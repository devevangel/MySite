# Personal Site — Architecture & Build Plan

**Author:** Evangel Chidiebube Iheuwkumere  
**Status:** Built (v1)  
**Last updated:** July 2026

This README describes the full structure, data model, routes, design intent, and deployment plan for a personal website with **two distinct public faces** — a **tech portfolio** and a **civic writing portal** — served from a single Node.js application.

Use this document to review, challenge, or approve the plan before implementation.

---

## Table of Contents

1. [Vision](#1-vision)
2. [Core Principles](#2-core-principles)
3. [Two Sites, One Repo](#3-two-sites-one-repo)
4. [URL Map](#4-url-map)
5. [Folder Structure](#5-folder-structure)
6. [Data Layer](#6-data-layer)
7. [Content Format (Markdown Posts)](#7-content-format-markdown-posts)
8. [Tech Landing Page](#8-tech-landing-page)
9. [Civic Landing Page](#9-civic-landing-page)
10. [Career Timeline (Interactive)](#10-career-timeline-interactive)
11. [Citations & Sources (Civic Posts)](#11-citations--sources-civic-posts)
12. [Read Time Rules](#12-read-time-rules)
13. [Design System](#13-design-system)
14. [Server & Tech Stack](#14-server--tech-stack)
15. [Workflow: Write → Preview → Deploy](#15-workflow-write--preview--deploy)
16. [MVP Scope (v1)](#16-mvp-scope-v1)
17. [Explicitly Out of Scope (v1)](#17-explicitly-out-of-scope-v1)
18. [Private vs Public Content](#18-private-vs-public-content)
19. [Migration from Current Folders](#19-migration-from-current-folders)
20. [Render Deployment](#20-render-deployment)
21. [Open Questions for Review](#21-open-questions-for-review)

---

## 1. Vision

### Tech side (`/tech`)

An **online catalogue** of who Evangel is as a builder. Visitors (employers, collaborators, dev community) land here to:

- See current role and career history
- Explore an interactive timeline of roles and projects
- Browse flagship projects (Gloomhunt, Kevvlar, etc.)
- Read short write-ups on things built, learned, and showcased

**Default audience.** The root domain redirects here.

### Civic side (`/civic`)

A **separate professional portal** for writing on Nigerian governance — reforms, current issues, policy analysis. Visitors find:

- A professional landing page with headshot
- Well-sourced essays with academic-style references
- A credible, editorial tone (not campaign material)

**Separate entry point.** Linked discreetly from the tech footer, not the main nav.

### What this is NOT

- Not a CMS or admin dashboard (v1)
- Not a single blended blog
- Not a JSON database for long-form essays
- Not a place for private strategy documents

---

## 2. Core Principles

| Principle | Decision |
|-----------|----------|
| **Simplicity** | File-based content, no database for v1 |
| **AI-maintainable** | Markdown for prose, JSON for structured data only |
| **Two distinct experiences** | Separate layouts, CSS, and tone per section |
| **Credibility (civic)** | Every published civic post must cite sources |
| **Brevity** | Target 5 min read, hard cap 7 min |
| **Deploy simplicity** | Git push → Render auto-deploy |
| **Familiar stack** | Express + EJS (same family as Gloomhunt) |

---

## 3. Two Sites, One Repo

One Node.js app serves two **visually and structurally distinct** experiences. They share:

- `profile.json` (name, email, social links)
- The same server process
- The same deployment pipeline

They do **not** share:

- Layout templates
- Stylesheets
- Navigation
- Default landing page

```
yoursite.com/          →  redirects to /tech
yoursite.com/tech      →  Tech world (portfolio catalogue)
yoursite.com/civic     →  Civic world (governance writing)
```

Cross-links appear **only in footers**:

- Tech footer: "Civic writing →"
- Civic footer: "Tech portfolio →"

---

## 4. URL Map

| URL | Page | Section |
|-----|------|---------|
| `/` | Redirect to `/tech` | — |
| `/tech` | Tech landing page | Tech |
| `/tech/writing` | List of tech posts | Tech |
| `/tech/writing/:slug` | Single tech article | Tech |
| `/civic` | Civic landing page | Civic |
| `/civic/writing` | List of civic essays | Civic |
| `/civic/writing/:slug` | Single civic essay | Civic |

**No mixed routes.** Tech posts never appear under `/civic` and vice versa.

---

## 5. Folder Structure

Planned repository layout after implementation:

```
MySite/
├── README.md                    # This document
├── package.json
├── server.js                    # Express entry point
├── render.yaml                  # Render deploy config (optional)
│
├── content/                     # All long-form writing (Markdown)
│   ├── tech/
│   │   ├── gloomhunt-what-i-built.md
│   │   └── ...
│   └── civic/
│       ├── protecting-citizens.md
│       └── ...
│
├── data/                        # Structured JSON (not essays)
│   ├── profile.json             # Name, bio, contact, social links
│   ├── career.json              # Timeline entries for tech landing
│   ├── projects.json            # Project cards for tech landing
│   └── site.json                # Per-section titles, taglines, config
│
├── lib/
│   ├── content.js               # Load & parse Markdown + frontmatter
│   └── readtime.js              # Word count → estimated minutes
│
├── scripts/
│   └── validate-posts.js        # Pre-deploy: read time + civic sources
│
├── views/
│   ├── tech/
│   │   ├── layout.ejs           # Tech shell (nav, footer)
│   │   ├── landing.ejs          # Tech homepage
│   │   ├── writing-list.ejs     # Post index
│   │   └── post.ejs             # Single post
│   └── civic/
│       ├── layout.ejs           # Civic shell (different nav, footer)
│       ├── landing.ejs          # Civic homepage
│       ├── writing-list.ejs     # Essay index
│       └── post.ejs             # Single essay (with references block)
│
├── public/
│   ├── css/
│   │   ├── tech.css             # Tech world styles
│   │   └── civic.css            # Civic world styles
│   ├── js/
│   │   └── timeline.js          # Career timeline expand/collapse + scroll
│   └── img/
│       ├── tech/                # Project screenshots, icons
│       └── civic/
│           └── profile.jpg      # Professional headshot (placeholder until added)
│
└── About Me/                    # PRIVATE — not served, not deployed
    ├── my_life.md               # Internal strategy doc
    ├── about_insecureity,md     # Draft source for first civic post
    └── Core_CV_*.docx           # Source for career.json extraction
```

### Folders to retire after migration

| Current folder | Replaced by |
|----------------|-------------|
| `JSON DB/` | `content/` (Markdown) + `data/` (JSON) |
| `tech/` (empty) | `content/tech/` + `views/tech/` |
| `political/` (empty) | `content/civic/` + `views/civic/` |
| `My CV/` (if exists) | `data/profile.json` + `data/career.json` |

---

## 6. Data Layer

JSON is used **only** for structured, field-based data. Essays and articles are **never** stored in JSON.

### `data/profile.json`

Shared identity and contact info.

```json
{
  "name": "Evangel Chidiebube Iheuwkumere",
  "preferredName": "Evangel",
  "tagline": "Software engineer. I build things that ship.",
  "location": "United Kingdom",
  "email": "your@email.com",
  "social": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "twitter": null
  }
}
```

### `data/site.json`

Per-section configuration.

```json
{
  "tech": {
    "title": "Evangel Iheukwumere",
    "subtitle": "Software engineer & builder",
    "writingSectionTitle": "Writing"
  },
  "civic": {
    "title": "Civic Writing",
    "subtitle": "Governance, reform, and what Nigeria owes its people",
    "disclaimer": "Personal analysis. All claims are sourced. Views are my own.",
    "focusAreas": [
      "Protecting citizens",
      "Investing in people over patronage",
      "Evidence-based reform",
      "Accountable governance"
    ]
  }
}
```

### `data/career.json`

Powers the interactive career timeline on `/tech`.

```json
{
  "current": {
    "role": "Software Engineer",
    "org": "Marchex",
    "since": "2024"
  },
  "entries": [
    {
      "id": "gloomhunt",
      "start": "2025-01",
      "end": null,
      "type": "project",
      "title": "Gloomhunt",
      "org": "Personal",
      "location": null,
      "summary": "Browser survival shooter with real-money bounties and deterministic anti-cheat.",
      "details": [
        "Vanilla JS + Canvas, no framework",
        "Node/Express backend, PostgreSQL via Supabase",
        "Built for Nigerian market"
      ],
      "tags": ["javascript", "game-dev", "nodejs"],
      "links": [
        { "label": "Dev log", "href": "/tech/writing/gloomhunt-what-i-built" }
      ],
      "relatedPosts": ["gloomhunt-what-i-built"]
    },
    {
      "id": "marchex",
      "start": "2024-03",
      "end": null,
      "type": "role",
      "title": "Software Engineer",
      "org": "Marchex",
      "location": "Remote / UK",
      "summary": "Production data systems at scale.",
      "details": ["Shipped production features with zero prior stack experience"],
      "tags": ["typescript", "data"],
      "links": [],
      "relatedPosts": []
    }
  ]
}
```

**Field reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique slug for the entry |
| `start` | Yes | `YYYY-MM` format |
| `end` | No | `YYYY-MM` or `null` for ongoing |
| `type` | Yes | `"role"` or `"project"` |
| `title` | Yes | Display title |
| `org` | Yes | Company or "Personal" |
| `summary` | Yes | One line (collapsed card view) |
| `details` | Yes | Array of strings (expanded card view) |
| `tags` | No | Tech/skills tags |
| `links` | No | External or internal links |
| `relatedPosts` | No | Slugs of `/tech/writing` posts |

### `data/projects.json`

Project catalogue cards on the tech landing page (below timeline).

```json
{
  "projects": [
    {
      "id": "gloomhunt",
      "title": "Gloomhunt",
      "summary": "Top-down browser survival shooter with real-money bounties.",
      "status": "in-development",
      "tags": ["javascript", "canvas", "nodejs"],
      "links": {
        "writing": "/tech/writing/gloomhunt-what-i-built",
        "live": null,
        "github": null
      },
      "image": "/img/tech/gloomhunt.png"
    }
  ]
}
```

---

## 7. Content Format (Markdown Posts)

All articles live in `content/tech/` or `content/civic/` as `.md` files with **YAML frontmatter**.

### Why Markdown, not JSON

| Markdown | JSON for posts |
|----------|----------------|
| Natural to write and edit | Escaped strings, hard to read |
| Clean git diffs | Noisy diffs |
| AI edits reliably | AI breaks JSON easily |
| Citations inline with `[1]` | Citations buried in nested objects |

### Tech post frontmatter

```yaml
---
title: "What I Built: Gloomhunt"
slug: gloomhunt-what-i-built
section: tech
type: showcase              # showcase | learn | build-log
published: 2026-07-05
status: published           # draft | published
tags: [game-dev, javascript, nigeria]
project: gloomhunt
summary: "A browser survival shooter with real-money bounties and deterministic anti-cheat."
---
```

### Civic post frontmatter

```yaml
---
title: "What Nigeria Refuses to Learn About Protecting Its Citizens"
slug: protecting-citizens
section: civic
published: 2026-07-05
status: published
tags: [security, governance, nigeria]
summary: "A comparison of how nations protect citizens abroad versus Nigeria's pattern at home."
sources:
  - id: 1
    author: "CNN"
    title: "US special operations forces rescue American citizen held hostage in Nigeria"
    url: "https://..."
    accessed: "2026-07-01"
  - id: 2
    author: "Human Rights Watch"
    title: "Nigeria: Renewed Spate of School Kidnappings"
    url: "https://..."
    accessed: "2026-07-01"
---
```

### Draft vs published

- `status: draft` — file exists on disk but is **not listed** on writing index pages and returns 404 if accessed directly (or optionally preview-only in dev mode).
- `status: published` — visible everywhere.

---

## 8. Tech Landing Page

**URL:** `/tech`

### Sections (top to bottom)

1. **Hero**
   - Name, current role (from `career.json` → `current`)
   - One-line tagline (from `profile.json` or `site.json`)

2. **Interactive career timeline** *(centrepiece)*
   - Vertical scrollable timeline
   - Data from `data/career.json`
   - See [Section 10](#10-career-timeline-interactive)

3. **Project catalogue**
   - Card grid from `data/projects.json`
   - Each card: title, summary, tags, link to writing or live demo

4. **Latest writing**
   - 2–3 most recent published posts from `content/tech/`
   - Link to `/tech/writing` for full list

5. **Footer**
   - Social links (from `profile.json`)
   - Discreet link: "Civic writing →" pointing to `/civic`

---

## 9. Civic Landing Page

**URL:** `/civic`

### Sections (top to bottom)

1. **Hero with photo**
   - Professional headshot: `public/img/civic/profile.jpg`
   - Placeholder grey box until real photo is added
   - Name + positioning subtitle (from `site.json` → `civic`)

2. **Focus areas**
   - 3–4 short bullets (from `site.json` → `civic.focusAreas`)
   - Not a manifesto — calm, professional framing

3. **Featured essays**
   - Latest 1–2 published civic posts
   - Each shows: title, summary, read time, "sourced" indicator

4. **Disclaimer**
   - Small text from `site.json` → `civic.disclaimer`

5. **Footer**
   - Discreet link: "Tech portfolio →" pointing to `/tech`

### Tone

- Editorial, credible, professional
- Personal analysis backed by sources
- **Not** campaign website or political party material

---

## 10. Career Timeline (Interactive)

The main interactive feature on the tech landing page.

### Visual concept

```
     2025 ──●── Gloomhunt (Personal)
              │  Browser survival shooter with real-money bounties
              │  [click to expand ▼]
              │
     2024 ──●── Software Engineer @ Marchex
              │  Production data systems at scale
              │
     2023 ──●── Eli Lilly
              │
     2022 ──●── University — First Class
              │
     2020 ──●── Kevvlar — SaaS platform
              │
     …    ──●── Earlier roles & projects
```

### Interaction behaviour

| State | What user sees |
|-------|----------------|
| **Collapsed (default)** | Year marker, title, org, one-line summary |
| **Expanded (click/tap)** | Full `details` array, tags, links to related posts |
| **Scroll highlight** | Active year node subtly highlighted via Intersection Observer |

### Implementation

- **Vanilla JS** — no React/Vue/framework
- `public/js/timeline.js` handles expand/collapse and scroll highlighting
- Data rendered server-side from `career.json` into EJS template
- CSS in `public/css/tech.css`

### Adding a new timeline entry

1. Add object to `data/career.json` → `entries` array
2. Optionally write a related post in `content/tech/`
3. Push to GitHub — no template changes needed

---

## 11. Citations & Sources (Civic Posts)

Civic posts must be **well-referenced** like academic or journalistic writing.

### In-text citations

Use numbered references in the body:

```markdown
America deployed SEAL Team 6 within 96 hours for one citizen [1].
Nigeria provided rented buses for thousands of stranded students [2].
```

### Sources in frontmatter

Each source in the `sources` array:

```yaml
sources:
  - id: 1
    author: "CNN"
    title: "US special operations forces rescue American citizen held hostage in Nigeria"
    url: "https://..."
    accessed: "2026-07-01"
    date: "2020-10"          # optional: original publication date
```

### Rendered output

The post template (`views/civic/post.ejs`) auto-generates a **References** section at the bottom:

```
References

[1] CNN — "US special operations forces rescue..." (accessed 2026-07-01)
    https://...

[2] Channels Television — "FG Gives Breakdown Of $1.2m Bus Fare..." (accessed 2026-07-01)
    https://...
```

### Validation rule

`scripts/validate-posts.js` will **fail the build** if:

- A published civic post has zero `sources`
- A published civic post body contains no `[N]` citation markers
- (Optional) A citation `[N]` in the body has no matching `id: N` in sources

Tech posts: sources optional.

---

## 12. Read Time Rules

| Rule | Value |
|------|-------|
| Target read time | **5 minutes** (~1,000 words at 200 wpm) |
| Hard cap | **7 minutes** (~1,400 words) |
| Calculation | Auto from word count in `lib/readtime.js` |
| Display | Shown on post cards and post header: "5 min read" |
| Validation | `npm run validate` warns at 5 min, **errors at 7 min** |

Long essays (like the insecurity draft) must be **trimmed or split** into parts before publishing.

Override (rare): `max_read_minutes: 7` in frontmatter with explicit approval.

---

## 13. Design System

Two visually distinct worlds. Same person, different rooms.

### Tech (`public/css/tech.css`)

| Aspect | Direction |
|--------|-----------|
| Mood | Modern developer portfolio |
| Palette | Dark background + teal/cyan accent, OR clean white + bold accent |
| Typography | Modern sans-serif; monospace for code/tags |
| Layout | Wide, scroll-driven, interactive |
| Key component | Career timeline |

### Civic (`public/css/civic.css`)

| Aspect | Direction |
|--------|-----------|
| Mood | Professional editorial / policy journal |
| Palette | Navy, cream/off-white, restrained gold or burgundy accent |
| Typography | Serif headlines; clean sans-serif body |
| Layout | Narrower reading column; photo-led hero |
| Key component | Sourced essay with references block |

### Shared

- Responsive (mobile-friendly)
- No JavaScript frameworks
- Accessible contrast and font sizes

---

## 14. Server & Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | Node.js | Familiar; matches Gloomhunt stack |
| Server | Express | Simple routing, static files |
| Templates | EJS | Server-rendered HTML, no SPA complexity |
| Content parsing | `gray-matter` + `marked` (or similar) | YAML frontmatter + Markdown → HTML |
| Client JS | Vanilla JS | Timeline interactions only |
| CSS | Plain CSS files | No Tailwind/build step for v1 |
| Database | None | File-based content |
| Auth | None | No admin UI in v1 |

### `server.js` responsibilities

1. Load JSON data files at startup (or on request with caching)
2. Parse Markdown posts from `content/`
3. Route requests to correct EJS templates
4. Serve static files from `public/`
5. Redirect `/` → `/tech`
6. Filter posts by `section` and `status: published`
7. Return 404 for unknown slugs

### `package.json` scripts (planned)

```json
{
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js",
    "validate": "node scripts/validate-posts.js"
  }
}
```

---

## 15. Workflow: Write → Preview → Deploy

```
1. Create or edit a .md file in content/tech/ or content/civic/
2. Set status: draft while working
3. npm run dev          → preview at http://localhost:3000
4. npm run validate     → check read time + civic sources
5. Set status: published
6. git add, commit, push
7. Render auto-deploys  → live site updates
```

### AI-assisted editing

- **Posts:** Edit Markdown directly — AI handles prose, frontmatter, citations
- **Timeline:** Edit `data/career.json` — add entry object
- **Projects:** Edit `data/projects.json` — add project object
- **Profile:** Edit `data/profile.json` — update bio, links

No database migrations, no admin panel, no build step beyond `npm install`.

---

## 16. MVP Scope (v1)

What gets built in the first implementation pass:

- [ ] Express server with routing (`server.js`)
- [ ] Dual EJS layouts (`views/tech/`, `views/civic/`)
- [ ] Dual stylesheets (`tech.css`, `civic.css`)
- [ ] Tech landing page with career timeline (JSON-driven, expandable)
- [ ] Civic landing page with photo placeholder
- [ ] Post list + single post templates for both sections
- [ ] Markdown content loader with frontmatter parsing
- [ ] Read time calculation and display
- [ ] References block renderer for civic posts
- [ ] `validate-posts.js` script
- [ ] `data/profile.json`, `career.json`, `projects.json`, `site.json` (seeded from CV)
- [ ] One tech post (Gloomhunt showcase)
- [ ] One civic post (protecting citizens essay, trimmed to ≤7 min)
- [ ] `render.yaml` for deployment
- [ ] Root redirect `/` → `/tech`

---

## 17. Explicitly Out of Scope (v1)

Deferred to later versions:

| Feature | Notes |
|---------|-------|
| Comments | Giscus, Utterances, or custom — add when ready |
| Search | Full-text search across posts |
| Admin UI / CMS | Content is files in repo |
| RSS feed | Easy to add later |
| Analytics | Plausible, GA, etc. |
| Newsletter | Substack integration or email capture |
| Authentication | No login, no draft preview URLs |
| Image uploads | Images committed to `public/img/` manually |
| i18n | English only |
| Subdomains | Path-based (`/tech`, `/civic`) not `tech.domain.com` |
| Copying all Gloomhunt docs | Curate 2–3 public posts instead |

---

## 18. Private vs Public Content

### Private (never deployed, stays in `About Me/`)

| File | Reason |
|------|--------|
| `my_life.md` | Internal political strategy assessment |
| `Core_CV_*.docx` | Source document — data extracted to JSON |
| Raw drafts not ready for publication | Work in progress |

### Public (deployed)

| Content | Location |
|---------|----------|
| Polished civic essays | `content/civic/` |
| Tech write-ups | `content/tech/` |
| Career data | `data/career.json` |
| Project cards | `data/projects.json` |
| Profile info | `data/profile.json` |
| Professional headshot | `public/img/civic/profile.jpg` |

The server must **not** serve files from `About Me/`.

---

## 19. Migration from Current Folders

| Current | Action |
|---------|--------|
| `About Me/about_insecureity,md` | Convert → `content/civic/protecting-citizens.md` (trim to ≤7 min, add frontmatter + formal `[N]` citations) |
| `About Me/my_life.md` | Keep private — do not publish |
| `About Me/Core_CV_*.docx` | Extract roles/projects → `data/career.json` + `data/projects.json` |
| `JSON DB/` | Delete after `content/` and `data/` exist |
| `tech/` (empty) | Delete after `content/tech/` and `views/tech/` exist |
| `political/` (empty) | Delete after `content/civic/` and `views/civic/` exist |

### Planned first public posts

**Tech:**

1. `gloomhunt-what-i-built.md` — showcase (~5 min), sourced from Gloomhunt docs
2. (Optional v1) `deterministic-anti-cheat.md` — learn post (~5 min)

**Civic:**

1. `protecting-citizens.md` — adapted from insecurity essay (~5–7 min, split if needed)

---

## 20. Render Deployment

### `render.yaml` (planned)

```yaml
services:
  - type: web
    name: evangel-site
    env: node
    buildCommand: npm install && npm run validate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### Requirements

- No database connection needed
- No secrets/env vars for v1 (unless custom domain DNS)
- Free tier sufficient for personal site traffic
- Auto-deploy on push to `main` branch

### Custom domain (optional, later)

- `evangel.dev` or similar → points to Render service
- `/` still redirects to `/tech`

---

## 21. Open Questions for Review

Use this section when vetting with your AI. Decisions not yet locked:

1. **Root behaviour:** Redirect `/` → `/tech` silently, or show a minimal two-card chooser (Tech | Civic)?
   - *Current plan:* silent redirect to `/tech`

2. **Draft preview:** Should `status: draft` posts be viewable at a secret URL in dev only, or strictly hidden?
   - *Current plan:* hidden everywhere except optional `?preview=1` in dev mode

3. **Insecurity essay length:** Trim to one post (≤7 min) or split into Part 1 / Part 2?
   - *Current plan:* trim for v1; split if trimming loses too much

4. **Tech colour scheme:** Dark mode portfolio or light/clean?
   - *Current plan:* TBD at build time — recommend dark with accent

5. **Photo:** Use placeholder SVG/initials until real headshot is provided?
   - *Current plan:* grey placeholder box with "Photo coming soon"

6. **Domain name:** What URL will this live at?
   - *TBD by owner*

7. **Gloomhunt live link:** Include play link on project card when game is deployed?
   - *Current plan:* `links.live: null` until game URL exists

---

## Quick Reference Card

```
TWO WORLDS
  /tech  → portfolio catalogue (default)
  /civic → governance writing portal

CONTENT
  Essays     → content/{tech,civic}/*.md  (Markdown + YAML frontmatter)
  Structure  → data/*.json                 (career, projects, profile)

RULES
  Read time  → target 5 min, max 7 min
  Civic posts → sources required, [N] citations in body
  Drafts     → status: draft (hidden)
  Private    → About Me/ folder never served

STACK
  Node + Express + EJS + vanilla JS/CSS
  No database, no framework, no CMS

DEPLOY
  git push → Render (npm install && npm run validate && npm start)
```

---

*End of planning document. Approve or annotate sections before implementation begins.*
