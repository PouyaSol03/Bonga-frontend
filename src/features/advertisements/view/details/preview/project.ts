import type { PropertyPreviewField } from "../previewFieldTypes";
import {
  formatAreaDetailValue,
  formatMeterDetailValue,
  formatPercentDetailValue,
} from "../detailUnits";

export const projectPreviewFields: Record<string, PropertyPreviewField[]> = {
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
