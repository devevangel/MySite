---
title: "Intent Accuracy Is a Production Gate, Not a Leaderboard"
slug: intent-accuracy-production-gate
section: tech
type: blog
topic: enterprise-ai
project: eli-lilly
published: 2025-02-06
status: published
summary: "In regulated chatbots, a fixed accuracy threshold beats chasing the highest number on a chart."
tags: ["AI", "NLP", "Enterprise", "Pharma"]
---

Enterprise chatbots are not Kaggle competitions. A model that scores 88% on a benchmark but misroutes dosage questions in production is worse than a boring 95% on the intents that actually matter.

I worked on pharmaceutical support bots where **intent classification** had a published production threshold  - around 92%. Below that, you do not ship. Above it, you still owe evidence that regressions will not slip through on the next retrain.

## What "good enough" meant

We iterated in Azure AI Language Studio: review misclassified utterances, add examples, remove noisy duplicates, retrain, measure again. Getting to **95%** on the target intents was not vanity  - it was margin above the gate so normal drift did not instantly breach policy.

Accuracy tied to business outcomes too. Better routing meant fewer overnight escalations to human reps. The programme was credited with substantial **out-of-hours support savings**  - a programme-level figure, not a personal scorecard, but it explained why NLU quality was budget-worthy.

## Pitfalls

**Optimising the leaderboard intent** while neglecting long-tail medical phrasing. Production traffic is not evenly distributed. A rare wrong answer on a high-risk intent outweighs dozens of fixed greetings.

**Treating LLM fluency as safety.** Generative answers needed guardrails, citations, and fallbacks to approved content. Fluency without compliance is a defect in pharma, not a feature.

## Takeaway

Define the threshold, the intents that matter, and the regression process before you chase the last percentage point. In regulated environments, **ship confidence**, not surprise.
