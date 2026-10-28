import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";

export function CancelAssignmentBottomSheet({
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="لغو واگذاری به آژانس"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onCancel}
      title="لغو واگذاری به آژانس"
      variant="confirm"
      zIndexClassName="z-2000"
    >
      <div className="px-4 pt-1 pb-4 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface m-0 text-sm leading-6"
        >
          آیا از لغو واگذاری این آگهی به آژانس اطمینان دارید؟
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 mt-2 text-xs leading-5"
        >
          پس از لغو، ۷ روز مهلت خواهید داشت تا آن را به آژانس دیگری واگذار کنید یا مستقیماً منتشر
          نمایید.
        </Typography>

        <div className="mt-6 flex gap-3">
          <Button
            unstyled
            className="bg-error inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-medium text-white shadow-sm active:opacity-90 disabled:opacity-50"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? "در حال لغو..." : "بله، لغو واگذاری"}
          </Button>
          <Button
            unstyled
            className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium"
            disabled={isPending}
            onClick={onCancel}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
