---
title: "A Bounty Board That Heals Itself"
slug: a-bounty-board-that-heals-itself
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-05-26
status: published
summary: "Calibration prices a challenge before launch. The self-heal loop watches what happens after — and fixes it without waking anyone up. Part 4."
tags: ["Game development", "Live ops", "Automation", "Game economy"]
---

Pricing a challenge from free-play data is a forecast. Live play is the weather. Players approach a paid challenge differently from a casual run — more carefully, more often, with real motivation — so the observed clear rate will drift from the target. The self-heal loop exists to notice and act.

## Two loops, two speeds

**Loop A — calibration** — runs on verified free-play data and decides how new challenges are priced. Slow and broad.

**Loop B — self-heal** — runs on the judged results of live paid challenges, every few hours and again right after any win. Fast and specific. It compares each live challenge's clear rate to its tier band and asks: is this still the deal we meant to offer?

## What "heal" actually does

The important design decision: **the engine never edits a live challenge.** A player who entered at one difficulty must finish at that difficulty; changing the rules mid-flight is the kind of thing that ends trust for good.

Instead, healing is a small ladder:

1. **Suspend** the current challenge — closes to new entries, refunds anyone mid-run.
2. **Draft a replacement** with re-calibrated thresholds, using both the free-play curve and what the live pot just taught us.
3. **Publish** the replacement automatically — or hold it as a draft for a human, a switch that flips without a deploy.

Emergencies suspend first, then draft, so a failed draft leaves the challenge safely closed. Warnings draft first and only suspend once the replacement is ready, so the board never goes empty over a small drift.

## Restocking

Challenges have a limited number of wins. When one sells out, the board restocks it — unless the sell-out looked wrong (the house lost money, or it was cleared far too easily). Then a **refill hold** is set, and the template stays dark until a person clears it.

## Why it feels boring

A healthy self-heal loop mostly does nothing. Most checks find every challenge inside its band. That is the point: it exists so that the one week a challenge is mispriced does not cost a month of margin or a queue of angry players.

*Next: why too easy is an emergency but too hard is a wait.*
