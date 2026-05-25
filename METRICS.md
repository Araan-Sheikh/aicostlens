# Metrics

## North Star Metric

Qualified savings opportunities discovered per week.

This is better than daily active users because AI spend audits are not a daily habit. The product creates value when it finds a credible savings opportunity and routes that company toward a useful next step. For Credex, the strongest signal is not raw traffic; it is the number of completed audits that reveal enough savings to justify a consultation or credit conversation.

## Input Metrics

1. **Audit completion rate:** percentage of visitors who start the form and reach a completed audit.
2. **Post-value email capture rate:** percentage of completed audits that submit email after seeing results.
3. **High-savings rate:** percentage of completed audits with more than $500/month in potential savings.
4. **Consultation intent rate:** percentage of high-savings reports where users click the Credex CTA or save the report.

## What I Would Instrument First

I would track `form_started`, `tool_added`, `audit_completed`, `lead_submitted`, `public_report_copied`, and `credex_cta_clicked`. The important funnel is visitor → completed audit → qualified savings report → lead captured. I would also log summary fallback rate, because a high fallback rate means the AI feature is not reliably working in production.

## Pivot Trigger

If fewer than 5% of the first 100 completed audits show more than $500/month in savings, the target segment or audit rules are probably wrong. The next move would be to narrow the audience to teams with 10+ employees, multiple AI subscriptions, or meaningful API spend instead of marketing the tool to all startups.
