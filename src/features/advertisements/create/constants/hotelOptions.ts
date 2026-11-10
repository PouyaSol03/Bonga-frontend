import type { DailyHotelRoomConfig, DailyHotelRoomTypeId } from "../types";

export const dailyHotelRoomTypes: {
  id: DailyHotelRoomTypeId;
  label: string;
}[] = [
  { id: "single", label: "اتاق یک تخته" },
  { id: "double", label: "اتاق دو تخته" },
  { id: "triple", label: "اتاق سه تخته" },
  { id: "quad", label: "اتاق چهار تخته" },
  { id: "quint", label: "اتاق پنج تخته" },
  { id: "suite", label: "سوییت" },
];

export const dailyHotelRoomCapacityOptions = Array.from(
  { length: 20 },
  (_, index) => `${index + 1}`,
);

export const dailyHotelMealPlanOptions = [
  "بدون وعده غذایی",
  "صبحانه",
  "ناهار",
  "شام",
  "صبحانه، ناهار",
  "صبحانه، شام",
  "ناهار، شام",
  "صبحانه، ناهار، شام",
];

export function createDefaultDailyHotelRooms(): DailyHotelRoomConfig[] {
  return dailyHotelRoomTypes.map((room) => ({
    id: room.id,
    label: room.label,
    guestCount: "",
    extraGuestCount: "",
    mealPlan: "",
    normalPrice: "",
    weekendPrice: "",
    specialPrice: "",
  }));
}