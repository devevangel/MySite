---
title: "Strava Gives You Two Seconds"
slug: strava-two-second-deadline
section: tech
type: blog
topic: integrations
project: street-keeper
published: 2026-04-22
status: published
summary: "Webhook handlers must answer fast. Heavy work belongs in a queue."
tags: ["Webhooks", "Strava", "Background jobs", "APIs"]
---

Third-party webhooks are latency contracts. The provider sends an event and expects an acknowledgement within a fixed window  - often just a couple of seconds. Anything slower belongs in a queue, not in the handler.

I integrated Strava activity webhooks into an app where processing one event could take tens of seconds (fetch points, spatial queries, database writes). The handler's only job is to **accept and enqueue**.

## Acknowledge fast

Validate the payload, push a background job, return **200 immediately**.

I return 200 even when internal handling fails after logging. Strava retries non-200 responses aggressively. A short deploy glitch plus retries can flood duplicate events once you recover.

## Deduplicate by design

Providers legitimately send duplicates  - slow responses, network blips, retries. Jobs need a **singleton key** per external event ID so two workers do not process the same activity in parallel. Without that, I saw races writing the same records.

## Pitfall: thundering herds

When a user imports dozens of historical activities in one area, many jobs may try to prepare the same local data at once. Layer your guards:

- lock by geographic cell so concurrent syncs share one in-flight operation
- cache city-detection results briefly
- one active sync per city
- throttle calls to upstream APIs

## Takeaway

Treat webhooks as envelopes, not workers. Fast ack, async processing, idempotent jobs, and guards for bursts  - especially when onboarding imports many events at once.
