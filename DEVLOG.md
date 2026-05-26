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

## Day 6 — 2026-05-24
**Hours worked:** 8
**What I did:** Added Supabase-backed public report pages at `/report/[slug]`, Open Graph and Twitter metadata, a copy-link share card, and privacy-safe public rendering that excludes email, company, role, and lead details. Also added the share card to the private results page so users can copy the public report URL after seeing value. Then I ran a bug and polish pass: fixed the public share link so it only appears when Supabase actually stores the audit, hardened lead capture messaging around storage/email failures, caught Resend send errors instead of letting them break the lead API, improved fallback share URLs, added a stack-efficiency benchmark strip, added a methodology card explaining deterministic audit rules, and added `ARCHITECTURE.md`, `LANDING_COPY.md`, and `METRICS.md`. I also added public `/privacy` and `/terms` pages, footer links, product-specific data/privacy language, mocked social proof in the hero, and expanded the visible FAQ so it matches `LANDING_COPY.md`.
**What I learned:** The public report needs to be useful without exposing lead data. Keeping all identifying information in the `leads` table and rendering only the audit result from the `audits` table makes that boundary easier to reason about. The most important bugs were product trust bugs: a dead public report link or vague “saved” message would make the product feel unreliable even if the core audit math worked. I also learned that the repo-root deliverables and the live UI need to agree exactly; if `LANDING_COPY.md` promises five FAQs or social proof, the page should show them.
**Blockers / what I'm stuck on:** I still need one more real user interview, deployed URL verification, screenshots or a short demo link, and Lighthouse scores from the deployed app.
**Plan for tomorrow:** Will complete the final interview and polish the remaining submission docs. Otherwise, deploy, verify CI, capture screenshots, and submit with the remaining risks documented honestly.

## Day 7 — 2026-05-26
**Hours worked:** 6
**What I did:** Completed the final root-level entrepreneurial and reflection docs that were still missing: `GTM.md`, `ECONOMICS.md`, and `REFLECTION.md`. The GTM doc now defines a specific founder/CTO/engineering-manager target, zero-budget launch channels, and week-1 traction goals. The economics doc models lead value, funnel conversion, CAC assumptions, and what would need to be true for the tool to support a $1M ARR path. The reflection doc answers all five required questions with specific implementation details, including the public report storage bug, the Anthropic-to-Gemini provider reversal, week-2 roadmap, AI usage boundaries, and self-ratings. I also completed and documented the third real interview in `USER_INTERVIEWS.md`. For bonus work, I added a styled server-generated PDF export at `/report/[slug]/pdf` for saved reports, with a branded header, KPI cards, summary, per-tool recommendations, confidence labels, evidence, assumptions, and methodology. I kept a print fallback for local-only reports, documented the benchmark strip as a bonus feature, and wrote `LAUNCH_POST.md` with a blog post draft and X/Twitter launch thread. I also changed the private results page so users see the full audit first, then unlock share and PDF actions after saving the report by email. I improved the audit engine output with recommendation confidence, numeric evidence, and assumptions so each savings claim is easier to inspect. I fixed production crawler polish by adding generated `/robots.txt` and `/sitemap.xml` routes. Ran Lighthouse checks: local `http://localhost:3000/` scored Performance 95, Accessibility 100, Best Practices 100; deployed `https://aicostlens.shop/` scored Performance 94, Accessibility 100, Best Practices 100.
**What I learned:** The written deliverables are not separate from the product; they explain the product judgment behind the code. The strongest docs use actual implementation choices and real constraints instead of generic startup language.
**Blockers / what I'm stuck on:** I still need confirmation that GitHub Actions is green on the public repo after the last changes are pushed.
**Plan for tomorrow:** No new feature work unless a final review finds a critical issue. Confirm CI and submit the Google Form with the public GitHub repo and live URL.
