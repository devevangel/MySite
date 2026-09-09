---
title: "A Perfect Replay Can Still Be a Bot"
slug: replay-proves-the-run-not-the-player
section: tech
type: blog
topic: anti-cheat
project: gloomhunt
published: 2026-06-09
status: published
summary: "Server-side replay proves the run is real. It says nothing about whether a human played it. Part 1 of a series on securing paid game runs."
tags: ["Game development", "Anti-cheat", "Server verification", "Paid challenges"]
---

In an earlier post I argued that when money is involved, the server must **replay** every run and check the result instead of trusting the browser. We built that. It works. And then I noticed the hole in it.

Replay answers one question: *does this list of inputs really produce this score?* It cannot answer a second question: *did a person produce those inputs, at a real keyboard, in real time?*

## The uncomfortable example

Take our own game code, run it in a script with no screen, and feed it inputs from a program instead of a human. The run is genuine. The inputs are real. The final state matches. Replay says **valid** — because it is a valid run. It just was not played by anyone.

The same goes for a run played at half speed, or a run where the player rewound the last thirty seconds and tried again. The finished log is internally consistent. Replay is happy. The reward is wrong.

## Two questions, two kinds of evidence

Once I separated the questions, the design got clearer:

- **Is the run real?** Replay. Deterministic simulation, frozen config, seed, input log, hash comparison. Done.
- **Was it played live by a human?** That needs evidence collected *while the run is happening*, timed by a clock the player does not control.

The second kind of evidence is the subject of the next few posts: the server's clock, a floor on how slowly the game may run, and a way of committing to the game while it is still being played.

## What I would tell my earlier self

"Replay verified" is a statement about the log, not about the person. Treat it as necessary, never as sufficient, the moment money moves.

*Next in the series: the one clock a cheater cannot touch.*

## Update — September 2026

The scripted player in this post is no longer a thought experiment. We built one. It only sees what a screen would show, and it writes the same input log a person would. See [A Bot That Plays Like a Person](/tech/blog/a-bot-that-plays-like-a-person).
