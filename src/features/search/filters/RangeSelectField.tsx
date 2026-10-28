import { areaRangeOptions, customRangeOptionLabel } from "./rangeOptions";
import { useState } from "react";
import { formatPersianPlainNumber, normalizeRangeNumber } from "./numberValues";
import { Button } from "../../../shared/ui/Button";
import { ChevronDownIcon } from "./filterIcons";
import { Typography } from "../../../shared/ui/Typography";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { FormTextField } from "../../../shared/form/FormControls";

export function RangeSelectField({
  label,
  onChange,
  options = areaRangeOptions,
  unit = "متر",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options?: readonly string[];
  unit?: string;
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const displayValue = formatPersianPlainNumber(value);

  const closeSheet = () => {
    setIsOpen(false);
    setIsCustomInputVisible(false);
    setCustomValue("");
  };

  const openCustomInput = () => {
    setCustomValue(formatPersianPlainNumber(value));
    setIsCustomInputVisible(true);
  };

  return (
    <div className="min-w-0 flex-1">
      <Button
        unstyled
        className="border-outline-var bg-surface-container-lowest flex h-12 w-full items-center justify-between rounded-xl border px-3 text-sm leading-5 font-normal [direction:ltr]"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <ChevronDownIcon />
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className={`min-w-0 truncate text-right [direction:rtl] ${displayValue ? "text-on-surface" : "text-outline"}`}
        >
          {displayValue || label}
        </Typography>
      </Button>

      <BottomSheet
        ariaLabel={isCustomInputVisible ? customRangeOptionLabel : label}
        contentClassName="min-h-0 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2"
        isOpen={isOpen}
        onBack={isCustomInputVisible ? () => setIsCustomInputVisible(false) : closeSheet}
        onClose={closeSheet}
        showHeaderDivider
        title={isCustomInputVisible ? customRangeOptionLabel : label}
        variant="form"
      >
        {isCustomInputVisible ? (
          <div className="space-y-4 pt-2" dir="rtl">
            <FormTextField
              badge={unit}
              label="مقدار دلخواه"
              onChange={(event) => setCustomValue(formatPersianPlainNumber(event.target.value))}
              onClear={() => setCustomValue("")}
              placeholder="مقدار دلخواه را وارد کنید"
              value={customValue}
            />
            <Button
              disabled={!normalizeRangeNumber(customValue)}
              fullWidth
              onClick={() => {
                const normalizedCustomValue = normalizeRangeNumber(customValue);

                if (!normalizedCustomValue) return;

                onChange(normalizedCustomValue);
                closeSheet();
              }}
              size="sm"
            >
              تایید مقدار
            </Button>
          </div>
        ) : (
          <div className="space-y-1" dir="rtl">
            {value ? (
              <Button
                unstyled
                className="text-primary active:bg-primary-container flex h-12 w-full items-center justify-center rounded-[10px] px-2 text-center text-sm leading-5 font-medium"
                onClick={() => {
                  onChange("");
                  closeSheet();
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  پاک کردن انتخاب
                </Typography>
              </Button>
            ) : null}

            {options.map((option) => {
              const normalizedOption = normalizeRangeNumber(option);
              const selected =
                Boolean(normalizedOption) && normalizeRangeNumber(value) === normalizedOption;

              return (
                <Button
                  unstyled
                  aria-pressed={selected}
                  className={`flex h-12 w-full items-center justify-center rounded-[10px] px-2 text-center text-sm leading-5 font-medium ${
                    selected
                      ? "bg-primary-container text-primary"
                      : "bg-surface-container-lowest text-on-surface"
                  }`}
                  key={option}
                  onClick={() => {
                    if (option === customRangeOptionLabel) {
                      openCustomInput();
                      return;
                    }

                    onChange(normalizedOption);
                    closeSheet();
                  }}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular">
                    {option}
                  </Typography>
                </Button>
              );
            })}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
