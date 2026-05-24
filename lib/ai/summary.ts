import type { AuditResult } from "@/lib/audit/types";

export const auditSummaryPrompt = `You are writing a concise AI spend audit summary for a startup founder.
Use only the provided audit numbers and recommendations.
Do not invent tools, prices, savings, or claims.
Keep it around 100 words.
Tone: helpful, direct, finance-literate, not alarmist.

Audit data:
{{auditJson}}`;

export function buildFallbackSummary(result: AuditResult) {
  if (result.totalMonthlySavings > 500) {
    return `Your AI stack shows a meaningful savings opportunity of $${result.totalMonthlySavings.toFixed(
      0
    )} per month, or about $${result.totalAnnualSavings.toFixed(
      0
    )} per year. The biggest wins appear to come from plan fit, duplicate tooling, and potential credit-based purchasing. Credex may be able to help capture more of this savings without changing your team’s workflow.`;
  }

  if (result.totalMonthlySavings < 100) {
    return "Your AI stack appears reasonably optimized based on the information provided. There may still be small improvements from seat cleanup or future vendor changes, but there is no major overspend signal right now. You can save this report and get notified when new optimization opportunities apply to your stack.";
  }

  return `Your AI stack has moderate savings potential of $${result.totalMonthlySavings.toFixed(
    0
  )} per month, or about $${result.totalAnnualSavings.toFixed(
    0
  )} per year. The recommendations focus on right-sizing plans, removing overlap, and matching tools to your primary use case.`;
}

function extractGeminiText(response: unknown) {
  if (
    typeof response === "object" &&
    response !== null &&
    "candidates" in response &&
    Array.isArray(response.candidates)
  ) {
    const firstCandidate = response.candidates[0];

    if (
      typeof firstCandidate === "object" &&
      firstCandidate !== null &&
      "content" in firstCandidate &&
      typeof firstCandidate.content === "object" &&
      firstCandidate.content !== null &&
      "parts" in firstCandidate.content &&
      Array.isArray(firstCandidate.content.parts)
    ) {
      return firstCandidate.content.parts
        .map((part: unknown) => {
          if (typeof part === "object" && part !== null && "text" in part) {
            return typeof part.text === "string" ? part.text : "";
          }

          return "";
        })
        .join("")
        .trim();
    }
  }

  return "";
}

export async function generateAuditSummary(result: AuditResult) {
  const fallback = buildFallbackSummary(result);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      summary: fallback,
      provider: "fallback",
      usedFallback: true
    };
  }

  try {
    const prompt = auditSummaryPrompt.replace(
      "{{auditJson}}",
      JSON.stringify(result, null, 2)
    );
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 180
          }
        })
      }
    );

    if (!response.ok) {
      return {
        summary: fallback,
        provider: "fallback",
        usedFallback: true
      };
    }

    const text = extractGeminiText(await response.json());

    return {
      summary: text || fallback,
      provider: text ? "gemini" : "fallback",
      usedFallback: !text
    };
  } catch {
    return {
      summary: fallback,
      provider: "fallback",
      usedFallback: true
    };
  }
}
