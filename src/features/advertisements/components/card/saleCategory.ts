import type { AdCategoryType } from "./types";
import type { CategoryInput } from "./category";

export function resolveSaleCategory({ formCode, category, title }: CategoryInput): AdCategoryType | undefined {
  if (
    formCode.includes("hotel") ||
    category.includes("hotel") ||
    category.includes("هتل") ||
    category.includes("اقامتگاه") ||
    title.includes("هتل") ||
    title.includes("اقامتگاه")
  ) {
    return "sale-hotel";
  }

  if (
    formCode.includes("commercial") ||
    category.includes("commercial") ||
    category.includes("تجاری") ||
    category.includes("مغازه") ||
    title.includes("تجاری") ||
    title.includes("مغازه")
  ) {
    return "sale-commercial";
  }

  if (
    formCode.includes("factory") ||
    formCode.includes("warehouse") ||
    category.includes("factory") ||
    category.includes("warehouse") ||
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
    return "sale-factory";
  }

  if (
    formCode.includes("land") ||
    category.includes("land") ||
    category.includes("زمین") ||
    category.includes("کلنگی") ||
    title.includes("زمین") ||
    title.includes("کلنگی")
  ) {
    return "sale-land";
  }

  if (
    formCode.includes("office") ||
    category.includes("office") ||
    category.includes("اداری") ||
    category.includes("دفتر") ||
    title.includes("اداری") ||
    title.includes("دفتر")
  ) {
    return "sale-office";
  }

  if (
    formCode.includes("garden") ||
    formCode.includes("villa") ||
    category.includes("garden") ||
    category.includes("villa") ||
    category.includes("ویلا") ||
    category.includes("باغ") ||
    title.includes("ویلا") ||
    title.includes("باغ")
  ) {
    return "sale-garden-villa";
  }

  if (
    formCode.includes("apartment") ||
    category.includes("apartment") ||
    category.includes("آپارتمان") ||
    title.includes("آپارتمان")
  ) {
    return "sale-apartment";
  }

  return undefined;

}
