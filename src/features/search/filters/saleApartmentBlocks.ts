import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedExchangeBlock,
} from "./rentalChoiceBlocks";
import {
  asChipItems,
  approvedOccupancyStatusBlock,
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
  saleApartmentHeatingItems,
  saleApartmentFacilityItems,
} from "../../advertisements/create/data";
import {
  approvedSaleFilterAgeOptions,
  approvedSaleFilterUnitsPerFloorOptions,
  approvedSaleFilterBuildingPositionOptions,
  approvedSaleFilterUnitPositionOptions,
  approvedSaleFilterDocumentTypeOptions,
} from "./saleResidentialOptions";

export function getApprovedSaleApartmentFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ آپارتمان", "area", "متر مربع", true),
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
    approvedTotalFloorsBlock("تعداد طبقات آپارتمان"),
    {
      icon: "floor",
      id: "unitsPerFloor",
      kind: "single",
      options: approvedSaleFilterUnitsPerFloorOptions,
      title: "تعداد واحد در طبقه",
      more: false,
    },
    {
      icon: "orientation",
      id: "unitType",
      kind: "single",
      options: approvedSaleFilterBuildingPositionOptions,
      title: "موقعیت ساختمان",
      more: false,
    },
    {
      icon: "orientation",
      id: "unitPosition",
      kind: "single",
      options: approvedSaleFilterUnitPositionOptions,
      title: "موقعیت واحد",
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
    approvedOccupancyStatusBlock(),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedKitchenTypeBlock(),
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    approvedHeatingBlock(saleApartmentHeatingItems),
    approvedFacilitiesBlock(saleApartmentFacilityItems),
    createRangeBlock("price", "قیمت", "money", "تومان"),
    { kind: "loan" },
    approvedExchangeBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
