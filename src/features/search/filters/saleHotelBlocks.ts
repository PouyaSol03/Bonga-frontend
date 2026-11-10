import { type FilterBlock } from "./filterTypes";
import { approvedHotelAccommodationOptions, approvedHotelStarOptions } from "./businessOptions";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedSaleFilterDocumentTypeOptions,
  approvedSaleFilterLandPositionOptions,
  approvedSaleFilterAgeOptions,
} from "./saleResidentialOptions";
import {
  asChipItems,
  approvedRenovatedBlock,
  approvedFurnishedBlock,
  approvedFloorMaterialBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import { approvedTotalFloorsBlock, approvedExchangeBlock } from "./rentalChoiceBlocks";
import { saleHotelHeatingItems, saleHotelFacilityItems } from "../../advertisements/create/data";

export function getApprovedSaleHotelFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    {
      icon: "building",
      id: "accommodationType",
      kind: "single",
      options: approvedHotelAccommodationOptions,
      title: "نوع اقامتگاه",
    },
    {
      icon: "star",
      id: "hotelStars",
      kind: "single",
      options: approvedHotelStarOptions,
      title: "رتبه اقامتگاه",
    },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedSaleFilterDocumentTypeOptions,
      title: "سند",
    },
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
    approvedTotalFloorsBlock("تعداد طبقات"),
    createRangeBlock("singleRoomCount", "اتاق ۱ تخته", "number", "اتاق", true),
    createRangeBlock("doubleRoomCount", "اتاق ۲ تخته", "number", "اتاق", true),
    createRangeBlock("suiteCount", "سوییت", "number", "سوییت", true),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedFloorMaterialBlock(),
    approvedHeatingBlock(saleHotelHeatingItems),
    approvedFacilitiesBlock(saleHotelFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
