import { useState } from "react";
import { BusinessCreationShell, BusinessHero, BusinessTypeCard, getBusinessTypePath, navigateTo } from "../businessCreationShared";
import type { BusinessType } from "../businessCreationShared";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";

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
            <Typography as="span" variant="label" size="medium" weight="medium">مرحله بعد</Typography>
            <LinearArrowLeft1 aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
      }
    >
      <BusinessHero infoType={selectedType} showInfoButton />

      <section className="mt-14 px-4">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
          انتخاب کسب و کار
        </Typography>

        <div className="mt-6 space-y-6">
          <BusinessTypeCard
            badge="رایگان"
            icon={<LinearBuilding aria-hidden="true" className="h-6 w-6 shrink-0" />}
            isSelected={selectedType === "agency"}
            label="آژانس املاک"
            onClick={() => setSelectedType("agency")}
          />
          <BusinessTypeCard
            icon={<LinearUserSolid aria-hidden="true" className="h-6 w-6 shrink-0" />}
            isSelected={selectedType === "independent-consultant"}
            label="مشاور مستقل"
            onClick={() => setSelectedType("independent-consultant")}
          />
        </div>
      </section>
    </BusinessCreationShell>
  );
}
