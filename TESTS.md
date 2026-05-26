# Tests

Run all tests:

```bash
npm run test
```

## tests/day1-catalog.test.ts

Covers the supported tool catalog and primary use-case options required by the assignment.

Tests:

1. Includes the minimum tools required by the assignment.
2. Includes plan options and primary use cases for the first form shell.

## tests/audit-form-schema.test.ts

Covers the spend input form schema, including valid defaults, negative spend rejection, invalid team size rejection, and tool/plan compatibility.

Tests:

1. Accepts a valid minimum audit form draft.
2. Rejects negative spend and zero seat counts.
3. Rejects invalid team size.
4. Rejects a plan that does not belong to the selected tool.

## tests/audit-engine.test.ts

Covers deterministic audit engine behavior.

1. Solo user on ChatGPT Team receives a downgrade recommendation.
2. Cursor Business with one seat recommends Cursor Pro.
3. Listed-price overspend explains the official benchmark amount and tolerance buffer.
4. Duplicate coding assistants recommend consolidation.
5. High API spend qualifies for the Credex CTA when savings exceed $500/month.
6. Already optimized stack does not manufacture savings.
7. Paid seats greater than team size recommend reducing seats and includes assumptions.

## tests/summary.test.ts

Covers fallback AI summary behavior for high-savings, optimized, and moderate-savings audits.

Tests:

1. Mentions Credex for high-savings audits.
2. Is honest for optimized audits.
3. Summarizes moderate savings without inventing tools.
