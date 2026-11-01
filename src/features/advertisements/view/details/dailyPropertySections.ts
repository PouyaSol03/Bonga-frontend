import type { AdvertisementItem } from "../../api/advertisement.service";
import type { IconName } from "../viewAdTypes";
import { formatDetailPrice as formatPrice } from "../../../../shared/lib/MoneyHandler";
import { toText, type DetailInfoItem, type DetailInfoSection } from "./detailCore";
import { createCheckBadge, createGridItem, filterDetailSections } from "./detailRows";
import { formatAreaDetailValue, formatRoomDetailValue, formatTomanDetailValue } from "./detailUnits";
import { getFirstExistingFeatureValue, isFilledValue } from "./featureValues";
import { parseHotelStarCount } from "./advertiserAndPricing";

export function buildDailyPropertyDetailSections(
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (!formCode.startsWith("daily-")) return null;

  const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
  const hasHotelStars = isFilledValue(hotelStarsRaw);
  const starCount = parseHotelStarCount(hotelStarsRaw);

  if (formCode === "daily-hotel") {
    const rawRooms = getFirstExistingFeatureValue(features, ["daily_hotel_rooms"]);
    let roomItems: DetailInfoItem[] = [];
    if (Array.isArray(rawRooms)) {
      roomItems = rawRooms.flatMap((room: unknown) => {
        if (!room || typeof room !== "object") return [];
        const r = room as Record<string, unknown>;
        const label = toText(r.label ?? r.room_label ?? r.room_type, "اتاق");
        const details = [
          isFilledValue(r.guest_count) ? `ظرفیت: ${toText(r.guest_count)} نفر` : "",
          isFilledValue(r.extra_guest_count)
            ? `نفر اضافه: ${toText(r.extra_guest_count)}`
            : "",
          isFilledValue(r.meal_plan) ? `پذیرایی: ${toText(r.meal_plan)}` : "",
          isFilledValue(r.normal_price) ? `عادی: ${formatPrice(r.normal_price)}` : "",
          isFilledValue(r.weekend_price) ? `آخر هفته: ${formatPrice(r.weekend_price)}` : "",
          isFilledValue(r.special_price) ? `ویژه: ${formatPrice(r.special_price)}` : "",
        ].filter(Boolean);
        return [
          {
            icon: "bed" as IconName,
            label,
            value: details.length ? details.join(" | ") : "-",
          },
        ];
      });
    }

    const hotelSpaceItems = [
      createGridItem({ features, labels: ["rental_period"], label: "دوره اجاره" }),
      createGridItem({ features, labels: ["check_in_time"], label: "ساعت ورود" }),
      createGridItem({ features, labels: ["check_out_time"], label: "ساعت خروج" }),
      createGridItem({
        features,
        labels: ["min_stay_days"],
        label: "حداقل مدت اقامت",
        formatter: (val) => `${toText(val)} روز`,
      }),
      createGridItem({ features, labels: ["pet_policy"], label: "حیوان خانگی" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const hotelSections: DetailInfoSection[] = [
      {
        title: "مشخصات اقامتگاه",
        items: [
          createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
        ].filter((item): item is DetailInfoItem => item !== null),
        layout: "grid",
        columns: 2,
        showIcons: true,
        ratingBanner:
          hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
      },
    ];

    if (roomItems.length) {
      hotelSections.push({
        title: "مشخصات و تعرفه اتاق‌ها",
        items: roomItems,
        layout: "rows",
      });
    }

    if (hotelSpaceItems.length) {
      hotelSections.push({
        title: "شرایط و زمان‌بندی اقامت",
        items: hotelSpaceItems,
        layout: "grid",
        columns: 2,
      });
    }

    return filterDetailSections(hotelSections);
  }

  const mainItems = [
    createGridItem({
      features,
      labels: ["accommodation_type", "villa_type", "house_type", "space_type"],
      label: formCode === "daily-office-booth" ? "نوع فضا" : "نوع اقامتگاه",
    }),
    createGridItem({
      features,
      labels: ["area", "meterage", "apartment_area", "unit_area", "land_area", "building_area"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "ruler",
    }),
    createGridItem({
      features,
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    }),
    createGridItem({
      features,
      labels: ["standard_capacity", "capacity"],
      label: "ظرفیت استاندارد",
      formatter: (val) => `${toText(val)} نفر`,
      icon: "profile",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const spaceItems = [
    createGridItem({
      features,
      labels: ["extra_people_capacity"],
      label: "تعدادنفر اضافه",
      formatter: (val) => `${toText(val)} نفر`,
    }),
    createGridItem({ features, labels: ["space_type"], label: "بافت اقامتگاه" }),
    createGridItem({ features, labels: ["view_type"], label: "چشم انداز" }),
    createGridItem({ features, labels: ["rental_period"], label: "دوره اجاره" }),
    createGridItem({ features, labels: ["check_in_time"], label: "ساعت تحویل" }),
    createGridItem({ features, labels: ["check_out_time"], label: "ساعت تخلیه" }),
    createGridItem({
      features,
      labels: ["min_stay_days"],
      label: "حداقل مدت اقامت",
      formatter: (val) => `${toText(val)} روز`,
    }),
    createGridItem({
      features,
      labels: ["evacuation_guarantee"],
      label: "تضمین تخلیه",
      formatter: formatTomanDetailValue,
    }),
    createGridItem({ features, labels: ["pet_policy"], label: "حیوان خانگی" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const badges = [
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const sections: DetailInfoSection[] = [
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
      ratingBanner:
        hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
    },
  ];

  if (spaceItems.length || badges.length) {
    sections.push({ title: "موقعیت و فضا", items: spaceItems, layout: "grid", columns: 2, badges });
  }

  return filterDetailSections(sections);
}

