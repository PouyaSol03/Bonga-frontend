import type { PropertyPreviewField } from "./previewFieldTypes";
export type { PropertyPreviewField } from "./previewFieldTypes";
import { saleResidentialPreviewFields } from "./preview/saleResidential";
import { saleBusinessPreviewFields } from "./preview/saleBusiness";
import { rentResidentialPreviewFields } from "./preview/rentResidential";
import { rentBusinessPreviewFields } from "./preview/rentBusiness";
import { dailyPreviewFields } from "./preview/daily";
import { projectPreviewFields } from "./preview/project";

export const propertyPreviewFieldsByFormCode: Record<string, PropertyPreviewField[]> = {
  ...saleResidentialPreviewFields,
  ...saleBusinessPreviewFields,
  ...rentResidentialPreviewFields,
  ...rentBusinessPreviewFields,
  ...dailyPreviewFields,
  ...projectPreviewFields,
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
