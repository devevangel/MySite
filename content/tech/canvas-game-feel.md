---
title: "Making a Browser Game Feel Good Without Unity"
slug: canvas-game-feel
section: tech
type: blog
topic: game-dev
project: gloomhunt
published: 2026-03-12
status: published
summary: "Custom canvas engine tricks: particle pools, directional hit feedback, and distance-based sound."
tags: ["Game development", "Canvas", "Sound design", "Visual effects"]
---

Commercial engines ship editors, asset pipelines, and years of polish defaults. Building on raw Canvas means you earn "game feel" yourself — but you also learn which tricks actually matter.

These are patterns I used on a 2D browser shooter that had to stay fast on mid-range phones.

## Particle pools

Allocating objects every explosion is an easy way to stutter. I used a **fixed pool** (400 slots) and reused dead particles. On weaker devices, spawn counts scale down so combat frenzies do not flood the GPU.

A satisfying hit is rarely one effect. I stacked cheap layers: particles, clamped **camera shake**, a **flash ring**, brief **lighting**, and a **ground scorch**. Each is simple; together they read as impact.

## Directional feedback

When the player takes damage, a small **wedge** on screen points toward the source. Short fade, tiny pool. Players feel where pressure is coming from without reading UI.

## Distance-based sound

The Web Audio API with a **voice cap** (16 sounds) stopped clipping: older voices fade when the limit is hit.

For ambient sources (campfires, etc.), quadratic falloff works well:

```javascript
const t = 1 - dist / maxDistance;
return baseVolume * t * t;
```

Gunshots stay configured per weapon in JSON. On mobile, audio must unlock after a user gesture — plan for that in your boot flow.

## Quality tiers

The expensive part on Canvas is often **overdraw**: glow halos on particles, shadow blur, high device pixel ratio. Touch layouts skip the halo pass; desktop keeps it. Same game, different GPU budget.

## Pitfall

Juice code can accidentally feed gameplay randomness. If you ever verify runs server-side, keep visual systems on their own random source.

## Takeaway

Pools, falloff, layered cheap effects, and one quality toggle get you surprisingly far without Unity. The skill is knowing what to skip on weak hardware, not adding more features.
