---
title: "Your Game Says 60 FPS But Players Still Feel Lag"
slug: catching-lag-fps-hides
section: tech
type: blog
topic: performance
project: gloomhunt
published: 2026-03-20
status: published
summary: "I built a hitch detector that auto-saves snapshots when frame time spikes — because averages lie."
tags: ["Game development", "Performance", "Debugging", "Telemetry"]
---

"Feels laggy sometimes" with a steady 60 FPS counter usually means **frame time spikes** you are not measuring. Averages hide one or two frames at 50ms in an otherwise smooth second.

I ran into this during heavy combat in a Canvas game. The simulation looked fine; players still felt hitches. Building a small **hitch detector** turned vague complaints into files I could compare.

## Measure milliseconds, not FPS

At 60fps the budget is ~16.7ms per frame. I flagged:

- **mild** — ~1.5× budget
- **moderate** — 2× (noticeable)
- **severe** — 3× (visible freeze)

Track p50, p95, p99 — and the gap between p99 and p50. That "stutter gap" often explains feel better than mean FPS.

## Time your phases

Wrap major work (entities, physics, particles, render, HUD) in per-phase timers. When a hitch fires, attribute it to whichever phase — or the **unmeasured gap** between them — jumped furthest above a calm baseline.

Important: compute baseline from **normal frames only**, so spikes do not redefine "normal."

## Capture automatically

On moderate+ hitches, freeze a snapshot: entity counts, render settings, per-phase times, recent frame ring, bottleneck label. Auto-download with cooldown so one frenzy does not produce hundreds of files.

## What the data showed

Severe combat hitches had **near-zero extra JS time**. The gap was unmeasured — classic Canvas **GPU** cost: shadow blur, particle glow halos, high DPR backing store. Turning those down removed the hitches without touching gameplay.

## Pitfall

Do not rewrite game logic until you know whether the stall is sim or paint. I almost did.

## Takeaway

Instrument per-frame time, capture spikes with context, bisect render toggles before you refactor systems that were never the problem.
