---
title: "Money Should Wait: Review Holds and Delay Periods"
slug: money-should-wait
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-08-11
status: published
summary: "Automatic credits are a convenience, not a right. The list of reasons ours refuses to fire is the most valuable part of the feature. Part 6."
tags: ["Game development", "Payments", "Fraud review", "Paid challenges"]
---

We credit small rewards automatically. A verified win on a free-entry challenge updates the balance without an admin clicking anything. Players love it. It is also the single most attractive target in the system, so most of the code is about when *not* to do it.

## The refusal list

Before a reward credits automatically, all of these must be true:

- the run **replayed** correctly on the server,
- the server **watched it happen** live, with no contradictions,
- **no flag** was raised at submission — not even a soft one,
- the account is at least **24 hours old**,
- the score is **not a statistical outlier** against verified players on the same settings,
- the winner is **not the person who published** the challenge,
- the challenge is one we tagged for automatic credit, and the reward is under the cap.

Miss any one and nothing bad happens to the player. The win simply waits in a queue for a person.

## The bug this fixed

The embarrassing discovery: our judge used to *overwrite* a flagged result with "completed" the moment the replay matched. A run flagged as suspicious at submission could be laundered clean by its own verification a minute later. Now a flag survives judgment. The win is recorded — the player did finish the challenge — but the reward waits until a reviewer clears the flag.

## Why 24 hours

A short wait on a new account is standard when a game sends rewards for one reason: multi-account farms are fastest in their first day. Holding the first win gives the review queue time to see three accounts appear from the same device before money leaves for any of them. It costs an honest newcomer one day. It costs a farm its business model.

## The principle

Refusing to credit automatically is never a denial. It is a promise that a human will look. Design the refusal list first; the "approve" button is the easy part.

*Next: finding "too good, too fast" without a cheat detector.*
