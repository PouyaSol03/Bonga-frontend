import { motion } from "motion/react";
import LinearInfoCircle from "../../../../../shared/icons/LinearInfoCircle";
import LinearAd from "../../../../../shared/icons/LinearAd";
import LinearAnalystic from "../../../../../shared/icons/LinearAnalystic";
import { Typography } from "../../../../../shared/ui/Typography";
import type { TabKey } from "./types";

const TABS = [
  { id: "info" as const, label: "اطلاعات", Icon: LinearInfoCircle },
  { id: "ads" as const, label: "آگهی‌ها", Icon: LinearAd },
  { id: "performance" as const, label: "عملکرد", Icon: LinearAnalystic },
] as const;

export function ConsultantTabsNav({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  return (
    <div className="relative z-10 flex h-[72px] w-full items-stretch border-b border-outline-variant/60 bg-surface-container-lowest shadow-xs">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              isActive ? "text-primary" : "text-outline hover:text-on-surface"
            }`}
          >
            <Icon className="h-5 w-5" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className={isActive ? "text-primary" : "text-outline"}
            >
              {label}
            </Typography>
            {isActive && (
              <motion.span
                layoutId="consultant-tabs-active-indicator"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
