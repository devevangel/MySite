---
title: "A Bot That Plays Like a Person"
slug: a-bot-that-plays-like-a-person
section: tech
type: blog
topic: game-dev
project: gloomhunt
published: 2026-09-04
status: published
summary: "We needed players before we had players. The bot only sees what a screen would show, has a few habits, and falls apart under pressure the way people do."
tags: ["Game development", "Bots", "Game design", "Testing"]
---

A paid challenge needs a difficulty number before anyone has played it. Guessing is expensive. Waiting for a crowd is slow. So we built a player we can run overnight.

It is not a script that walks a path. It is a policy that looks at the same picture a renderer would draw — enemies on screen, pickups, walls, the gun in the hand — and then emits the same buttons a person uses: move, aim, shoot, and swap when two guns are allowed.

It never sees the inside of the simulation. It never asks the random number generator what comes next. It has its own dice, seeded from the run, so the same bot on the same run is repeatable.

## What we borrowed

Quake 3 and Unreal Tournament split item hunting in two, and that split still works.

**Nearby grab.** If something useful is close and the path is not a death corridor, take it. A greedy bot still grabs a health pack it does not need. The game eats the pack and heals nothing. That is a human habit. We kept it.

**Need run.** When health or ammo is actually low, go get it. A weak bot runs through danger. A strong one waits for a gap, or gives up.

We did not add a twelfth "skill" for that. Greed is a habit, not a skill.

## Three habits, not a personality system

Skill is how well the bot aims and how fast it notices. Habits sit next to skill, and we only kept three:

- **Greed** — how often it takes the nearby grab, even a wasted one.
- **Discipline** — whether it waits until the aim is on the target, or sprays.
- **Who it shoots** — the closest enemy, the one that looks most dangerous, or the one that just hurt it.

That last one is not a hidden id. After a health drop it tags the nearest enemy it can still see. Same picture a person has.

## Pressure

Composure is a skill, not a habit. When too much is happening, a low-composure bot can freeze, spray, or run. A high-composure bot holds together longer.

When two walls close in, it looks for the most open way out. A weak bot drifts toward the edge of the screen. A stronger one drifts toward space.

On a phone it also misses things that sit under the thumbs. That is not a joke setting. The fire stick covers that corner.

## What we refused to do

The live game is move, aim, shoot. Reload happens on its own when the mag is empty. There is no dash. There are no gadgets. The bot does not press buttons the game does not have. Copying an old phone-test helper that still taps dash would have taught us the wrong game.

We also do not learn by copying raw human logs. A poisoned log would teach the bot to cheat. The safe version compares clean human numbers to bot numbers, later, in small steps.

The point of this bot is not to beat people. It is to be the first people, so we can price a challenge before a crowd exists.

*Next: [bots first, then people](/tech/blog/bots-first-then-people).*
