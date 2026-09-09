---
title: "Too Easy Is an Emergency. Too Hard Is a Wait."
slug: too-easy-emergency-too-hard-wait
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-06-02
status: published
summary: "The self-heal loop reacts to a challenge being too easy after five attempts, but refuses to ease a hard one before twenty. The asymmetry is the whole design. Part 5, closing the series."
tags: ["Game development", "Live ops", "Game economy", "Decision making"]
---

The self-heal loop compares how often each live challenge is finished to its target band. The obvious implementation treats both misses the same: too easy, tighten; too hard, ease. The version that survived contact with real costs is deliberately lopsided.

## Too easy costs money now

If a challenge is being finished at twice its target, every extra attempt is a reward we did not plan for. Waiting for more data is paying for more data. So **tighten fires early** — five attempts and a sold-out challenge is enough — and the replacement goes straight to the *hard* end of the band, not the middle. Undershooting a fix you have just paid for is not conservative; it is a second bill.

## Too hard costs patience later

A challenge nobody is clearing costs us nothing today. It costs players' willingness to come back. That is real, but it is slow, and it is easy to misread.

Twenty attempts with no win could mean the challenge is broken. It could also mean twenty ordinary attempts at a hard target. So **ease waits** for a real sample — at least twenty — and then asks a second question: *how close is the typical run getting?*

- If the median run reaches 90% of the goal, players are in the hunt. Do nothing; the wins are coming.
- If the median run is stuck below 70%, the goal is genuinely out of reach. Ease it.
- In between, leave it and check again next pass.

And when it does ease, it never goes past the *easy* end of the band. A hard challenge becoming a walk-in win is the tighten problem all over again.

## The lesson beyond this board

Any automated corrector faces two kinds of error, and they rarely cost the same. Work out which mistake bleeds and which mistake merely stings, then let the loop be fast on the first and slow on the second. Symmetry feels principled. Asymmetry is what keeps the lights on.

## Where the series ends

Kill switches, calibration from real players, one vote each, a heal ladder that never edits a live challenge, and a corrector that knows which way is expensive. None of it is clever on its own. Together it lets a very small team run a board of paid challenges that mostly looks after itself — and tells us, loudly, when it cannot.
