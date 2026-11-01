import type { Dispatch, SetStateAction } from "react";
import { Typography } from "../../../shared/ui/Typography";
import type { ModalField } from "./types";
type Props = {
  field: ModalField;
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
};
export function EditorChecklistField({ field, values, setValues }: Props) {
  const value = values[field.name] ?? "";
  if (field.type === "checklist") {
    const selectedValues = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return (
      <fieldset className="col-span-2" key={field.name}>
        <legend className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</legend>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="m-0 mb-3 text-xs leading-5 text-[#8b94a3]"
        >
          هر نقش مستقل است و می‌توانید بیش از یک مورد را برای کاربر فعال کنید.
        </Typography>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(field.options ?? []).map((option) => {
            const isChecked = selectedValues.includes(option.value);

            return (
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  isChecked
                    ? "border-[#0048c4] bg-[#f2f6ff] text-[#0048c4]"
                    : "border-[#d9d9d9] bg-white text-[#333333] hover:border-[#b9c7dd]"
                }`}
                key={option.value}
              >
                <input
                  checked={isChecked}
                  className="h-4 w-4 shrink-0 accent-[#0048c4]"
                  name={field.name}
                  onChange={() => {
                    const nextValues = isChecked
                      ? selectedValues.filter((item) => item !== option.value)
                      : [...selectedValues, option.value];

                    setValues((current) => ({
                      ...current,
                      [field.name]: nextValues.join(","),
                    }));
                  }}
                  type="checkbox"
                  value={option.value}
                />
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="text-sm font-bold"
                >
                  {option.label}
                </Typography>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }
  return null;
}
