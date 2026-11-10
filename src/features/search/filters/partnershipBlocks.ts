import { type FilterBlock } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import {
  participationTypeOptions,
  partnershipCurrentStatusOptions,
  projectTypeOptions,
  projectStatusOptions,
} from "../../advertisements/create/data";
import {
  approvedPartnershipLandPositionOptions,
  approvedPartnershipDocumentOptions,
} from "./dailyProjectOptions";
import {
  approvedRentBusinessHeatingBlock,
  approvedRentBusinessFacilitiesBlock,
  approvedExchangeBlock,
} from "./rentalChoiceBlocks";

export function getApprovedProjectPartnershipFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("landArea", "متراژ زمین", "area", "متر مربع", true),
    {
      icon: "agreement",
      id: "participationType",
      kind: "single",
      options: participationTypeOptions,
      title: "نوع مشارکت",
    },
    {
      icon: "settings",
      id: "currentStatus",
      kind: "single",
      options: partnershipCurrentStatusOptions,
      title: "وضعیت فعلی ملک",
    },
    {
      icon: "orientation",
      id: "landPosition",
      kind: "single",
      options: approvedPartnershipLandPositionOptions,
      title: "موقعیت ورودی",
    },
    {
      icon: "agreement",
      id: "documentType",
      kind: "single",
      options: approvedPartnershipDocumentOptions,
      title: "نوع سند",
    },
    { id: "constructionPermit", kind: "toggle", title: "مجوز ساخت" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}

export function getApprovedProjectPresaleFilterBlocks(): FilterBlock[] {
  return [
    { kind: "neighborhood" },
    createRangeBlock("meterage", "متراژ", "area", "متر مربع", true),
    createRangeBlock("projectPrice", "قیمت متری", "money", "تومان"),
    {
      icon: "building",
      id: "projectType",
      kind: "single",
      options: projectTypeOptions,
      title: "نوع پروژه",
    },
    {
      icon: "settings",
      id: "projectStatus",
      kind: "single",
      options: projectStatusOptions,
      title: "وضعیت پروژه",
    },
    approvedRentBusinessHeatingBlock(),
    approvedRentBusinessFacilitiesBlock(),
    approvedExchangeBlock(),
    { id: "saleTermsEnabled", kind: "toggle", title: "فروش شرایطی" },
    { kind: "advertiser" },
    { kind: "publicationTime" },
    { kind: "adFlags" },
  ];
}
