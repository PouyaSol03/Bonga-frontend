import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedSaleFilterLandPositionOptions,
  approvedSaleFilterAgeOptions,
} from "./saleResidentialOptions";
import { asChipItems, approvedHeatingBlock, approvedFacilitiesBlock } from "./amenityBlocks";
import {
  roomOptions,
  rentHeatingItems,
  rentFactoryFacilityItems,
} from "../../advertisements/create/data";
import {
  approvedIndustrialPropertyOptions,
  approvedIndustrialAccessOptions,
  approvedBusinessCurrentStatusOptions,
  approvedRentIndustrialLicenseOptions,
} from "./businessOptions";
import { approvedRentConversionBlock } from "./rentalChoiceBlocks";

export function getApprovedRentIndustrialFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
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
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
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
      options: approvedRentIndustrialLicenseOptions,
      title: "مجوز تجاری",
    },
    { id: "readyDeliveryDate", kind: "date", title: "تاریخ تحویل" },
    createRangeBlock("minContractMonths", "حداقل مدت قرارداد", "number", "ماه", true),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentFactoryFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
