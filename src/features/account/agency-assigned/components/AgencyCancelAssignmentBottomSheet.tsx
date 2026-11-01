import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";

export function AgencyCancelAssignmentBottomSheet({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="لغو واگذاری آگهی به آژانس"
      className="rounded-t-[24px]!"
      contentClassName="min-h-0 overflow-y-auto overscroll-contain pb-2"
      headerButtonAriaLabel="بستن"
      headerClassName="h-10! gap-1! px-2!"
      isOpen={isOpen}
      onClose={onClose}
      title="لغو واگذاری آگهی به آژانس"
      variant="confirm"
      zIndexClassName="z-2000"
    >
      <div className="px-5 pt-4 text-right [direction:rtl]">
        <Typography
          as="h3"
          variant="body"
          size="large"
          weight="medium"
          className="text-on-surface m-0"
        >
          با لغو این درخواست، آژانس دیگر آگهی شما را مدیریت نخواهد کرد.
        </Typography>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-3"
        >
          آگهی شما تا ۷ روز در وضعیت «در انتظار ثبت مجدد» باقی می‌ماند و در این مدت می‌توانید:
        </Typography>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <div className="bg-outline h-1.25 w-1.25 rounded-full" />
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var m-0 mt-2"
            >
              آگهی را به آژانس دیگری واگذار کنید.
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-outline h-1.25 w-1.25 rounded-full" />
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var m-0"
            >
              آگهی را به صورت شخصی منتشر کنید.
            </Typography>
          </div>
        </div>

        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-4"
        >
          پس از پایان مهلت، آگهی به بایگانی منتقل خواهد شد.
        </Typography>

        <div className="bg-tertiary-container/30 text-tertiary mt-4 flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-medium">
          <LinearInfoCircle className="text-tertiary h-4 w-4 shrink-0" />
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="medium"
            className="text-tertiary"
          >
            اطلاعات و تصاویر آگهی حذف نخواهند شد.
          </Typography>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 [direction:ltr]">
          <Button
            fullWidth
            variant="primary"
            size="x-medium"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "در حال لغو..." : "لغو درخواست"}
          </Button>

          <Button
            fullWidth
            variant="secondary"
            size="x-medium"
            disabled={isPending}
            onClick={onClose}
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
