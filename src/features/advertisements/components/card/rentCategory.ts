import type { AdCategoryType } from "./types";
import type { CategoryInput } from "./category";

export function resolveRentCategory({ formCode, category, title }: CategoryInput): AdCategoryType {
  if (
    formCode.includes("hotel") ||
    category.includes("هتل") ||
    category.includes("اقامتگاه") ||
    title.includes("هتل") ||
    title.includes("اقامتگاه")
  ) {
    return "rent-hotel";
  }

  if (
    formCode.includes("office") ||
    category.includes("اداری") ||
    category.includes("دفتر") ||
    title.includes("اداری") ||
    title.includes("دفتر")
  ) {
    return "rent-office";
  }

  if (
    formCode.includes("commercial") ||
    category.includes("تجاری") ||
    category.includes("مغازه") ||
    title.includes("تجاری") ||
    title.includes("مغازه")
  ) {
    return "rent-commercial";
  }

  if (
    formCode.includes("factory") ||
    formCode.includes("warehouse") ||
    category.includes("صنعتی") ||
    category.includes("سوله") ||
    category.includes("کارخانه") ||
    category.includes("کارگاه") ||
    category.includes("انبار") ||
    title.includes("صنعتی") ||
    title.includes("سوله") ||
    title.includes("کارخانه") ||
    title.includes("کارگاه") ||
    title.includes("انبار")
  ) {
    return "rent-factory";
  }

  if (
    formCode.includes("villa") ||
    formCode.includes("house") ||
    formCode.includes("garden") ||
    category.includes("ویلا") ||
    category.includes("باغ") ||
    category.includes("خانه") ||
    title.includes("ویلا") ||
    title.includes("باغ") ||
    title.includes("خانه")
  ) {
    return "rent-villa-house";
  }

  return "rent-apartment";
}
