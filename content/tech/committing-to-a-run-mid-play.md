---
title: "Signing the Game While It's Still Being Played"
slug: committing-to-a-run-mid-play
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-07-21
status: published
summary: "A rewind, a splice, or a run generated after the fact all produce a valid-looking log. The fix is to commit to the log every 30 seconds, before it is finished. Part 4."
tags: ["Game development", "Anti-cheat", "Cryptography", "Liveness"]
---

Our server replays the input log a player submits at the end of a run. But the log arrives *after* the run. Between playing and submitting, a determined player could rewind and redo a bad stretch, splice two good attempts together, or generate a whole log offline and upload it with a straight face. Each produces a file that replays perfectly.

The question became: how do you prove the log you received is the log that was happening while you watched?

## Borrowing an old idea

Cryptographers call this a **commitment**. You lock in a value now, reveal it later, and anyone can check you did not change your mind in between. Rhythm game osu! streams replay frames live for the same reason; Trackmania and Tetr.io verify on the server against what the client sent during play.

## How ours works

Every heartbeat now carries a **fingerprint** — a SHA-256 hash — of every input recorded so far. The server stores the fingerprint next to its own timestamp.

At the end of the run the server takes the submitted log, cuts it off at the same point each heartbeat referred to, and recomputes the fingerprint. If all of them match, the finished log is the one we watched being written. If any one does not, something was changed after the fact.

A mismatch is a hard fail. There is no honest way to produce one.

## Two design choices worth sharing

**Full prefix each time, not a chain.** A chained hash is cheaper but breaks if a single heartbeat response is lost. A full fingerprint every 30 seconds costs a few milliseconds and survives bad networks.

**One shared implementation.** The browser and the server hash with the same code, byte for byte. Two implementations that "should agree" is how you flag every honest player at once.

## What it buys

Rewinds, splices, and offline logs are gone as a category. What remains is the honest ceiling: a bot playing live, at human pace, on a real device. That is the fight the next posts are about.

*Next: hard rules for impossibilities, humans for probabilities.*

## Update — September 2026

The fingerprint-on-every-heartbeat idea is the same. It now rides a more frequent heartbeat, and that same reply can also hand the client the next piece of randomness. See [The Seed You Cannot See Ahead](/tech/blog/the-seed-you-cannot-see-ahead).

The thirty-second number in the body above is what we shipped first.
