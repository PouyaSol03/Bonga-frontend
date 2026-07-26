import { useState } from "react";

import { CrmSupportRequestsView } from "../CrmSupportRequestsView";
import { CrmSupportView } from "../CrmSupportView";
import type { CrmRoutePageProps } from "../CrmLayout";

type SupportTab = "chats" | "requests";

const supportTabs: Array<{ label: string; value: SupportTab }> = [
  { label: "گفتگوهای پشتیبانی", value: "chats" },
  { label: "درخواست‌های پشتیبانی", value: "requests" },
];

export function CrmSupportPage(props: CrmRoutePageProps) {
  const [activeTab, setActiveTab] = useState<SupportTab>("chats");

  return (
    <section className="flex h-full min-h-0 flex-col gap-4" dir="rtl">
      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e4e7ec] bg-white p-1.5 shadow-sm">
        {supportTabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              className={`min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#0048c4] text-white"
                  : "bg-transparent text-[#475467] hover:bg-[#f2f4f7]"
              }`}
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1">
        {activeTab === "chats" ? (
          <CrmSupportView {...props} />
        ) : (
          <CrmSupportRequestsView {...props} />
        )}
      </div>
    </section>
  );
}
