---
title: "Catching 'Too Good, Too Fast' Without a Cheat Detector"
slug: too-good-too-fast
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-08-18
status: draft
summary: "Chess sites have no client to inspect, so they lean on statistics against a known population. We borrowed the idea for game runs and for accounts. Part 7."
tags: ["Game development", "Anti-cheat", "Statistics", "Fraud review"]
---

Chess.com and Lichess have an anti-cheat problem with no anti-cheat surface. There is no game client to inspect, only moves. Their answer is statistics: how unlikely is this performance for this population? We have more to work with than they do, but the idea transferred cleanly.

## Runs against the population

Every verified run gives us a kills-per-minute number on a known configuration. Enough of them, and a new run can be placed in that distribution. A run in the top half-percent of a hundred-plus verified peers is not proof of anything — the best player in the world lands there on purpose — but it is worth a look before money moves.

Two guardrails made this safe:

- **Same settings only.** Enemy speed and health set the ceiling; comparing across configurations is comparing apples to sprint times.
- **No verdict on a thin population.** Under a hundred peers, the number is shown to reviewers but never acts.

## Accounts against each other

The other statistic is about people, not runs. When a reviewer opens a flagged win they see how many *other* accounts share its sign-up address, its device, and — the strongest tie — its **bank account**. Someone can create ten logins. Cashing out still needs one real account at a real bank, and two players paying into the same one is a pattern with very few innocent explanations.

## Where it lives

None of this blocks anything on its own. Outliers park a prize for review and appear in the risk queue with the numbers beside them. Cluster counts sit under the player's name. The reviewer decides.

## What it does not need

No model, no training data, no labelled corpus. Just our own verified population and a willingness to say "unusual" rather than "guilty." The behavioural model — the one that reads mouse jitter and reaction times — comes later, once paid testers have given us a few hundred runs we *know* were human.

*Next, closing the series: the layers we researched but have not shipped, and why.*

## Update — September 2026

The behavioural checks I said would come later now exist as a first version. We can run them against bot profiles that play like cheats and bot profiles that play like people. We still lack a labelled human corpus, so those checks stay in the background. The population statistics in this post are unchanged. See [A Bot That Plays Like a Person](/tech/blog/a-bot-that-plays-like-a-person).
