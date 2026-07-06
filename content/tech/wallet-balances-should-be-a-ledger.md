---
title: "Why Wallet Balances Should Be a Ledger"
slug: wallet-balances-should-be-a-ledger
section: tech
type: blog
topic: fintech
project: gloomhunt
published: 2025-06-02
status: published
summary: "Incrementing one balance column breaks the moment retries, webhooks, or partial failures appear."
tags: ["Payments", "Databases", "Game development", "Ledger"]
---

A single `balance` column looks fine in a prototype. The first duplicate webhook, retry, or half-failed transfer turns it into a support ticket.

I learned this adding real-money flows to a game: entry fees, holds, payouts. Play money can forgive `balance += 10`. Production money cannot.

## The pitfall

Treating the balance field as source of truth. Network retries double-charge. Webhooks arrive twice. A crash between debit and credit leaves invisible drift. Users remember every cent.

## The pattern

**Double-entry ledger:** every movement is a transaction row — debit account, credit account, amount, idempotency key, reference. Balance is derived (or cached with reconciliation), not blindly incremented.

Entry fees **hold** funds until a run verifies, then **capture** or **release** — similar mental model to card authorisations.

Payment webhooks become **events**: store the event ID, process once, ignore duplicates.

## What this buys you

Audit trail for disputes. Replay from empty. Confidence when Stripe or your queue redelivers a message.

## Takeaway

If money moves, design accounting semantics on day one. A ledger feels heavy until the first production incident proves the column was lying.
