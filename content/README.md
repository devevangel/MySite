# Content topic index

Read this before writing a new post. It exists so the next pass does not have to re-read every file.

Posts are markdown in `content/tech/` and `content/civic/`. Frontmatter + body. `lib/content.js` parses them. `server.js` serves `/tech/blog/:slug` and `/civic/writing/:slug`. Drafts stay off the public list unless `?preview=1` in development. The author publishes by setting `status: published`.

**Voice:** first person, one idea, plain titles, easy English. No "Part N of M" on new posts. No invented numbers, player data, secrets, env values, detector limits, or cheat-useful thresholds. No gambling tone: never prize, payout, pot, pool (except object reuse, say "reuse"), house, deal, odds, cash-out, cooling, risk queue, or bounty-as-bet. Prefer reward, credit, review queue, entry cost, finish rate, paid challenge.

**Updates:** do not rewrite an old body. Append `## Update — <Month YYYY>` at the end. Keep `published` as-is. Set `status: draft` until the author publishes.

**Related links:** at most one "next" post that follows the idea. Not every post needs one.

---

## Gloomhunt — already covered (do not rewrite as a new post)

| Slug | Date | Topic | Status | One line |
|---|---|---|---|---|
| `ship-challenges-without-code` | 2026-04-01 | game-dev | published | Challenges are data and rules, not a deploy. |
| `wallet-balances-should-be-a-ledger` | 2026-04-15 | fintech | published | Wallet balance is a ledger, not a column. |
| `verifying-paid-game-runs` | 2026-03-05 | anti-cheat | published | Server replay; do not trust the browser. |
| `canvas-game-feel` | 2026-03-12 | game-dev | published | Canvas feel without Unity. |
| `catching-lag-fps-hides` | 2026-03-20 | performance | published | Hitch detector; averages lie. |
| `kill-switches-for-money-features` | 2026-04-28 | live-ops | published | Money features need a kill switch. |
| `pricing-a-challenge-nobody-played` | 2026-05-12 | live-ops | published | Price difficulty from a population, not a guess. |
| `one-player-one-vote` | 2026-05-19 | live-ops | published | Calibration counts people, not runs. |
| `a-bounty-board-that-heals-itself` | 2026-05-26 | live-ops | published | Self-heal after launch. |
| `too-easy-emergency-too-hard-wait` | 2026-06-02 | live-ops | published | Too easy is urgent; too hard can wait. |
| `replay-proves-the-run-not-the-player` | 2026-06-09 | anti-cheat | published | Replay proves the log, not the human. |
| `heartbeats-server-clock` | 2026-06-23 | anti-cheat | published | Server clock is the one a cheater cannot touch. |
| `slow-motion-cheat` | 2026-07-07 | anti-cheat | published | Slow-mo passes replay; pace floor + stalls. |
| `committing-to-a-run-mid-play` | 2026-07-21 | anti-cheat | published | Prefix fingerprint each heartbeat. |
| `hard-rules-vs-probabilities` | 2026-08-04 | anti-cheat | published | Impossibilities get rules; maybes get people. |
| `money-should-wait` | 2026-08-11 | anti-cheat | published | Auto-pay refusal list; flags survive judgment. |
| `too-good-too-fast` | 2026-08-18 | anti-cheat | published | Outliers vs a known population. |
| `anti-cheat-layers-not-yet-shipped` | 2026-08-25 | anti-cheat | published | Researched layers; some later shipped. |
| `engine-version-is-a-contract` | 2026-09-02 | game-dev | published | One-command engine bump; version is a contract. |
| `the-seed-you-cannot-see-ahead` | 2026-09-03 | anti-cheat | published | Rolling seed pieces; no lookahead oracle. |
| `a-bot-that-plays-like-a-person` | 2026-09-04 | game-dev | published | Synthetic Hunter: see-only, three habits, composure. |
| `bots-first-then-people` | 2026-09-05 | live-ops | published | Bot ladder prices day one; humans take over. |
| `flag-the-run-never-lock-the-player` | 2026-09-06 | anti-cheat | published | Integrity pauses the reward, never blocks play. |
| `a-changed-migration-is-a-broken-promise` | 2026-09-07 | operations | published | Migration checksums after 2026-09-08 drift. |
| `one-minute-to-decide-a-flagged-run` | 2026-09-16 | anti-cheat | published | Review screen: sentence, watch, two buttons. |

### Ideas already used (off the table unless the build moved again)

Replay · canvas juice · hitch detector · challenges-as-data · wallet ledger · kill switches · human-population pricing · one vote per person · self-heal · easy/hard asymmetry · replay ≠ human · server-clock heartbeats · slow-mo / stall-not-slow · mid-run prefix commits · review queue · delayed rewards · too-good-too-fast stats · researched-but-unshipped list · engine-version contract · rolling seeds · human-like bot · bots-first calibration · flag-the-run-never-lock-play · migration checksums + local-DB guard · one-minute review screen.

### Still open (built in Gloomhunt, not a post yet)

Only write these if they still have a story after reading the code. Do not invent results.

- Per-type pickup metrics generated from the item list (`pickups.<type>.{count,valueGranted,activeMs}`).
- Clean-data gate as a *single door* every job must use (touched in the one-vote update; a full post only if the "one function, many consumers" story is still new).
- Identity clusters (bank / phone / device) beyond the one-vote mention.
- Hidden canary conditions / honeypot challenge.
- Practice mode on a flagship recipe with fresh seeds.
- Device-class MATCH floor (pause paid starts for a broken platform class).
- Verification queue in its own worker, not inside the web process.
- Run-duration cap so a long survivor is never rejected at submit.

Do not write money, legal, launch-date, or "players confirmed" posts. Many items are code-complete with a human check still open.

---

## Other tech projects (not Gloomhunt)

| Slug | Project | Topic |
|---|---|---|
| `shipping-weekly-in-a-startup` | weekend-social | startup |
| `live-kanban-websockets` | kevvlar | realtime |
| `video-calls-in-an-iframe` | kevvlar | realtime |
| `syncing-a-city-on-free-tier` | street-keeper | geospatial |
| `strava-two-second-deadline` | street-keeper | integrations |
| `gps-street-matching` | street-keeper | geospatial |
| `when-manual-testing-blocks-ai-releases` | eli-lilly | enterprise-ai |
| `intent-accuracy-production-gate` | eli-lilly | enterprise-ai |

## Civic

| Slug | Date | Status |
|---|---|---|
| `protecting-citizens` | 2026-07-05 | published |

---

## Suggested next-read chains (Gloomhunt)

- Replay → heartbeats → slow-mo → mid-run commit → hard rules → money waits → too-good → unshipped layers
- Unshipped layers → **the seed you cannot see ahead** → **a bot that plays like a person** → **bots first, then people** → one player one vote
- Verifying paid runs → **engine version is a contract** → **bots first, then people**
- Hard rules → **one minute to decide a flagged run** → money waits
- Hard rules → **flag the run, never lock the player** → money waits
- Kill switches → pricing → one vote → self-heal → too easy / too hard
- **Changed migration** → **engine version is a contract**
