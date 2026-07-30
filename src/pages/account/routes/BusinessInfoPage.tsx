import { useState } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { BusinessInfoCard, businessInfoCards, getBusinessTypeFromSearch, getBusinessTypePath } from "../businessCreationViews";
import type { BusinessType } from "../businessCreationViews";
import { Button } from "../../../components/ui/Button";

export function BusinessInfoPage() {
  const initialType = getBusinessTypeFromSearch();
  const [activeType, setActiveType] = useState<BusinessType>(initialType);
  const cards = businessInfoCards[activeType];

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={getBusinessTypePath(initialType)}
        title="معرفی کسب و کار"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-8 [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 z-10 bg-[#f0f0f0] px-2 pb-4 pt-2">
          <div className="grid h-9 grid-cols-2 overflow-hidden rounded-lg border border-[#808080] bg-white p-0.5 text-sm font-medium leading-5">
            <Button unstyled
              className={`rounded-md transition-colors ${activeType === "agency" ? "bg-[#eaf1ff] text-[#0048c4]" : "text-[#1a1a1a]"}`}
              onClick={() => setActiveType("agency")}
              type="button"
            >
              آژانس
            </Button>
            <Button unstyled
              className={`rounded-md transition-colors ${activeType === "independent-consultant" ? "bg-[#eaf1ff] text-[#0048c4]" : "text-[#1a1a1a]"}`}
              onClick={() => setActiveType("independent-consultant")}
              type="button"
            >
              مشاور
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {cards.map((card, index) => (
            <BusinessInfoCard
              businessType={activeType}
              card={card}
              index={index}
              key={card.title}
            />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}
