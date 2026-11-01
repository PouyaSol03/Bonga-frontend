import { type FilterBlock } from "./filterTypes";
import {
  projectTypeOptions,
  moreFeatureOptions,
  projectStatusOptions,
  projectFloorOptions,
  projectRoomOptions,
  projectPositionOptions,
} from "../../advertisements/create/data";
import { createRangeBlock } from "./fieldBlocks";

export function getProjectPresaleBlocks(): FilterBlock[] {
  return [
    {
      icon: "settings",
      id: "projectType",
      kind: "single",
      options: projectTypeOptions,
      title: "نوع پروژه",
    },
    createRangeBlock("projectTotalFloors", "تعداد کل طبقات", "number"),
    createRangeBlock("projectTotalUnits", "تعداد کل واحد ها", "number"),
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: moreFeatureOptions.documentType,
      title: "سند",
    },
    {
      icon: "settings",
      id: "projectStatus",
      kind: "single",
      options: projectStatusOptions,
      title: "وضعیت پروژه",
    },
    { id: "projectDeliveryDate", kind: "date", title: "تاریخ تحویل" },
    {
      icon: "settings",
      id: "kitchenType",
      kind: "single",
      options: moreFeatureOptions.kitchenType,
      title: "نوع آشپزخانه",
    },
    {
      icon: "settings",
      id: "facadeMaterial",
      kind: "single",
      options: moreFeatureOptions.facadeMaterial,
      title: "جنس نما",
    },
    {
      icon: "settings",
      id: "floorMaterial",
      kind: "single",
      options: moreFeatureOptions.floorMaterial,
      title: "جنس کف",
    },
    {
      icon: "settings",
      id: "cabinetMaterial",
      kind: "single",
      options: moreFeatureOptions.cabinetMaterial,
      title: "جنس کابینت",
    },
    { id: "furnished", kind: "toggle", title: "با لوازم و مبله" },
    createRangeBlock("projectMeterage", "متراژ", "area", "متر مربع"),
    {
      icon: "floor",
      id: "projectFloors",
      kind: "multi",
      options: projectFloorOptions.map((label) => ({ id: label, label })),
      title: "طبقه",
    },
    {
      icon: "bed",
      id: "projectRooms",
      kind: "multi",
      options: projectRoomOptions.map((label) => ({ id: label, label })),
      title: "تعداد اتاق",
    },
    {
      icon: "orientation",
      id: "projectPositions",
      kind: "multi",
      options: projectPositionOptions.map((label) => ({ id: label, label })),
      title: "موقعیت",
    },
    createRangeBlock("saleTermsPercent", "درصد شرایط", "percent", "درصد"),
    createRangeBlock("saleTermsInstallmentMonths", "تعداد اقساط", "number", "ماه"),
  ];
}
