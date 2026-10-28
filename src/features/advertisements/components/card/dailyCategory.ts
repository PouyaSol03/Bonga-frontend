import type { AdCategoryType } from "./types";
import type { CategoryInput } from "./category";

export function resolveDailyCategory({ formCode, category, title }: CategoryInput): AdCategoryType {
  if (
    formCode.includes("hotel") ||
    category.includes("هتل") ||
    category.includes("اقامتگاه") ||
    title.includes("هتل") ||
    title.includes("اقامتگاه")
  ) {
    return "daily-hotel";
  }

  if (
    formCode.includes("garden") ||
    formCode.includes("villa") ||
    category.includes("ویلا") ||
    category.includes("باغ") ||
    title.includes("ویلا") ||
    title.includes("باغ")
  ) {
    return "daily-garden-villa";
  }

  if (
    formCode.includes("office") ||
    formCode.includes("booth") ||
    formCode.includes("workspace") ||
    category.includes("دفتر") ||
    category.includes("غرفه") ||
    category.includes("اتاق کار") ||
    category.includes("فضای کار") ||
    title.includes("دفتر") ||
    title.includes("غرفه") ||
    title.includes("اتاق کار") ||
    title.includes("فضای کار")
  ) {
    return "daily-office-booth";
  }

  return "daily-apartment-suite";
}
