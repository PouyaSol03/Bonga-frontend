import { useEffect, useRef, useState } from "react";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import LinearTick from "../../../../shared/icons/LinearTick";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { RankIndicator, RankingPeriod } from "../types";

export function RankIndicatorRow({ indicator }: { indicator: RankIndicator }) {
  return (
    <div className="border-outline-var flex h-20 items-center rounded-lg border px-4 [direction:ltr]">
      <Typography
        as="strong"
        variant="label"
        size="large"
        weight="semibold"
        className="text-primary shrink-0 [direction:rtl]"
      >
        {indicator.value}
      </Typography>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className="text-on-surface-var min-w-0 flex-1 px-2.5 text-right text-sm font-semibold [direction:rtl]"
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
        {indicator.icon}
      </Typography>
    </div>
  );
}

export function RankingIndicatorsPanel({
  indicators,
  period,
  setPeriod,
  isLoading = false,
}: {
  indicators: RankIndicator[];
  period: RankingPeriod;
  setPeriod: (period: RankingPeriod) => void;
  isLoading?: boolean;
}) {
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
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="خلاصه فعالیت">
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <div ref={dropdownRef} className="relative">
          <Button
            unstyled
            className="text-on-surface inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-medium"
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <LinearArrowDown1 className="text-on-surface-var h-4 w-4" />
            <Typography
              as="span"
              variant="body"
              size="small"
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
              {(["ماه", "هفته"] as const).map((opt) => {
                const isSelected = opt === period;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setPeriod(opt);
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
                      {opt}
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
          className="m-0 text-base font-semibold [direction:rtl]"
        >
          خلاصه فعالیت
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
          indicators.map((indicator) => (
            <RankIndicatorRow indicator={indicator} key={indicator.label} />
          ))
        )}
      </div>
    </section>
  );
}
