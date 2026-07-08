---
title: "Why Phone GPS Ruins Clever Map Algorithms"
slug: gps-street-matching
section: tech
type: blog
topic: geospatial
project: street-keeper
published: 2026-04-08
status: published
summary: "My first street-matching engine looked smart on paper. Consumer GPS made it lie."
tags: ["GPS", "Maps", "Running apps", "PostGIS"]
---

Location features often fail in the gap between **map precision** and **phone GPS reality**. Map geometry is clean. Consumer tracks drift metres at a time. Algorithms that look rigorous on paper can still lie to users.

I hit this matching runs to street coverage: which roads did someone actually run? My first engine was geometrically clever. My second was boring. The boring one won.

## First approach: polyline coverage

I scored how much of each street's polyline a GPS trace covered  - optionally snapped via Mapbox.

In controlled tests with snapping, accuracy looked excellent (~98%). Without snapping, it dropped (~85%). I treated that as good enough while iterating.

## Where it broke

**Drift vs parallel roads.** GPS error is often 7–13 metres. Parallel streets can be closer than that. Continuous percentages let one run credit the wrong road.

**Live API dependency.** Each activity queried Overpass for streets. Public API latency became my latency.

**Unstable scores.** Reprocessing the same run could nudge percentages. Users notice flicker.

## What worked instead: node hits

Treat the network as nodes. If a GPS point falls within 25 metres of a node, record a hit (`ST_DWithin` on geography types so the radius is real metres). A street completes when enough of its nodes are hit  - stricter on short cul-de-sacs.

Binary hits absorb noise better than continuous line coverage. When error is larger than the feature you measure, **coarsen the feature**.

Street geometry lives in the database per city after sync, so matching does not call Overpass on every run.

## Pitfall

Elegant geometry feels more "correct." It is only correct if your input is precise. Phone GPS is not.

## Takeaway

Match your model to your sensor error budget. Simpler discrete rules often outperform clever continuous scoring for consumer GPS.
