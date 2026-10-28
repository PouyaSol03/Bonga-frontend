import type { Dispatch, SetStateAction } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { modalInputClassName } from "./constants";
import { CrmSelect } from "./CrmSelect";
import type { ModalField } from "./types";
type Props = {
  field: ModalField;
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
};
export function EditorStandardField({ field, values, setValues }: Props) {
  const value = values[field.name] ?? "";
  const isWide = field.type === "textarea";
  return (
    <label className={isWide ? "col-span-2" : ""} key={field.name}>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className="mb-2 block text-sm font-bold text-[#4f5a6c]"
      >
        {field.label}
      </Typography>
      {field.type === "select" ? (
        <CrmSelect
          className={modalInputClassName}
          name={field.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, [field.name]: event.target.value }))
          }
          value={value}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </CrmSelect>
      ) : field.type === "textarea" ? (
        <textarea
          className={`${modalInputClassName} min-h-24 resize-y py-3`}
          dir={field.label.includes("JSON") ? "ltr" : "rtl"}
          name={field.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, [field.name]: event.target.value }))
          }
          placeholder={field.placeholder}
          rows={4}
          value={value}
        />
      ) : (
        <input
          className={modalInputClassName}
          dir={field.type === "number" || field.type === "email" ? "ltr" : "rtl"}
          name={field.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, [field.name]: event.target.value }))
          }
          placeholder={field.placeholder}
          step={field.type === "number" ? "any" : undefined}
          type={field.type ?? "text"}
          value={value}
        />
      )}
    </label>
  );
}
