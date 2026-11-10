import type { RefObject } from "react";
import { FormTextField } from "../../../../shared/form/FormControls";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { formatAreaValue, normalizeNumber } from "./quickFilterHelpers";

export function QuickAreaRangeField({
  active,
  inputRef,
  isCustom,
  label,
  onChange,
  onClick,
  value,
}: {
  active: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  isCustom: boolean;
  label: string;
  onChange: (value: string) => void;
  onClick: () => void;
  value: string;
}) {
  const displayedValue = formatAreaValue(value);

  return (
    <div
      className="min-w-0 flex-1"
      onClick={() => {
        if (!isCustom) onClick();
      }}
    >
      <FormTextField
        className={`[&_input]:placeholder:text-outline w-full ${active ? "[&>span]:border-2" : ""}`}
        forceHighlight={active}
        forceLabel={active}
        inputRef={inputRef}
        label={label}
        onChange={isCustom ? (event) => onChange(normalizeNumber(event.target.value)) : undefined}
        onFocus={() => {
          if (!isCustom) onClick();
        }}
        placeholder={active ? "" : label}
        readOnly={!isCustom}
        trailingSlot={
          <LinearArrowDown1
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 ${active ? "text-outline" : "text-on-surface-var"}`}
          />
        }
        value={displayedValue}
      />
    </div>
  );
}
