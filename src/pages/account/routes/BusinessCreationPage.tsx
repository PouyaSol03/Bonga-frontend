import { useState } from "react";
import { ArrowLeftIcon, BusinessCreationShell, BusinessHero, BusinessTypeCard, getBusinessTypePath, navigateTo } from "../businessCreationViews";
import type { BusinessType } from "../businessCreationViews";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

export function BusinessCreationPage() {
  const [selectedType, setSelectedType] = useState<BusinessType>("agency");

  const handleNext = () => {
    navigateTo(getBusinessTypePath(selectedType));
  };

  return (
    <BusinessCreationShell
      bottomBar={
        <div className="flex items-center justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3">
          <Button unstyled
            className="inline-flex h-10 min-w-[156px] items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] px-5 text-sm font-semibold leading-5 text-white disabled:bg-[#b3c8ef]"
            onClick={handleNext}
            type="button"
          >
            <Typography as="span" variant="body" size="medium" weight="regular">مرحله بعد</Typography>
            <ArrowLeftIcon />
          </Button>
        </div>
      }
    >
      <BusinessHero />

      <section className="mt-14 px-4">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
          انتخاب کسب و کار
        </Typography>

        <div className="mt-6 space-y-6">
          <BusinessTypeCard
            badge="رایگان"
            icon="agency"
            isSelected={selectedType === "agency"}
            label="آژانس املاک"
            onClick={() => setSelectedType("agency")}
          />
          <BusinessTypeCard
            icon="consultant"
            isSelected={selectedType === "independent-consultant"}
            label="مشاور مستقل"
            onClick={() => setSelectedType("independent-consultant")}
          />
        </div>
      </section>
    </BusinessCreationShell>
  );
}
