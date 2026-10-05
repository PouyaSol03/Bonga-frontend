import { useState } from "react";
import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import { RadioIndicator } from "../../../../../shared/components/RadioIndicator";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearCancelCircle from "../../../../../shared/icons/LinearCancelCircle";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { CONSULTANT_AD_STATUS_OPTIONS } from "./consultantAdsFilterTypes";

export function ConsultantAdsStatusSheet({
  onChange,
  value,
}: {
  onChange: (status?: string) => void;
  value?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="relative flex h-14 w-full items-center rounded-xl border border-[#CCCCCC] bg-surface-container-lowest px-3 [direction:ltr]">
        {value ? (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="absolute -top-2 right-3 bg-surface-container-lowest px-1 text-outline [direction:rtl]"
          >
            وضعیت آگهی
          </Typography>
        ) : null}

        {value ? (
          <Button
            unstyled
            aria-label="پاک کردن"
            className="grid h-5 w-5 shrink-0 place-items-center text-outline"
            onClick={() => onChange(undefined)}
            type="button"
          >
            <LinearCancelCircle className="h-5 w-5" />
          </Button>
        ) : (
          <LinearArrowDown1 className="h-5 w-5 text-on-surface-var" />
        )}

        <Button
          unstyled
          className="min-w-0 flex-1 truncate text-right text-sm font-normal leading-5 [direction:rtl]"
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
            {value ?? "وضعیت آگهی"}
          </Typography>
        </Button>
      </div>

      <BottomSheet
        ariaLabel="وضعیت آگهی"
        contentClassName="px-4 pb-4 pt-2"
        heightClassName="max-h-[50svh]"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="وضعیت آگهی"
      >
        <div className="space-y-1" dir="rtl">
          {CONSULTANT_AD_STATUS_OPTIONS.map((option) => {
            const isSelected = value === option;

            return (
              <Button
                unstyled
                aria-pressed={isSelected}
                className={`flex h-12 w-full items-center justify-between rounded-[10px] px-2 text-right transition-colors active:bg-primary-container/20 [direction:ltr] ${
                  isSelected ? "text-primary" : "text-on-surface"
                }`}
                key={option}
                onClick={() => {
                  onChange(isSelected ? undefined : option);
                  setIsOpen(false);
                }}
                type="button"
              >
                <RadioIndicator checked={isSelected} />
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
    </div>
  );
}
