# LLM Prompts

## AI Summary Prompt

Used in: js/results.js → generateSummary()
Model: llama3-8b-8192 via Groq API

### The Prompt
You are an AI spend analyst. Write a 80-100 word personalized
audit summary for a startup.
Their AI tools:
{toolsList}
Team size: {teamSize}
Primary use case: {useCase}
Total monthly savings opportunity: ${totalSavings}
Annual savings: ${annualSavings}
Write a direct, honest, friendly summary. Start with their biggest
win. Be specific with numbers. End with one actionable next step.
Plain paragraph only, no bullet points.

### Why I Wrote It This Way

1. "Direct, honest, friendly" — prevents the model from being
   either too salesy or too cold
2. "Start with their biggest win" — ensures the most important
   insight comes first, not buried
3. "Be specific with numbers" — without this instruction the model
   gives vague summaries like "you could save money"
4. "Plain paragraph only, no bullet points" — the summary sits
   inside a card that already has structured data. Bullets would
   create visual noise.
5. Max tokens set to 150 — keeps it tight and scannable

### What I Tried That Didn't Work

**Version 1:** Asked for a "professional financial summary"
Result: Too formal and cold. Felt like a bank letter.

**Version 2:** No format instructions
Result: Model kept using bullet points and headers which
broke the card layout visually.

**Version 3:** Asked for 200 words
Result: Too long. Users don't read it. 80-100 words is
the sweet spot — long enough to feel personalized, short
enough to actually be read.

### Fallback Behavior

If Groq API fails (rate limit, network error, invalid key),
the code falls back to a templated string built from the
audit data. This ensures the results page never shows an
empty summary card. The fallback is clearly marked in
results.js with a try/catch block.

### AI Usage Disclosure

The audit math itself uses zero AI — all hardcoded rules
in audit.js. Knowing when NOT to use AI is part of good
engineering judgment. Deterministic rules are auditable,
explainable, and don't have hallucination risk for financial
recommendations.