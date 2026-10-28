import { type TransactionType, type CategoryKey } from "./categories";
import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import { isDailyRentCategory } from "./listingFields";
import { rentConversionPolicyOptions } from "../../advertisements/create/data";

export function getPriceBlocks(transaction: TransactionType, category: CategoryKey): FilterBlock[] {
  if (category === "project-partnership") {
    return [createRangeBlock("builderSharePercent", "درصد مشارکت / درصد سهم", "percent", "درصد")];
  }

  if (transaction === "project") {
    return [createRangeBlock("projectPrice", "قیمت متری", "money", "تومان")];
  }

  if (transaction === "rent" && isDailyRentCategory(category)) {
    return [createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان")];
  }

  if (transaction === "rent") {
    return [
      createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
      createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
      {
        icon: "exchange",
        id: "rentConversionPolicy",
        kind: "single",
        options: rentConversionPolicyOptions,
        title: "تبدیل رهن و اجاره",
      },
    ];
  }

  return [createRangeBlock("price", "قیمت", "money", "تومان")];
}
