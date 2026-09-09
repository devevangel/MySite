---
title: "The One Clock a Cheater Can't Touch"
slug: heartbeats-server-clock
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-06-23
status: draft
summary: "Every 30 seconds the game reports in. The server, not the browser, writes down when. That timestamp is the backbone of proving a run was played live. Part 2."
tags: ["Game development", "Anti-cheat", "Server verification", "Liveness"]
---

Everything a browser sends can be edited: scores, timestamps, the input log itself. There is exactly one thing the player cannot forge — **when the server received it**.

That single fact is what we built "liveness" on.

## Heartbeats

While a run is in progress, the game sends a small message every 30 seconds: how far the in-game clock has advanced, a few running counters, and how many simulation frames have passed. The server stamps each one with its own clock and stores it.

At the end of the run we now have two timelines side by side: the **game's** account of how much time passed, and the **server's** account of how much real time passed.

## What the two timelines tell you

**Game time running faster than real time** is physically impossible for a human. Ten minutes of survival cannot arrive inside two minutes of wall clock. When it does, the run is rejected outright — no review needed.

**Too few heartbeats** for the length of the run means the server never watched it happen. Perhaps the network dropped. Perhaps the run was produced offline and uploaded. Either way, we do not know, so the outcome is marked *unproven*.

**Heartbeat frame counts that disagree with the submitted log** mean the stream we watched and the file we received describe different runs.

## The rule that made it safe to ship

Unproven is not the same as guilty. A player on a bad mobile connection will sometimes miss heartbeats. So:

- Impossibilities block automatically.
- Everything else routes to a human before money moves.

A run with thin evidence still pays — after someone looks. Nobody honest loses a prize to a flaky network; nobody dishonest gets paid by a machine.

*Next: the one cheat that passes both replay and heartbeats — and how we closed it.*

## Update — September 2026

Heartbeats still work the way this post describes: the server stamps when it heard from you. Two things changed.

The messages now come more often, and each reply can include the next piece of the run's randomness. That is how we stopped a program from seeing the whole future at the start. I wrote that up here: [The Seed You Cannot See Ahead](/tech/blog/the-seed-you-cannot-see-ahead).

The thirty-second number in the body above is what we shipped first. Treat it as history.
