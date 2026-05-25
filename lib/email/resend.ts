import { Resend } from "resend";

type SendAuditEmailInput = {
  email: string;
  shareUrl: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  credexQualified: boolean;
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function buildAuditEmailHtml(input: SendAuditEmailInput) {
  const headline = input.credexQualified
    ? "You have a meaningful AI savings opportunity"
    : "Your AI spend audit is ready";
  const note = input.credexQualified
    ? "Your audit crossed the $500/month savings threshold, so Credex may be able to help capture more of this through discounted AI infrastructure credits."
    : "Your AI stack looks reasonably controlled. Save this report and revisit it when your tools, seats, or API usage changes.";

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f7f7f4;color:#172033;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dfe3e8;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 20px;">
                <div style="font-size:13px;font-weight:700;color:#147a70;letter-spacing:0.04em;text-transform:uppercase;">AICostLens</div>
                <h1 style="margin:12px 0 8px;font-size:28px;line-height:1.2;color:#172033;">${headline}</h1>
                <p style="margin:0;color:#5c6675;font-size:15px;line-height:1.6;">Your report is ready. The audit math is deterministic and based on your submitted tools, plans, seats, and spend.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f6f5;border:1px solid #cfe2df;border-radius:8px;">
                  <tr>
                    <td style="padding:20px;">
                      <div style="font-size:13px;color:#5c6675;">Estimated monthly savings</div>
                      <div style="margin-top:4px;font-size:34px;line-height:1;font-weight:800;color:#147a70;">${money(
                        input.totalMonthlySavings
                      )}</div>
                    </td>
                    <td style="padding:20px;border-left:1px solid #cfe2df;">
                      <div style="font-size:13px;color:#5c6675;">Estimated annual savings</div>
                      <div style="margin-top:4px;font-size:24px;line-height:1;font-weight:800;color:#172033;">${money(
                        input.totalAnnualSavings
                      )}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 26px;">
                <p style="margin:0 0 18px;color:#334155;font-size:15px;line-height:1.6;">${note}</p>
                <a href="${input.shareUrl}" style="display:inline-block;background:#147a70;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:6px;">View audit report</a>
                <p style="margin:18px 0 0;color:#6b7280;font-size:12px;line-height:1.5;">If the button does not work, paste this link into your browser:<br><a href="${input.shareUrl}" style="color:#147a70;">${input.shareUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td style="background:#f7f7f4;border-top:1px solid #e5e7eb;padding:18px 28px;color:#6b7280;font-size:12px;line-height:1.5;">
                Sent by AICostLens for Credex. Email is captured only after the audit value is shown.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendAuditEmail(input: SendAuditEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      sent: false,
      reason: "missing_resend_env"
    };
  }

  const resend = new Resend(apiKey);
  const highSavingsNote = input.credexQualified
    ? "\n\nYour audit shows a significant savings opportunity, so Credex may reach out with options for discounted AI infrastructure credits."
    : "\n\nYour stack looks reasonably optimized. We will notify you when new optimization opportunities apply.";

  try {
    await resend.emails.send({
      from,
      to: input.email,
      subject: input.credexQualified
        ? `Your AI audit found ${money(input.totalMonthlySavings)}/mo in potential savings`
        : "Your AI Spend Audit report is ready",
      html: buildAuditEmailHtml(input),
      text: `Hi,

Your AI Spend Audit is ready.

Estimated monthly savings: ${money(input.totalMonthlySavings)}
Estimated annual savings: ${money(input.totalAnnualSavings)}

You can view your public report here:
${input.shareUrl}${highSavingsNote}

AICostLens / Credex`
    });
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "resend_send_failed"
    };
  }

  return {
    sent: true
  };
}
