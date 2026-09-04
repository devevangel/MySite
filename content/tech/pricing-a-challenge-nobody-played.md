---
title: "Pricing a Challenge Nobody Has Played Yet"
slug: pricing-a-challenge-nobody-played
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-05-12
status: published
summary: "How hard should 'survive 4 minutes' be for a ₦200 entry and ₦2,500 prize? Instead of guessing, the board reads it off what real players already do. Part 2."
tags: ["Game development", "Live ops", "Statistics", "Game economy"]
---

A paid challenge has three numbers: entry fee, prize, and how hard it is. The first two are business decisions. The third used to be a guess, and a guess is expensive in both directions — too easy and the house pays out on every run; too hard and nobody plays twice.

## Start from a target, not a threshold

The trick was to stop thinking in thresholds ("120 kills") and think in **clear rates**. Each tier has a band: a free-entry challenge should be cleared by roughly 25–35% of attempts; a ₦400 daily by about 4–6%. The band is the promise. The threshold is whatever delivers it.

## Let the players set the threshold

Every verified free-play run on the game's default settings tells us what real players do: how long they last, how many kills, and so on. Line those up and the question "what kill count would 30% of players reach?" has a literal answer — the 70th percentile of the data.

So that is what the engine does. A challenge template says "kills, at least, aim for the Free band." Calibration reads the percentile from real runs, rounds it to a player-friendly number, and writes it in. No one types a threshold.

## Only clean data votes

Three rules keep the data honest:

- Only **server-verified** runs count. A run that failed replay, or that sits in the fraud review queue, is not a data point.
- Only the **default configuration** counts. Percentiles from a different enemy speed are a different game.
- The engine will not calibrate below **30 distinct players**. A handful of runs is an anecdote.

## What surprised me

Composite challenges — survive *and* reach a kill count *and* avoid an item — need each condition seeded a step easier than the target, because meeting three conditions at once is harder than meeting any one. The engine knows this; I did not, until the first composite came out impossible.

## Takeaway

Pick the business numbers by hand. Let the population pick the difficulty. The next post is about why "population" means players, not runs.

*Next: one player, one vote.*
