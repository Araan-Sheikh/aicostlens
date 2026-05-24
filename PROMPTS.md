# Prompts

## AI Spend Audit Summary Prompt

```txt
You are writing a concise AI spend audit summary for a startup founder.
Use only the provided audit numbers and recommendations.
Do not invent tools, prices, savings, or claims.
Keep it around 100 words.
Tone: helpful, direct, finance-literate, not alarmist.

Audit data:
{{auditJson}}
```

## Why This Prompt

The assignment requires an AI-generated personalized summary, but the audit math must stay deterministic. This prompt tells Gemini to summarize only the already-computed audit result and not invent savings, prices, or tools.

## Provider Decision

The PDF says Anthropic is preferred, but any LLM is acceptable. This build uses Gemini because it has a practical free API path for the take-home timeline. The fallback summary is always available if `GEMINI_API_KEY` is missing or the API request fails.

## What Was Avoided

- Asking the model to calculate savings.
- Asking the model to choose prices.
- Letting the model recommend tools not present in the deterministic audit result.
- Alarmist copy that would exaggerate savings.

## Fallback Behavior

If Gemini is unavailable, `buildFallbackSummary` returns one of three templated summaries:

- high-savings audits above $500/month
- already-optimized audits below $100/month
- moderate-savings audits in between
