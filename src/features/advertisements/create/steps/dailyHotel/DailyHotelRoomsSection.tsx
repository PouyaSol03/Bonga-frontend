import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BottomSheet, BottomSheetActionList } from "../../../../../shared/components/BottomSheet";
import LinearCancelCircle from "../../../../../shared/icons/LinearCancelCircle";
import { formatBigNumber } from "../../../../../shared/lib/MoneyHandler";
import {
  dailyHotelMealPlanOptions,
  dailyHotelRoomTypes,
  dailyHotelRoomCapacityOptions,
} from "../../data";
import type {
  DailyHotelRoomConfig,
  DailyHotelRoomConfigKey,
  DailyHotelRoomTypeId,
  NewAdFormValues,
} from "../../types";
import { InputBox, SelectBox } from "../../components/NewAdControls";
import { Typography } from "../../../../../shared/ui/Typography";
import { Button } from "../../../../../shared/ui/Button";

const editorSelectFields: Record<
  Exclude<DailyHotelRoomConfigKey, "id" | "label" | "normalPrice" | "weekendPrice" | "specialPrice">,
  { title: string; placeholder: string; options: string[] }
> = {
  guestCount: {
    title: "ظرفیت استاندارد",
    placeholder: "ظرفیت استاندارد *",
    options: dailyHotelRoomCapacityOptions,
  },
  extraGuestCount: {
    title: "ظرفیت اضافه",
    placeholder: "ظرفیت اضافه *",
    options: dailyHotelRoomCapacityOptions,
  },
  mealPlan: {
    title: "وعده غذایی",
    placeholder: "وعده غذایی *",
    options: dailyHotelMealPlanOptions,
  },
};

type RoomSelectSheet = {
  field: keyof typeof editorSelectFields;
  title: string;
  options: string[];
};

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getEmptyRoomConfig(id: DailyHotelRoomTypeId): DailyHotelRoomConfig {
  const room = dailyHotelRoomTypes.find((item) => item.id === id);

  return {
    id,
    label: room?.label ?? "",
    guestCount: "",
    extraGuestCount: "",
    mealPlan: "",
    normalPrice: "",
    weekendPrice: "",
    specialPrice: "",
  };
}

function normalizeRoomConfig(room: DailyHotelRoomConfig): DailyHotelRoomConfig {
  return {
    ...getEmptyRoomConfig(room.id),
    ...room,
  };
}

function hasConfiguredRoom(room?: DailyHotelRoomConfig) {
  if (!room) return false;

  return [
    room.guestCount,
    room.extraGuestCount,
    room.mealPlan,
    room.normalPrice,
    room.weekendPrice,
    room.specialPrice,
  ].some((value) => value.trim().length > 0);
}

function formatNumber(value: string) {
  const normalized = value.replace(/,/g, "");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || !normalized) return value;

  return new Intl.NumberFormat("fa-IR").format(parsed);
}

function moneySupportingText(value: string) {
  const number = Number(value.replace(/,/g, ""));

  return Number.isFinite(number) && number > 0
    ? `${formatBigNumber(number)} تومان`
    : "";
}

function buildRoomSummary(room: DailyHotelRoomConfig) {
  const summary: string[] = [];

  if (room.guestCount) summary.push(`${room.guestCount} نفر`);
  if (room.extraGuestCount) summary.push(`${room.extraGuestCount} نفر اضافه`);
  if (room.mealPlan) summary.push(room.mealPlan);
  if (room.normalPrice) summary.push(`روز عادی: ${formatNumber(room.normalPrice)} تومان`);
  if (room.weekendPrice) summary.push(`آخر هفته: ${formatNumber(room.weekendPrice)} تومان`);
  if (room.specialPrice) summary.push(`روزهای خاص: ${formatNumber(room.specialPrice)} تومان`);

  return summary;
}

function RoomEditorHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header className="shrink-0 border-b border-[#f0f0f0] bg-[#f0f0f0] pt-2 [direction:rtl]">
      <div className="flex h-20 items-center gap-2 px-4">
        <Button unstyled
          aria-label="بازگشت"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
          onClick={onBack}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 7l5 5-5 5M20 12H4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </Button>

        <Typography as="h2" variant="title" size="large" weight="semibold" className="m-0 min-w-0 flex-1 truncate text-right text-xl font-semibold leading-7 text-[#1a1a1a]">
          {title}
        </Typography>
      </div>
    </header>
  );
}

export function DailyHotelRoomsSection() {
  const { setValue, control } = useFormContext<NewAdFormValues>();
  const watchedRooms = useWatch({ control, name: "dailyHotelRooms" }) ?? [];
  const [editingRoomId, setEditingRoomId] = useState<DailyHotelRoomTypeId | null>(null);
  const [draftRoom, setDraftRoom] = useState<DailyHotelRoomConfig | null>(null);
  const [sheet, setSheet] = useState<RoomSelectSheet | null>(null);

  const rooms = useMemo(
    () =>
      dailyHotelRoomTypes.map((roomType) => {
        const current = watchedRooms.find((item) => item.id === roomType.id);
        return current ? normalizeRoomConfig(current) : getEmptyRoomConfig(roomType.id);
      }),
    [watchedRooms],
  );

  const openEditor = (roomId: DailyHotelRoomTypeId) => {
    const current = rooms.find((item) => item.id === roomId) ?? getEmptyRoomConfig(roomId);
    setDraftRoom({ ...current });
    setEditingRoomId(roomId);
  };

  const closeEditor = () => {
    setEditingRoomId(null);
    setDraftRoom(null);
    setSheet(null);
  };

  const saveRoom = () => {
    if (!draftRoom) return;

    const nextRooms = rooms.map((room) => (room.id === draftRoom.id ? normalizeRoomConfig(draftRoom) : room));
    setValue("dailyHotelRooms", nextRooms, {
      shouldDirty: true,
      shouldValidate: true,
    });
    closeEditor();
  };

  const resetRoom = (roomId: DailyHotelRoomTypeId) => {
    const nextRooms = rooms.map((room) => (room.id === roomId ? getEmptyRoomConfig(roomId) : room));
    setValue("dailyHotelRooms", nextRooms, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const selectedRoom = editingRoomId
    ? dailyHotelRoomTypes.find((room) => room.id === editingRoomId)
    : null;

  return (
    <>
      <div className="space-y-1 pt-1">
        {rooms.map((room) => {
          const configured = hasConfiguredRoom(room);
          const summary = buildRoomSummary(room);

          return (
            <div className="border-b border-[#e0e0e0] py-4 last:border-b-0" key={room.id}>
              <div className="flex items-center justify-between gap-3">
                <Button unstyled
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
                  onClick={() => openEditor(room.id)}
                  type="button"
                >
                  {configured ? <EditIcon /> : <ChevronLeftIcon />}
                </Button>

                <Button unstyled
                  className="min-w-0 flex-1 text-right text-base font-semibold leading-7 text-[#1a1a1a]"
                  onClick={() => openEditor(room.id)}
                  type="button"
                >
                  {room.label}
                </Button>
              </div>

              {configured ? (
                <div className="mt-4 flex items-start gap-3">
                  <Button unstyled
                    aria-label={`حذف اطلاعات ${room.label}`}
                    className="mt-1 grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]"
                    onClick={() => resetRoom(room.id)}
                    type="button"
                  >
                    <LinearCancelCircle aria-hidden="true" className="h-6 w-6" />
                  </Button>

                  <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                    {summary.map((item) => (
                      <Typography as="span" variant="label" size="medium" weight="medium"
                        className="flex min-h-9 items-center rounded-[7px] border border-[#cccccc] bg-white px-3 py-1 text-sm font-medium leading-5 text-[#4d4d4d]"
                        key={item}
                      >
                        {item}
                      </Typography>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {editingRoomId && draftRoom && selectedRoom ? (
        <div className="fixed inset-0 z-[70] flex flex-col bg-white" dir="rtl">
          <RoomEditorHeader title={selectedRoom.label} onBack={closeEditor} />

          <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-4 pt-6">
            <div className="space-y-4">
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
                onChange={(value) => setDraftRoom((current) => (current ? { ...current, normalPrice: value } : current))}
                placeholder="قیمت روزهای عادی *"
                supportingText={moneySupportingText(draftRoom.normalPrice)}
                value={draftRoom.normalPrice}
              />

              <InputBox
                formatNumeric
                leftText="تومان"
                numeric
                onChange={(value) => setDraftRoom((current) => (current ? { ...current, weekendPrice: value } : current))}
                placeholder="قیمت آخر هفته *"
                supportingText={moneySupportingText(draftRoom.weekendPrice)}
                value={draftRoom.weekendPrice}
              />

              <InputBox
                formatNumeric
                leftText="تومان"
                numeric
                onChange={(value) => setDraftRoom((current) => (current ? { ...current, specialPrice: value } : current))}
                placeholder="قیمت روزهای خاص *"
                supportingText={moneySupportingText(draftRoom.specialPrice)}
                value={draftRoom.specialPrice}
              />
            </div>
          </main>

          <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-4px_16px_0_rgba(26,26,26,0.08)] [direction:ltr]">
            <Button unstyled
              className="h-12 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white"
              onClick={saveRoom}
              type="button"
            >
              ثبت
            </Button>

            <Button unstyled
              className="h-12 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
              onClick={closeEditor}
              type="button"
            >
              انصراف
            </Button>
          </footer>

          <BottomSheet
            ariaLabel={sheet?.title ?? "انتخاب"}
            className="rounded-t-[14px]"
            contentClassName="pt-0 pb-6"
            handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
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
            zIndexClassName="z-[60]"
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
      ) : null}
    </>
  );
}
