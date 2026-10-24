import { useState } from "react";
import { Chip } from "../../../../shared/ui/Chip";
import { ViewAdLeadCard, type ViewAdLeadItem } from "./ViewAdLeadCard";
import { useAdLeadsQuery } from "../api/singleLeadApi";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";

type LeadFilterKey = "all" | "new" | "visit" | "followup" | "cancel";

interface ViewAdLeadsSectionProps {
  leads?: ViewAdLeadItem[];
  adId?: string | number;
  onChatClick?: (lead: ViewAdLeadItem) => void;
  onDetailsClick?: (lead: ViewAdLeadItem) => void;
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
  leads,
  adId,
  onChatClick,
  onDetailsClick,
  className = "",
}: ViewAdLeadsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<LeadFilterKey>("all");

  const { data: serverLeads, isLoading } = useAdLeadsQuery(adId);

  const resolvedLeads: ViewAdLeadItem[] = leads
    ? leads
    : ((serverLeads as unknown as ViewAdLeadItem[]) ?? []);

  const filteredLeads = resolvedLeads.filter((lead) => {
    if (activeFilter === "all") return true;
    const filterDef = LEAD_FILTERS.find((f) => f.key === activeFilter);
    return filterDef?.statusMatch ? lead.status === filterDef.statusMatch : true;
  });

  return (
    <section
      aria-label="لیست سرنخ‌های آگهی"
      className={`flex min-h-[420px] flex-col [direction:rtl] ${className}`}
    >
      <div className="bg-surface-container-lowest p-4">
        <div className="border-surface-container bg-surface-container-lowest flex items-center justify-between gap-2 rounded-2xl border p-4">
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

      {isLoading ? (
        <div className="bg-surface-container flex flex-col gap-4 p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest h-28 w-full animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container flex flex-1 flex-col gap-4 pb-4">
          {filteredLeads.map((lead) => (
            <ViewAdLeadCard
              key={lead.id}
              lead={lead}
              adId={adId}
              onChatClick={onChatClick}
              onDetailsClick={onDetailsClick}
            />
          ))}

          {filteredLeads.length === 0 && (
            <div className="bg-surface-container-lowest mx-4 my-2 flex min-h-[320px] flex-1 items-center justify-center rounded-2xl p-6">
              <SearchEmptyState
                title="هیچ سرنخی یافت نشد"
                description={
                  activeFilter === "all"
                    ? "هنوز هیچ سرنخ یا تماسی برای این آگهی ثبت نشده است."
                    : "سرنخی با این وضعیت یافت نشد."
                }
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ViewAdLeadsSection;
