import type { PropertyPreviewField } from "../previewFieldTypes";
import { formatAreaDetailValue, formatRoomDetailValue } from "../detailUnits";

export const dailyPreviewFields: Record<string, PropertyPreviewField[]> = {
  "daily-apartment-suite": [
    {
      labels: ["accommodation_type", "villa_type", "house_type"],
      label: "نوع اقامتگاه",
      icon: "apartment",
    },
    {
      labels: ["area", "meterage", "apartment_area", "unit_area"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "ruler",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
  "daily-garden-villa": [
    {
      labels: ["accommodation_type", "villa_type", "house_type"],
      label: "نوع اقامتگاه",
      icon: "apartment",
    },
    {
      labels: ["area", "meterage", "land_area", "building_area"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "ruler",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
  "daily-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["area", "meterage", "building_area"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "ruler",
    },
    { labels: ["min_stay_days"], label: "حداقل مدت اقامت", icon: "calendar" },
    { labels: ["rental_period"], label: "دوره اجاره", icon: "calendar" },
    { labels: ["check_in_time"], label: "ساعت ورود", icon: "calendar" },
    { labels: ["check_out_time"], label: "ساعت خروج", icon: "calendar" },
    { labels: ["pet_policy", "pets_allowed"], label: "حیوان خانگی", icon: "apartment" },
  ],
  "daily-office-booth": [
    { labels: ["accommodation_type", "space_type"], label: "نوع فضا", icon: "apartment" },
    {
      labels: ["area", "meterage"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "ruler",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    { labels: ["standard_capacity", "capacity"], label: "ظرفیت استاندارد", icon: "profile" },
  ],
};
