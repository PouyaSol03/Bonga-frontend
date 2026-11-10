import { useState } from "react";
import { TopBar } from "../../../../../shared/components/TopBar";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import LinearApartment from "../../../../../shared/icons/LinearApartment";
import {
  adManagementTransactionOptions,
  type AdManagementTransaction,
} from "../../../../account/adManagement/adManagementData";
import { ConsultantAdsNeighborhoodPicker } from "./ConsultantAdsNeighborhoodPicker";
import { ConsultantAdsPropertyTypeSheet } from "./ConsultantAdsPropertyTypeSheet";
import { ConsultantAdsStatusSheet } from "./ConsultantAdsStatusSheet";
import {
  emptyConsultantAdsFilterState,
  type ConsultantAdsFilterState,
} from "./consultantAdsFilterTypes";

export function ConsultantAdsFilterView({
  initialFilters,
  onApply,
  onBack,
}: {
  agentId?: number | string;
  initialFilters?: ConsultantAdsFilterState;
  onApply: (filters: ConsultantAdsFilterState) => void;
  onBack: () => void;
}) {
  const [filters, setFilters] = useState<ConsultantAdsFilterState>(
    initialFilters ?? emptyConsultantAdsFilterState,
  );

  const toggleTransaction = (target: AdManagementTransaction) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: [],
      transaction: prev.transaction === target ? undefined : target,
    }));
  };

  const handleReset = () => {
    setFilters(emptyConsultantAdsFilterState);
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <section
      className="bg-surface-container text-on-surface mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden"
      dir="rtl"
    >
      <TopBar
        centerClassName="px-0"
        className="bg-surface-container"
        onBack={onBack}
        reserveStartSpace
        title="فیلتر"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6 [-webkit-overflow-scrolling:touch]">
        <section className="bg-surface-container-lowest mt-2 px-4">
          <ConsultantAdsNeighborhoodPicker
            onChange={(neighborhoods) => setFilters((prev) => ({ ...prev, neighborhoods }))}
            selectedNeighborhoods={filters.neighborhoods}
          />
        </section>

        <section className="bg-surface-container-lowest mt-2 p-4">
          <div className="flex items-center justify-start gap-2">
            <LinearApartment className="text-on-surface-var h-6 w-6 shrink-0" />
            <Typography
              as="p"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface m-0"
            >
              نوع معامله
            </Typography>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2" dir="rtl">
            {adManagementTransactionOptions.map((opt) => {
              const isSelected = filters.transaction === opt.id;
              return (
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  key={opt.id}
                  onClick={() => toggleTransaction(opt.id)}
                  type="button"
                  className={`flex h-10 items-center justify-center rounded-[10px] border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "bg-surface-container-lowest text-on-surface border-[#CCCCCC]"
                  }`}
                >
                  <Typography variant="label" size="medium" weight="medium">
                    {opt.label}
                  </Typography>
                </Button>
              );
            })}
          </div>

          <div className="my-4 h-px bg-[#CCCCCC]" />

          <ConsultantAdsPropertyTypeSheet
            onChange={(propertyTypes) => setFilters((prev) => ({ ...prev, propertyTypes }))}
            propertyTypes={filters.propertyTypes}
            transaction={filters.transaction}
          />
        </section>

        <section className="bg-surface-container-lowest mt-2 px-4 py-6">
          <ConsultantAdsStatusSheet
            onChange={(status) => setFilters((prev) => ({ ...prev, status }))}
            value={filters.status}
          />
        </section>
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            variant="primary"
            size="x-medium"
            radius="small"
            fullWidth
            onClick={handleApply}
            type="button"
          >
            اعمال
          </Button>
          <Button
            variant="secondary"
            size="x-medium"
            radius="small"
            fullWidth
            onClick={handleReset}
            type="button"
          >
            حذف فیلتر
          </Button>
        </div>
      </footer>
    </section>
  );
}
