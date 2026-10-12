import type { FC } from "react";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export interface DeleteAdBottomSheetProps {
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
        className="m-0 text-center font-medium leading-5 text-on-surface"
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="m-0 mt-1.5 text-center text-xs leading-5 text-on-surface-var"
        >
          {description}
        </Typography>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-3 [direction:ltr]">
        <Button
          unstyled
          className="inline-flex py-2.5 items-center justify-center rounded-lg border border-error bg-error px-4 text-xs font-semibold leading-4 text-white active:bg-error/90 disabled:opacity-60"
          disabled={isDeleting}
          onClick={onConfirm}
          type="button"
        >
          {isDeleting ? "..." : confirmLabel}
        </Button>
        <Button
          unstyled
          className="inline-flex py-2.5 items-center justify-center rounded-lg border border-primary bg-surface-container-lowest px-4 text-xs font-semibold leading-4 text-primary disabled:opacity-60"
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
