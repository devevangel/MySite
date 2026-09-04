---
title: "Hard Rules for Impossibilities, Humans for Probabilities"
slug: hard-rules-vs-probabilities
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-08-04
status: published
summary: "The most important anti-cheat decision is not what to detect. It is what to do when you detect it. Part 5: the risk queue."
tags: ["Game development", "Anti-cheat", "Fraud review", "Operations"]
---

Every detector we added raised the same question: now what? Block the run? Deny the prize? Ban the player?

The answer that held up was borrowed from how Valve reviews suspicious matches, how chess sites handle fair play, and how real-money skill-gaming companies run their risk desks. There are two kinds of signal, and they deserve two kinds of response.

## Impossibilities get rules

Some things cannot happen to an honest player. Game time arriving faster than real time. More frames reported than the log contains. A log that differs from what was committed during play. These are not suspicions; they are contradictions. Code rejects them, and nobody needs to look.

## Probabilities get people

Everything else is a shade of grey. A run that seems slow. A pause that seems long. A brand-new account that wins big. A score in the top half-percent of everyone who has ever played. Great players, weak phones, and bad networks all live in this grey. An automatic denial here punishes the wrong person often enough to kill trust.

So these do not deny. They **flag**, and the flag does three things at once:

- the run comes off the leaderboard,
- it stops counting toward how we price future challenges,
- any prize attached to it waits.

Then it lands in one place: the **risk queue**.

## What a reviewer sees

One row per run, with why it is there — in plain words, not codes. The server's heartbeat timeline, interval by interval. How the score compares to verified players on the same settings. The account's age, its verified history, and how many *other* accounts share its sign-up address, device, or bank account.

Two buttons. **Clear** puts everything back: leaderboard, calibration vote, prize. **Confirm** marks the run invalid for good. Both are written to an audit log with the reviewer's name and note.

## Why this shape

A rule can be wrong forever. A person can be wrong once and learn. Keeping humans on the probabilistic side is not a gap in automation; it is what makes the automation safe to turn on.

*Next: why money should wait.*
