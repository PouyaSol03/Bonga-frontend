import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { locationKey } from "../../data";
import type { NewAdFieldErrorKey, NewAdFormValues, SelectKey, SheetState } from "../../types";
import type { SetDetailsField } from "./types";

export function useDetailsForm(onClearError?: (key: NewAdFieldErrorKey) => void) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const [sheet, setSheet] = useState<SheetState | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(locationKey)?.trim();
    if (stored && !values.location) {
      setValue("location", stored, { shouldDirty: false });
    }
  }, [setValue, values.location]);

  const setField: SetDetailsField = (key, value) => {
    setValue(key as never, value as never, { shouldDirty: true });
    onClearError?.(key);
  };
  const handleLoanToggle = (checked: boolean) => {
    setField("loanEnabled", checked);
    if (!checked) {
      setField("loanAmount", "");
      setField("loanInstallment", "");
    }
  };
  const openSelectSheet = (key: SelectKey, title: string, options: string[]) => {
    setSheet({
      kind: "select",
      key,
      title,
      options,
    });
  };

  return { values, setValue, sheet, setSheet, setField, handleLoanToggle, openSelectSheet };
}
