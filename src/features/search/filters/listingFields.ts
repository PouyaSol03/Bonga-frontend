import { type TransactionType, type CategoryKey } from "./categories";
import { type BasicPropertyField, type MoreFeatureField } from "../../advertisements/create/types";
import {
  participationTypeOptions,
  partnershipCurrentStatusOptions,
  saleLandPositionOptions,
  basicPropertyFieldsByListingType,
  defaultBasicPropertyFields,
  moreFeatureFieldsByListingType,
  moreFeatureFieldsByCategory,
} from "../../advertisements/create/data";

export const removedFilterFieldKeys = new Set<string>();

export function getListingKey(transaction: TransactionType, category: CategoryKey) {
  return `${transaction}:${category}`;
}

export function getBasicFields(
  transaction: TransactionType,
  category: CategoryKey,
): BasicPropertyField[] {
  if (category === "project-partnership") {
    return [
      {
        key: "participationType",
        label: "نوع مشارکت",
        control: "select",
        options: participationTypeOptions,
        required: true,
      },
      {
        key: "currentStatus",
        label: "وضعیت فعلی ملک",
        control: "select",
        options: partnershipCurrentStatusOptions,
        required: true,
      },
      {
        key: "landArea",
        label: "متراژ زمین",
        control: "input",
        numeric: true,
        leftText: "متر مربع",
        required: true,
      },
      {
        key: "landPosition",
        label: "موقعیت زمین",
        control: "select",
        options: saleLandPositionOptions,
        required: true,
      },
    ];
  }

  if (category === "project-presale") {
    return [];
  }

  return (
    basicPropertyFieldsByListingType[getListingKey(transaction, category)] ??
    defaultBasicPropertyFields
  );
}

export function getMoreFields(
  transaction: TransactionType,
  category: CategoryKey,
): MoreFeatureField[] {
  return (
    moreFeatureFieldsByListingType[getListingKey(transaction, category)] ??
    moreFeatureFieldsByCategory[category] ??
    []
  ).filter((field) => !removedFilterFieldKeys.has(field.key));
}

export function isDailyRentCategory(category: CategoryKey) {
  return category.startsWith("daily-");
}

export function isProjectCategory(category: CategoryKey) {
  return category.startsWith("project-");
}
