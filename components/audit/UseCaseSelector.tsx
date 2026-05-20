import { useCases } from "@/lib/audit/catalog";

type UseCaseSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function UseCaseSelector({ value, onChange }: UseCaseSelectorProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      Primary use case
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border bg-white px-3 py-2"
      >
        {useCases.map((useCase) => (
          <option key={useCase.value} value={useCase.value}>
            {useCase.label}
          </option>
        ))}
      </select>
    </label>
  );
}
