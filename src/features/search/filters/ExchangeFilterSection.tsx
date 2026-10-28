import { type ReactNode, useState, useRef } from "react";
import { type ChipItem } from "../../advertisements/create/types";
import { useTwoRowVisibleCount } from "../../../shared/lib/useTwoRowVisibleCount";
import { Typography } from "../../../shared/ui/Typography";
import { Chip } from "../../../shared/ui/Chip";
import { normalizeExactFilterValue } from "./numberValues";
import { AnimatePresence, motion } from "motion/react";
import { MoreButton } from "./MoreButton";

export type ExchangeFilterSectionProps = {
  icon: ReactNode;
  onToggle: (value: string) => void;
  options: readonly ChipItem[];
  sectionId?: string;
  selected: string[];
  title: string;
};

export function ExchangeFilterSection({
  icon,
  onToggle,
  options,
  sectionId,
  selected,
  title,
}: ExchangeFilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const twoRowCount = useTwoRowVisibleCount(measureRef, options.length);
  const canExpand = options.length > twoRowCount;
  const initialOptions = canExpand ? options.slice(0, twoRowCount) : options;
  const extraOptions = canExpand ? options.slice(twoRowCount) : [];

  return (
    <section
      className="border-surface-container bg-surface-container-lowest relative scroll-mt-4 border-b-8 px-4 pt-4 pb-2"
      data-filter-section={sectionId}
      dir="rtl"
    >
      <div className="text-on-surface-var flex h-6 items-center justify-start gap-2">
        {icon}
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="medium"
          className="text-on-surface m-0 text-right text-base leading-6 font-medium"
        >
          {title}
        </Typography>
      </div>

      <div className="relative mt-4 w-full">
        <div
          ref={measureRef}
          className="pointer-events-none invisible absolute inset-x-0 top-0 -z-50 flex flex-wrap justify-start gap-2"
          aria-hidden="true"
          dir="rtl"
        >
          {options.map((option) => (
            <Chip className="h-9" key={option.id}>
              {option.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {initialOptions.map((option) => (
            <Chip
              className="h-9"
              key={option.id}
              onClick={() => onToggle(option.id)}
              selected={selected.some(
                (item) => normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id),
              )}
            >
              {option.label}
            </Chip>
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
                <Chip
                  className="h-9"
                  key={option.id}
                  onClick={() => onToggle(option.id)}
                  selected={selected.some(
                    (item) =>
                      normalizeExactFilterValue(item) === normalizeExactFilterValue(option.id),
                  )}
                >
                  {option.label}
                </Chip>
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
    </section>
  );
}
