import type { PropertyPreviewField } from "../previewFieldTypes";
import {
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatRoomDetailValue,
} from "../detailUnits";

export const rentResidentialPreviewFields: Record<string, PropertyPreviewField[]> = {
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
};
