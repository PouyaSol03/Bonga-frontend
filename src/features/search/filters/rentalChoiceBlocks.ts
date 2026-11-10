import { type SingleChoiceBlock, type MultiChoiceBlock } from "./filterTypes";
import { rentConversionPolicyOptions } from "../../advertisements/create/data";
import {
  approvedRentBusinessHeatingItems,
  approvedRentBusinessFacilities,
} from "./rentBusinessOptions";
import { asChipItems } from "./amenityBlocks";
import {
  approvedSaleFilterExchangeTargets,
  approvedSaleFilterFloorOptions,
} from "./saleResidentialOptions";
import { approvedTotalFloorsOptions } from "./businessOptions";
import { approvedDailyCapacityOptions } from "./dailyProjectOptions";

export function approvedRentConversionBlock(): SingleChoiceBlock {
  return {
    icon: "exchange",
    id: "rentConversionPolicy",
    kind: "single",
    options: rentConversionPolicyOptions,
    title: "تبدیل رهن و اجاره",
  };
}

export function approvedRentBusinessHeatingBlock(): MultiChoiceBlock {
  return {
    icon: "temperature",
    id: "heatingCooling",
    kind: "multi",
    options: approvedRentBusinessHeatingItems,
    title: "سرمایش و گرمایش",
    more: true,
    moreLimit: 3,
    moreLabel: "نمایش ۱۲ مورد دیگر",
  };
}

export function approvedRentBusinessFacilitiesBlock(): MultiChoiceBlock {
  return {
    icon: "settings",
    id: "facilities",
    kind: "multi",
    options: approvedRentBusinessFacilities,
    title: "امکانات",
    more: true,
    moreLimit: 3,
    moreLabel: "نمایش ۱۲ مورد دیگر",
  };
}

export function approvedExchangeBlock(): MultiChoiceBlock {
  return {
    icon: "exchange",
    id: "exchangeWith",
    kind: "multi",
    options: asChipItems(approvedSaleFilterExchangeTargets),
    title: "معاوضه با",
  };
}

export function approvedFloorBlock(title = "طبقه"): MultiChoiceBlock {
  return {
    icon: "floor",
    id: "floor",
    kind: "multi",
    options: asChipItems(approvedSaleFilterFloorOptions),
    title,
    more: true,
    moreLimit: 6,
    moreLabel: "مشاهده همه طبقات",
    moreIcon: "left",
  };
}

export function approvedTotalFloorsBlock(title = "تعداد طبقات"): SingleChoiceBlock {
  return {
    icon: "floor",
    id: "totalFloors",
    kind: "single",
    options: approvedTotalFloorsOptions,
    title,
    more: true,
    moreLimit: 7,
    moreLabel: "مشاهده همه طبقات",
    moreIcon: "left",
  };
}

export function approvedDailyCapacityBlock(): SingleChoiceBlock {
  return {
    icon: "unitBed",
    id: "standardCapacity",
    kind: "single",
    options: approvedDailyCapacityOptions,
    title: "ظرفیت استاندارد",
    more: true,
    moreLimit: 5,
    moreLabel: "مشاهده همه ظرفیتها",
    moreIcon: "left",
  };
}
