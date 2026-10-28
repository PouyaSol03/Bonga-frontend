import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export function BlockChatConfirmBottomSheet({
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
      ariaLabel="تأیید مسدود کردن کاربر"
      className="rounded-t-[20px]"
      contentClassName="px-4 pb-7 pt-7"
      isOpen={isOpen}
      onClose={onCancel}
      scrimClassName="bg-black/60"
      showHandle={false}
      showHeader={false}
      variant="confirm"
      zIndexClassName="z-[70]"
    >
      <div className="flex flex-col gap-5">
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="medium"
          className="text-on-surface m-0 text-center text-base leading-6 font-medium"
        >
          آیا از مسدود کردن کاربر مطمئن هستید؟
        </Typography>
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Button disabled={isPending} fullWidth onClick={onConfirm} size="sm">
            {isPending ? "در حال مسدود کردن..." : "بله مسدود کن!"}
          </Button>
          <Button disabled={isPending} fullWidth onClick={onCancel} size="sm" variant="secondary">
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
