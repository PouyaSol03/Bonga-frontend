import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  asChipItems,
  approvedPetPolicyBlock,
  approvedRenovatedBlock,
  approvedFurnishedBlock,
  approvedKitchenTypeBlock,
  approvedFacadeMaterialBlock,
  approvedFloorMaterialBlock,
  approvedCabinetMaterialBlock,
  approvedHeatingBlock,
  approvedFacilitiesBlock,
} from "./amenityBlocks";
import {
  roomOptions,
  rentHeatingItems,
  rentVillaHouseFacilityItems,
} from "../../advertisements/create/data";
import { approvedSaleFilterAgeOptions } from "./saleResidentialOptions";
import {
  approvedRentVillaSuitableOptions,
  approvedRentVillaLandPositionOptions,
  approvedRentVillaBuildingTypeOptions,
  approvedRentVillaTypeOptions,
} from "./rentResidentialOptions";
import { approvedTotalFloorsBlock, approvedRentConversionBlock } from "./rentalChoiceBlocks";

export function getApprovedRentVillaHouseFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ بنا", "area", "متر مربع", true),
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
    {
      icon: "suitable",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedRentVillaSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 3,
      moreLabel: "مشاهده ۱۰ مورد دیگر",
      moreIcon: "down",
    },
    {
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedRentVillaLandPositionOptions,
      title: "موقعیت زمین",
    },
    {
      icon: "typeBuilding",
      id: "buildingType",
      kind: "single",
      options: approvedRentVillaBuildingTypeOptions,
      title: "نوع بنا",
    },
    {
      icon: "city02",
      id: "villaType",
      kind: "single",
      options: approvedRentVillaTypeOptions,
      title: "تیپ بنا",
    },
    approvedTotalFloorsBlock("تعداد طبقات"),
    createRangeBlock("streetWidth", "عرض گذر", "number", "متر", true),
    approvedPetPolicyBlock(),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedKitchenTypeBlock(),
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentVillaHouseFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
