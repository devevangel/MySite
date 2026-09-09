---
title: "Bots First, Then People"
slug: bots-first-then-people
section: tech
type: blog
topic: live-ops
project: gloomhunt
published: 2026-09-05
status: draft
summary: "A challenge still needs a difficulty number on day one. Until enough clean human runs exist, a ladder of bots is the guess — and prizes stay conservative."
tags: ["Game development", "Live ops", "Bots", "Statistics"]
---

I already wrote that we price a challenge off what real players do. That is still the goal. It is not how day one works.

On day one there are no real players. If publish has to wait for a crowd, the board stays empty. If publish guesses, the house or the players get a bad deal.

## The rule we shipped

While we do not have enough clean human runs, the **bot ladder** is allowed to stand in for "we measured this."

The ladder is a grid: skill, phone or mouse, and a recipe. Each cell is a job. A finished cell is a pile of numbers — how long they last, how many they kill — not a vibe. Everything that asks "is this challenge even possible?" reads those cells. Nothing else.

Publish still has to pass the rest of the lint: the recipe comes from the catalogue, the item mix is legal, the predicted clear rate sits in the tier band. The only thing bots unlock is "we have a baseline at all."

Until real players confirm the guess, prizes stay smaller than the full table. That is not a business trick. It is the cost of being early. When the human sample is large enough, the cap lifts on its own. Nobody has to remember to flip it.

## What we will not mix

Bot runs are marked as bot runs when they are written. They never sit on a leaderboard. They never vote as if they were people. The clean-data door that prices the live board does not let them in.

Human runs and bot runs answer different questions. Bots answer "can anyone clear this, and roughly how hard is it?" People answer "how hard is it for this audience?" Using one as the other is how you ship a challenge that only a script can win, or one that nobody will play twice.

## After the rules change

A new engine version makes yesterday's cells belong to a different game. The bump command does not delete them. It lines up a fresh ladder. Morning should have new numbers. If it does not, publish should fail, not guess.

The later job — sliding the bot's skill curves toward real humans — only reads the same clean human door. A cheater-looking sample never gets to move the curves.

I still want people to set the difficulty. Bots are how we get to the day when that sentence is true.

*Next: [one player, one vote](/tech/blog/one-player-one-vote).*
