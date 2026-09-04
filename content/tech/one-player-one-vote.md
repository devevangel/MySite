---
title: "One Player, One Vote: Keeping Calibration Honest"
slug: one-player-one-vote
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-05-19
status: published
summary: "If one enthusiast plays 200 runs, the difficulty curve becomes their difficulty curve. Calibration counts people, not attempts. Part 3."
tags: ["Game development", "Live ops", "Statistics", "Testing"]
---

The pricing engine reads difficulty off real runs. The first version counted every run equally. Then I imagined one very good, very keen player grinding two hundred sessions, and every challenge on the board quietly becoming a challenge for *that person*.

## People, not runs

Each signed-in player now contributes exactly **one vote**: the middle value of their own runs. Play once or play a hundred times, you move the curve by the same amount. The 30-sample minimum became 30 *players*, and extra runs from the same people do not fill it.

This sounds like a small change. It reshaped how we hire testers.

## Testers are votes

Because a player is a vote, twenty runs from one tester is worth roughly the same as three. So instead of paying a few people for many runs, we pay **many people for a few runs each** — three is the sweet spot, enough for a stable middle value per person. Forty testers for three runs gives a better curve than eight testers for fifteen, and costs less.

## Guests watch, players vote

Anyone can play without an account, and we do track those sessions — an anonymous cookie, the standard funnel method, so we can see who drops off before signing up. But guest runs **never price a bounty**. A cookie is free; a signed-in account is at least a small cost, and calibration should only listen to inputs that cost something to fake.

## Remembering the curve

Every calibration pass also saves a **snapshot**: how many players voted, the key percentiles, the thresholds it produced. That gives us two things — a chart of the curve drifting as the audience grows, and an exact record of what the data said when any given challenge was priced. "The tester wave set this; the public shifted it here" is a question with an answer.

## Takeaway

Any time a system learns from behaviour, ask who can vote and how often. The answers are your defence against both the enthusiast and the farm.

*Next: a bounty board that heals itself.*
