import type { PropertyPreviewField } from "../previewFieldTypes";
import {
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatRoomDetailValue,
} from "../detailUnits";

export const saleBusinessPreviewFields: Record<string, PropertyPreviewField[]> = {
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
};
