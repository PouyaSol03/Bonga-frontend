import { type ReactNode, useState, useRef } from "react";
import { useTwoRowVisibleCount } from "../../../shared/lib/useTwoRowVisibleCount";
import { FilterSection } from "./FilterSection";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { normalizeExactFilterValue } from "./numberValues";
import { AnimatePresence, motion } from "motion/react";
import { MoreButton } from "./MoreButton";

export type SingleChoiceSectionProps = {
  icon: ReactNode;
  sectionId?: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
  onSelect: (value: string) => void;
  options: readonly string[];
  selected?: string;
  title: string;
};

export function SingleChoiceSection({
  icon,
  sectionId,
  onSelect,
  options,
  selected,
  title,
}: SingleChoiceSectionProps) {
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
            <FormChoiceChip key={option} label={option} />
          ))}
        </div>
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {initialOptions.map((option) => (
            <FormChoiceChip
              key={option}
              label={option}
              onClick={() => onSelect(option)}
              selected={
                selected !== undefined &&
                normalizeExactFilterValue(selected) === normalizeExactFilterValue(option)
              }
            />
          ))}
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
              {extraOptions.map((option) => (
                <FormChoiceChip
                  key={option}
                  label={option}
                  onClick={() => onSelect(option)}
                  selected={
                    selected !== undefined &&
                    normalizeExactFilterValue(selected) === normalizeExactFilterValue(option)
                  }
                />
              ))}
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
