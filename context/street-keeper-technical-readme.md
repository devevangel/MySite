# Street Keeper

A gamified street-coverage tracking web application for runners. Draw an area on the map, connect Strava, and the system tracks which streets you've run at node-level precision using OpenStreetMap data and PostGIS spatial queries.

**Live:** [street-keeper.onrender.com](https://street-keeper.onrender.com)

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [GPS-to-Street Matching Engine](#gps-to-street-matching-engine)
  - [V1: Polyline Coverage (Retired)](#v1-polyline-coverage-retired)
  - [V2: Node Proximity (Current)](#v2-node-proximity-current)
  - [Why V1 Was Abandoned](#why-v1-was-abandoned)
- [On-Demand City Synchronisation](#on-demand-city-synchronisation)
  - [The PBF Problem](#the-pbf-problem)
  - [How City Sync Works](#how-city-sync-works)
  - [Three-Layer Deduplication](#three-layer-deduplication)
- [Strava Webhook Pipeline](#strava-webhook-pipeline)
  - [The Two-Second Constraint](#the-two-second-constraint)
  - [Always-200 Pattern](#always-200-pattern)
  - [Idempotency via pg-boss](#idempotency-via-pg-boss)
  - [Activity Processing Flow](#activity-processing-flow)
- [Suggestion Engine](#suggestion-engine)
  - [Clustering Algorithm](#clustering-algorithm)
  - [Seed Alternation Strategy](#seed-alternation-strategy)
  - [The Array Mutation Bug](#the-array-mutation-bug)
- [Background Sync and Historical Import](#background-sync-and-historical-import)
- [Free-Tier Engineering](#free-tier-engineering)
- [Database Design](#database-design)
- [Error Handling and Resilience](#error-handling-and-resilience)
- [API Design](#api-design)
- [Security](#security)
- [Testing](#testing)
- [Problems Solved](#problems-solved)
- [What I Would Do Differently](#what-i-would-do-differently)

---

## System Architecture

Street Keeper is a three-tier web application:

```
┌─────────────────┐     HTTPS     ┌─────────────────────────────────┐     SQL      ┌──────────────────────┐
│   React SPA     │ ◄──────────► │         Express 5 API            │ ◄─────────► │   PostgreSQL 15      │
│   Vite · Mapbox │               │  15 route groups · 56 endpoints  │              │   PostGIS · pg-boss  │
│   Recharts      │               │  4 pg-boss background workers    │              │   19 Prisma models   │
└─────────────────┘               └───────┬────────┬────────┬────────┘              └──────────────────────┘
                                          │        │        │
                                    Strava API  Overpass  Nominatim
                                   (OAuth/Webhooks) (OSM)  (Geocoding)
```

The frontend is a fully client-side SPA hosted as static files — no server-side rendering. This was a deliberate decision: Street Keeper is accessed only by authenticated Strava users, so there is no SEO benefit from SSR, and avoiding it means frontend deployments don't trigger backend cold starts.

The backend follows a three-layer pattern: routes (thin HTTP handlers), services (all business logic), and data access (Prisma ORM). Each layer has a single downward dependency. Express 5 was chosen over NestJS because the decorator-based module system pays off when onboarding multiple developers — a cost that never arrives on a solo project.

All application data and pg-boss job tables live in a single PostgreSQL instance on Supabase with PostGIS enabled.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19.2, Vite 7.2, TypeScript | Near-instant HMR for rapid solo iteration |
| Styling | Tailwind 4.1 | Utility-first, no context-switching to CSS files |
| Maps | Mapbox GL JS, Leaflet | Mapbox for tiles, Leaflet for interactive drawing |
| Charts | Recharts | React-idiomatic declarative API; composes with component model |
| Backend | Express 5, TypeScript | Direct route-to-handler mapping, no DI scaffolding overhead |
| ORM | Prisma 7.2 | Type-safe client generated from schema; catches query errors at compile time |
| Database | PostgreSQL 15, PostGIS | Relational integrity for progress data; spatial queries for matching engine |
| Job Queue | pg-boss 12.5 | Runs inside PostgreSQL — no second data store, stays within free-tier limits |
| Auth | Strava OAuth 2.0 | Scopes: `read`, `activity:read_all`, `activity:write` |
| Street Data | OpenStreetMap via Overpass API | Open-licensed, global coverage, node/way data model |
| Geocoding | Nominatim | Open-source geocoder for project area search |
| Hosting | Render (backend + frontend), Supabase (database) | Both free-tier |

---

## GPS-to-Street Matching Engine

The central technical challenge: converting raw GPS coordinates from a runner's activity into a determination of which streets were covered and by how much. Two engines were built, each with a fundamentally different approach.

### V1: Polyline Coverage (Retired)

V1 treated street matching as a geometric coverage problem.

**How it worked:**
1. Compute a bounding box around the GPS trace
2. Query the Overpass API for candidate streets within that box
3. Optionally snap the trace using Mapbox Map Matching (HMM-based)
4. Calculate what percentage of each street's polyline was covered by the trace
5. Store results in `UserStreetProgress` under a MAX rule (progress never decreases)

**Accuracy:** ~98% with Mapbox snapping enabled, ~85% without. The 13-percentage-point gap was the empirical signal that motivated the V2 redesign.

**Fatal weaknesses:**
- Required an Overpass API call for every activity — tied processing success to a third-party service with observed downtime
- Non-deterministic: the weighted scoring model (distance 40%, trajectory 40%, continuity 20%) was order-dependent, so the same GPS data could produce different results
- Sensitive to GPS drift: 10m of drift caused parallel streets to become candidates, and the scoring model had to disambiguate — often incorrectly

### V2: Node Proximity (Current)

V2 treats the street network as a graph of discrete nodes rather than continuous polylines. Inspired by [CityStrides](https://citystrides.com), an established street-completion platform.

**How it works:**

1. Load GPS points from the activity record
2. Detect which user projects overlap the activity's geographic extent
3. Ensure the city's street data is cached locally via City Sync
4. Chunk GPS points into batches of 200
5. For each batch, run a PostGIS `ST_DWithin` spatial query at 25m radius against `NodeCache`
6. Bulk-upsert hit nodes into `UserNodeHit` in batches of 500
7. Derive street completion: a street is complete when ≥90% of its nodes are hit (100% for streets with ≤10 nodes)

**The core spatial query:**

```sql
WITH pts AS (
  SELECT * FROM unnest($lngs::float8[], $lats::float8[])
  AS t(lng, lat)
)
SELECT DISTINCT nc."nodeId"
FROM "NodeCache" nc, pts
WHERE nc."geom" IS NOT NULL
  AND nc."lat" BETWEEN $minLat AND $maxLat
  AND nc."lon" BETWEEN $minLng AND $maxLng
  AND ST_DWithin(
    nc."geom"::geography,
    ST_SetSRID(ST_MakePoint(pts.lng, pts.lat), 4326)::geography,
    25  -- snap radius in metres
  )
```

The `::geography` cast is critical — it means the 25m radius is measured in metres on the Earth's surface, not in degrees of latitude/longitude.

**The bounding-box pre-filter** (`nc."lat" BETWEEN $minLat AND $maxLat`) is a ~30m buffered rectangle that lets PostgreSQL's B-tree index eliminate most rows before the expensive `ST_DWithin` computation runs. This is cheaper than relying solely on the GIST spatial index for the initial scan.

**Why 200-point chunks?** Supabase's free tier has a 60-second statement timeout. A long activity with 3,000+ GPS points would exceed that limit in a single `ST_DWithin` call against a city with tens of thousands of nodes. 200 points per chunk keeps the slowest observed query well under 10 seconds.

**Why 500-row upsert batches?** PostgreSQL has a per-prepared-statement parameter limit. With the `UserNodeHit` row shape (`id`, `userId`, `nodeId`, `hitAt`), 500 rows fits comfortably within that limit.

**Completion thresholds:**
- Streets with >10 nodes: 90% of nodes must be hit
- Streets with ≤10 nodes: 100% of nodes must be hit

The stricter threshold for short streets prevents a four-node cul-de-sac from being marked complete after a single nearby GPS point. Completion is derived at query time from the ratio of hit nodes to total nodes per way — not stored as a pre-computed percentage — which avoids a denormalised field that could drift out of sync.

### Why V1 Was Abandoned

| Property | V1: Polyline Coverage | V2: Node Proximity |
|---|---|---|
| External dependency per activity | Overpass + Mapbox (optional, paid) | None once city synced |
| Determinism | Non-deterministic (weighted scoring) | Deterministic (pure spatial predicate) |
| GPS-drift sensitivity | High (10m drift → parallel street candidates) | Low (10m drift within 25m radius) |
| Progress storage | Continuous percentage, one row per street | Binary node hits, one row per node |
| Accuracy | ~98% with Mapbox, ~85% without | Comparable via 25m radius + 90% rule |

The key insight: when consumer GPS error (7–13m) exceeds the spacing between discrete spatial units, a binary hit/miss model absorbs that error at the unit level without propagating it across the street. A continuous coverage model accumulates error along the street's length, producing unstable percentages across repeated runs.

---

## On-Demand City Synchronisation

### The PBF Problem

The original V2 design pre-seeded the database from an OpenStreetMap PBF (Protocolbuffer Binary Format) extract. The Hampshire region file was 260MB compressed. Expanded into node, way, and edge tables, it produced a database exceeding ~7.5GB — fifteen times the Supabase free-tier limit of 500MB.

This wasn't a minor overshoot that could be optimised away. The storage budget behaves like a hard constraint on a set-cover problem, not like a cache size. Pre-seeding only becomes viable on a paid plan.

### How City Sync Works

City Sync replaced the PBF approach with on-demand street data acquisition:

1. **User creates a project** → backend detects the enclosing city via an Overpass `is_in` query
2. **Check `CitySync` table** → if a valid cache entry exists (less than 42 days old), reuse it
3. **If no cache** → query Overpass for every street in that city
4. **Store results** in `NodeCache`, `WayNode`, and `WayTotalEdges`
5. **Compute convex hull boundary** via `ST_ConvexHull` with ~100m `ST_Buffer` and store on the `CitySync` row

**42-day expiry:** Long enough to outlast most realistic editing cycles in a single city, short enough that OSM changes (new developments, road reclassifications) are eventually picked up.

**Fast-path check for subsequent requests:** `findSyncedCityByPoint` runs a PostGIS `ST_Contains` query against the convex hull boundary. If the point lies inside a non-expired boundary, no Overpass call is made. In practice, only the first project in a new city triggers a network request — every subsequent project creation, activity processing, and map-streets request resolves locally against PostGIS.

**Known UX limitation:** The first sync in a large city can take 20–30 seconds. The user sees a "Creating…" label with no progress percentage. Future work: progressive loading via server-sent events.

### Three-Layer Deduplication

When a user connects Strava and the system imports dozens of historical activities, all targeting the same unsynchronised city, concurrent `ensureCitySynced` calls would each independently detect the city and attempt a full sync — multiplying Overpass load and database writes. Three layers prevent this:

1. **Grid-cell promise lock** (`ensureInProgress`): Keyed by a ~1km cell from `Math.floor(lat × 100)`. Concurrent calls for the same neighbourhood share a single in-flight promise.

2. **City detection cache** (`detectCityCache` + `detectCityInFlight`): 60-second result cache and in-flight promise map. The Overpass `is_in` query is never duplicated within the same grid cell.

3. **Per-city sync lock** (`syncInProgress`): Keyed by `relationId`. Only one `syncCity` call per city can be active; concurrent callers await the same promise.

**Beneath all three layers:** A serialising throttle (`overpass-throttle.service.ts`) enforces a minimum 2.8-second gap between any two Overpass requests to stay within public-server rate limits.

---

## Strava Webhook Pipeline

### The Two-Second Constraint

Strava's webhook contract: any receiving service must acknowledge an event within 2 seconds. A full match of a one-hour run against a city's street network takes 5–30 seconds (GPS fetch from Strava, spatial queries against PostGIS, node hit upserts). A naive "match inline and return" handler would time out, triggering Strava's retry logic and flooding the system with duplicates.

### Always-200 Pattern

The webhook handler returns HTTP 200 regardless of whether internal processing succeeds or throws an exception. This is stronger than "respond quickly":

```typescript
router.post("/strava", async (req, res) => {
  if (!isValidWebhookPayload(req.body)) {
    res.status(400).json({ error: "Invalid webhook payload" });
    return;
  }

  try {
    const result = await handleWebhookEvent(req.body);
    res.status(200).json({ status: "received", action: result.action });
  } catch (error) {
    // Still return 200 — prevents Strava retry cascade
    res.status(200).json({ status: "received", action: "error" });
  }
});
```

**Why 200 even on error?** Strava retries delivery indefinitely for any non-200 response. A transient backend bug would cascade into a flood of duplicate webhook events once the system recovered. The accepted trade-off: if the handler crashes before enqueueing, that activity is not processed until the user triggers a manual sync.

**Design consequence:** Once 200 is the only response code, idempotency becomes a correctness requirement rather than a nice-to-have.

### Idempotency via pg-boss

```typescript
await queue.send("activity-processing", payload, {
  singletonKey: `activity-${stravaActivityId}`
});
```

The `singletonKey` ensures that duplicate enqueue attempts for the same activity silently return `null` rather than creating a second job. Without this, Strava's legitimate retry behaviour (e.g. a slow deploy delays the first response past 2 seconds) was observed during testing to produce 2–3 worker invocations racing to upsert the same `UserNodeHit` rows.

**Queue configuration:**
- 3 retry attempts with exponential backoff (5s → 10s → 20s)
- 2-minute per-job timeout (`JOB_TIMEOUT_MS`) — kills stalled workers before they block the queue
- 4 named queues (activity processing, sync, city sync, GPX analysis) with 1 worker each
- `DISABLE_QUEUE` env var for debugging without triggering background processing

### Activity Processing Flow

```
Strava webhook POST
  → Validate payload structure
  → Resolve user by Strava athlete ID
  → Enqueue pg-boss job (singletonKey: activity-{stravaActivityId})
  → Return 200 immediately
  
Background worker picks up job:
  → Refresh OAuth token if expired
  → Fetch full GPS stream from Strava API
  → Save Activity record with coordinates
  → Detect overlapping user projects (bounding-box then Haversine check)
  → For each project:
      → ensureCitySynced (fast-path if already cached)
      → markHitNodes (V2 engine: 200-point chunks, ST_DWithin at 25m)
      → Bulk-upsert UserNodeHit (500-row batches)
      → Derive street completion percentages
      → Update project snapshot (MAX rule: percentages never decrease)
      → Check milestone thresholds → generate celebration events if crossed
  → Mark activity as processed
```

**Partial-failure tolerance:** Each project-overlap step is wrapped in try-catch. A failure in one project does not prevent processing of other overlapping projects. If all projects fail, the activity stays unprocessed and can be retried.

---

## Suggestion Engine

The suggestion engine recommends areas for the user's next run. It operates entirely on data already in memory — no additional API calls.

### Clustering Algorithm

Rather than recommending the nearest single unrun street (which would feel trivial), the engine groups nearby unrun streets into clusters of 3–8 streets that form a runnable outing of approximately 6–12 minutes.

**Constants:**
```typescript
const CLUSTER_MAX_STREETS = 8;
const CLUSTER_MAX_DISTANCE_M = 2000;
const CLUSTER_MAX_BBOX_DIAMETER_M = 500;
const CLUSTER_IN_PROGRESS_THRESHOLD = 1;  // 1% progress = "in progress"
const CLUSTER_CONNECTING_OVERHEAD = 1.3;
const CLUSTER_MAX_COUNT = 5;
```

**How clustering works:**

1. Gather all unrun and in-progress streets in the user's project
2. For each cluster (up to 5):
   a. Select a seed street (alternating between completion and exploration seeds)
   b. Greedily add nearby streets that fit within the 500m bounding-box diameter
   c. Filter candidates by remaining distance budget
   d. Score candidates by a `streetValue` function balancing progress and proximity
   e. Stop when the cluster reaches 8 streets or no candidates remain
3. Remove picked streets from the pool
4. Skip clusters with fewer than 2 streets
5. Sort final clusters by estimated distance and return up to 5

### Seed Alternation Strategy

The engine alternates seed selection between even and odd cluster indices:

- **Even clusters:** Seed from the street with the highest existing progress (completion-focused — finish what you started)
- **Odd clusters:** Seed from the nearest street with 0% progress (exploration-focused — discover new territory)

This produces a mix of "go finish that street" and "go explore over there" suggestions, which is more useful than either strategy alone.

### The Array Mutation Bug

One of the hardest bugs in the project. JavaScript's `Array.prototype.sort()` mutates the array in place. An early version called `.sort()` directly on the shared `pool` array inside the clustering loop:

```typescript
// BUG: mutates the shared pool
const seed = pool.sort((a, b) => a.distFromCenter - b.distFromCenter)[0];
```

Because `sort()` reordered the pool in place, later iterations operated on a reordered pool and selected biased seeds that clustered around the same region. The output was plausible — it produced valid clusters — but they were geographically repetitive.

**The fix:** Defensive spread copies before every sort:

```typescript
const seed = [...pool].sort((a, b) => a.distFromCenter - b.distFromCenter)[0];
```

**Why it was hard to catch:** The output looked correct on casual inspection. It only became visible with a deterministic test fixture that asserted the geographic spread of successive cluster calls. Value-equality assertions on a single call continued to pass. The transferable lesson: plausible-but-wrong bugs need property-based tests, not value equality.

---

## Background Sync and Historical Import

When a user first connects Strava, the system imports their historical activities through a background sync flow:

1. User triggers sync from the frontend
2. API creates a `SyncJob` record and enqueues a pg-boss job
3. Worker fetches activity list from Strava (paginated, with token refresh)
4. Each activity is processed through the same pipeline as webhook-delivered activities
5. Frontend polls the `SyncJob` status and displays a progress banner
6. User can navigate freely during sync — homepage and map update progressively

**Duplicate protection:** Only one sync can run per user at a time. If a `SyncJob` in `queued` or `running` state exists, the API returns the existing job's status rather than creating a new one. This also resolves a race condition where a user finishing onboarding simultaneously receives a Strava webhook for a freshly-uploaded activity — without the guard, both the backfill job and the webhook job would attempt to write the same `Activity` row.

---

## Free-Tier Engineering

The entire application runs on free-tier infrastructure. This was a hard constraint that shaped the architecture, not a temporary cost-saving measure.

| Constraint | Impact on Architecture |
|---|---|
| **Supabase 500MB storage** | Killed PBF pre-seeding; forced on-demand City Sync with 42-day expiry |
| **Supabase 3-connection pool cap** | Limited pg-boss to 4 workers with 1 concurrent connection each; worker concurrency kept deliberately low to avoid starving user-facing API requests |
| **Render cold starts (20–30s)** | SSR rejected — every first page load would pay the full cold-start cost instead of just data-fetching |
| **Overpass rate limits** | Serialising throttle with 2.8s minimum gap between requests; 3-layer deduplication on City Sync |
| **Overpass 502 errors** | City sync handles transient failures with retry-and-skip rather than treating Overpass as reliably available |
| **Supabase 60s statement timeout** | GPS points chunked into batches of 200 for `ST_DWithin` queries |
| **PostgreSQL parameter limit** | Node hit upserts batched at 500 rows per prepared statement |

The transferable insight: free-tier service budgets behave like hard ceilings, not soft tuning parameters. Any design that assumes elastic capacity should include an early quota check against the target deployment environment.

---

## Database Design

19 Prisma models across 6 functional groups:

| Group | Models | Purpose |
|---|---|---|
| User identity | `User`, `UserPreferences` | Strava profile, OAuth tokens, preferences |
| Activity ingestion | `Activity`, `ProjectActivity`, `SyncJob` | Raw GPS data, activity-to-project mapping, background job state |
| Project & progress | `Project`, `UserStreetProgress`, `UserNodeHit` | User-defined areas, V1 street progress, V2 node hits |
| V2 OSM reference | `NodeCache`, `WayNode`, `WayTotalEdges`, `CitySync` | Cached street geometry from OpenStreetMap |
| Gamification | `MilestoneType`, `UserMilestone`, `RunCelebrationEvent`, `SuggestionCooldown` | Milestone definitions, user achievements, celebration cards, suggestion freshness |
| Analytics | `AnalyticsEvent` | Client-side event tracking |
| Deprecated V1 | `UserEdge`, `WayCache` | Retained for historical data; not written by V2 engine |

**Why PostgreSQL over MongoDB:** The data has a strongly relational structure (User ↔ Project ↔ Activity forms a many-to-many join). Progress calculations require ACID transactions so that concurrent processing (webhook arriving while a manual sync is running) cannot corrupt progress values. pg-boss runs in the same instance, avoiding a second data store.

**PostGIS usage:** Three columns use PostGIS geometry types (`WayTotalEdges.geometry`, `NodeCache.geom`, `CitySync.boundary`). These are declared as `Unsupported("geometry(..., 4326)")` in Prisma and accessed via `prisma.$queryRaw`. The raw-SQL surface is bounded to 5 files: `node-proximity.ts`, `city-sync.service.ts`, `local-streets.service.ts`, `celebration-map.service.ts`, and `seed-way-cache-from-pbf.ts`.

**GIST spatial indexes** on all three geometry columns. B-tree indexes on `NodeCache(lat, lon)` for bounding-box pre-filtering.

**3 migrations:** One large baseline, then two targeted additions responding to failure modes (crash-safe resume for `SyncJob`, soft-delete for `Activity`, celebration events table).

---

## Error Handling and Resilience

**Domain-specific error classes:** `ActivityNotFoundError` (Strava returned 404 — user deleted the activity between upload and worker pickup; treated as terminal skip, not retryable), `QueueUnavailableError` (pg-boss not initialised; surfaces as "sync temporarily unavailable" instead of 500).

**Startup reconciliation:** On boot, `server.ts` marks all `SyncJob` records stuck in `queued` or `running` as `failed`. A separate query resets `isProcessed` on activities that were marked processed but have no corresponding `ProjectActivity` or `UserNodeHit` evidence. This self-heal addressed a real production failure where Render restarts left inconsistent state.

**Per-project try-catch:** Each project-overlap processing step is isolated. One project timing out does not discard progress from other projects.

**Structured logging:** All errors tagged with prefixed identifiers (`[Webhook]`, `[Queue]`, `[CitySync]`). Stack traces never leaked to Strava.

---

## API Design

56 endpoints across 15 resource groups, all RESTful except for two Strava integration patterns (webhook handler and client-side polling for background sync).

| Group | Endpoints | Purpose |
|---|---|---|
| Auth | 3 | Strava OAuth flow |
| Users | 2 | Profile retrieval |
| Projects | 6 | CRUD, polygon creation, area management |
| Activities | 4 | List, detail, processing status |
| Runs | 2 | GPX analysis |
| Map | 2 | Street geometry with progress overlay |
| Sync | 4 | Background sync lifecycle |
| Webhooks | 3 | Strava webhook handler + verification |
| Engine V2 | 3 | V2 streets, map, analysis |
| Celebrations | 5 | Pending events, history, sharing |
| Milestones | 3 | Types, user progress |
| Suggestions | 3 | Cluster suggestions, cooldowns |
| Homepage | 1 | Aggregated dashboard payload |
| Analytics | 1 | Client event ingestion |
| Preferences | 2 | User settings |
| Geocoding | 1 | Nominatim address search |

**Known weakness:** No schema-level input validation library (Zod/Joi). Validation is ad-hoc inside route handlers. SQL injection is mitigated by Prisma's parameterised queries, but malformed payloads surface as uncaught 500s instead of clean 400s. Planned fix: `validate()` middleware wrapping Zod schemas, starting with the 4 highest-risk endpoints.

---

## Security

**Authentication:** Strava OAuth 2.0 with scopes `read`, `activity:read_all`, `activity:write`. Token refresh handled automatically.

**Known weakness:** Authentication uses an `x-user-id` header (UUID) without cryptographic verification (no JWT). This is documented as a security limitation. The system was designed for a supervised academic demo, not production deployment with adversarial users.

**HTTPS:** Enforced at the Render infrastructure layer.

**SQL injection:** Mitigated across all endpoints by Prisma's parameterised queries. Raw PostGIS queries also use parameterised inputs.

---

## Testing

**98 automated test cases** covering unit, integration, and route-level tests. All passed in the submission run.

**Coverage distribution:**
- Pure-logic utilities: 70–90%
- Route handlers: 30–50%
- Activity-processing and engine subsystems: effectively zero (these subsystems depend heavily on PostGIS and Strava API state, making isolated testing impractical without a full integration test harness)

**No frontend tests.** This was a deliberate scope decision: with one developer and a fixed deadline, testing time went to where bugs cause the most damage. A frontend bug shows a wrong label. A backend bug silently marks the wrong streets as complete or loses activities. The risk was not equal, so the effort wasn't either.

**Manual system testing:** Structured test flows covering the core user journey (auth → project creation → activity sync → map progress → suggestions → milestones) validated in production with real Strava data.

**Supervisor testing surfaced a failure mode developer testing missed:** The 25m snap radius produces incorrect attributions on parallel streets less than 25m apart. A route in central Portsmouth exercised this geometry; the developer's routes did not. This is documented as a known limitation, not hidden.

---

## Problems Solved

### 1. Inflated Street Coverage Exceeding 100% (V1)
The V1 coverage calculation summed all pairwise distances between GPS samples tagged to the same street, including large jumps from out-and-back routes. A 2km street traversed twice reported 4km of coverage. **Fix:** Preserve the original GPS track index with each tagged point, sort by index, detect consecutive segments, and sum haversine distances only within each segment.

### 2. Array Mutation in the Cluster Builder
`Array.prototype.sort()` mutating a shared pool in place caused subsequent clustering iterations to produce geographically biased suggestions. **Fix:** Defensive spread copies (`[...pool].sort(...)`) before every sort operation.

### 3. Database Storage Limit and the City Sync Pivot
The PBF pre-seeding approach exceeded the 500MB Supabase limit by 15×. **Fix:** Complete redesign to on-demand city synchronisation with 42-day cache expiry, 3-layer deduplication, and Overpass rate-limit throttling.

### 4. Orphaned Sync Jobs After Server Restart
Render restarts during active syncs left `SyncJob` records stuck in `running` state indefinitely, showing a permanent "syncing" indicator. **Fix:** Startup reconciliation in `server.ts` that sweeps all stuck jobs and marks them failed on boot. Works because: single-instance deployment (no risk of marking another node's active job as failed), and underlying work is idempotent (re-processing performs a cheap upsert skip).

### 5. Division by Near-Zero in Progress Projections
The estimated completion date calculation divided by `weeksActive`, which approached zero for new projects, producing `Infinity` or `NaN` rendered as "Invalid Date". **Fix:** `Math.max(weeksActive, 1)` clamp. Deeper lesson: any user-facing metric that divides by elapsed time has a structurally different fresh-project case.

---

## What I Would Do Differently

1. **Start with V2 from day one.** V1 built confidence that the GPS-to-street pipeline was feasible, but the time spent on it could have gone into features that were eventually descoped (Garmin support, leaderboards, clubs). If the PBF capacity estimation had been done earlier, the conclusion that on-demand city sync was necessary would have pointed directly to V2.

2. **Set up integration tests earlier.** Unit tests caught logic bugs. The hardest bugs (orphaned sync jobs, parallel-street attribution, webhook race conditions) lived in the joins between systems — webhook to queue, queue to worker, worker to database. Those only surfaced in manual testing or production.

3. **Test with real users sooner.** The app was tested by one developer and one supervisor. Even two extra runners would have caught usability issues and geographic edge cases (like the parallel-street problem) that are invisible when you built the thing yourself.

4. **Run an early capacity check against the deployment environment.** Expanding the Hampshire PBF file before writing the seed script would have revealed the storage limit before any code was committed, saving two weeks lost to the pivot.

---

## Project Context

This was built as a final year BSc Software Engineering project at the University of Portsmouth (module PJE40), supervised by Dr Rich Boakes (Head of the School of Computing) with Dr Amanda Peart as second marker. Solo developer, built over approximately 8 months from October 2025 to May 2026.

The full academic report, including literature review, requirements analysis, design rationale, testing strategy, and reflective evaluation, is available on request.
