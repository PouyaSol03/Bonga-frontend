import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedDailyAccommodationOptions,
  approvedDailyHotelAccommodationOptions,
  approvedDailyHotelRankOptions,
  approvedDailyWorkspaceTypeOptions,
} from "./dailyProjectOptions";
import { asChipItems, approvedHeatingBlock, approvedFacilitiesBlock } from "./amenityBlocks";
import {
  roomOptions,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyHotelFacilityItems,
  dailyWorkspaceFacilityItems,
} from "../../advertisements/create/data";
import { approvedDailyCapacityBlock, approvedFloorBlock } from "./rentalChoiceBlocks";

export function getApprovedDailyApartmentFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    {
      icon: "building",
      id: "accommodationType",
      kind: "single",
      options: approvedDailyAccommodationOptions,
      title: "نوع اقامتگاه",
    },
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    approvedDailyCapacityBlock(),
    approvedFloorBlock(),
    approvedHeatingBlock(dailyRentHeatingItems),
    approvedFacilitiesBlock(dailyStayFacilityItems),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

export function getApprovedDailyVillaFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    approvedDailyCapacityBlock(),
    approvedHeatingBlock(dailyRentHeatingItems),
    approvedFacilitiesBlock(dailyStayFacilityItems),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

export function getApprovedDailyHotelFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    {
      icon: "building",
      id: "accommodationType",
      kind: "single",
      options: approvedDailyHotelAccommodationOptions,
      title: "نوع اقامتگاه",
    },
    {
      icon: "star",
      id: "hotelStars",
      kind: "single",
      options: approvedDailyHotelRankOptions,
      title: "رتبه اقامتگاه",
    },
    approvedHeatingBlock(dailyRentHeatingItems),
    approvedFacilitiesBlock(dailyHotelFacilityItems),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

export function getApprovedDailyWorkspaceFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("dailyPrice", "قیمت روزانه", "money", "تومان"),
    {
      icon: "building",
      id: "spaceType",
      kind: "single",
      options: approvedDailyWorkspaceTypeOptions,
      title: "نوع فضا",
    },
    {
      icon: "bed",
      id: "rooms",
      kind: "multi",
      options: asChipItems(roomOptions),
      title: "تعداد اتاق",
    },
    approvedDailyCapacityBlock(),
    approvedFloorBlock(),
    approvedHeatingBlock(dailyRentHeatingItems),
    approvedFacilitiesBlock(dailyWorkspaceFacilityItems),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
