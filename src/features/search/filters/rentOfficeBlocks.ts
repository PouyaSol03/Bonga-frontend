import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedRentConversionBlock,
} from "./rentalChoiceBlocks";
import {
  asChipItems,
  approvedRenovatedBlock,
  approvedFurnishedBlock,
  approvedFacadeMaterialBlock,
  approvedFloorMaterialBlock,
  approvedCabinetMaterialBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import {
  roomOptions,
  rentHeatingItems,
  rentOfficeFacilityItems,
} from "../../advertisements/create/data";
import { approvedSaleFilterAgeOptions } from "./saleResidentialOptions";
import { approvedRentOfficeSuitableOptions } from "./businessSuitableOptions";
import {
  approvedOfficePositionOptions,
  approvedBusinessCurrentStatusOptions,
  approvedOfficeDocumentOptions,
} from "./businessOptions";

export function getApprovedRentOfficeFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    approvedFloorBlock(),
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    {
      icon: "year",
      id: "age",
      kind: "multi",
      options: asChipItems(approvedSaleFilterAgeOptions),
      title: "سن ساخت",
    },
    approvedTotalFloorsBlock("تعداد کل طبقات"),
    {
      icon: "suitable",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedRentOfficeSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 5,
      moreLabel: "مشاهده ۱۵ مورد دیگر",
      moreIcon: "down",
    },
    {
      icon: "orientation",
      id: "officePosition",
      kind: "single",
      options: approvedOfficePositionOptions,
      title: "موقعیت اداری",
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
    {
      icon: "agreement",
      id: "officeDocumentType",
      kind: "single",
      options: approvedOfficeDocumentOptions,
      title: "سند اداری",
    },
    { id: "managementRoom", kind: "toggle", title: "اتاق مدیریت" },
    { id: "conferenceRoom", kind: "toggle", title: "اتاق کنفرانس" },
    { id: "receptionHall", kind: "toggle", title: "سالن پذیرش" },
    { id: "signboard", kind: "toggle", title: "تابلو خور" },
    { id: "kitchen", kind: "toggle", title: "آشپزخانه" },
    { id: "separateEntrance", kind: "toggle", title: "ورودی مجزا" },
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentOfficeFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
