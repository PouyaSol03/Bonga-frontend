import { useState } from "react";
import { Chip } from "../../../../shared/ui/Chip";
import { Typography } from "../../../../shared/ui/Typography";
import {
  ViewAdLeadCard,
  type ViewAdLeadItem,
  MOCK_VIEW_AD_LEADS,
} from "./ViewAdLeadCard";

export type LeadFilterKey = "all" | "new" | "visit" | "followup" | "cancel";

export interface ViewAdLeadsSectionProps {
  leads?: ViewAdLeadItem[];
  onChatClick?: (lead: ViewAdLeadItem) => void;
  className?: string;
}

const LEAD_FILTERS: { key: LeadFilterKey; label: string; statusMatch?: string }[] = [
  { key: "all", label: "همه" },
  { key: "new", label: "جدید", statusMatch: "جدید" },
  { key: "visit", label: "بازدید", statusMatch: "بازدید" },
  { key: "followup", label: "پیگیری", statusMatch: "پیگیری" },
  { key: "cancel", label: "انصراف", statusMatch: "انصراف" },
];

export function ViewAdLeadsSection({
  leads = MOCK_VIEW_AD_LEADS,
  onChatClick,
  className = "",
}: ViewAdLeadsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<LeadFilterKey>("all");

  const filteredLeads = leads.filter((lead) => {
    if (activeFilter === "all") return true;
    const filterDef = LEAD_FILTERS.find((f) => f.key === activeFilter);
    return filterDef?.statusMatch ? lead.status === filterDef.statusMatch : true;
  });

  return (
    <section
      aria-label="لیست سرنخ‌های آگهی"
      className={`flex flex-col [direction:rtl] ${className}`}
    >
      {/* Filter Bar Container: white background */}
      <div className="bg-surface-container-lowest p-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-surface-container bg-surface-container-lowest p-4">
          {LEAD_FILTERS.map((f) => (
            <Chip
              key={f.key}
              selected={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
              className="justify-center"
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Cards List: no top gap from filters, 16px gap between cards */}
      <div className="flex flex-col gap-4 bg-surface-container pb-4">
        {filteredLeads.map((lead) => (
          <ViewAdLeadCard key={lead.id} lead={lead} onChatClick={onChatClick} />
        ))}

        {filteredLeads.length === 0 && (
          <div className="mx-4 rounded-2xl bg-surface-container-lowest py-12 px-4 text-center">
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="medium"
              className="text-sm text-on-surface-variant"
            >
              سرنخی با این وضعیت یافت نشد
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
}

export default ViewAdLeadsSection;