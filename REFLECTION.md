# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was around public report links and what should happen when Supabase is not configured or fails to store an audit. My first version let the UI talk about a shareable report too early, which made the product feel more complete than it really was in local fallback mode. The symptom was subtle: the private results page could show a share affordance even though the canonical `/report/[slug]` page could not be loaded from another device. My first hypothesis was that the slug generation was wrong. I checked the API route, the saved audit payload, and the public report loader. The slug was fine when Supabase wrote successfully. The actual issue was state truth: localStorage results and Supabase-backed public results were being treated too similarly. The fix was to only show the real public share card when the audit response includes a stored public slug, and to make the copy clearer when storage or email is unavailable. I also hardened Resend errors so email failure does not break lead capture.

## 2. A decision I reversed mid-week, and what made me reverse it

I reversed the AI provider decision. The assignment says Anthropic is preferred, so my initial plan referenced Anthropic for the summary feature. While implementing, I switched to Gemini because it had a practical free API path available for this build and the assignment explicitly allows any LLM for the personalized summary. I kept the important boundary the same: the model never calculates savings. The audit math remains deterministic and source-backed, while Gemini only turns the computed audit into a short paragraph. That made the trade-off acceptable. I documented the prompt in `PROMPTS.md`, added a fallback summary, and wrote a test for the fallback path. The reversal was not about chasing convenience only; it was about shipping the required AI feature without blocking the whole product on paid credits or provider access. If this became a Credex production product, I would make the provider configurable and compare summary quality, latency, and failure rate across Anthropic, Gemini, and OpenAI.

## 3. What I would build in week 2 if I had it

In week 2, I would build three things: better evidence, better sharing, and better qualification. Better evidence means a versioned pricing table with source snapshots, admin review of vendor price changes, and clearer confidence labels for custom or enterprise pricing. Better sharing means PDF export and a more polished public report preview, because the report is the viral loop and the thing users screenshot. Better qualification means adding a consultation intent step for high-savings users: current contracts, renewal date, monthly API spend range, and whether they are open to credits. I would also add analytics for `form_started`, `audit_completed`, `lead_submitted`, `public_report_copied`, and `credex_cta_clicked`, plus basic dashboard views for high-savings leads. The biggest product improvement would be benchmark mode: "your AI spend per developer is $X." That turns the audit from a calculator into a conversation starter for founders and finance teams. I would also schedule more user interviews with teams above $1,000/month in AI spend, because the product only matters if the recommendations survive a real budget-owner conversation.

## 4. How I used AI tools

I used AI tools as a coding pair and reviewer, not as a one-shot app generator. I used Codex for implementation help, file-by-file refactors, test writing, copy drafting, and checking the assignment against the repo deliverables. I did not trust AI with user interviews, secrets, or the final audit math without inspection. One specific time AI could have gone wrong was user interviews: it would have been easy to fabricate realistic-sounding notes, but the assignment explicitly says fabricated interviews are an instant reject, so I kept missing interviews marked honestly and only added answers when the user supplied real responses. AI was useful for speed, but the important judgment was deciding where deterministic logic, source citations, and honest TODOs mattered more than polished prose.

## 5. Self-rating

**Discipline: 8/10.** I made progress across multiple days and kept a devlog, but the interview requirement still needs one more real conversation before submission. The strongest part was spreading product, code, and docs across the week instead of leaving everything to one final sprint.

**Code quality: 9/10.** The core audit logic is typed, tested, and separated from UI, with graceful fallbacks for AI, email, and storage. I am happy with the boundary between deterministic savings rules and AI summary generation.

**Design sense: 8/10.** The UI is clear, responsive, and product-focused, though a production version could use stronger visual hierarchy and richer report previews. The results page is the most important surface, and it now gives savings, reasons, lead capture, and sharing in a coherent order.

**Problem-solving: 8/10.** I handled provider fallbacks, public/private report boundaries, deterministic savings logic, and edge cases around missing backend services. The main improvement would be more automated integration coverage for Supabase and email behavior.

**Entrepreneurial thinking: 8/10.** The GTM, economics, lead capture, and Credex CTA are tied to real user value, but the product needs one more interview and live traction to be fully validated. I think the best entrepreneurial choice was making the audit useful before email capture, because that matches how a skeptical founder would actually try the tool.
