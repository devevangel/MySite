---
title: "A Changed Migration Is a Broken Promise"
slug: a-changed-migration-is-a-broken-promise
section: tech
type: blog
topic: operations
project: gloomhunt
published: 2026-09-07
status: draft
summary: "We found a live database that did not match the files we thought had built it. Applied migrations are frozen now. A change is a new file, or the server will not start."
tags: ["Backend", "Databases", "Operations", "Testing"]
---

A migration file is a promise: "if this name is in the list of things we ran, the database looks like this."

We broke that promise by editing files after they had already run. The list said "done." The live database had the old content. The repo had the new content. Nothing in boot noticed.

## How we found it

On 8 September 2026 we compared the live database to a clean run of every migration, in order, on an empty database. They did not match.

Some objects the files said they created were missing. One bookkeeping row pointed at a file that had been renamed after it ran, so the old name sat in the list with no file on disk.

The likely cause was the obvious one: someone — me, or a tool I ran — changed a migration that production had already applied. The next boot saw the name, skipped the file, and moved on.

## What we did that day

We did not "fix" the old files and re-run them. That is how you get a second, different drift.

We wrote a **new** migration whose only job is to add what was missing, and only if it is still missing. On a database that already matches, it changes nothing.

Then we made the runner remember a fingerprint of each file it applies. On every boot it compares the fingerprint of every already-applied file with the file on disk. If they disagree, the server refuses to start and names the file.

Rows from before fingerprints existed get one free baseline: whatever the file is today. After that, the file is frozen.

A failing migration no longer leaves a "we ran this" row behind. The row and the SQL live in the same transaction. All or nothing.

## The other half of the same week

Local `npm run dev` and the test suite used to be able to open the live database if a URL in the environment pointed there. That is how a leftover setting becomes a very bad afternoon.

Outside production, boot now dies if the database URL looks like the live host. The message names the variable. It does not print the password. Local work uses a database on the machine. Tests use a second one.

## What I would do again

Treat an applied migration as history, not as a document. The edit you want is a new file. And never let a laptop share a database with players. The check is cheap. The mistake is not.

This one stands on its own. If you came from the game posts, the closest next read is how we keep the simulation honest when the rules change.

*Next: [the engine version is a contract](/tech/blog/engine-version-is-a-contract).*
