import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  asChipItems,
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
  saleVillaHouseHeatingItems,
  saleVillaHouseFacilityItems,
} from "../../advertisements/create/data";
import {
  approvedSaleFilterAgeOptions,
  approvedSaleFilterLandPositionOptions,
  approvedSaleFilterVillaBuildingTypeOptions,
  approvedSaleFilterVillaTypeOptions,
  approvedSaleFilterDocumentTypeOptions,
} from "./saleResidentialOptions";
import { approvedTotalFloorsBlock, approvedExchangeBlock } from "./rentalChoiceBlocks";

export function getApprovedSaleGardenVillaFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    createRangeBlock("buildingArea", "متراژ زیربنا", "area", "متر مربع", true),
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
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedSaleFilterLandPositionOptions,
      title: "موقعیت زمین",
      more: false,
    },
    {
      icon: "typeBuilding",
      id: "buildingType",
      kind: "single",
      options: approvedSaleFilterVillaBuildingTypeOptions,
      title: "نوع بنا",
      more: false,
    },
    {
      icon: "city02",
      id: "villaType",
      kind: "single",
      options: approvedSaleFilterVillaTypeOptions,
      title: "تیپ بنا",
      more: false,
    },
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedSaleFilterDocumentTypeOptions,
      title: "سند",
      more: false,
    },
    approvedTotalFloorsBlock("تعداد طبقات"),
    createRangeBlock("streetWidth", "عرض گذر", "number", "متر", true),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedKitchenTypeBlock(),
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    approvedHeatingBlock(saleVillaHouseHeatingItems),
    approvedFacilitiesBlock(saleVillaHouseFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
