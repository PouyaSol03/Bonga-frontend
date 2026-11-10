import type { FC } from "react";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

interface DeleteAdBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const DeleteAdBottomSheet: FC<DeleteAdBottomSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "آیا از حذف این آگهی اطمینان دارید؟",
  description,
  confirmLabel = "بله",
  cancelLabel = "خیر",
}) => {
  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <BottomSheet
      ariaLabel="حذف آگهی"
      className="rounded-t-[16px]"
      contentClassName="px-4 pt-[18px] pb-6"
      handleClassName="h-1 w-10 rounded-full bg-outline-var"
      heightClassName=""
      isOpen={isOpen}
      onClose={handleClose}
      panelPaddingClassName="pt-2.5"
      showHeader={false}
      showHeaderDivider={false}
      zIndexClassName="z-[2000]"
    >
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface m-0 text-center leading-5 font-medium"
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 mt-1.5 text-center text-xs leading-5"
        >
          {description}
        </Typography>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-3 [direction:ltr]">
        <Button
          unstyled
          className="border-error bg-error active:bg-error/90 inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-xs leading-4 font-semibold text-white disabled:opacity-60"
          disabled={isDeleting}
          onClick={onConfirm}
          type="button"
        >
          {isDeleting ? "..." : confirmLabel}
        </Button>
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-xs leading-4 font-semibold disabled:opacity-60"
          disabled={isDeleting}
          onClick={handleClose}
          type="button"
        >
          {cancelLabel}
        </Button>
      </div>
    </BottomSheet>
  );
};
