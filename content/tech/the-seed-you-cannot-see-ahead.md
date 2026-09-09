---
title: "The Seed You Cannot See Ahead"
slug: the-seed-you-cannot-see-ahead
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-09-03
status: draft
summary: "If the whole future is known at the start, a program can plan the whole run. We now hand randomness out in pieces while the player is still playing."
tags: ["Game development", "Anti-cheat", "Server verification", "Liveness"]
---

I used to send the run's random seed at the start. One number. The whole future of spawns, drops, and enemy paths sat in the browser before the first shot.

Replay still worked. The server could rebuild the same run. That was never the problem.

The problem is a program that reads the seed, plays the future in its head, and then plays the real run with a perfect plan. Heartbeats and a signed log do not catch that. The log is honest. The player just never had to react.

I wrote this down as a layer we had researched and not shipped. We have shipped it now.

## What we tried first

Keeping the seed on the server and never sending it is not an option. The game has to spawn things. The client has to draw them.

Sending a new seed every few seconds without tying it to a live check is not enough either. A copied log from someone else's run would still replay.

## What shipped

The server picks a track for the session and never tells the client which track it is. It sends only the **next pieces** of randomness, a few at a time, as the run goes on.

Each heartbeat is both a "I am still here" and a "here is the next piece." If the pieces run out — the connection dropped, or the client tried to play past what it was given — the run ends. There is no pause to wait. There is no resume.

The server can rebuild the same sequence later, so replay still matches. A second player who pastes the first player's finished log fails, because the log is tied to that session, not just to the seed.

Free play and paid play use the same path. Free play feeds how we price challenges. It needs the same protection.

## What this does not catch

A bot that plays live, at human pace, with only the pieces it has so far, still looks like a strong player. That is the honest ceiling. The seed-in-pieces change just takes the *oracle* off the table — the bot that knew minute four at minute one.

The remaining fight is a bot that plays like a person. That is a different post.

*Next: [a bot that plays like a person](/tech/blog/a-bot-that-plays-like-a-person).*
