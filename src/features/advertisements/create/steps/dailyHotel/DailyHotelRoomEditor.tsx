import { useState } from "react";
import { BottomSheet, BottomSheetActionList } from "../../../../../shared/components/BottomSheet";
import { TopBar } from "../../../../../shared/components/TopBar";
import { InputBox, MoreFeaturesFooter, SelectBox } from "../../components/NewAdControls";
import { useNewAdDesktopLayout } from "../../NewAdLayoutContext";
import type { DailyHotelRoomConfig } from "../../types";
import {
  editorSelectFields,
  moneySupportingText,
  type RoomSelectSheet,
} from "./dailyHotelRoomsUtils";

interface DailyHotelRoomEditorProps {
  draftRoom: DailyHotelRoomConfig;
  onClose: () => void;
  onSave: () => void;
  setDraftRoom: React.Dispatch<React.SetStateAction<DailyHotelRoomConfig | null>>;
}

export function DailyHotelRoomEditor({
  draftRoom,
  onClose,
  onSave,
  setDraftRoom,
}: DailyHotelRoomEditorProps) {
  const desktop = useNewAdDesktopLayout();
  const [sheet, setSheet] = useState<RoomSelectSheet | null>(null);

  return (
    <div className="bg-surface-container fixed inset-0 z-[70] flex flex-col" dir="rtl">
      <div className="bg-surface-container mx-auto flex h-full w-full max-w-[1440px] flex-col overflow-hidden">
        <TopBar onBack={onClose} placement="inline" title={draftRoom.label} />

        <main
          className={
            desktop
              ? "bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5"
              : "bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6"
          }
          dir="rtl"
        >
          <div
            className={
              desktop
                ? "border-outline-var bg-surface-container-lowest mx-auto grid max-w-[1120px] grid-cols-2 gap-5 rounded-xl border p-6 shadow-[0_6px_20px_rgba(30,50,80,0.04)]"
                : "space-y-4"
            }
          >
            <SelectBox
              onClick={() =>
                setSheet({
                  field: "guestCount",
                  title: editorSelectFields.guestCount.title,
                  options: editorSelectFields.guestCount.options,
                })
              }
              placeholder={editorSelectFields.guestCount.placeholder}
              value={draftRoom.guestCount}
            />

            <SelectBox
              onClick={() =>
                setSheet({
                  field: "extraGuestCount",
                  title: editorSelectFields.extraGuestCount.title,
                  options: editorSelectFields.extraGuestCount.options,
                })
              }
              placeholder={editorSelectFields.extraGuestCount.placeholder}
              value={draftRoom.extraGuestCount}
            />

            <SelectBox
              onClick={() =>
                setSheet({
                  field: "mealPlan",
                  title: editorSelectFields.mealPlan.title,
                  options: editorSelectFields.mealPlan.options,
                })
              }
              placeholder={editorSelectFields.mealPlan.placeholder}
              value={draftRoom.mealPlan}
            />

            <InputBox
              formatNumeric
              leftText="تومان"
              numeric
              onChange={(value) =>
                setDraftRoom((current) => (current ? { ...current, normalPrice: value } : current))
              }
              placeholder="قیمت روزهای عادی *"
              supportingText={moneySupportingText(draftRoom.normalPrice)}
              value={draftRoom.normalPrice}
            />

            <InputBox
              formatNumeric
              leftText="تومان"
              numeric
              onChange={(value) =>
                setDraftRoom((current) => (current ? { ...current, weekendPrice: value } : current))
              }
              placeholder="قیمت آخر هفته *"
              supportingText={moneySupportingText(draftRoom.weekendPrice)}
              value={draftRoom.weekendPrice}
            />

            <InputBox
              formatNumeric
              leftText="تومان"
              numeric
              onChange={(value) =>
                setDraftRoom((current) => (current ? { ...current, specialPrice: value } : current))
              }
              placeholder="قیمت روزهای خاص *"
              supportingText={moneySupportingText(draftRoom.specialPrice)}
              value={draftRoom.specialPrice}
            />
          </div>
        </main>

        <MoreFeaturesFooter onCancel={onClose} onConfirm={onSave} />

        <BottomSheet
          ariaLabel={sheet?.title ?? "انتخاب"}
          className="rounded-t-[14px]"
          contentClassName="pt-0 pb-6"
          handleClassName="bg-outline-var h-1 w-[42px] rounded-full"
          heightClassName="h-auto max-h-[calc(100dvh-102px)]"
          isOpen={Boolean(sheet)}
          headerButtonAriaLabel="بازگشت"
          onBack={() => setSheet(null)}
          onClose={() => setSheet(null)}
          panelPaddingClassName="pt-3"
          showBackButton={false}
          showHandle
          showHeader
          showHeaderDivider
          title={sheet?.title ?? "انتخاب"}
          titleAlign="center"
          zIndexClassName="z-[80]"
        >
          <BottomSheetActionList
            align="center"
            isOpen={Boolean(sheet)}
            items={(sheet?.options ?? []).map((option) => ({
              id: option,
              title: option,
            }))}
            itemClassName="h-12 text-sm font-normal leading-5"
            onSelect={(item) => {
              if (!sheet) return;

              setDraftRoom((current) =>
                current
                  ? {
                      ...current,
                      [sheet.field]: item.title,
                    }
                  : current,
              );
              setSheet(null);
            }}
            selectedId={sheet && draftRoom ? draftRoom[sheet.field] : undefined}
            showCheckIcon
            showDividers={false}
          />
        </BottomSheet>
      </div>
    </div>
  );
}
