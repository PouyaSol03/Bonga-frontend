import { type TransactionType, type CategoryKey, categoryLabels } from "./categories";

export function getApprovedSelectedCategoryLabel(
  transaction: TransactionType,
  category: CategoryKey,
) {
  if (transaction === "sale") {
    if (category === "apartment") return "فروش آپارتمان";
    if (category === "land") return "فروش زمین، ملک کلنگی";
    if (category === "villa-house") return "فروش خانه، ویلا";
    if (category === "office") return "فروش اداری";
    if (category === "commercial-unit") return "فروش تجاری";
    if (category === "factory-workshop") return "فروش صنعتی";
    if (category === "hotel-apartment") return "فروش هتل، اقامتگاه";
  }

  if (transaction === "rent") {
    if (category === "apartment") return "اجاره آپارتمان";
    if (category === "villa-house") return "اجاره خانه، ویلا";
    if (category === "office") return "اجاره اداری";
    if (category === "commercial-unit") return "اجاره تجاری";
    if (category === "factory-workshop") return "اجاره صنعتی";
    if (category === "hotel-apartment") return "اجاره هتل، اقامتگاه";
    if (category === "daily-apartment-suite") return "اجاره روزانه آپارتمان، سوئیت";
    if (category === "daily-garden-villa") return "اجاره روزانه ویلا، باغ";
    if (category === "daily-hotel-apartment") return "اجاره روزانه هتل، اقامتگاه";
    if (category === "daily-workspace") return "اجاره روزانه دفترکار، غرفه";
  }

  if (transaction === "project") {
    if (category === "project-presale") return "پیش فروش، فروش پروژه";
    if (category === "project-partnership") return "مشارکت";
  }

  return categoryLabels[category];
}
