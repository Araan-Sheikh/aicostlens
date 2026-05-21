import { z } from "zod";
import { plansByTool, toolNames, useCaseValues } from "@/lib/audit/catalog";

export const auditFormSchema = z.object({
  tools: z
    .array(
      z
        .object({
          tool: z.enum(toolNames),
          plan: z.string().min(1, "Select a plan"),
          monthlySpend: z
            .number({ error: "Enter monthly spend" })
            .min(0, "Monthly spend must be 0 or more"),
          seats: z
            .number({ error: "Enter paid seats" })
            .int("Seats must be a whole number")
            .min(1, "Seats must be at least 1")
        })
        .refine((value) => plansByTool[value.tool].includes(value.plan), {
          message: "Select a valid plan for this tool",
          path: ["plan"]
        })
    )
    .min(1, "Add at least one AI tool"),
  teamSize: z
    .number({ error: "Enter team size" })
    .int("Team size must be a whole number")
    .min(1, "Team size must be at least 1"),
  primaryUseCase: z.enum(useCaseValues)
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;

export const defaultAuditFormValues: AuditFormValues = {
  tools: [
    {
      tool: "Cursor",
      plan: "Pro",
      monthlySpend: 0,
      seats: 1
    }
  ],
  teamSize: 1,
  primaryUseCase: "coding"
};
