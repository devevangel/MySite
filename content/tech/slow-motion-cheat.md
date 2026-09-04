---
title: "The Cheat That Passes Every Replay Check: Slow Motion"
slug: slow-motion-cheat
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-07-07
status: published
summary: "Run the game at half speed and every enemy becomes easy — while the replay still verifies. Trackmania's top players got caught doing exactly this. Part 3."
tags: ["Game development", "Anti-cheat", "Fixed timestep", "Liveness"]
---

Here is a cheat that needs no hacked scores and no fake inputs. Just make the game run **slower**. Enemies crawl. Bullets drift. You have all the time in the world to aim. The finished run is a genuine run — it simply took twice as long in real life as the game thinks it did.

Replay verifies it. In 2021 several of Trackmania's top times turned out to be exactly this, and they passed the official validation for years.

## Why the obvious fix failed

Our heartbeats already caught the *opposite* problem — game time running faster than real time. Slow motion goes the other way, and I could not simply flag "game time slower than real time" because honest players pause. A phone call, a menu, a tab switch: the game stops, the clock keeps going.

Worse, a slow phone that cannot keep up with the game was *also* producing slow motion — by accident, on our own honest client.

## Fix one: freeze, never slow

The first change was to the game itself. When a device cannot keep pace, the game now **stops advancing** for that moment and records the gap as a pause, rather than smearing the shortfall across every frame. The simulation only ever runs at full speed or stands still. Slow motion is no longer something our client can produce.

## Fix two: a floor, not just a ceiling

With honest clients behaving, the server can hold the line from both sides. Outside declared pauses, game time must keep up with real time — we allow about 20% slack for stutter and load. A run that falls well below that is flagged for review.

## Fix three: budget the excuse

A cheat can still lie by *declaring* its slow-down as pause. So declared pause has a budget: a run that claims to have been paused for more than half its length, or stalled for more than a quarter, is flagged too. No honest phone call looks like that.

## The rollout rule

None of this blocks a payout on day one. It flags, a human looks, and only once we have real device data does a flag become a gate. Shipping a detector in shadow mode first is how every anti-cheat team I have read about avoids punishing the wrong people.

*Next: proving the log we received is the log that was actually played.*
