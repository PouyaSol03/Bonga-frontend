import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedSaleFilterLandPositionOptions,
  approvedSaleFilterAgeOptions,
  approvedSaleFilterDocumentTypeOptions,
} from "./saleResidentialOptions";
import { asChipItems, approvedHeatingBlock, approvedFacilitiesBlock } from "./amenityBlocks";
import {
  roomOptions,
  saleFactoryHeatingItems,
  saleFactoryFacilityItems,
} from "../../advertisements/create/data";
import {
  approvedIndustrialPropertyOptions,
  approvedIndustrialAccessOptions,
  approvedBusinessCurrentStatusOptions,
  approvedCommercialLicenseOptions,
} from "./businessOptions";
import { approvedExchangeBlock } from "./rentalChoiceBlocks";

export function getApprovedSaleIndustrialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    {
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedSaleFilterLandPositionOptions,
      title: "موقعیت زمین",
    },
    {
      icon: "year",
      id: "age",
      kind: "multi",
      options: asChipItems(approvedSaleFilterAgeOptions),
      title: "سن ساخت",
    },
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedSaleFilterDocumentTypeOptions,
      title: "سند",
    },
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("ceilingHeight", "ارتفاع سقف", "number", "متر", true),
    {
      icon: "building",
      id: "industrialPropertyType",
      kind: "single",
      options: approvedIndustrialPropertyOptions,
      title: "نوع ملک",
    },
    {
      icon: "location",
      id: "accessType",
      kind: "single",
      options: approvedIndustrialAccessOptions,
      title: "دسترسی",
    },
    {
      icon: "settings",
      id: "currentStatus",
      kind: "single",
      options: approvedBusinessCurrentStatusOptions,
      title: "وضعیت فعلی",
    },
    {
      icon: "agreement",
      id: "commercialLicense",
      kind: "single",
      options: approvedCommercialLicenseOptions,
      title: "مجوز تجاری",
    },
    approvedHeatingBlock(saleFactoryHeatingItems),
    approvedFacilitiesBlock(saleFactoryFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
