---
title: "The Engine Version Is a Contract"
slug: engine-version-is-a-contract
section: tech
type: blog
topic: game-dev
project: gloomhunt
published: 2026-09-02
status: draft
summary: "Change how the game works and every old proof is about a different game. One command now moves the version, the proofs, and the fixtures together — or it refuses."
tags: ["Game development", "Determinism", "Testing", "Server verification"]
---

Replay only works if the server plays the same game the player played. The seed, the settings, and the inputs are not enough. You also need the same rules.

I used to treat "the rules" as whatever was in the code today. That is how you get a false alarm: a run that was honest last week looks broken this week, because you changed how damage is calculated and forgot to say so.

## What went wrong

The first fix was a number: an **engine version**. Bump it when the simulation changes. Keep it still when you only change pictures, sounds, or menu copy.

That number sat in a file. The proofs sat in other files. After a change I would refresh the proofs by hand. Miss one, and the next test fails for a reason that has nothing to do with a cheat.

Worse: some changes look tiny. A distance helper that disagrees by a hair between browsers. A pause that used to freeze the clock. Those are still "the game changed." If the version does not move, two machines can disagree and you will not know why.

## What we ship now

There is one command. It does the whole job or it does none of it.

It writes the new version and a one-line reason. It replays every saved run we trust. If anything other than the final hash changed — a check that used to pass, a rule that used to hold — the command puts the old version back and stops. If the hashes are the only thing that moved, it rewrites the proofs, checks the same run in more than one browser, and writes down that the bump happened.

A version that changed without the proofs changing fails CI. That is the whole point. The version is not a comment. It is a contract.

The server also stamps the version on the run when it **starts**, not when it is submitted. A later upload cannot pick a different set of rules.

## What I would do again

Treat pictures and rules as different things from day one. And never let a person bump a version by editing a file. People forget a fixture. A command does not.

When the rules change you also have to measure the game again. Until real players exist, that measurement is a ladder of bots. I wrote that up next.

*Next: [bots first, then people](/tech/blog/bots-first-then-people).*
