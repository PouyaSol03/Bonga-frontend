import { motion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { RequestManagementTab, RequestTabItem } from "../types";

export function RequestTabs({
  activeTab,
  hasReceivedIndicator,
  onChange,
  tabs,
  variant,
}: {
  activeTab: RequestManagementTab;
  hasReceivedIndicator: boolean;
  onChange: (tab: RequestManagementTab) => void;
  tabs: RequestTabItem[];
  variant: "account" | "default";
}) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );
  const count = tabs.length || 1;

  return (
    <section className={variant === "account" ? "px-4 py-2" : "bg-surface-container px-4 py-4"}>
      <div
        className={`border-outline bg-surface-container-lowest relative grid overflow-hidden border [direction:rtl] ${
          variant === "account"
            ? "h-10 rounded-xl"
            : "h-10 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
        }`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        <motion.div
          aria-hidden="true"
          className="bg-primary-container pointer-events-none absolute inset-y-0 right-0"
          style={{ width: `${100 / count}%` }}
          animate={{ x: `${-activeIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.8 }}
        />
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Button
              unstyled
              aria-current={isActive ? "page" : undefined}
              className={`focus-visible:outline-primary/40 relative inline-flex min-w-0 items-center justify-center px-2 leading-5 transition-colors duration-200 focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-[-3px] ${
                variant === "account" ? "text-sm font-medium" : "text-base font-semibold"
              } ${isActive ? "text-primary font-semibold" : "text-on-surface-var"}`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="relative z-10 inline-flex min-w-0 items-center justify-center gap-1"
              >
                {tab.id === "received" && hasReceivedIndicator ? (
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    aria-hidden="true"
                    className="bg-error h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                ) : null}
                <Typography as="span" variant="label" size="large" weight="medium">
                  {tab.label}
                </Typography>
              </Typography>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
