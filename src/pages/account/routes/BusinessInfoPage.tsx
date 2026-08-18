import { useState } from "react";
import { PageFrame } from "../../../app/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import {
  BusinessInfoCard,
  businessInfoCards,
  getBusinessTypeFromSearch,
  getBusinessTypePath,
} from "../businessCreationShared";
import type { BusinessType } from "../businessCreationShared";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

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
        heightClassName="h-14"
        title="معرفی کسب و کار"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0] pb-8 [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 z-10 bg-[#f0f0f0] px-4 pb-2 pt-1">
          <div className="grid h-10 grid-cols-2 overflow-hidden rounded-[16px] border border-[#808080] bg-white text-sm font-medium leading-5">
            <Button
              unstyled
              aria-pressed={activeType === "agency"}
              className={`h-full transition-colors ${
                activeType === "agency"
                  ? "bg-[#e7efff] text-[#0048c4]"
                  : "bg-white text-[#4d4d4d]"
              }`}
              onClick={() => setActiveType("agency")}
              type="button"
            >
              <Typography as="span" variant="label" size="medium" weight="medium">
                آژانس
              </Typography>
            </Button>
            <Button
              unstyled
              aria-pressed={activeType === "independent-consultant"}
              className={`h-full transition-colors ${
                activeType === "independent-consultant"
                  ? "bg-[#e7efff] text-[#0048c4]"
                  : "bg-white text-[#4d4d4d]"
              }`}
              onClick={() => setActiveType("independent-consultant")}
              type="button"
            >
              <Typography as="span" variant="label" size="medium" weight="medium">
                مشاور
              </Typography>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {cards.map((card, index) => (
            <BusinessInfoCard
              businessType={activeType}
              card={card}
              index={index}
              key={`${activeType}-${card.title}`}
            />
          ))}
        </div>
      </main>
    </PageFrame>
  );
}
