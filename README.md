# AICostLens

AICostLens is a free AI spend audit tool for startup founders, CTOs, and engineering managers who want to find waste across Cursor, Claude, ChatGPT, Copilot, Gemini, Windsurf, and AI API usage. It will calculate plan-fit recommendations, estimate monthly and annual savings, and create shareable reports without requiring login.

Live: TODO

## Screenshots

TODO

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values for Supabase, Gemini, and Resend before testing backend features.

## Decisions

1. Chose Next.js App Router because shareable report pages need dynamic metadata and API routes.
2. Chose TypeScript because audit rules and pricing data should be explicit and testable.
3. Started with a deterministic audit form shell before backend work so the product flow is visible early.
4. Planned Supabase for persistence because it keeps the backend simple while still being real storage.
5. Planned email capture after results because the assignment requires showing value before asking for contact details.
