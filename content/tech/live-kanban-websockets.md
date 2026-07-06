---
title: "When Everyone Needs to See the Same Board"
slug: live-kanban-websockets
section: tech
type: blog
topic: realtime
project: kevvlar
published: 2021-09-14
status: published
summary: "Drag a card to Done and every teammate sees it move — no refresh."
tags: ["Real-time", "WebSockets", "SaaS", "Kanban"]
---

Collaborative UI breaks when users must refresh to see each other's changes. Kanban boards are an obvious example: drag a card to Done and everyone should see it move.

Early on, our board worked like standard CRUD — update the API, hope others reload. That felt broken for a tool meant to replace juggling separate apps.

## What we did

Each open project board held a **WebSocket** authenticated to that workspace. When the server committed a change, it broadcast a small event to every connection in that room.

Clients applied events to local state. The server remained **source of truth**; the socket only carried diffs, not authority.

## Pitfalls

**Reconnects.** Sleeping tabs and flaky networks drop events. On reconnect, send enough state or version info to detect gaps — otherwise a user drags against stale data.

**Ordering.** Two quick edits from different people can arrive out of order. **Monotonic event IDs** per project let clients ignore stale messages.

**Scope creep.** Not everything needs sockets. File uploads and billing stayed on REST. Real-time was reserved for shared board state where latency is visible.

## Takeaway

Live collaboration is three problems: delivery, ordering, and recovery after disconnect. Solve all three or users trust the board less than a slow refresh.
