import { type FilterBlock } from "./filterTypes";
import { approvedHotelAccommodationOptions, approvedHotelStarOptions } from "./businessOptions";
import { createRangeBlock } from "./fieldBlocks";
import {
  asChipItems,
  approvedRenovatedBlock,
  approvedFurnishedBlock,
  approvedFloorMaterialBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import {
  approvedSaleFilterAgeOptions,
  approvedSaleFilterLandPositionOptions,
} from "./saleResidentialOptions";
import { approvedTotalFloorsBlock, approvedRentConversionBlock } from "./rentalChoiceBlocks";
import { rentHeatingItems, rentHotelFacilityItems } from "../../advertisements/create/data";

export function getApprovedRentHotelFilterBlocks(): FilterBlock[] {
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
      icon: "year",
      id: "age",
      kind: "multi",
      options: asChipItems(approvedSaleFilterAgeOptions),
      title: "سن ساخت",
    },
    {
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedSaleFilterLandPositionOptions,
      title: "موقعیت زمین",
    },
    approvedTotalFloorsBlock("تعداد طبقات"),
    createRangeBlock("singleRoomCount", "اتاق ۱ تخته", "number", "اتاق", true),
    createRangeBlock("doubleRoomCount", "اتاق ۲ تخته", "number", "اتاق", true),
    createRangeBlock("suiteCount", "سوییت", "number", "سوییت", true),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedFloorMaterialBlock(),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentHotelFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
