import type { RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearRuler from "../../../../shared/icons/LinearRuler";
import { QuickAreaRangeField } from "./QuickAreaRangeField";
import {
  normalizeNumber,
  quickAreaCustomOptionLabel,
  quickAreaRangeOptions,
} from "./quickFilterHelpers";
import type { AreaBound } from "./types";

type AreaFilterSectionProps = {
  activeAreaBound: AreaBound | null;
  areaMaximum: string;
  areaMinimum: string;
  customAreaBound: AreaBound | null;
  maximumAreaInputRef: RefObject<HTMLInputElement | null>;
  minimumAreaInputRef: RefObject<HTMLInputElement | null>;
  onActiveAreaBoundChange: (bound: AreaBound | null) => void;
  onAreaMaximumChange: (val: string) => void;
  onAreaMinimumChange: (val: string) => void;
  onCustomAreaBoundChange: (bound: AreaBound | null) => void;
};

export function AreaFilterSection({
  activeAreaBound,
  areaMaximum,
  areaMinimum,
  customAreaBound,
  maximumAreaInputRef,
  minimumAreaInputRef,
  onActiveAreaBoundChange,
  onAreaMaximumChange,
  onAreaMinimumChange,
  onCustomAreaBoundChange,
}: AreaFilterSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-full min-h-0 flex-col" dir="rtl">
      <div className="text-on-surface flex items-center gap-2">
        <LinearRuler aria-hidden="true" className="text-on-surface-var h-6 w-6 shrink-0" />
        <Typography as="span" variant="title" size="medium" weight="medium">
          متراژ
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-outline"
        >
          (متر)
        </Typography>
      </div>

      <div className="mt-6 flex min-h-[66px] items-start gap-4">
        <QuickAreaRangeField
          active={activeAreaBound === "minimum"}
          inputRef={minimumAreaInputRef}
          isCustom={customAreaBound === "minimum"}
          label="حداقل"
          onChange={onAreaMinimumChange}
          onClick={() => {
            onActiveAreaBoundChange("minimum");
            onCustomAreaBoundChange(null);
          }}
          value={areaMinimum}
        />
        <QuickAreaRangeField
          active={activeAreaBound === "maximum"}
          inputRef={maximumAreaInputRef}
          isCustom={customAreaBound === "maximum"}
          label="حداکثر"
          onChange={onAreaMaximumChange}
          onClick={() => {
            onActiveAreaBoundChange("maximum");
            onCustomAreaBoundChange(null);
          }}
          value={areaMaximum}
        />
      </div>

      <AnimatePresence initial={false}>
        {activeAreaBound ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="border-outline-var mt-4 flex min-h-0 flex-1 flex-col border-t pt-[17px]"
            exit={{ opacity: 0 }}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            key="area-value-list"
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }
            }
          >
            <Button
              unstyled
              className="bg-surface-container-lowest text-on-surface flex h-[72px] w-full shrink-0 items-center justify-center px-2 text-center"
              onClick={() => onCustomAreaBoundChange(activeAreaBound)}
              type="button"
            >
              <Typography as="span" variant="body" size="large" weight="regular">
                {quickAreaCustomOptionLabel}
              </Typography>
            </Button>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {quickAreaRangeOptions.map((option) => {
                const normalizedOption = normalizeNumber(option);

                return (
                  <Button
                    unstyled
                    className="bg-surface-container-lowest text-on-surface flex h-[72px] w-full shrink-0 items-center justify-center px-2 text-center"
                    key={option}
                    onClick={() => {
                      if (activeAreaBound === "minimum") {
                        onAreaMinimumChange(normalizedOption);
                      } else {
                        onAreaMaximumChange(normalizedOption);
                      }

                      onCustomAreaBoundChange(null);
                      onActiveAreaBoundChange(null);
                    }}
                    type="button"
                  >
                    <Typography as="span" variant="body" size="large" weight="regular">
                      {option}
                    </Typography>
                  </Button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
