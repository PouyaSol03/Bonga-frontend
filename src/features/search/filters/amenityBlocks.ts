import { type ChipItem } from "../../advertisements/create/types";
import { type MultiChoiceBlock, type ToggleBlock, type SingleChoiceBlock } from "./filterTypes";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
import { moreFeatureOptions } from "../../advertisements/create/data";

export function asChipItems(options: readonly string[]): ChipItem[] {
  return options.map((label) => ({ id: label, label }));
}

export function approvedHeatingBlock(items: readonly ChipItem[]): MultiChoiceBlock {
  const countMore = Math.max(items.length - 6, 0);
  return {
    icon: "temperature",
    id: "heatingCooling",
    kind: "multi",
    options: items,
    title: "سرمایش و گرمایش",
    more: countMore > 0,
    moreLimit: 6,
    moreLabel: countMore > 0 ? `نمایش ${toPersianDigits(countMore)} مورد دیگر` : undefined,
  };
}

export function approvedFacilitiesBlock(items: readonly ChipItem[]): MultiChoiceBlock {
  const countMore = Math.max(items.length - 6, 0);
  return {
    icon: "settings",
    id: "facilities",
    kind: "multi",
    options: items,
    title: "امکانات",
    more: countMore > 0,
    moreLimit: 6,
    moreLabel: countMore > 0 ? `نمایش ${toPersianDigits(countMore)} مورد دیگر` : undefined,
  };
}

export function approvedRenovatedBlock(): ToggleBlock {
  return { id: "renovated", kind: "toggle", title: "بازسازی" };
}

export function approvedFurnishedBlock(): ToggleBlock {
  return { id: "furnished", kind: "toggle", title: "مبله" };
}

export function approvedKitchenTypeBlock(): SingleChoiceBlock {
  return {
    icon: "settings",
    id: "kitchenType",
    kind: "single",
    options: moreFeatureOptions.kitchenType,
    title: "نوع آشپزخانه",
  };
}

export function approvedFacadeMaterialBlock(): SingleChoiceBlock {
  return {
    icon: "building",
    id: "facadeMaterial",
    kind: "single",
    options: moreFeatureOptions.facadeMaterial,
    title: "جنس نما",
  };
}

export function approvedFloorMaterialBlock(): SingleChoiceBlock {
  return {
    icon: "settings",
    id: "floorMaterial",
    kind: "single",
    options: moreFeatureOptions.floorMaterial,
    title: "جنس کف",
  };
}

export function approvedCabinetMaterialBlock(): SingleChoiceBlock {
  return {
    icon: "settings",
    id: "cabinetMaterial",
    kind: "single",
    options: moreFeatureOptions.cabinetMaterial,
    title: "جنس کابینت",
  };
}

export function approvedOccupancyStatusBlock(): SingleChoiceBlock {
  return {
    icon: "settings",
    id: "occupancyStatus",
    kind: "single",
    options: moreFeatureOptions.occupancyStatus,
    title: "وضعیت سکونت",
  };
}

export function approvedPetPolicyBlock(): SingleChoiceBlock {
  return {
    icon: "settings",
    id: "petPolicy",
    kind: "single",
    options: moreFeatureOptions.petPolicy,
    title: "حیوان خانگی",
  };
}
