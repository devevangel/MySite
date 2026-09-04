---
title: "Every Money Feature Needs a Kill Switch"
slug: kill-switches-for-money-features
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-04-28
status: published
summary: "Before I automated anything that moves money, I built four ways to stop it — and made sure the machine can pull the switch but only a person can push it back. Part 1 of a series on the self-healing bounty board."
tags: ["Game development", "Live ops", "Operations", "Paid prizes"]
---

Our game runs paid challenges — "bounties" — that price themselves, restock themselves, and pay out without a person clicking approve. Before any of that went live, I built the stop buttons. This series is about the automation; it has to start with how it is switched off.

## Four levels, not one

A single "emergency stop" is too blunt. Some problems are one broken challenge; others are the whole board. So there is a ladder:

**Level 1 — Suspend.** One challenge closes to new entries immediately. Anyone mid-run is voided and refunded. This is the first move while diagnosing, and it is reversible.

**Level 2 — Retract, fair.** The challenge retires. Existing wins still pay; entry fees are not refunded, because the deal was honest.

**Level 3 — Retract, broken.** The challenge retires *and* every entry fee comes back. For when the deal itself was defective.

**Level 4 — Board halt.** No new paid entries anywhere. Free play continues untouched; in-flight runs settle normally. Nothing else stops.

Each independent automation — auto-restock, auto-payout, auto-withdraw — also has its own on/off switch that takes effect without a deploy.

## The asymmetry that matters

The system may pull any switch by itself. Two challenges hitting emergency in the same check is treated as systemic and halts the board. A job that misses its schedule raises an alert. Verification falling behind raises another.

But **only a person can resume.** No timer, no "conditions look normal again." A machine that can turn itself back on after tripping is a machine that will oscillate at 3 a.m.

## Fail closed

If a setting cannot be read, the answer is "off." If a quota cannot be checked, the answer is "no." A broken database connection should cost a player a few minutes of paid entry, never the house a night of unchecked payouts.

## Why lead with this

Every automation in the coming posts — pricing, healing, restocking — was written knowing the switch existed. That changed how boldly I could let the system act. Build the brake before the engine.

*Next: pricing a challenge nobody has played yet.*
