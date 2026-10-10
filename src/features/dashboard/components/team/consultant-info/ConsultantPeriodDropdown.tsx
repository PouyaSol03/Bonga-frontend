import { useEffect, useRef, useState } from "react";
import { Typography } from "../../../../../shared/ui/Typography";
import LinearArrowDown1 from "../../../../../shared/icons/LinearArrowDown1";
import LinearTick from "../../../../../shared/icons/LinearTick";

export type PerformancePeriod = "week" | "month" | "year";

const PERIOD_OPTIONS: { key: PerformancePeriod; label: string }[] = [
  { key: "week", label: "در هفته" },
  { key: "month", label: "در ماه" },
  { key: "year", label: "در سال" },
];

interface ConsultantPeriodDropdownProps {
  onSelectPeriod: (period: PerformancePeriod) => void;
  period: PerformancePeriod;
}

export function ConsultantPeriodDropdown({
  onSelectPeriod,
  period,
}: ConsultantPeriodDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel =
    PERIOD_OPTIONS.find((option) => option.key === period)?.label ?? "در هفته";

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2 py-1 text-xs text-on-surface-var transition active:scale-95"
      >
        <Typography variant="label" size="small" weight="medium" className="text-on-surface-var text-xs">
          {currentLabel}
        </Typography>
        <LinearArrowDown1 className="h-3.5 w-3.5 text-on-surface-var" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 min-w-[110px] rounded-lg border border-outline-var bg-surface-container-lowest py-1 shadow-md">
          {PERIOD_OPTIONS.map((option) => {
            const isSelected = option.key === period;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onSelectPeriod(option.key);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-right text-xs transition ${
                  isSelected
                    ? "bg-primary/5 font-bold text-primary"
                    : "bg-transparent text-on-surface-var"
                }`}
              >
                <Typography variant="label" size="small" weight="medium" className={isSelected ? "text-primary text-xs" : "text-on-surface-var text-xs"}>
                  {option.label}
                </Typography>
                {isSelected && (
                  <LinearTick className="h-3.5 w-3.5 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
