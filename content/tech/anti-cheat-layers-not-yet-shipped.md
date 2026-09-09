---
title: "The Anti-Cheat Layers We Researched but Haven't Shipped"
slug: anti-cheat-layers-not-yet-shipped
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-08-25
status: published
summary: "Six more layers, ranked by value, and an honest statement of what no layer can catch. Part 8, closing the series."
tags: ["Game development", "Anti-cheat", "Security", "Roadmap"]
---

Seven posts in, here is what is built: server replay, a server-clocked heartbeat stream, a pace floor with a pause budget, mid-run commitments, a review queue, delayed rewards, and population statistics. Here is what is researched, ranked by how much I expect each to be worth.

## 1. A replay viewer for reviewers

We can already re-simulate any run. Rendering that so a reviewer can *watch* a flagged run is the cheapest, highest-value addition left. Slow motion, bots, and rewinds are obvious to a human eye in twenty seconds. Every replay-verified game with a fair-play team has this.

## 2. Device fingerprinting and IP intelligence

Ties accounts to devices, spots headless browsers and virtual machines, flags data-centre addresses. This is what turns "three accounts, one sign-up address" from a hint into a case. Needs a vendor and a privacy notice.

## 3. Identity before first withdrawal

A one-time identity check, matched against the name on the bank account we already resolve. One human, one withdrawal identity. It collapses multi-account farming at the only point that matters — where the money leaves.

## 4. A bot check at money edges

An invisible check on challenge entry and on withdrawal. Cheap, and it raises the price of scripted farms from "write a loop" to "solve a research problem."

## 5. Revealing the seed in pieces

Today the run's random seed is known up front. Revealing it thirty seconds at a time in heartbeat responses would cap how far ahead a program can plan, make heartbeats mandatory, and make slow motion structurally harder. The cost is a mid-run network dependency and a graceful "waiting for server" state.

## 6. A behavioural model

Reaction times, aim smoothness, input rhythm — compared to a corpus of runs we know were human. This is how Valve's VACnet and Lichess's detection work. We have the metrics; we lack the labelled corpus until paid testers provide it. Shipping guessed thresholds would flag everyone or nobody.

## The honest ceiling

A bot that plays live at human pace with realistic jitter, on a real device, behind a real identity, is indistinguishable from an excellent player. No layer changes that. What the layers do is make it the *only* attack left, and reward limits plus review holds bound what it can ever take.

That is the goal: not a system nobody can beat, but one where beating it costs more than it is worth.

## Update — September 2026

Four things around this list have shipped. The original ranking stays as I wrote it in August. This is what moved.

The seed now arrives in pieces. The server no longer hands the whole future at the start. [The Seed You Cannot See Ahead](/tech/blog/the-seed-you-cannot-see-ahead).

Integrity scoring is live. A flag holds the reward and leaves the start button alone. [Flag the Run, Never Lock the Player](/tech/blog/flag-the-run-never-lock-the-player).

Accounts that share a bank, a phone, or a device are one cluster. Votes and caps use that cluster, not the login count. That is the one-vote rule with a harder "who is one person." [One Player, One Vote](/tech/blog/one-player-one-vote).

We have a bot that only sees what a screen would show, and a ladder of those bots that prices a challenge before people arrive. We also run them at the checks. That is the bot validation. It is not a labelled-human behavioural model, and it does not decide money on its own. [A Bot That Plays Like a Person](/tech/blog/a-bot-that-plays-like-a-person). [Bots First, Then People](/tech/blog/bots-first-then-people).

Layer 1 — a replay viewer on a review page a non-engineer can finish in a minute — is not built. Neither is a vendor device fingerprint, nor an identity check before first withdrawal. Those stay on the list.
