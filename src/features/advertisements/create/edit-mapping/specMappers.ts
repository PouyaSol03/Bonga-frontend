import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import { dailyHotelRoomTypes } from "../data";
import type { NewAdFormValues, ProjectDetailItem } from "../types";
import {
  normalizeLookupText,
  numericInputText,
  readArrayValue,
  readFirstValue,
  readText,
  selectText,
} from "./featureReaders";

export function mapProjectDetails(value: unknown): NewAdFormValues["projectDetails"] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index): ProjectDetailItem | null => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const meterage = numericInputText(record.meterage ?? record.area ?? record.min_meterage ?? record.minMeterage);

      return {
        floors: readArrayValue(record.floors ?? record.floor),
        id: readText(record.id) || `project-detail-${index}`,
        maxMeterage: numericInputText(record.max_meterage ?? record.maxMeterage),
        meterage,
        minMeterage: numericInputText(record.min_meterage ?? record.minMeterage),
        positions: readArrayValue(record.positions ?? record.position ?? record.unit_position),
        rooms: readArrayValue(record.rooms),
      };
    })
    .filter((item): item is ProjectDetailItem => item !== null);
}

export function mapDailyHotelRooms(value: unknown): NewAdFormValues["dailyHotelRooms"] {
  const baseRooms = dailyHotelRoomTypes.map((room) => ({
    id: room.id,
    label: room.label,
    guestCount: "",
    extraGuestCount: "",
    mealPlan: "",
    normalPrice: "",
    weekendPrice: "",
    specialPrice: "",
  }));

  if (!Array.isArray(value)) return baseRooms;

  return baseRooms.map((room) => {
    const apiRoom = value.find((item) => {
      if (!item || typeof item !== "object") return false;

      const record = item as Record<string, unknown>;
      const roomType = normalizeLookupText(record.room_type ?? record.id ?? record.label ?? record.room_label);

      return roomType === normalizeLookupText(room.id) || roomType === normalizeLookupText(room.label);
    });

    if (!apiRoom || typeof apiRoom !== "object") return room;

    const record = apiRoom as Record<string, unknown>;

    return {
      ...room,
      extraGuestCount: selectText(record.extra_guest_count ?? record.extraGuestCount),
      guestCount: selectText(record.guest_count ?? record.guestCount ?? record.capacity),
      mealPlan: readText(record.meal_plan ?? record.mealPlan),
      normalPrice: numericInputText(record.normal_price ?? record.normalPrice ?? record.price),
      specialPrice: numericInputText(record.special_price ?? record.specialPrice),
      weekendPrice: numericInputText(record.weekend_price ?? record.weekendPrice),
    };
  });
}

export function readFormCode(ad: AdvertisementItem, features: AdvertisementFeature[]) {
  return normalizeLookupText(readFirstValue(ad, features, ["form_code"], ["form_code", "formCode"]));
}
