import { Link } from "react-router";
import { SwitchButton } from "../../../shared/components/SwitchButton";
import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { adManagementPaths } from "./adManagementData";
import { NeighborhoodPickerRow } from "./filter/components/NeighborhoodPickerRow";
import { PropertyTypeSelectionScreen } from "./filter/components/PropertyTypeSelectionScreen";
import { PublisherSelectField } from "./filter/components/PublisherSelectField";
import { SingleSelectField } from "./filter/components/SingleSelectField";
import { TransactionSection } from "./filter/components/TransactionSection";
import { statusOptions } from "./filter/filterHelpers";
import { useAdFilterState } from "./filter/useAdFilterState";

export function IndependentConsultantAdFilterPage() {
  const f = useAdFilterState();

  if (f.isPropertyTypePickerOpen && f.transaction) {
    return (
      <PropertyTypeSelectionScreen
        initialPropertyTypes={f.propertyTypes}
        onBack={() => f.setIsPropertyTypePickerOpen(false)}
        onConfirm={f.confirmPropertyType}
        transaction={f.transaction}
      />
    );
  }

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{
          filters: f.initialFilters,
          onlyMine: f.isAssignedTab ? false : f.previousOnlyMine,
          tab: f.tab,
        }}
        backTo={adManagementPaths.root}
        className="bg-surface-container"
        title="فیلتر"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6 [-webkit-overflow-scrolling:touch]">
        {!f.isAssignedTab ? (
          <section
            className="bg-surface-container-lowest flex items-center justify-between p-4"
            aria-label="نمایش آگهی من"
          >
            <Typography
              as="h2"
              variant="label"
              size="large"
              weight="medium"
              className="text-on-surface m-0"
            >
              آگهی من
            </Typography>
            <SwitchButton ariaLabel="نمایش آگهی من" checked={f.onlyMine} onChange={f.setOnlyMine} />
          </section>
        ) : null}

        <NeighborhoodPickerRow
          onChange={f.setSelectedNeighborhoods}
          selectedNeighborhoods={f.selectedNeighborhoods}
        />

        <TransactionSection
          onOpenPropertyTypePicker={f.openPropertyTypePicker}
          onRemovePropertyType={f.removePropertyType}
          onSelectTransaction={f.selectTransaction}
          propertyTypes={f.propertyTypes}
          transaction={f.transaction}
        />

        {!f.isAssignedTab ? (
          <section
            className="bg-surface-container-lowest mt-2 space-y-6 px-4 py-6"
            aria-label="فیلترهای تکمیلی"
          >
            <SingleSelectField
              indicator="radio"
              label="وضعیت آگهی"
              onChange={f.setStatus}
              options={statusOptions}
              value={f.status}
            />
            <PublisherSelectField onChange={f.setPublisher} value={f.publisher} />
          </section>
        ) : null}
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Link
            className="bg-primary text-on-primary inline-flex h-10 items-center justify-center rounded-lg text-sm leading-5 font-medium no-underline"
            state={{ filters: f.filters, onlyMine: f.isAssignedTab ? false : f.onlyMine, tab: f.tab }}
            to={adManagementPaths.root}
          >
            اعمال
          </Link>
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary h-10 rounded-lg border text-sm leading-5 font-medium"
            onClick={f.resetFilters}
            type="button"
          >
            حذف فیلتر
          </Button>
        </div>
      </footer>
    </PageFrame>
  );
}
