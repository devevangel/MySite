# LinkedIn Post Drafts

Content drafts for LinkedIn posts. Each post is designed to be standalone, professional, and demonstrate engineering capability to hiring managers and the broader tech community.

---

## Post 1: First Class Honours Announcement

**Goal:** Announce degree completion. Professional, grateful, forward-looking. Not just "I graduated" but framing the journey and what's next.

**Suggested timing:** This week (July 2026)

---

I graduated from the University of Portsmouth with First Class honours in Software Engineering.

Portsmouth was the only university that offered me a place. Every other institution looked at the same application and said no. Portsmouth said yes. That decision changed everything.

I came here with a tablet and Tinkercad. No personal computer. No Arduino. No lab. I learned circuits by simulating them in a browser because the real components cost more than I could afford growing up in Nigeria.

During my degree I co-founded a SaaS platform that's still live after five years. I completed an industrial placement at Eli Lilly where the chatbot systems I worked on were credited with over $4M in support savings. I built a GPS analytics engine using PostGIS spatial queries for my final-year project. I picked up a contract building game payment systems for a studio in Australia. I started building a browser game engine from scratch that now sits at 50,000+ lines with 230 automated tests.

None of this was planned at enrolment. All of it was possible because one university looked at my application and saw potential.

I am now a software engineer at Marchex, building data visualisation and analytics tools for enterprise conversation intelligence. The work continues.

Thank you to Dr Rich Boakes, Dr Petronella Beukman, and Uchenna Ogenyi for putting tools in my hands when I had none. Thank you to every lecturer, supervisor, and peer who made these four years what they were.

First Class. Software Engineering. University of Portsmouth. 2026.

---

## Post 2: Custom Game Engine (Gloomhunt)

**Goal:** Technical credibility post. Show you can architect complex systems. Hiring managers and engineers will respect this.

**Suggested timing:** 3-5 days after Post 1

---

I built a game engine from scratch. No Unity. No Godot. No frameworks. Vanilla JavaScript and HTML5 Canvas.

Gloomhunt is a browser-based survival shooter where players compete in paid prize challenges. When real money is on the line, you cannot trust the client. So the architecture had to solve a hard problem: how do you verify a game score without watching the player?

The answer was deterministic replay. Every game run is a pure function of a seed, a frozen config, and an ordered input log. The server re-simulates the run and compares end-state hashes. Match means valid. Mismatch means no payout.

What this required:
- Seeded PRNG (mulberry32) for all gameplay randomness. No Math.random() in simulation code.
- A double-entry financial ledger for real-money flows. Hold, capture, release, refund lifecycle with idempotency keys.
- An 8-page admin console for bounty management, settlement review, player wallets, and anti-cheat verification.
- 230 automated tests covering the settlement pipeline, wallet operations, and verification logic.

50,000+ lines of application code. Zero client-side dependencies.

The game is live: https://gloomhunt.onrender.com

Building your own engine is not the efficient choice. But it forces you to understand every layer: rendering, collision detection, audio, input handling, state management. There is no abstraction to hide behind.

---

## Post 3: UAV and Aerospace Engineering

**Goal:** Show breadth beyond software. Hardware, sensors, control systems. Differentiates you from pure web developers.

**Suggested timing:** 5-7 days after Post 2

---

Software engineering is my profession. Hardware engineering is what I research in my free time.

Earlier this year I designed and built an autonomous fixed-wing UAV from scratch. Airframe design in Fusion 360. Flight controller integration. GPS waypoint navigation logic. Sensor payload planning for area surveillance.

Alongside it, I built a 6-axis IMU stabilisation module for model rockets. Real-time attitude correction using PID control loops, compensating for roll, pitch, and yaw deviations during flight.

This started with an Arduino kit I borrowed from my university. I had spent years simulating circuits on a tablet in Nigeria because the physical components were priced out of reach. When I finally held real hardware, I worked through every sensor, wire, and solder joint I had only ever imagined.

Today I have a small engineering lab at home where I continue researching embedded systems, flight control, and sensor fusion. The goal is to understand how intelligent physical systems work from first principles, not just interact with them through an API.

Software tells hardware what to do. I want to understand both sides.

---

## Post 4: Street Keeper (GPS Engineering)

**Goal:** Show depth in geospatial engineering, system design under constraints. Links to the live project and blog posts.

**Suggested timing:** 7-10 days after Post 3

---

For my final-year project I built a GPS analytics engine that matches running routes to individual streets using PostGIS spatial queries.

Street Keeper connects to Strava, ingests activities via webhooks, and determines which streets you have covered at node-level precision. The technical challenge: consumer GPS drifts 7-13 metres. Parallel streets can be closer than that.

My first engine used polyline coverage scoring. It looked smart on paper. Consumer GPS made it lie. Reprocessing the same run produced different percentages. That instability led to a full rewrite.

The second engine treats the street network as discrete nodes. A GPS point within 25 metres of a node records a binary hit. A street completes when 90% of its nodes are hit. Binary hits absorb noise better than continuous line coverage.

The system runs entirely on free-tier infrastructure:
- PostGIS spatial queries with bounding-box pre-filters
- On-demand city synchronisation (42-day cache, three-layer deduplication)
- Background job processing via pg-boss
- Strava webhook pipeline with always-200 acknowledgement pattern

The project scored a First. The app is deployed live: https://street-keeper.onrender.com

I wrote about the GPS matching problem here: [link to blog post]
I wrote about the webhook pipeline here: [link to blog post]
I wrote about fitting a city map in a free database here: [link to blog post]

---

## Post 5: The Full Journey (Narrative/Inspirational)

**Goal:** The emotional story. This is the one that gets shared. Use sparingly - one post like this is powerful, two is performative.

**Suggested timing:** 2 weeks after Post 1

---

Portsmouth was the only university that offered me a place.

I came to study software engineering, but what I really wanted was to understand the full picture. Hardware, sensors, control systems, how intelligent machines actually work.

Growing up in Nigeria, that world felt locked behind a price tag I could not reach. The official Arduino Starter Kit costs over $100 before conversion and shipping. I did not have a personal computer at the time. I used Tinkercad on a tablet browser just to practise building circuits I had never physically touched.

One afternoon after a lecture, I was walking with my lecturer Dr Rich Boakes. I told him I did not want to stay only in software. I wanted hardware, sensors, the physical side. He told me the university had Arduino kits students could borrow for the full duration of their degree.

I did not believe him. He directed me to Dr Petronella Beukman. She confirmed it and directed me to Uchenna Ogenyi. When I met Uchenna, he told me to come back the next day.

The next morning, when I held that kit in my hands, tears rolled down my cheeks. Not because of the kit itself. Because I had spent years watching this technology through a screen, convinced it belonged to someone else's world.

I started small. Turning a servo. Blinking an LED. Learning to read components, wire them, solder them. I used the free CAD tools on the university computers. I used LinkedIn Learning through my UoP account to teach myself aerospace, aerodynamics, and flight control.

Within six months of my final year, I built my first autonomous UAV from scratch. It crashed. I redesigned it and built two more that flew.

Today I have a small engineering lab at home. I teach fellow students and young people back in Nigeria who are in the same position I was.

Portsmouth did not just give me a kit. It was the one place that looked at me and saw what I could become before I saw it myself. And once you see that, you build.

First Class. Software Engineering. 2026.

---

## Posting Strategy

| # | Topic | Tone | Best day to post |
|---|-------|------|-----------------|
| 1 | Degree announcement | Professional, grateful | Tuesday or Wednesday morning |
| 2 | Game engine | Technical, engineering depth | Tuesday or Thursday morning |
| 3 | UAV/Hardware | Breadth, curiosity | Tuesday or Wednesday morning |
| 4 | Street Keeper | System design, problem-solving | Tuesday or Thursday morning |
| 5 | Journey narrative | Personal, inspirational | Any weekday morning |

**Spacing:** 3-7 days between posts minimum. Do not dump all at once.

**Order recommendation:** Post 1 first (timely, graduation just happened). Then alternate between technical (2, 4) and narrative (3, 5). End with Post 5 as the emotional anchor once people have seen your technical credibility.

**Formatting tips for LinkedIn:**
- First line must hook (LinkedIn truncates after ~3 lines)
- Short paragraphs (1-2 sentences max per paragraph)
- No hashtag spam. 3-5 relevant ones at the bottom if any.
- No emojis unless you genuinely use them
