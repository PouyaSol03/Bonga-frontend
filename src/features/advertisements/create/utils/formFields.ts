import {
  basicPropertyFieldsByListingType,
  defaultBasicPropertyFields,
  moreFeatureFieldsByCategory,
  moreFeatureFieldsByListingType,
} from "../data";
import { getFormSchemaByListing } from "../../forms";
import type {
  BasicPropertyField,
  BasicPropertyFieldKey,
  MoreFeatureField,
  MoreFeatureFormKey,
  MoreFeaturesFormValues,
  NewAdFormValues,
} from "../types";
import { normalizeUnitsPerFloorValue } from "./formatters";
import { getParams } from "./routeAndDraftState";

export function getBasicPropertyFields(): BasicPropertyField[] {
  const { transaction, category } = getParams();
  const schema = getFormSchemaByListing(transaction, category);
  if (schema?.create?.basicFields) {
    return schema.create.basicFields.map((field) => ({
      key: field.key as BasicPropertyFieldKey,
      label: field.title,
      control:
        field.input === "multiSelect"
          ? "multiSelect"
          : field.input === "select" || field.ui === "bottomSheet"
            ? "select"
            : "input",
      numeric: field.numeric,
      required: field.required,
      leftText: field.leftText,
      options: field.options,
    }));
  }

  const listingKey = `${transaction}:${category}`;
  return basicPropertyFieldsByListingType[listingKey] ?? defaultBasicPropertyFields;
}

export function getMoreFeatureFields(): MoreFeatureField[] {
  const { transaction, category } = getParams();
  const schema = getFormSchemaByListing(transaction, category);
  if (schema?.create?.moreFeatures?.fields) {
    return schema.create.moreFeatures.fields.map((field) => ({
      key: field.key as MoreFeatureFormKey,
      label: field.title,
      control:
        field.input === "toggle" || field.ui === "toggle"
          ? "toggle"
          : field.input === "time"
            ? "time"
            : field.input === "date"
              ? "date"
              : field.input === "number"
                ? "number"
                : field.input === "multiSelect"
                  ? "multiSelect"
                  : "select",
      options: field.options,
      leftText: field.leftText,
    }));
  }

  const listingKey = `${transaction}:${category}`;
  return moreFeatureFieldsByListingType[listingKey] ?? moreFeatureFieldsByCategory[category] ?? [];
}

export function pickMoreFeatures(values: NewAdFormValues): MoreFeaturesFormValues {
  return {
    builderCompanyName: values.builderCompanyName,
    age: values.age,
    buildingArea: values.buildingArea,
    floor: values.floor,
    rooms: values.rooms,
    totalFloors: values.totalFloors,
    unitsPerFloor: normalizeUnitsPerFloorValue(values.unitsPerFloor),
    unitType: values.unitType,
    unitPosition: values.unitPosition,
    documentType: values.documentType,
    usageType: values.usageType,
    suitableFor: values.suitableFor,
    occupancyStatus: values.occupancyStatus,
    kitchenType: values.kitchenType,
    petPolicy: values.petPolicy,
    readyDeliveryDate: values.readyDeliveryDate,
    projectDeliveryDate: values.projectDeliveryDate,
    projectStatus: values.projectStatus,
    minContractMonths: values.minContractMonths,
    rentalPeriod: values.rentalPeriod,
    viewType: values.viewType,
    checkInTime: values.checkInTime,
    checkOutTime: values.checkOutTime,
    minStayDays: values.minStayDays,
    evacuationGuarantee: values.evacuationGuarantee,
    extraPeopleCapacity: values.extraPeopleCapacity,
    renovated: values.renovated,
    furnished: values.furnished,
    facadeMaterial: values.facadeMaterial,
    floorMaterial: values.floorMaterial,
    cabinetMaterial: values.cabinetMaterial,
    landPosition: values.landPosition,
    buildingType: values.buildingType,
    villaType: values.villaType,
    commercialPosition: values.commercialPosition,
    ownershipStatus: values.ownershipStatus,
    currentStatus: values.currentStatus,
    industrialPropertyType: values.industrialPropertyType,
    accessType: values.accessType,
    officePosition: values.officePosition,
    officeDocumentType: values.officeDocumentType,
    hasDocument: values.hasDocument,
    managementRoom: values.managementRoom,
    conferenceRoom: values.conferenceRoom,
    receptionHall: values.receptionHall,
    signboard: values.signboard,
    kitchen: values.kitchen,
    separateEntrance: values.separateEntrance,
    density: values.density,
    landWidth: values.landWidth,
    streetWidth: values.streetWidth,
    constructionPermit: values.constructionPermit,
    commercialPermit: values.commercialPermit,
    commercialLicense: values.commercialLicense,
    ceilingHeight: values.ceilingHeight,
    openingCount: values.openingCount,
    singleRoomCount: values.singleRoomCount,
    doubleRoomCount: values.doubleRoomCount,
    suiteCount: values.suiteCount,
  };
}
