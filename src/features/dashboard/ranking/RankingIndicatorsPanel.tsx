import { useState, useRef, useEffect } from "react";
import LinearArrowDown1 from "../../../shared/icons/LinearArrowDown1";
import LinearTick from "../../../shared/icons/LinearTick";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export type RankingPeriod = "ماه" | "هفته";

const PERIOD_OPTIONS: { key: RankingPeriod; label: string }[] = [
  { key: "ماه", label: "ماه" },
  { key: "هفته", label: "هفته" },
];

export interface AgencyIndicator {
  Icon: React.ComponentType<{ className?: string }>;
  id: string;
  label: string;
  value: string;
}

interface RankingIndicatorsPanelProps {
  indicators: AgencyIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
  isLoading?: boolean;
}

export function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
  isLoading = false,
}: RankingIndicatorsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <section
      className="bg-surface-container-lowest rounded-2xl p-4"
      aria-label="شاخص‌های رتبه‌بندی"
    >
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <div ref={dropdownRef} className="relative">
          <Button
            unstyled
            className="text-on-surface active:bg-surface-container inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs leading-4 font-medium transition"
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <LinearArrowDown1 className="text-on-surface-var h-4 w-4" />
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="[direction:rtl]"
            >
              {period}
            </Typography>
          </Button>

          {isOpen && (
            <div
              className="border-outline-var bg-surface-container-lowest absolute top-full left-0 z-30 mt-1 min-w-[100px] rounded-lg border py-1 shadow-md [direction:rtl]"
              role="listbox"
            >
              {PERIOD_OPTIONS.map((option) => {
                const isSelected = option.key === period;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPeriod(option.key);
                      setIsOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between border-none px-3 py-2 text-right text-xs transition ${
                      isSelected
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-on-surface-var bg-transparent"
                    }`}
                  >
                    <Typography
                      variant="label"
                      size="small"
                      weight="medium"
                      className={isSelected ? "text-primary text-xs" : "text-on-surface-var text-xs"}
                    >
                      {option.label}
                    </Typography>
                    {isSelected && <LinearTick className="text-primary h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base leading-6 font-semibold [direction:rtl]"
        >
          شاخص‌های رتبه‌بندی
        </Typography>
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-outline-var flex min-h-20 animate-pulse items-center justify-between rounded-lg border px-4 py-3 [direction:ltr]"
            >
              <div className="bg-surface-container-high h-6 w-10 rounded" />
              <div className="bg-surface-container-high h-5 w-32 rounded" />
              <div className="bg-surface-container-high h-12 w-12 rounded-2xl" />
            </div>
          ))
        ) : (
          indicators.map((indicator) => {
            const Icon = indicator.Icon;
            return (
              <div
                className="border-outline-var flex min-h-20 items-center gap-3 rounded-lg border px-4 py-3 [direction:ltr]"
                key={indicator.id}
              >
                <strong className="text-primary w-12 shrink-0 text-left text-base leading-6 font-semibold [direction:rtl]">
                  {indicator.value}
                </strong>
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="text-on-surface-var min-w-0 flex-1 px-2 text-right text-sm leading-5 font-semibold [direction:rtl]"
                >
                  {indicator.label}
                </Typography>
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="bg-primary-container text-primary grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                >
                  <Icon className="h-6 w-6" />
                </Typography>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
