import type { IconName } from "../viewAdTypes";
import {
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatMeterDetailValue,
  formatPercentDetailValue,
  formatRoomDetailValue,
} from "./detailFormatters";

export type PropertyPreviewField = {
  icon?: IconName;
  label: string;
  labels: string[];
  formatter?: (value: unknown) => string;
};

export const propertyPreviewFieldsByFormCode: Record<string, PropertyPreviewField[]> = {
  "sale-apartment": [
    {
      labels: ["area", "meterage", "apartment_area", "unit_area"],
      label: "متراژ آپارتمان",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["floor", "unit_floor", "apartment_floor"],
      label: "طبقه آپارتمان",
      formatter: formatFloorDetailValue,
      icon: "floor",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "sale-villa-house": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "year" },
  ],
  "sale-garden-villa": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    { labels: ["building_area"], label: "زیربنا", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["rooms"], label: "تعداد اتاق ها", formatter: formatRoomDetailValue, icon: "bed" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "year" },
  ],
  "sale-land": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "agreement" },
    {
      labels: ["land_width"],
      label: "عرض زمین",
      formatter: formatMeterDetailValue,
      icon: "houseDimensions",
    },
    {
      labels: ["street_width"],
      label: "عرض گذر",
      formatter: formatMeterDetailValue,
      icon: "ruler",
    },
  ],
  "sale-office": [
    {
      labels: ["area", "meterage"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_age", "age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["floor", "unit_floor"],
      label: "طبقه",
      formatter: formatFloorDetailValue,
      icon: "floor",
    },
  ],
  "sale-commercial": [
    {
      labels: ["area", "meterage"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "agreement" },
    { labels: ["commercial_position"], label: "موقعیت تجاری", icon: "navigation" },
    { labels: ["ownership_status"], label: "وضعیت مالکیت", icon: "agreement" },
  ],
  "sale-warehouse": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["land_position", "ground_position", "plot_position"],
      label: "موقعیت زمین",
      icon: "navigation",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "agreement" },
  ],
  "sale-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["document_type", "document", "deed_type"], label: "نوع سند", icon: "agreement" },
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
  ],
  "sale-factory": [
    { labels: ["land_area"], label: "متراژ زمین", formatter: formatAreaDetailValue, icon: "area" },
    { labels: ["land_position"], label: "موقعیت زمین", icon: "navigation" },
    { labels: ["building_age"], label: "سال ساخت", formatter: formatAgeDetailValue, icon: "year" },
    { labels: ["document_type"], label: "سند", icon: "agreement" },
  ],
  "rent-apartment": [
    {
      labels: ["area", "meterage", "apartment_area", "unit_area"],
      label: "متراژ آپارتمان",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["floor", "unit_floor", "apartment_floor"],
      label: "طبقه آپارتمان",
      formatter: formatFloorDetailValue,
      icon: "floor",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "rent-villa-house": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "rent-garden-villa": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "rent-office": [
    {
      labels: ["area", "meterage"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["floor", "unit_floor"],
      label: "طبقه",
      formatter: formatFloorDetailValue,
      icon: "floor",
    },
    {
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "rent-commercial": [
    {
      labels: ["area", "meterage"],
      label: "متراژ",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    { labels: ["commercial_position"], label: "موقعیت تجاری", icon: "navigation" },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
    {
      labels: ["floor", "unit_floor"],
      label: "طبقه",
      formatter: formatFloorDetailValue,
      icon: "floor",
    },
  ],
  "rent-warehouse": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["land_position", "ground_position", "plot_position"],
      label: "موقعیت زمین",
      icon: "navigation",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
  "rent-hotel": [
    { labels: ["accommodation_type"], label: "نوع اقامتگاه", icon: "apartment" },
    { labels: ["document_type", "document", "deed_type"], label: "نوع سند", icon: "agreement" },
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
  ],
  "rent-factory-workshop": [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["building_area"],
      label: "متراژ بنا",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["land_position", "ground_position", "plot_position"],
      label: "موقعیت زمین",
      icon: "navigation",
    },
    {
      labels: ["building_age", "age", "construction_age"],
      label: "سال ساخت",
      formatter: formatAgeDetailValue,
      icon: "year",
    },
  ],
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
  "presale-special": [
    { labels: ["project_type"], label: "نوع پروژه", icon: "construction" },
    { labels: ["document_type", "document", "deed_type"], label: "سند", icon: "agreement" },
    { labels: ["project_total_floors", "total_floors"], label: "تعداد کل طبقات", icon: "floor" },
    { labels: ["project_total_units", "total_units"], label: "تعداد کل واحدها", icon: "bed" },
  ],
  partnership: [
    {
      labels: ["land_area", "area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    },
    {
      labels: ["builder_share", "builder_share_percent"],
      label: "درصد مشارکت",
      formatter: formatPercentDetailValue,
      icon: "agreement",
    },
    { labels: ["land_position"], label: "موقعیت ورودی", icon: "navigation" },
    { labels: ["partnership_type", "participation_type"], label: "نوع مشارکت", icon: "apartment" },
    { labels: ["current_status"], label: "وضعیت فعلی ملک", icon: "apartment" },
    { labels: ["build_permit", "construction_license"], label: "مجوز ساخت", icon: "agreement" },
    { labels: ["document_type"], label: "نوع سند", icon: "agreement" },
    {
      labels: ["land_width"],
      label: "عرض زمین",
      formatter: formatMeterDetailValue,
      icon: "houseDimensions",
    },
    {
      labels: ["street_width"],
      label: "عرض گذر",
      formatter: formatMeterDetailValue,
      icon: "ruler",
    },
  ],
};

const propertyPreviewTitleByFormCode: Record<string, string> = {
  "sale-apartment": "اطلاعات آپارتمان",
  "sale-villa-house": "اطلاعات بنا",
  "sale-garden-villa": "اطلاعات بنا",
  "sale-land": "اطلاعات زمین",
  "sale-office": "اطلاعات واحد اداری",
  "sale-commercial": "اطلاعات واحد تجاری",
  "sale-factory": "اطلاعات واحد صنعتی",
  "sale-warehouse": "اطلاعات واحد صنعتی",
  "sale-hotel": "اطلاعات هتل، اقامتگاه",
  "rent-apartment": "اطلاعات آپارتمان",
  "rent-villa-house": "اطلاعات خانه، ویلا",
  "rent-garden-villa": "اطلاعات خانه، ویلا",
  "rent-office": "اطلاعات واحد اداری",
  "rent-commercial": "اطلاعات واحد تجاری",
  "rent-factory-workshop": "اطلاعات واحد صنعتی",
  "rent-warehouse": "اطلاعات واحد صنعتی",
  "rent-hotel": "اطلاعات هتل، اقامتگاه",
  "daily-apartment-suite": "اطلاعات آگهی",
  "daily-garden-villa": "اطلاعات آگهی",
  "daily-hotel": "اطلاعات هتل، اقامتگاه",
  "daily-office-booth": "اطلاعات آگهی",
  "presale-special": "اطلاعات پروژه",
  partnership: "اطلاعات مشارکت",
};

export function getPropertyPreviewTitle(formCode: string) {
  return propertyPreviewTitleByFormCode[formCode] ?? "اطلاعات ملک";
}

