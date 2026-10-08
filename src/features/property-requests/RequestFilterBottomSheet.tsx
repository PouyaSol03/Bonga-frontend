import {
  BottomSheet,
  BottomSheetActionList,
  type BottomSheetAction,
} from "../../shared/components/BottomSheet";
import { ChoiceIndicator } from "../../shared/ui/Choice";
import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import type { PropertySearchRequest } from "./api/property-request.service";

export interface RequestFilterBottomSheetProps {
  agencyStyle?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filterId: string) => void;
  requests: PropertySearchRequest[];
  selectedId: string;
}

export function RequestFilterBottomSheet({
  agencyStyle = false,
  isOpen,
  onClose,
  onSelect,
  requests,
  selectedId,
}: RequestFilterBottomSheetProps) {
  const items: BottomSheetAction[] = [
    { id: "all", title: agencyStyle ? "همه" : "همه درخواست‌ها" },
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
      showHeaderDivider={!agencyStyle}
      className={agencyStyle ? "rounded-t-3xl" : ""}
      title={agencyStyle ? "انتخاب درخواست" : "فیلتر بر اساس درخواست"}
    >
      {agencyStyle ? (
        <div className="pt-5" role="group" aria-label="انتخاب درخواست">
          {items.map((item) => (
            <Button
              unstyled
              key={item.id}
              aria-pressed={item.id === selectedId}
              className="flex min-h-16 w-full items-center justify-between gap-4 px-4 text-right text-on-surface [direction:rtl] focus-visible:outline-2 focus-visible:outline-primary"
              onClick={() => handleSelect(item)}
              type="button"
            >
              <Typography as="span" variant="body" size="large" weight="regular" className="min-w-0 break-words">
                {item.title}
              </Typography>
              <ChoiceIndicator checked={item.id === selectedId} type="radio" className="shadow-none [&>span]:h-[7px] [&>span]:w-[7px]" />
            </Button>
          ))}
        </div>
      ) : (
      <BottomSheetActionList
        isOpen={isOpen}
        items={items}
        onSelect={handleSelect}
        selectedId={selectedId}
        showCheckIcon
      />
      )}
    </BottomSheet>
  );
}
