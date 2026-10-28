import { BottomSheet } from "../../../shared/components/BottomSheet";
import { ChatMenuDivider, ChatMenuRow } from "./ChatMenuRow";
import { ChevronLeftIcon, ChevronRightIcon } from "./listIcons";
import { ClockAlarmIcon, TrashIcon } from "./statusIcons";
import { ToggleSwitch } from "./ToggleSwitch";

export function ChatMenuBottomSheet({
  isOpen,
  onClose,
  onShowBlockedChange,
  onShowMyAdsChange,
  onSelect,
  showBlocked,
  showMyAds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onShowBlockedChange: (checked: boolean) => void;
  onShowMyAdsChange: (checked: boolean) => void;
  onSelect: (id: string) => void;
  showBlocked: boolean;
  showMyAds: boolean;
}) {
  return (
    <BottomSheet
      ariaLabel="مدیریت چت"
      className="rounded-t-[18px]"
      contentClassName="mt-1"
      heightClassName="h-[448px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-black/60"
      showHeader={false}
    >
      <ChatMenuRow compact icon={<ChevronRightIcon className="h-6 w-6" />} onClick={onClose}>
        <strong className="font-semibold">مدیریت چت</strong>
      </ChatMenuRow>
      <ChatMenuRow icon={<ClockAlarmIcon className="h-6 w-6" />} onClick={() => onSelect("hours")}>
        ساعات پاسخگویی
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow icon={<TrashIcon className="h-6 w-6" />} onClick={() => onSelect("rename")}>
        تغییر نام چت
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow trailing={<ToggleSwitch checked={showBlocked} onChange={onShowBlockedChange} />}>
        نمایش چت‌های مسدود شده
      </ChatMenuRow>
      <ChatMenuRow trailing={<ToggleSwitch checked={showMyAds} onChange={onShowMyAdsChange} />}>
        نمایش آگهی‌های من
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow
        icon={<TrashIcon className="h-6 w-6" />}
        onClick={() => onSelect("bulk-delete")}
        trailing={<ChevronLeftIcon className="h-5 w-5" />}
      >
        حذف گروهی چت‌ها
      </ChatMenuRow>
    </BottomSheet>
  );
}
