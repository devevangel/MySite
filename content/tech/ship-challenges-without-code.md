---
title: "Ship Game Challenges Without Shipping Code"
slug: ship-challenges-without-code
section: tech
type: blog
topic: game-dev
project: gloomhunt
published: 2025-03-18
status: published
summary: "Paid challenges should be data and rules, not a new deploy every time someone invents a variant."
tags: ["Game development", "Configuration", "Backend", "Live ops"]
---

Live games need fresh challenges. The slow way is a new code branch for every variant: survive X seconds, ban health pickups, combine three conditions. The fast way treats challenges as **content** the server already knows how to evaluate.

I hit this building paid bounties on a browser game. Admins wanted new rules weekly. Engineering wanted sleep.

## The wrong first step

Hard-coded templates in the client worked for three bounties. The fourth request was always a combination nobody predicted — timer AND kill count AND item restriction. Multiplying hand-written templates does not scale.

## What worked

**Declarative rules** stored as data: win conditions, fail conditions, timers, allowed items. Admins compose challenges from building blocks. The server evaluates rules against **verified run state**, not a client flag that says "I won."

Client UI can preview progress (timer, counters) for responsiveness. Payout authority stays on the server, using the same frozen config the anti-cheat replay trusts.

Version configs. When balance changes, old challenges point at old artifacts so disputes have a clear reference.

## Pitfalls

**Rules only on the client** invite cheating the moment money is involved. Dual evaluation is fine only if both sides read the same frozen definition.

**Deploying rule tweaks without versioning** makes "what were the rules when I played?" unanswerable.

## Takeaway

If operators will change behaviour often, invest in a **rule engine and config pipeline** early. Code is for capabilities; data is for variations.
