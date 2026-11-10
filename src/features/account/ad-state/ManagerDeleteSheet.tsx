import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";

export function ManagerDeleteSheet({
  isDeleteDialogOpen,
  isDeleting,
  setIsDeleteDialogOpen,
  handleDeleteAd,
}: {
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteAd: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="حذف آگهی"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isDeleteDialogOpen}
      onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
      title="حذف آگهی"
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
          آیا از حذف آگهی مطمئن هستید؟
        </Typography>

        <div className="mt-6 flex gap-3">
          <Button
            unstyled
            className="bg-error inline-flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-medium text-white shadow-sm active:opacity-90 disabled:opacity-50"
            disabled={isDeleting}
            onClick={handleDeleteAd}
            type="button"
          >
            {isDeleting ? "در حال حذف..." : "بله"}
          </Button>
          <Button
            unstyled
            className="border-outline-var bg-surface text-on-surface active:bg-surface-container inline-flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium"
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(false)}
            type="button"
          >
            خیر
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
