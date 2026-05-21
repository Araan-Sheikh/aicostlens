import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister,
  UseFormSetValue
} from "react-hook-form";
import { plansByTool, supportedTools } from "@/lib/audit/catalog";
import type { AuditFormValues } from "@/lib/audit/form-schema";

type ToolSpendRowProps = {
  errors?: Merge<FieldError, FieldErrorsImpl<AuditFormValues["tools"][number]>>;
  index: number;
  register: UseFormRegister<AuditFormValues>;
  setValue: UseFormSetValue<AuditFormValues>;
  tool: AuditFormValues["tools"][number]["tool"];
};

export function ToolSpendRow({
  errors,
  index,
  register,
  setValue,
  tool
}: ToolSpendRowProps) {
  const plans = plansByTool[tool] ?? [];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Tool
        <select
          onChange={(event) => {
            const selectedTool = event.target.value as keyof typeof plansByTool;
            setValue(`tools.${index}.tool`, selectedTool, {
              shouldDirty: true,
              shouldValidate: true
            });
            setValue(`tools.${index}.plan`, plansByTool[selectedTool][0], {
              shouldDirty: true,
              shouldValidate: true
            });
          }}
          value={tool}
          className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {supportedTools.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
        {errors?.tool?.message ? (
          <span className="text-sm font-normal text-red-700">
            {errors.tool.message}
          </span>
        ) : null}
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Plan
        <select
          {...register(`tools.${index}.plan`)}
          className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {plans.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
        {errors?.plan?.message ? (
          <span className="text-sm font-normal text-red-700">
            {errors.plan.message}
          </span>
        ) : null}
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Monthly spend
        <input
          type="number"
          min="0"
          placeholder="240"
          {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
          className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors?.monthlySpend?.message ? (
          <span className="text-sm font-normal text-red-700">
            {errors.monthlySpend.message}
          </span>
        ) : null}
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Paid seats
        <input
          type="number"
          min="1"
          {...register(`tools.${index}.seats`, { valueAsNumber: true })}
          className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors?.seats?.message ? (
          <span className="text-sm font-normal text-red-700">
            {errors.seats.message}
          </span>
        ) : null}
      </label>
    </div>
  );
}
