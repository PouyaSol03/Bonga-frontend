import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedSaleFilterDocumentTypeOptions,
  approvedSaleFilterLandUseOptions,
  approvedSaleFilterLandPositionOptions,
  approvedSaleFilterSuitableForOptions,
} from "./saleResidentialOptions";
import { asChipItems, approvedFacilitiesBlock } from "./amenityBlocks";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
import { saleLandFacilityItems } from "../../advertisements/create/data";
import { approvedExchangeBlock } from "./rentalChoiceBlocks";

export function getApprovedSaleLandFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedSaleFilterDocumentTypeOptions,
      title: "سند",
      more: false,
    },
    {
      icon: "settings",
      id: "usageType",
      kind: "multi",
      options: asChipItems(approvedSaleFilterLandUseOptions),
      title: "نوع کاربری",
      more: true,
      moreLimit: 10,
      moreLabel: `مشاهده ${toPersianDigits(Math.max(approvedSaleFilterLandUseOptions.length - 10, 0))} مورد دیگر`,
      moreIcon: "left",
    },
    {
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedSaleFilterLandPositionOptions,
      title: "موقعیت زمین",
      more: false,
    },
    {
      icon: "building",
      id: "density",
      kind: "single",
      options: ["کم", "متوسط", "زیاد"],
      title: "تراکم زمین",
      more: false,
    },
    {
      icon: "suitable",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedSaleFilterSuitableForOptions),
      title: "مناسب برای",
    },
    createRangeBlock("landWidth", "عرض زمین", "number", "متر", true),
    createRangeBlock("streetWidth", "عرض گذر", "number", "متر", true),
    { id: "constructionPermit", kind: "toggle", title: "مجوز ساخت" },
    approvedFacilitiesBlock(saleLandFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
