# Devlog

## Day 1 — 2026-05-20
**Hours worked:** 2
**What I did:** Read the assignment, compared it against the implementation plan, and scaffolded the Next.js TypeScript app structure. Added the landing page shell, initial audit form layout, Tailwind setup, README draft, environment variable template, and starting component organization.
**What I learned:** The assignment is evaluated as both a product and a submission package, so the app needs to be useful while the repo root files stay easy for reviewers and LLMs to inspect.
**Blockers / what I'm stuck on:** Dependency installation may need network access, and the current `.git` directory is empty/read-only, so the repo may need to be initialized or recreated before committing.
**Plan for tomorrow:** Implement dynamic form validation with Zod, persist draft state in localStorage, and improve the mobile form interactions.

## Day 2 — 2026-05-21
**Hours worked:** 3
**What I did:** Reworked the audit form around React Hook Form and Zod validation. Added dynamic tool rows with plan dropdowns tied to the selected tool, numeric validation for spend, seats, and team size, automatic draft persistence through `localStorage`, visible draft restore/save/reset states, live draft totals, and schema tests for the form rules.
**What I learned:** Keeping the tool catalog typed in one place makes the UI, validation, and tests agree, and it avoids accidental drift between dropdown options and schema rules.
**Blockers / what I'm stuck on:** The form currently validates and saves drafts, but it does not calculate audit results yet. That belongs to the deterministic audit engine work on Day 3.
**Plan for tomorrow:** Implement pricing data structures, deterministic audit rules, savings totals, Credex qualification logic, and focused audit engine tests.

## Day 3 — 2026-05-22
**Hours worked:** 4
**What I did:** Added the deterministic audit engine with typed inputs/results, pricing config, plan-fit rules, seat cleanup logic, duplicate coding assistant consolidation, high API spend Credex qualification, `PRICING_DATA.md`, `TESTS.md`, and six audit-engine tests. I also documented the first real user interview response from Shivang Kumar Sinha at Elitro Technologies.
**What I learned:** Pricing pages change often, so every number needs a source. If a price is unclear, I should mark it for manual verification. The first interview also made the problem feel more real: a team can spend around $8000 on Claude/OpenAI while still not having a clear tracking owner.
**Blockers / what I'm stuck on:** I still need two more real user interviews before submission.
**Plan for tomorrow:** Wire the audit engine into the form submission flow and build the results page with savings hero, per-tool recommendations, honest low-savings state, and prominent Credex CTA for high-savings audits.

## Day 4 — 2026-05-23
**Hours worked:** 4
**What I did:** Wired the audit form into the deterministic audit engine, stored generated audit results locally, and added the `/audit/[id]` results route. Built the results hero, per-tool recommendation cards, high-savings Credex CTA, honest low-savings state, and placeholder sections for Day 5 email capture and AI summary.
**What I learned:** The results page is where trust is won or lost. The strongest UI pattern is to show the savings number first, then immediately explain the exact recommendation and reason for every tool.
**Blockers / what I'm stuck on:** Results are currently stored in browser localStorage, so links are not shareable across devices yet. Day 5 needs to move audits/leads into Supabase and add email capture.
**Plan for tomorrow:** Add Supabase storage for audits/leads, Gemini summary generation with fallback, Resend confirmation email, and honeypot abuse protection.

## Day 5 — 2026-05-24
**Hours worked:** 5
**What I did:** Added API routes for audits, leads, Gemini summary generation, and transactional email. Added Supabase admin and Resend helpers, SQL schema for audits/leads, honeypot protection on the lead form, a working post-value email capture form, Gemini summary fallback logic, `PROMPTS.md`, and fallback summary tests.
**What I learned:** The backend needs to degrade gracefully during development. The app should still produce a useful audit and summary if Gemini, Supabase, or Resend environment variables are missing, while making it clear what will only work in production.
**Blockers / what I'm stuck on:** Public `/report/[slug]` pages are still Day 6 work, so the email share URL points to the future public route. Supabase/Resend need real project credentials before production verification.
**Plan for tomorrow:** Add public report pages backed by Supabase, strip private lead details, add Open Graph/Twitter metadata, copy-link behavior, and mobile/accessibility polish.
