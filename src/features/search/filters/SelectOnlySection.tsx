import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { Chip } from "../../../shared/ui/Chip";
import { ChevronLeftIcon, ClearCircleIcon } from "./filterIcons";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { ChoiceIndicator } from "../../../shared/ui/Choice";

export function SelectOnlySection({
  label,
  onChange,
  options,
  sectionId,
  topPadding = false,
  value,
}: {
  label: string;
  onChange: (value: string | undefined) => void;
  options: readonly string[];
  sectionId?: string;
  topPadding?: boolean;
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className={`bg-surface-container-lowest px-4 ${topPadding ? "pt-2" : ""}`}
      data-filter-section={sectionId}
      dir="rtl"
    >
      <div className="border-outline-var flex h-[59px] w-full items-center justify-between gap-3 border-b text-right">
        <Button
          unstyled
          className="flex h-full min-w-0 flex-1 items-center text-right"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="large"
            weight="medium"
            className="text-on-surface truncate"
          >
            {label}
          </Typography>
        </Button>

        {value ? (
          <Chip
            aria-label={`حذف ${value}`}
            className="bg-primary-container text-on-primary-container h-9 max-w-[55%] px-2 py-2 [&_svg]:h-4 [&_svg]:w-4"
            onClick={() => onChange(undefined)}
            removable
            selected
          >
            {value}
          </Chip>
        ) : (
          <Button
            unstyled
            className="text-primary flex h-full shrink-0 items-center gap-1 text-sm leading-5 font-medium"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">
              انتخاب
            </Typography>
            <ChevronLeftIcon />
          </Button>
        )}
      </div>

      <BottomSheet
        ariaLabel={label}
        contentClassName="px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-2"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showHeaderDivider
        title={label}
        variant="actions"
      >
        <div className="space-y-1" dir="rtl">
          {value ? (
            <Button
              unstyled
              className="text-primary active:bg-primary-container flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right text-sm leading-5 font-medium"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                پاک کردن انتخاب
              </Typography>
              <ClearCircleIcon />
            </Button>
          ) : null}

          {options.map((option) => {
            const selected = value === option;

            return (
              <Button
                unstyled
                aria-pressed={selected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right text-sm leading-5 font-medium ${
                  selected
                    ? "bg-primary-container text-primary"
                    : "bg-surface-container-lowest text-on-surface"
                }`}
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">
                  {option}
                </Typography>
                <ChoiceIndicator checked={selected} />
              </Button>
            );
          })}
        </div>
      </BottomSheet>
    </section>
  );
}
