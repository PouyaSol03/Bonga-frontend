import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { SwitchButton } from "../../../shared/components/SwitchButton";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight2 from "../../../shared/icons/LinearArrowRight2";
import LinearDelete from "../../../shared/icons/LinearDelete";
import LinearNotification from "../../../shared/icons/LinearNotification";
import LinearTickDouble from "../../../shared/icons/LinearTickDouble";

export function NotificationSettingsSheet({
  isClearingRead,
  isMarkingAllRead,
  isOpen,
  markAllUnread,
  onClearRead,
  onClose,
  onManage,
  onMarkAllRead,
  onMarkAllUnreadChange,
}: {
  isClearingRead: boolean;
  isMarkingAllRead: boolean;
  isOpen: boolean;
  markAllUnread: boolean;
  onClearRead: () => void;
  onClose: () => void;
  onManage: () => void;
  onMarkAllRead: () => void;
  onMarkAllUnreadChange: (checked: boolean) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="تنظیمات اعلان"
      className="rounded-t-[16px]"
      contentClassName="mt-2"
      handleClassName="h-[3px] w-[42px] rounded-full bg-outline-var"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2.5"
      scrimClassName="bg-black/70"
      showHeader={false}
    >
      <div className="px-3">
        <div className="flex h-[72px] items-center gap-2 border-b border-outline-var px-1 text-right [direction:rtl]">
          <LinearArrowRight2 className="h-6 w-6 shrink-0 text-on-surface-var" />
          <Typography
            as="p"
            variant="label"
            size="large"
            weight="medium"
            className="m-0 font-medium leading-5 text-on-surface"
          >
            تنظیمات اعلان
          </Typography>
        </div>

        <div className="flex h-[72px] items-center justify-between border-b border-outline-var px-1 [direction:ltr]">
          <SwitchButton
            ariaLabel="علامت‌گذاری همه به‌عنوان خوانده‌نشده"
            checked={markAllUnread}
            onChange={onMarkAllUnreadChange}
          />
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-right font-normal leading-4 text-on-surface"
            dir="rtl"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌نشده
          </Typography>
        </div>

        <Button
          unstyled
          className="flex h-[72px] w-full items-center justify-between border-b border-outline-var px-1 text-on-surface [direction:ltr]"
          onClick={onManage}
          type="button"
        >
          <LinearArrowLeft1 className="h-6 w-6 shrink-0 text-on-surface-var" />
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="flex items-center gap-2 font-normal leading-4 [direction:rtl]"
          >
            <LinearNotification className="h-6 w-6 text-on-surface-var" />
            مدیریت اعلان‌ها
          </Typography>
        </Button>

        <Button
          unstyled
          className="flex h-[72px] w-full items-center gap-2 border-b border-outline-var px-1 text-[11px] font-normal leading-4 text-on-surface disabled:cursor-wait disabled:opacity-60 [direction:rtl]"
          disabled={isMarkingAllRead}
          onClick={onMarkAllRead}
          type="button"
        >
          <LinearTickDouble className="h-6 w-6 text-on-surface-var" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            {isMarkingAllRead ? "در حال ثبت..." : "علامت‌گذاری همه به‌عنوان خوانده شده"}
          </Typography>
        </Button>

        <Button
          unstyled
          className="flex h-[72px] w-full items-center gap-2 px-1 text-[11px] font-normal leading-4 text-on-surface disabled:cursor-wait disabled:opacity-60 [direction:rtl]"
          disabled={isClearingRead}
          onClick={onClearRead}
          type="button"
        >
          <LinearDelete className="h-6 w-6 text-on-surface-var" />
          <Typography as="span" variant="body" size="medium" weight="regular">
            {isClearingRead ? "در حال پاک کردن..." : "پاک کردن اعلان‌های خوانده شده"}
          </Typography>
        </Button>
      </div>
    </BottomSheet>
  );
}
