import { JalaliDatePickerSheet } from "../advertisements/create/steps/project/JalaliDatePickerSheet";
import { PaymentDetailsModal } from "./payments/components/PaymentDetailsModal";
import { PaymentFilterSection } from "./payments/components/PaymentFilterSection";
import { PaymentMetricsSection } from "./payments/components/PaymentMetricsSection";
import { PaymentTableSection } from "./payments/components/PaymentTableSection";
import type { CrmPaymentsViewProps } from "./payments/types";
import { useCrmPayments } from "./payments/useCrmPayments";

export function CrmPaymentsView({ notify, refreshNonce }: CrmPaymentsViewProps) {
  const {
    applyFilters,
    changePage,
    clearFilters,
    currentPage,
    draft,
    isError,
    isFetching,
    isLoading,
    openPicker,
    payments,
    perPage,
    refetch,
    selectedPayment,
    setOpenPicker,
    setPerPage,
    setSelectedPayment,
    total,
    totalPages,
    updateDraft,
  } = useCrmPayments({ notify, refreshNonce });

  return (
    <div className="space-y-4">
      <PaymentMetricsSection isLoading={isLoading} payments={payments} total={total} />

      <PaymentFilterSection
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        draft={draft}
        setOpenPicker={setOpenPicker}
        updateDraft={updateDraft}
      />

      <PaymentTableSection
        changePage={changePage}
        clearFilters={clearFilters}
        currentPage={currentPage}
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
        onSelectPayment={setSelectedPayment}
        payments={payments}
        perPage={perPage}
        refetch={refetch}
        setPerPage={setPerPage}
        total={total}
        totalPages={totalPages}
      />

      <JalaliDatePickerSheet
        isOpen={openPicker === "from"}
        onClose={() => setOpenPicker(null)}
        onConfirm={(value) => {
          updateDraft("fromDate", value);
          setOpenPicker(null);
        }}
        title="انتخاب تاریخ شروع"
        value={draft.fromDate}
      />
      <JalaliDatePickerSheet
        isOpen={openPicker === "to"}
        onClose={() => setOpenPicker(null)}
        onConfirm={(value) => {
          updateDraft("toDate", value);
          setOpenPicker(null);
        }}
        title="انتخاب تاریخ پایان"
        value={draft.toDate}
      />

      <PaymentDetailsModal onClose={() => setSelectedPayment(null)} payment={selectedPayment} />
    </div>
  );
}
