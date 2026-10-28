import { BottomSheet, BottomSheetActionList } from "../../../shared/components/BottomSheet";
import { BlockedIcon } from "./listIcons";
import { InfoIcon, TrashIcon } from "./statusIcons";

export function ChatSettingsBottomSheet({
  isBlockedByMe,
  isOpen,
  onClose,
  onSelect,
}: {
  isBlockedByMe: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, title: string) => void;
}) {
  const options = [
    {
      id: isBlockedByMe ? "unblock" : "block",
      title: isBlockedByMe ? "رفع مسدودیت" : "مسدود کردن",
      Icon: BlockedIcon,
    },
    {
      id: "delete",
      title: "حذف مکالمه",
      Icon: TrashIcon,
    },
    {
      id: "report",
      title: "گزارش تخلف",
      Icon: InfoIcon,
    },
  ];

  return (
    <BottomSheet
      ariaLabel="تنظیمات مکالمه"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-black/60"
      title="تنظیمات مکالمه"
      variant="actions"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={options}
        onSelect={(item) => onSelect(item.id, item.title)}
      />
    </BottomSheet>
  );
}
