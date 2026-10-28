import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedCommercialPositionOptions,
  approvedBusinessCurrentStatusOptions,
} from "./businessOptions";
import {
  asChipItems,
  approvedRenovatedBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import { approvedSaleFilterAgeOptions } from "./saleResidentialOptions";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedRentConversionBlock,
} from "./rentalChoiceBlocks";
import {
  roomOptions,
  moreFeatureOptions,
  rentHeatingItems,
  rentCommercialFacilityItems,
} from "../../advertisements/create/data";
import { approvedRentCommercialSuitableOptions } from "./businessSuitableOptions";

export function getApprovedRentCommercialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    {
      icon: "location",
      id: "commercialPosition",
      kind: "single",
      options: approvedCommercialPositionOptions,
      title: "موقعیت تجاری",
    },
    {
      icon: "year",
      id: "age",
      kind: "multi",
      options: asChipItems(approvedSaleFilterAgeOptions),
      title: "سن ساخت",
    },
    approvedFloorBlock(),
    approvedTotalFloorsBlock("تعداد کل طبقات"),
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    {
      icon: "building",
      id: "openingCount",
      kind: "single",
      options: moreFeatureOptions.openingCount,
      title: "تعداد دهنه",
    },
    createRangeBlock("ceilingHeight", "ارتفاع سقف", "number", "متر", true),
    {
      icon: "settings",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedRentCommercialSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 5,
      moreLabel: "مشاهده ۱۵ مورد دیگر",
      moreIcon: "down",
    },
    {
      icon: "settings",
      id: "currentStatus",
      kind: "single",
      options: approvedBusinessCurrentStatusOptions,
      title: "وضعیت فعلی",
    },
    { id: "readyDeliveryDate", kind: "date", title: "تاریخ تحویل" },
    createRangeBlock("minContractMonths", "حداقل مدت قرارداد", "number", "ماه", true),
    approvedRenovatedBlock(),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentCommercialFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
