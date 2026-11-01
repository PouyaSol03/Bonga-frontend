import type { PropertyPreviewField } from "../previewFieldTypes";
import {
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatRoomDetailValue,
} from "../detailUnits";

export const rentBusinessPreviewFields: Record<string, PropertyPreviewField[]> = {
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
};
