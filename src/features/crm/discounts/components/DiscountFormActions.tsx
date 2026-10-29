import { Button } from "../../../../shared/ui/Button";

export function DiscountFormActions({
  editingItem,
  isPending,
  onClose,
}: {
  editingItem: boolean;
  isPending: boolean;
  onClose: () => void;
}) {
  return (
    <div className="border-outline-var mt-6 flex justify-end gap-3 border-t pt-3">
      <Button
        className="h-10 px-4"
        disabled={isPending}
        onClick={onClose}
        type="button"
        variant="neutral-outline"
      >
        انصراف
      </Button>
      <Button
        className="h-10 px-5"
        loading={isPending}
        type="submit"
        variant="primary"
      >
        {editingItem ? "بروزرسانی کد" : "ایجاد کد تخفیف"}
      </Button>
    </div>
  );
}
