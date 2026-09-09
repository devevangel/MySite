---
title: "You Can't Trust the Browser When Money Is Involved"
slug: verifying-paid-game-runs
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-03-05
status: published
summary: "If money is on the line, the server has to replay the run and check the result  - not take the client's word for it."
tags: ["Game development", "Anti-cheat", "Server verification", "Paid challenges"]
---

Whenever an outcome affects money, rankings, or rewards, the client cannot be the referee. A browser tab is fully under the user's control. Trusting a posted score is trusting whoever sent it.

I learned this building a browser game with paid challenges. The fix was not smarter heuristics ("that kill rate looks suspicious"). It was **replay**: prove the run on the server or do not send the reward.

## What to record

After each session, save enough to reproduce it:

- the random **seed**
- a frozen **config hash** (balance at play time, not today's live config)
- a **sim engine version** (code contract, separate from data tweaks)
- an ordered **input log**
- a **final state hash** from the client

The server replays with the same seed, config, and inputs, then compares hashes. Match means valid. Mismatch means stop.

## Pitfalls I hit

**Non-determinism everywhere.** `Math.random()`, frame timing leaking into simulation, cosmetic effects touching game state  - any of these breaks replay. Gameplay randomness went through a seeded PRNG. Visual-only effects used a separate stream. We linted against accidental `Math.random()` in sim code.

**Versioning confusion.** Bumping weapon damage in JSON is not the same as changing how damage is calculated. Mixing those caused false mismatches until sim version and config hash were clearly separated.

**Latency expectations.** Replay takes CPU. Players see a short verification step before a win confirms. That is preferable to instant credits you later reverse.

## What I would do again

Design for replay before you add rewards. Retrofitting determinism into a game that grew organically is painful.

If the server can reproduce the session, cheating becomes boring. If it cannot, you only have opinions.

## Update — September 2026

Three changes since this post.

The random seed is no longer one number you get at the start. The server issues it in pieces while you play. See [The Seed You Cannot See Ahead](/tech/blog/the-seed-you-cannot-see-ahead).

The engine version is stamped by the server when the run begins. A later submit cannot pick a different set of rules. See [The Engine Version Is a Contract](/tech/blog/engine-version-is-a-contract).

If the replay matches, we score the run from what the server replayed — not from the numbers the browser sent. A lie in the score packet cannot change a reward.
