# Tests

Run all tests:

```bash
npm run test
```

## tests/day1-catalog.test.ts

Covers the supported tool catalog and primary use-case options required by the assignment.

## tests/audit-form-schema.test.ts

Covers the spend input form schema, including valid defaults, negative spend rejection, invalid team size rejection, and tool/plan compatibility.

## tests/audit-engine.test.ts

Covers deterministic audit engine behavior:

1. Solo user on ChatGPT Team receives a downgrade recommendation.
2. Cursor Business with one seat recommends Cursor Pro.
3. Duplicate coding assistants recommend consolidation.
4. High API spend qualifies for the Credex CTA when savings exceed $500/month.
5. Already optimized stack does not manufacture savings.
6. Paid seats greater than team size recommend reducing seats.
