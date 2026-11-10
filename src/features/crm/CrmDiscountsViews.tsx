import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import { DiscountDeleteModal } from "./discounts/components/DiscountDeleteModal";
import { DiscountFormModal } from "./discounts/components/DiscountFormModal";
import { DiscountStatsCards } from "./discounts/components/DiscountStatsCards";
import { DiscountTable } from "./discounts/components/DiscountTable";
import type { ViewProps } from "./discounts/types";
import { useCrmDiscountsFlow } from "./discounts/useCrmDiscountsFlow";

export function CrmDiscountsViews({ notify, refreshNonce }: ViewProps) {
  const {
    activeCodes,
    closeModal,
    createMutation,
    deleteConfirmId,
    deleteMutation,
    discountCodes,
    draft,
    editingItem,
    handleSubmit,
    hundredPercentCodes,
    isError,
    isLoading,
    modalOpen,
    openCreateModal,
    openEditModal,
    setDeleteConfirmId,
    setDraft,
    toggleMutation,
    toggleService,
    totalCodes,
    totalUsed,
    updateMutation,
  } = useCrmDiscountsFlow(notify, refreshNonce);

  const isFormPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 [direction:rtl]">
      {/* Header & Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            as="h2"
            variant="title"
            size="large"
            weight="semibold"
            className="text-on-surface text-xl font-bold"
          >
            مدیریت کدهای تخفیف
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var mt-1"
          >
            تعریف کدهای تخفیف درصدی و ۱۰۰٪ و تخصیص به سرویس‌های آگهی، بسته و پنل
          </Typography>
        </div>

        <Button className="h-11 px-5" onClick={openCreateModal} type="button" variant="primary">
          + ایجاد کد تخفیف جدید
        </Button>
      </div>

      <DiscountStatsCards
        activeCodes={activeCodes}
        hundredPercentCodes={hundredPercentCodes}
        totalCodes={totalCodes}
        totalUsed={totalUsed}
      />

      <DiscountTable
        discountCodes={discountCodes}
        isError={isError}
        isLoading={isLoading}
        isPendingToggle={toggleMutation.isPending}
        onDeleteClick={(id) => setDeleteConfirmId(id)}
        onEditClick={openEditModal}
        onToggleStatus={(id) => toggleMutation.mutate(id)}
      />

      <DiscountFormModal
        draft={draft}
        editingItem={editingItem}
        isPending={isFormPending}
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        setDraft={setDraft}
        toggleService={toggleService}
      />

      <DiscountDeleteModal
        deleteConfirmId={deleteConfirmId}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
      />
    </div>
  );
}
