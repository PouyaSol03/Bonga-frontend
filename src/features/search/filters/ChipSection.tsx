import { type ReactNode, useState, useRef } from "react";
import { type ChipItem } from "../../advertisements/create/types";
import { useTwoRowVisibleCount } from "../../../shared/lib/useTwoRowVisibleCount";
import { FilterSection } from "./FilterSection";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { FeatureChipIcon } from "./FeatureChipIcon";
import { normalizeExactFilterValue } from "./numberValues";
import { AnimatePresence, motion } from "motion/react";
import { MoreButton } from "./MoreButton";

export type ChipSectionProps = {
  icon: ReactNode;
  sectionId?: string;
  showFeatureIcons?: boolean;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
  onToggle: (value: string) => void;
  options: readonly ChipItem[];
  selected: string[];
  title: string;
};

export function ChipSection({
  icon,
  sectionId,
  showFeatureIcons = false,
  onToggle,
  options,
  selected,
  title,
}: ChipSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const twoRowCount = useTwoRowVisibleCount(measureRef, options.length);
  const canExpand = options.length > twoRowCount;
  const initialOptions = canExpand ? options.slice(0, twoRowCount) : options;
  const extraOptions = canExpand ? options.slice(twoRowCount) : [];

  return (
    <FilterSection icon={icon} sectionId={sectionId} title={title}>
      <div className="relative w-full">
        <div
          ref={measureRef}
          className="pointer-events-none invisible absolute inset-x-0 top-0 -z-50 flex flex-wrap justify-start gap-2"
          aria-hidden="true"
          dir="rtl"
        >
          {options.map((option) => (
            <FormChoiceChip
              key={option.id}
              icon={
                showFeatureIcons ? (
                  <FeatureChipIcon label={option.label} selected={false} />
                ) : undefined
              }
              label={option.label}
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {initialOptions.map((option) => {
            const isSelected = selected.some(
              (item) => normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id),
            );

            return (
              <FormChoiceChip
                key={option.id}
                icon={
                  showFeatureIcons ? (
                    <FeatureChipIcon label={option.label} selected={isSelected} />
                  ) : undefined
                }
                label={option.label}
                onClick={() => onToggle(option.id)}
                selected={isSelected}
              />
            );
          })}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && extraOptions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
              {extraOptions.map((option) => {
                const isSelected = selected.some(
                  (item) =>
                    normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id),
                );

                return (
                  <FormChoiceChip
                    key={option.id}
                    icon={
                      showFeatureIcons ? (
                        <FeatureChipIcon label={option.label} selected={isSelected} />
                      ) : undefined
                    }
                    label={option.label}
                    onClick={() => onToggle(option.id)}
                    selected={isSelected}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {canExpand ? (
        <MoreButton
          count={options.length - twoRowCount}
          expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        />
      ) : null}
    </FilterSection>
  );
}
