import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedExchangeBlock,
} from "./rentalChoiceBlocks";
import {
  asChipItems,
  approvedFacadeMaterialBlock,
  approvedFloorMaterialBlock,
  approvedCabinetMaterialBlock,
  approvedRenovatedBlock,
  approvedFurnishedBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import {
  roomOptions,
  saleOfficeHeatingItems,
  saleOfficeFacilityItems,
} from "../../advertisements/create/data";
import { approvedSaleFilterAgeOptions } from "./saleResidentialOptions";
import { approvedSaleOfficeSuitableOptions } from "./businessSuitableOptions";
import {
  approvedOfficeCurrentStatusOptions,
  approvedOfficePositionOptions,
  approvedOfficeDocumentOptions,
} from "./businessOptions";

export function getApprovedSaleOfficeFilterBlocks(): FilterBlock[] {
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
      options: asChipItems(approvedSaleOfficeSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 5,
      moreLabel: "مشاهده ۱۰ مورد دیگر",
      moreIcon: "down",
    },
    {
      icon: "settings",
      id: "currentStatus",
      kind: "single",
      options: approvedOfficeCurrentStatusOptions,
      title: "وضعیت فعلی",
    },
    {
      icon: "location",
      id: "officePosition",
      kind: "single",
      options: approvedOfficePositionOptions,
      title: "موقعیت اداری",
    },
    {
      icon: "agreement",
      id: "officeDocumentType",
      kind: "single",
      options: approvedOfficeDocumentOptions,
      title: "سند اداری",
    },
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    { id: "managementRoom", kind: "toggle", title: "اتاق مدیریت" },
    { id: "conferenceRoom", kind: "toggle", title: "اتاق کنفرانس" },
    { id: "receptionHall", kind: "toggle", title: "سالن پذیرش" },
    { id: "signboard", kind: "toggle", title: "تابلو خور" },
    { id: "kitchen", kind: "toggle", title: "آشپزخانه" },
    { id: "separateEntrance", kind: "toggle", title: "ورودی مجزا" },
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedHeatingBlock(saleOfficeHeatingItems),
    approvedFacilitiesBlock(saleOfficeFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
