import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function DiscountDeleteModal({
  deleteConfirmId,
  isPending,
  onCancel,
  onConfirm,
}: {
  deleteConfirmId: number | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {deleteConfirmId !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="border-outline-var bg-surface-container-lowest w-full max-w-sm rounded-2xl border p-6 shadow-xl [direction:rtl]"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <Typography
              as="h3"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-error text-base font-bold"
            >
              حذف کد تخفیف
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var mt-2 text-sm"
            >
              آیا از حذف این کد تخفیف اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </Typography>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                className="h-9 px-4"
                onClick={onCancel}
                type="button"
                variant="neutral-outline"
              >
                انصراف
              </Button>
              <Button
                className="h-9 px-4"
                loading={isPending}
                onClick={onConfirm}
                type="button"
                variant="danger"
              >
                حذف قطعی
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
