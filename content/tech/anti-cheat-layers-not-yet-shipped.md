---
title: "The Anti-Cheat Layers We Researched but Haven't Shipped"
slug: anti-cheat-layers-not-yet-shipped
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-08-25
status: draft
summary: "Six more layers, ranked by value, and an honest statement of what no layer can catch. Part 8, closing the series."
tags: ["Game development", "Anti-cheat", "Security", "Roadmap"]
---

Seven posts in, here is what is built: server replay, a server-clocked heartbeat stream, a pace floor with a pause budget, mid-run commitments, a risk queue, payout holds, and population statistics. Here is what is researched, ranked by how much I expect each to be worth.

## 1. A replay viewer for reviewers

We can already re-simulate any run. Rendering that so a reviewer can *watch* a flagged run is the cheapest, highest-value addition left. Slow motion, bots, and rewinds are obvious to a human eye in twenty seconds. Every replay-verified game with a fair-play team has this.

## 2. Device fingerprinting and IP intelligence

Ties accounts to devices, spots headless browsers and virtual machines, flags data-centre addresses. This is what turns "three accounts, one sign-up address" from a hint into a case. Needs a vendor and a privacy notice.

## 3. Identity before first cash-out

A one-time identity check, matched against the name on the bank account we already resolve. One human, one payout identity. It collapses multi-account farming at the only point that matters — where the money leaves.

## 4. A bot challenge at money edges

An invisible challenge on challenge entry and on withdrawal. Cheap, and it raises the price of scripted farms from "write a loop" to "solve a research problem."

## 5. Revealing the seed in pieces

Today the run's random seed is known up front. Revealing it thirty seconds at a time in heartbeat responses would cap how far ahead a program can plan, make heartbeats mandatory, and make slow motion structurally harder. The cost is a mid-run network dependency and a graceful "waiting for server" state.

## 6. A behavioural model

Reaction times, aim smoothness, input rhythm — compared to a corpus of runs we know were human. This is how Valve's VACnet and Lichess's detection work. We have the metrics; we lack the labelled corpus until paid testers provide it. Shipping guessed thresholds would flag everyone or nobody.

## The honest ceiling

A bot that plays live at human pace with realistic jitter, on a real device, behind a real identity, is indistinguishable from an excellent player. No layer changes that. What the layers do is make it the *only* attack left, and the payout caps and holds bound what it can ever extract.

That is the goal: not a system nobody can beat, but one where beating it costs more than it pays.

## Update — September 2026

Layer 5 — revealing the seed in pieces — is built. The server no longer hands the whole future at the start. Details: [The Seed You Cannot See Ahead](/tech/blog/the-seed-you-cannot-see-ahead).

Layer 6 — a behavioural model — has a first version. We test those checks against bot runs we wrote to look like cheats, and against bot runs we wrote to look honest. We still do not have a labelled set of human runs, so those checks watch in the background. They do not decide money on their own. See [A Bot That Plays Like a Person](/tech/blog/a-bot-that-plays-like-a-person).

The other layers in this post are still not shipped.
