---
title: "A Flagged Run Should Take One Minute to Decide"
slug: one-minute-to-decide-a-flagged-run
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-09-16
status: published
summary: "A review queue is useless if only the person who wrote the detectors can use it. Ours is a list, a sentence, a watch button, and two decisions."
tags: ["Game development", "Anti-cheat", "Fraud review", "Admin tools"]
---

I already wrote that grey cases wait for a person. That sentence is cheap. The expensive part is the screen.

If the queue shows codes, raw verdicts, and a dump of numbers, the only person who can clear it is the person who wrote the checks. That does not scale. The job I wanted was: a non-engineer opens the list, understands why the run is there, watches it, and decides.

## What I refused to ship

A "details" page that is the database row with nicer fonts. That is not a review. That is homework.

The first version of our queue was close to that. You could see that something was wrong. You could not tell, in one look, whether it was a cheat, a bad phone, or a great player.

## What the row shows

One line per flagged run. The important column is **why it is here**, in a short phrase a person can read: the game ran faster than real time, the recording was edited after play, the win had almost no check-ins, the device is shared, the score sits far above everyone else on the same challenge.

Under that: did our replay match, and did the live check-ins look normal. Those are two different questions. A match means the score is real. It does not mean a human made the inputs.

Paid or free is on the row so you know what is waiting. So is how fast the game ran against our clock. None of that decides for you. It tells you where to look.

While the run sits here it is off the leaderboard, it does not vote on difficulty, and the reward waits.

## Open it, then watch it

**Inspect** opens the same row. You get the full sentence for each reason. You get the player's age, how many of their runs already matched, and how many other accounts share a bank, a device, or a sign-up address. You get their last runs on one table, so "is this how they always play?" has an answer on this screen.

You also get every check-in we stamped while they played: real time, game time, pauses, and whether that check-in still matches the file they sent. A timeline a person can scan beats a verdict letter.

**Watch** opens the run in a new tab. It is not a video. It is the same game engine, fed the same inputs, with the frozen settings from that session. You can pause, change speed, and jump. Declared pauses hold the picture so you see them. Slow motion, a script, and a rewind are obvious to the eye. The page does not record a new run. Nothing about the review is written as play.

That watch is the tool I used to think we still lacked. We can already re-simulate any run. Showing it was the missing half.

## Two buttons and a note

**Clear** puts the run back: leaderboard, difficulty vote, and a held win can credit.

**Mark invalid** keeps it out. The replay verdict does not change. You are not arguing with the simulation. You are saying the person behind the inputs is not one you will pay.

Both ask for a note. Both write who decided. A decision with no name is a decision you cannot learn from.

There is a short "how to read this" under the list. Speed, edited recordings, and a high kill rate each get one sentence. The high kill rate sentence is the important one: it is a statistic, not proof. Great players land there. Look at their last runs before you click.

## What I would do again

Design the queue as a job, not as a log. If a new check cannot explain itself in a phrase, it is not ready to flag anyone. And never make the reviewer reconstruct the run from numbers when you can let them watch it.

*Next: [why money should wait](/tech/blog/money-should-wait).*
