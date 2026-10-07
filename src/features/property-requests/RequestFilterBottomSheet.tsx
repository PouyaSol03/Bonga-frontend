import {
  BottomSheet,
  BottomSheetActionList,
  type BottomSheetAction,
} from "../../shared/components/BottomSheet";
import type { PropertySearchRequest } from "./api/property-request.service";

export interface RequestFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filterId: string) => void;
  requests: PropertySearchRequest[];
  selectedId: string;
}

export function RequestFilterBottomSheet({
  isOpen,
  onClose,
  onSelect,
  requests,
  selectedId,
}: RequestFilterBottomSheetProps) {
  const items: BottomSheetAction[] = [
    { id: "all", title: "همه درخواست‌ها" },
    ...requests.map((req) => ({
      id: req.id,
      title: req.title || "درخواست بدون عنوان",
    })),
  ];

  const handleSelect = (item: BottomSheetAction) => {
    onSelect(item.id);
    onClose();
  };

  return (
    <BottomSheet
      ariaLabel="فیلتر درخواست‌ها"
      contentClassName="overflow-y-auto max-h-[50svh] px-4 pb-4"
      heightClassName="max-h-[50svh] h-auto pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      maxHeight="50svh"
      isOpen={isOpen}
      onClose={onClose}
      showHandle
      showHeader
      showHeaderDivider
      title="فیلتر بر اساس درخواست"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        items={items}
        onSelect={handleSelect}
        selectedId={selectedId}
        showCheckIcon
      />
    </BottomSheet>
  );
}
