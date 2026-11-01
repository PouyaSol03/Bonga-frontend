import { formatBigNumber } from "../../../../../shared/lib/MoneyHandler";
import { formatNumber } from "../../../../../shared/lib/numberUtils";
import {
  dailyHotelMealPlanOptions,
  dailyHotelRoomTypes,
  dailyHotelRoomCapacityOptions,
} from "../../data";
import type {
  DailyHotelRoomConfig,
  DailyHotelRoomConfigKey,
  DailyHotelRoomTypeId,
} from "../../types";

export const editorSelectFields: Record<
  Exclude<
    DailyHotelRoomConfigKey,
    "id" | "label" | "normalPrice" | "weekendPrice" | "specialPrice"
  >,
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

export type RoomSelectSheet = {
  field: keyof typeof editorSelectFields;
  title: string;
  options: string[];
};

export function getEmptyRoomConfig(id: DailyHotelRoomTypeId): DailyHotelRoomConfig {
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

export function normalizeRoomConfig(room: DailyHotelRoomConfig): DailyHotelRoomConfig {
  return {
    ...getEmptyRoomConfig(room.id),
    ...room,
  };
}

export function hasConfiguredRoom(room?: DailyHotelRoomConfig) {
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

export function moneySupportingText(value: string) {
  const number = Number(value.replace(/,/g, ""));

  return Number.isFinite(number) && number > 0 ? `${formatBigNumber(number)} تومان` : "";
}

export function buildRoomSummary(room: DailyHotelRoomConfig) {
  const summary: string[] = [];

  if (room.guestCount) summary.push(`${room.guestCount} نفر`);
  if (room.extraGuestCount) summary.push(`${room.extraGuestCount} نفر اضافه`);
  if (room.mealPlan) summary.push(room.mealPlan);
  if (room.normalPrice) summary.push(`روز عادی: ${formatNumber(room.normalPrice)} تومان`);
  if (room.weekendPrice) summary.push(`آخر هفته: ${formatNumber(room.weekendPrice)} تومان`);
  if (room.specialPrice) summary.push(`روزهای خاص: ${formatNumber(room.specialPrice)} تومان`);

  return summary;
}
