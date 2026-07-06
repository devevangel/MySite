---
title: "How I Fit a Whole City Map in a Free Database"
slug: syncing-a-city-on-free-tier
section: tech
type: blog
topic: geospatial
project: street-keeper
published: 2026-05-06
status: published
summary: "Pre-loading an entire region blew my storage limit. On-demand city sync was the fix."
tags: ["Maps", "OpenStreetMap", "Databases", "Free hosting"]
---

OpenStreetMap data grows fast once you materialise nodes, ways, and spatial indexes. A regional extract that looks manageable on disk can expand to **gigabytes** in PostgreSQL. On a 500MB hosting tier, the math does not work if you try to own the map upfront.

I needed local street geometry for spatial queries, but not for the whole country — only where users actually draw their areas. **On-demand city sync** was the pattern that fit the budget.

## The pattern

When a user defines a new area:

1. **Detect the city** for a point inside it (Overpass `is_in` or equivalent)
2. **Check cache** — synced this city recently? (I used ~42 days)
3. **If missing, sync once** — download that city's streets, store nodes and ways in PostGIS, index them
4. **Query locally after that** — no upstream street fetch per user action

First sync in a new city costs time (network + inserts). You pay once per city, not once for an entire region you may never need.

## Reuse what you already have

Store a boundary around each synced city (convex hull plus a small buffer works). Before any network call: is this point inside a fresh cached boundary? If yes, skip straight to local queries.

Most traffic in a city never triggers a second full download.

## Pitfall: concurrent first syncs

Bulk imports can enqueue many jobs in the same unsynced city. Without locks, each job starts its own download. Layer deduplication: grid-cell promise sharing, short-lived detection cache, per-city sync lock, and throttled Overpass requests.

## Takeaway

You rarely need all the map. You need the right slice **when the user acts**. Design storage around that and small tiers become viable without giving up geographic breadth.
