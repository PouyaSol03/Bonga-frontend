import { motion } from "motion/react";
import { Typography } from "../../../../shared/ui/Typography";
import { type AgencyPreviewTab, agencyTabs } from "../types";

interface AgencySegmentedTabsProps {
  activeTab: AgencyPreviewTab;
  onChange: (tab: AgencyPreviewTab) => void;
  tabs?: Array<{ id: AgencyPreviewTab; label: string }>;
}

export function AgencySegmentedTabs({
  activeTab,
  onChange,
  tabs = agencyTabs,
}: AgencySegmentedTabsProps) {
  return (
    <div className="bg-surface-container-lowest relative z-10 px-4 pb-4 shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
      <div
        className="border-outline bg-surface-container-lowest text-on-surface-var relative grid h-10 overflow-hidden rounded-xl border text-sm leading-5 font-semibold"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-pressed={isActive}
              className={`relative z-10 flex h-full cursor-pointer items-center justify-center transition-colors duration-200 ${
                isActive ? "text-primary" : "text-on-surface-var"
              }`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              <Typography variant="label" size="large" weight="medium">
                {tab.label}
              </Typography>
              {isActive && (
                <motion.div
                  className="bg-primary-container absolute inset-0 -z-10"
                  layoutId="agency-preview-tab-active-indicator"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
