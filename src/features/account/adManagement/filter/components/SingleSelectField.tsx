import { useState } from "react";
import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../../../shared/components/RadioIndicator";
import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { ClearCircleIcon } from "./FilterIcons";

export function SingleSelectField({
  indicator = "check",
  label,
  onChange,
  options,
  value,
}: {
  indicator?: "check" | "radio";
  label: string;
  onChange: (value?: string) => void;
  options: string[];
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="border-outline-var bg-surface-container-lowest relative flex h-14 w-full items-center rounded-xl border px-3 [direction:ltr]">
        {value ? (
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="bg-surface-container-lowest text-outline absolute -top-2 [direction:rtl]"
          >
            {label}
          </Typography>
        ) : null}
        {value ? (
          <Button
            unstyled
            aria-label="پاک کردن انتخاب"
            className="text-outline grid h-5 w-5 shrink-0 place-items-center"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <ClearCircleIcon />
          </Button>
        ) : (
          <LinearArrowDown1 className="text-on-surface-var h-5 w-5" />
        )}
        <Button
          unstyled
          className="min-w-0 flex-1 truncate text-right text-sm leading-5 font-normal [direction:rtl]"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={value ? "text-on-surface" : "text-outline"}
          >
            {value ?? label}
          </Typography>
        </Button>
      </div>

      <BottomSheet
        ariaLabel={label}
        contentClassName="px-4 mb-0 pt-4"
        maxHeight="50svh"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
      >
        <div className="space-y-2 pb-6" dir="rtl">
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <Button
                unstyled
                aria-pressed={isSelected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-1 text-right text-sm leading-5 font-normal [direction:ltr] ${
                  isSelected ? "text-primary" : "text-on-surface"
                }`}
                key={option}
                onClick={() => {
                  onChange(isSelected ? undefined : option);
                  setIsOpen(false);
                }}
                type="button"
              >
                {indicator === "radio" ? (
                  <RadioIndicator checked={isSelected} />
                ) : (
                  <SelectionCheckIndicator checked={isSelected} />
                )}
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="min-w-0 flex-1 truncate text-right [direction:rtl]"
                >
                  {option}
                </Typography>
              </Button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
}
