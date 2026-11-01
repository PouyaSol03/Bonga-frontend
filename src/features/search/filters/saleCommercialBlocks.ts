import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedCommercialPositionOptions,
  approvedCommercialOwnershipOptions,
  approvedCommercialLicenseOptions,
  approvedBusinessCurrentStatusOptions,
} from "./businessOptions";
import {
  approvedSaleFilterDocumentTypeOptions,
  approvedSaleFilterAgeOptions,
} from "./saleResidentialOptions";
import {
  asChipItems,
  approvedRenovatedBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedExchangeBlock,
} from "./rentalChoiceBlocks";
import {
  roomOptions,
  saleCommercialHeatingItems,
  saleCommercialFacilityItems,
} from "../../advertisements/create/data";
import { approvedSaleCommercialSuitableOptions } from "./businessSuitableOptions";

export function getApprovedSaleCommercialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    {
      icon: "orientation",
      id: "commercialPosition",
      kind: "single",
      options: approvedCommercialPositionOptions,
      title: "موقعیت تجاری",
    },
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedSaleFilterDocumentTypeOptions,
      title: "سند",
    },
    {
      icon: "settings",
      id: "ownershipStatus",
      kind: "single",
      options: approvedCommercialOwnershipOptions,
      title: "وضعیت مالکیت",
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
      icon: "suitable",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedSaleCommercialSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 7,
      moreLabel: "مشاهده ۴۶ مورد دیگر",
      moreIcon: "left",
    },
    {
      icon: "agreement",
      id: "commercialLicense",
      kind: "single",
      options: approvedCommercialLicenseOptions,
      title: "مجوز تجاری",
    },
    {
      icon: "settings",
      id: "currentStatus",
      kind: "single",
      options: approvedBusinessCurrentStatusOptions,
      title: "وضعیت فعلی",
    },
    approvedRenovatedBlock(),
    approvedHeatingBlock(saleCommercialHeatingItems),
    approvedFacilitiesBlock(saleCommercialFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
