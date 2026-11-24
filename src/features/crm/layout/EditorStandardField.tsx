import type { Dispatch, SetStateAction } from "react";
import { toEnglishDigits } from "../../../shared/lib/numberUtils";
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
  const isPhoneOrNumber =
    field.type === "number" ||
    field.type === "tel" ||
    field.name === "mobile" ||
    field.name === "phone" ||
    field.name === "phonenumber";

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
          dir={field.type === "number" || field.type === "email" || isPhoneOrNumber ? "ltr" : "rtl"}
          name={field.name}
          onChange={(event) => {
            let nextValue = event.target.value;
            if (isPhoneOrNumber) {
              const converted = toEnglishDigits(nextValue);
              nextValue = converted.replace(/\D/g, "");
              if (field.name === "mobile" || field.name === "phone") {
                nextValue = nextValue.slice(0, 11);
              }
            }
            setValues((current) => ({ ...current, [field.name]: nextValue }));
          }}
          placeholder={field.placeholder}
          step={field.type === "number" ? "any" : undefined}
          type={field.type ?? (isPhoneOrNumber ? "tel" : "text")}
          value={value}
        />
      )}
    </label>
  );
}
