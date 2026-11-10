import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function AccountLogoutConfirmSheet({
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
  const handleClose = () => {
    if (!isPending) {
      onCancel();
    }
  };

  return (
    <BottomSheet
      ariaLabel="خروج از حساب"
      className="rounded-t-[16px]"
      contentClassName="px-4 pt-[18px] pb-6"
      handleClassName="h-1 w-10 rounded-full bg-outline-var"
      heightClassName=""
      isOpen={isOpen}
      onClose={handleClose}
      panelPaddingClassName="pt-2.5"
      showHeader={false}
      showHeaderDivider={false}
      zIndexClassName="z-[1001]"
    >
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface m-0 text-center leading-5 font-medium"
      >
        مایل به خروج از حساب خود هستید؟
      </Typography>

      <div className="mt-3 grid grid-cols-2 gap-3 [direction:ltr]">
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-xs leading-4 font-semibold disabled:opacity-60"
          disabled={isPending}
          onClick={onConfirm}
          type="button"
        >
          {isPending ? "..." : "بله"}
        </Button>
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-xs leading-4 font-semibold disabled:opacity-60"
          disabled={isPending}
          onClick={handleClose}
          type="button"
        >
          خیر
        </Button>
      </div>
    </BottomSheet>
  );
}
