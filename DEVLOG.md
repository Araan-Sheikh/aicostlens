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
