import type { UseFormRegister } from "react-hook-form";
import { useCases } from "@/lib/audit/catalog";
import type { AuditFormValues } from "@/lib/audit/form-schema";

type UseCaseSelectorProps = {
  error?: string;
  register: UseFormRegister<AuditFormValues>;
};

export function UseCaseSelector({ error, register }: UseCaseSelectorProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      Primary use case
      <select
        {...register("primaryUseCase")}
        className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {useCases.map((useCase) => (
          <option key={useCase.value} value={useCase.value}>
            {useCase.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-sm font-normal text-red-700">{error}</span>
      ) : null}
    </label>
  );
}
