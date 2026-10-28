import type { ReactNode } from "react";
import { InputBox, SelectBox } from "../../components/NewAdControls";
import { getBasicPropertyFields } from "../../utils";
import type { NewAdFormValues, NewAdFieldErrors, SelectKey } from "../../types";
import type { SetDetailsField, OpenDetailsSheet } from "./types";

export function DetailsPropertyFields({
  values,
  errors,
  setField,
  setSheet,
}: {
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  setSheet: OpenDetailsSheet;
}) {
  const basicPropertyFields = getBasicPropertyFields();
  return (
    <>
      {basicPropertyFields.map((field) => {
        const placeholder = `${field.label}${field.required ? " *" : ""}`;
        const value = values[field.key];

        let controlNode: ReactNode;
        if (field.control === "input") {
          controlNode = (
            <InputBox
              key={field.key}
              error={errors[field.key]}
              numeric={field.numeric}
              leftText={field.leftText}
              onChange={(nextValue) => setField(field.key, nextValue)}
              placeholder={placeholder}
              value={String(value ?? "")}
            />
          );
        } else if (field.control === "multiSelect") {
          const selectedValues = values.suitableFor;
          controlNode = (
            <SelectBox
              key={field.key}
              error={errors[field.key]}
              onClear={() => setField("suitableFor", [])}
              onClick={() =>
                setSheet({
                  kind: "multiSelect",
                  key: "suitableFor",
                  title: field.label,
                  options: field.options ?? [],
                })
              }
              placeholder={placeholder}
              value={selectedValues.join("، ")}
            />
          );
        } else {
          controlNode = (
            <SelectBox
              key={field.key}
              error={errors[field.key]}
              onClear={() => setField(field.key, "")}
              onClick={() =>
                setSheet({
                  kind: "select",
                  key: field.key as SelectKey,
                  title: field.label,
                  options: field.options ?? [],
                })
              }
              placeholder={placeholder}
              value={String(value ?? "")}
            />
          );
        }

        return (
          <div key={field.key} data-field-key={field.key}>
            {controlNode}
          </div>
        );
      })}
    </>
  );
}
