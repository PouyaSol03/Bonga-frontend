import type { AdvertisementItem } from "../../api/advertisement.service";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import type {
  ViewAdDailyHotelRoom,
  ViewAdProjectDetailVariant,
} from "../viewAdTypes";
import {
  type AdvertisementFeatureMap,
  toNumber,
  toText,
} from "../viewAdDetails";
import {
  getFirstExistingFeatureValue,
  isFilledValue,
} from "./detailFormatters";

export const defaultDailyHotelRoomsData: ViewAdDailyHotelRoom[] = [
  {
    id: "single",
    label: "اتاق یک تخته",
    guestCount: "۱",
    extraGuestCount: "بدون نفر اضافه",
    mealPlan: "صبحانه",
    normalPrice: "۱/۵ میلیون",
    weekendPrice: "۲/۵ میلیون",
    specialPrice: "۵ میلیون",
  },
  {
    id: "double",
    label: "اتاق دو تخته",
    guestCount: "۲",
    extraGuestCount: "بدون نفر اضافه",
    mealPlan: "صبحانه، ناهار",
    normalPrice: "۲/۵ میلیون",
    weekendPrice: "۳/۵ میلیون",
    specialPrice: "۶ میلیون",
  },
  {
    id: "triple",
    label: "اتاق سه تخته",
    guestCount: "۳",
    extraGuestCount: "۱ نفر اضافه",
    mealPlan: "صبحانه، ناهار",
    normalPrice: "۳/۵ میلیون",
    weekendPrice: "۴/۵ میلیون",
    specialPrice: "۷/۵ میلیون",
  },
  {
    id: "quad",
    label: "اتاق چهار تخته",
    guestCount: "۴",
    extraGuestCount: "۱ نفر اضافه",
    mealPlan: "صبحانه، ناهار",
    normalPrice: "۴/۵ میلیون",
    weekendPrice: "۵/۵ میلیون",
    specialPrice: "۹ میلیون",
  },
  {
    id: "quint",
    label: "اتاق پنج تخته",
    guestCount: "۵",
    extraGuestCount: "۲ نفر اضافه",
    mealPlan: "صبحانه، ناهار، شام",
    normalPrice: "۵/۵ میلیون",
    weekendPrice: "۷ میلیون",
    specialPrice: "۱۱ میلیون",
  },
  {
    id: "suite",
    label: "سوئیت",
    guestCount: "۴",
    extraGuestCount: "۲ نفر اضافه",
    mealPlan: "صبحانه، ناهار، شام",
    normalPrice: "۶/۵ میلیون",
    weekendPrice: "۸/۵ میلیون",
    specialPrice: "۱۳ میلیون",
  },
];

export function parseDailyHotelRooms(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
  featureMap: AdvertisementFeatureMap,
  formCode: string,
): ViewAdDailyHotelRoom[] | undefined {
  if (formCode !== "daily-hotel") {
    return undefined;
  }

  let rawRooms =
    getFirstExistingFeatureValue(features, ["daily_hotel_rooms"]) ??
    featureMap.daily_hotel_rooms ??
    (ad as Record<string, unknown>).daily_hotel_rooms;

  if (typeof rawRooms === "string") {
    try {
      rawRooms = JSON.parse(rawRooms);
    } catch {
      // ignore
    }
  }

  const roomLabelMap: Record<string, string> = {
    single: "اتاق یک تخته",
    double: "اتاق دو تخته",
    triple: "اتاق سه تخته",
    quad: "اتاق چهار تخته",
    quint: "اتاق پنج تخته",
    suite: "سوئیت",
  };

  if (Array.isArray(rawRooms) && rawRooms.length > 0) {
    const parsed = rawRooms
      .map((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return null;
        const r = item as Record<string, unknown>;
        const typeId = toText(r.room_type ?? r.roomType ?? r.id ?? "");
        const label = toText(
          r.room_label ?? r.roomLabel ?? r.label ?? (typeId ? roomLabelMap[typeId] : ""),
          "اتاق",
        );
        const guestCountNum = toNumber(r.guest_count ?? r.guestCount);
        const extraGuestCountNum = toNumber(r.extra_guest_count ?? r.extraGuestCount);
        const mealPlan = toText(r.meal_plan ?? r.mealPlan);
        const normalPriceVal = r.normal_price ?? r.normalPrice;
        const weekendPriceVal = r.weekend_price ?? r.weekendPrice;
        const specialPriceVal = r.special_price ?? r.specialPrice;

        const hasAnyValue =
          guestCountNum !== undefined ||
          extraGuestCountNum !== undefined ||
          Boolean(mealPlan) ||
          normalPriceVal !== undefined ||
          weekendPriceVal !== undefined ||
          specialPriceVal !== undefined;

        if (!hasAnyValue) return null;

        return {
          id: typeId || label,
          label,
          guestCount:
            guestCountNum !== undefined
              ? toPersianDigits(guestCountNum)
              : toText(r.guest_count ?? r.guestCount, "۱"),
          extraGuestCount:
            extraGuestCountNum !== undefined
              ? extraGuestCountNum === 0
                ? "بدون نفر اضافه"
                : `${toPersianDigits(extraGuestCountNum)} نفر اضافه`
              : toText(r.extra_guest_count ?? r.extraGuestCount, "بدون نفر اضافه"),
          mealPlan: mealPlan || "بدون وعده غذایی",
          normalPrice: formatPrice(normalPriceVal),
          weekendPrice: formatPrice(weekendPriceVal),
          specialPrice: formatPrice(specialPriceVal),
        };
      })
      .filter((room): room is ViewAdDailyHotelRoom => room !== null);

    if (parsed.length > 0) {
      return parsed;
    }
  }

  return defaultDailyHotelRoomsData;
}

const defaultProjectDetailsData: ViewAdProjectDetailVariant[] = [
  {
    id: "variant-100",
    meterageTitle: "واحدهای ۱۰۰ متری",
    floors: ["۳", "۵", "۷", "۸", "۱۵"],
    roomLabel: "۱ تا ۳ خواب",
    positions: ["شمالی", "جنوبی", "شرقی"],
  },
  {
    id: "variant-150",
    meterageTitle: "۱۵۰ متری",
    floors: ["۲", "۴", "۶", "۹"],
    roomLabel: "تا ۳ خواب",
    positions: ["جنوبی"],
  },
  {
    id: "variant-180",
    meterageTitle: "۱۸۰ متری",
    floors: ["۱", "۱۰", "۱۲"],
    roomLabel: "تا ۴ خواب",
    positions: ["جنوبی"],
  },
  {
    id: "variant-250",
    meterageTitle: "۲۵۰ متری",
    floors: ["۱۳", "۱۴"],
    roomLabel: "تا ۴ خواب",
    positions: ["شمالی"],
  },
];

export function parseProjectDetails(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
  featureMap: AdvertisementFeatureMap,
  formCode: string,
): ViewAdProjectDetailVariant[] | undefined {
  if (formCode !== "presale-special") {
    return undefined;
  }

  let rawDetails =
    getFirstExistingFeatureValue(features, ["project_details"]) ??
    featureMap.project_details ??
    (ad as Record<string, unknown>).project_details;

  if (typeof rawDetails === "string") {
    try {
      rawDetails = JSON.parse(rawDetails);
    } catch {
      // ignore
    }
  }

  if (Array.isArray(rawDetails) && rawDetails.length > 0) {
    const parsed = rawDetails
      .map((item, index): ViewAdProjectDetailVariant | null => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return null;
        const r = item as Record<string, unknown>;

        const mRaw = r.meterage ?? r.area;
        const minM = r.min_meterage ?? r.minMeterage;
        const maxM = r.max_meterage ?? r.maxMeterage;

        let meterageStr = "";
        if (mRaw) {
          meterageStr = toText(mRaw);
        } else if (minM || maxM) {
          const minT = toText(minM);
          const maxT = toText(maxM);
          meterageStr = minT === maxT || !maxT ? minT : `${minT} الی ${maxT}`;
        }

        if (!meterageStr) meterageStr = toPersianDigits(100);

        const meterageTitle = meterageStr.includes("متری")
          ? `واحدهای ${meterageStr}`
          : `واحدهای ${meterageStr} متری`;

        const floors = Array.isArray(r.floors)
          ? r.floors.map((f) => toPersianDigits(f))
          : Array.isArray(r.floor)
            ? r.floor.map((f) => toPersianDigits(f))
            : isFilledValue(r.floors)
              ? [toPersianDigits(r.floors)]
              : [];

        const rawRooms = Array.isArray(r.rooms) ? r.rooms : r.rooms ? [r.rooms] : [];
        let roomLabel = "";
        if (rawRooms.length > 0) {
          const nums = rawRooms
            .map((rm) => toNumber(rm))
            .filter((n): n is number => n !== undefined);
          if (nums.length > 0) {
            const minR = Math.min(...nums);
            const maxR = Math.max(...nums);
            roomLabel =
              minR === maxR
                ? `${toPersianDigits(minR)} خواب`
                : `${toPersianDigits(minR)} تا ${toPersianDigits(maxR)} خواب`;
          } else {
            const textR = rawRooms
              .map((rm) => toText(rm))
              .filter(Boolean)
              .join("، ");
            roomLabel = textR.includes("خواب") ? textR : `${textR} خواب`;
          }
        }

        const positions = Array.isArray(r.positions)
          ? r.positions.map((p) => toText(p)).filter(Boolean)
          : Array.isArray(r.position)
            ? r.position.map((p) => toText(p)).filter(Boolean)
            : isFilledValue(r.positions ?? r.position)
              ? [toText(r.positions ?? r.position)]
              : [];

        return {
          id: toText(r.id, `project-detail-${index}`),
          meterageTitle,
          floors,
          roomLabel,
          positions,
        };
      })
      .filter((item): item is ViewAdProjectDetailVariant => item !== null);

    if (parsed.length > 0) {
      return parsed;
    }
  }

  return defaultProjectDetailsData;
}

