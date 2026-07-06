---
title: "Embedding Video Calls Without Building Zoom"
slug: video-calls-in-an-iframe
section: tech
type: blog
topic: realtime
project: kevvlar
published: 2022-02-18
status: published
summary: "Twilio video in an iframe shipped fast. Cross-origin pain shipped with it."
tags: ["Video calls", "Integrations", "iframes", "SaaS"]
---

Embedding video in your product without building a full calling UI is tempting. Device selection, reconnect logic, and layout polish take months. An iframe around a provider's room UI gets you live faster — with trade-offs you should expect upfront.

We used **Twilio** inside an iframe so meetings stayed inside the same workspace as chat and kanban.

## Why iframe

The parent app owned navigation and permissions. The iframe owned cameras, microphones, and Twilio's UI. That split let us ship calls while focusing on the board.

## Pitfalls

**Cross-origin communication.** Parent and child do not share memory. Events like "call ended" crossed via `postMessage` with strict origin checks. Failures often looked like dead buttons with no obvious stack trace in our code.

**Layout.** Nested flex and percentage heights produced black bars until min-height was fixed through the full container chain.

**Token lifecycle.** Short-lived join tokens must reach the iframe reliably. Expired tokens fail inside the provider UI, which is hard to debug from the parent.

**Two release surfaces.** A provider SDK update could break embedding while the rest of the app was unchanged.

## What we accepted

- Limited control over call UI branding
- Debugging split across parent and iframe logs
- Duplicate mobile permission flows

## Takeaway

Iframe video is a **delivery shortcut**, not a long-term architecture. Budget for message contracts, token handoff, and layout edge cases — or plan to own the WebRTC UI when video becomes core to the product.
