import { describe, expect, it } from "vitest";
import {
  auditFormSchema,
  defaultAuditFormValues
} from "@/lib/audit/form-schema";

describe("audit form schema", () => {
  it("accepts a valid minimum audit form draft", () => {
    expect(auditFormSchema.safeParse(defaultAuditFormValues).success).toBe(true);
  });

  it("rejects negative spend and zero seat counts", () => {
    const result = auditFormSchema.safeParse({
      ...defaultAuditFormValues,
      tools: [
        {
          tool: "Cursor",
          plan: "Pro",
          monthlySpend: -1,
          seats: 0
        }
      ]
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Monthly spend must be 0 or more",
        "Seats must be at least 1"
      ])
    );
  });

  it("rejects invalid team size", () => {
    const result = auditFormSchema.safeParse({
      ...defaultAuditFormValues,
      teamSize: 0
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Team size must be at least 1");
  });

  it("rejects a plan that does not belong to the selected tool", () => {
    const result = auditFormSchema.safeParse({
      ...defaultAuditFormValues,
      tools: [
        {
          tool: "GitHub Copilot",
          plan: "Pro",
          monthlySpend: 10,
          seats: 1
        }
      ]
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Select a valid plan for this tool"
    );
  });
});
