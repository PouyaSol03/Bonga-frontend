import type { PropertyPreviewField } from "../previewFieldTypes";
import {
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatMeterDetailValue,
  formatRoomDetailValue,
} from "../detailUnits";

export const saleResidentialPreviewFields: Record<string, PropertyPreviewField[]> = {
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
};
