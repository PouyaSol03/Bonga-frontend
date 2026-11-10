import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  approvedFloorBlock,
  approvedTotalFloorsBlock,
  approvedRentConversionBlock,
} from "./rentalChoiceBlocks";
import {
  asChipItems,
  approvedOccupancyStatusBlock,
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
  rentApartmentFacilityItems,
} from "../../advertisements/create/data";
import {
  approvedSaleFilterAgeOptions,
  approvedSaleFilterUnitsPerFloorOptions,
  approvedSaleFilterUnitPositionOptions,
} from "./saleResidentialOptions";
import {
  approvedRentApartmentSuitableOptions,
  approvedRentApartmentBuildingPositionOptions,
} from "./rentResidentialOptions";

export function getApprovedRentApartmentFilterBlocks(): FilterBlock[] {
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
    {
      icon: "suitable",
      id: "suitableFor",
      kind: "multi",
      options: asChipItems(approvedRentApartmentSuitableOptions),
      title: "مناسب برای",
      more: true,
      moreLimit: 5,
      moreLabel: "مشاهده ۱۰ مورد دیگر",
      moreIcon: "down",
    },
    approvedTotalFloorsBlock("تعداد طبقات آپارتمان"),
    {
      icon: "floor",
      id: "unitsPerFloor",
      kind: "single",
      options: approvedSaleFilterUnitsPerFloorOptions,
      title: "تعداد واحد در طبقه",
    },
    {
      icon: "orientation",
      id: "unitType",
      kind: "single",
      options: approvedRentApartmentBuildingPositionOptions,
      title: "موقعیت ساختمان",
    },
    {
      icon: "orientation",
      id: "unitPosition",
      kind: "single",
      options: approvedSaleFilterUnitPositionOptions,
      title: "موقعیت واحد",
    },
    approvedOccupancyStatusBlock(),
    { id: "readyDeliveryDate", kind: "date", title: "تاریخ تحویل" },
    createRangeBlock("minContractMonths", "حداقل مدت قرارداد", "number", "ماه", true),
    approvedPetPolicyBlock(),
    approvedRenovatedBlock(),
    approvedFurnishedBlock(),
    approvedKitchenTypeBlock(),
    approvedFacadeMaterialBlock(),
    approvedFloorMaterialBlock(),
    approvedCabinetMaterialBlock(),
    approvedHeatingBlock(rentHeatingItems),
    approvedFacilitiesBlock(rentApartmentFacilityItems),
    createRangeBlock("mortgagePrice", "مبلغ رهن", "money", "تومان"),
    createRangeBlock("rentPrice", "مبلغ اجاره", "money", "تومان"),
    approvedRentConversionBlock(),
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
