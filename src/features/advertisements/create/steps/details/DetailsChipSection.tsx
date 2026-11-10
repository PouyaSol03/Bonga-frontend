import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTwoRowVisibleCount } from "../../../../../shared/lib/useTwoRowVisibleCount";
import { Chip, MoreButton, Section } from "../../components/NewAdControls";

type ChipItem = Parameters<typeof Chip>[0]["item"];

export function DetailsChipSection({
  items,
  selected,
  onSelect,
  error,
  title,
  icon,
  getDisplayLabel,
  measureKey,
}: {
  items: ChipItem[];
  selected: string[];
  onSelect: (id: string) => void;
  error?: string;
  title: string;
  icon: string;
  getDisplayLabel?: (item: ChipItem) => string | undefined;
  measureKey?: string;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const visibleCount = useTwoRowVisibleCount(measureRef, items.length, measureKey);
  const [expanded, setExpanded] = useState(false);
  const initialItems = items.slice(0, visibleCount);
  const extraItems = items.slice(visibleCount);
  useEffect(() => {
    if (error) setExpanded(true);
  }, [error, expanded]);
  const renderChip = (item: ChipItem, measuring = false) => (
    <Chip
      key={item.id}
      item={item}
      displayLabel={getDisplayLabel?.(item)}
      selected={!measuring && selected.includes(item.id)}
      onClick={measuring ? () => {} : () => onSelect(item.id)}
    />
  );
  return (
    <Section icon={icon} title={title}>
      <div className="relative w-full">
        <div
          ref={measureRef}
          className="pointer-events-none invisible absolute inset-x-0 top-0 -z-50 flex flex-wrap justify-start gap-2"
          aria-hidden="true"
          dir="rtl"
        >
          {items.map((item) => renderChip(item, true))}
        </div>
        <div className="flex flex-wrap justify-start gap-2" dir="rtl">
          {initialItems.map((item) => renderChip(item))}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && extraItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="w-full overflow-hidden"
          >
            <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
              {extraItems.map((item) => renderChip(item))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {items.length > visibleCount ? (
        <MoreButton
          count={items.length - visibleCount}
          expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        />
      ) : null}
    </Section>
  );
}
