import type { NewAdFormValues } from "../types";
import { pickFirstNumber, toNumber, toUnitsPerFloorNumber } from "./formatters";
import {
  buildDailyHotelRoomFeatures,
  buildProjectDetailFeatures,
} from "./featureBuilders";
import type { FormDataAppenders } from "./formDataAppenders";
import { appendFormDataPricingSpecs } from "./formDataPricingSpecs";

export function appendFormDataSpecs(
  appenders: FormDataAppenders,
  values: NewAdFormValues,
  params: { category: string; transaction: string },
  formCode: string,
  extraSpecs: string[],
  facilities: string[],
  heatingCooling: string[],
): void {
  const {
    appendBaseValue,
    appendDynamicAliasValue,
    appendDynamicArray,
    appendDynamicJson,
    appendDynamicValue,
    appendFacilityCount,
  } = appenders;

  const isSale = params.transaction === "sale";
  const isSaleGardenVilla = isSale && params.category === "garden-villa";
  const isLoanActive = Boolean(values.loanEnabled || values.loanAmount || values.loanInstallment);

  appendFormDataPricingSpecs(appenders, values, params, formCode);

  appendDynamicAliasValue(
    ["builder_company_name", "builder_name", "developer_name"],
    values.builderCompanyName,
  );
  appendDynamicValue("project_type", values.projectType);
  appendDynamicValue("project_total_floors", toNumber(values.projectTotalFloors));
  appendDynamicValue("project_total_units", toNumber(values.projectTotalUnits));
  appendDynamicValue("delivery_date", values.projectDeliveryDate);
  appendDynamicValue("building_age", values.age);
  appendDynamicValue("rooms", values.rooms);
  appendDynamicValue("floor", values.floor);
  appendDynamicValue("hotel_stars", values.hotelStars);
  appendDynamicValue("accommodation_type", values.accommodationType);
  appendDynamicValue("space_type", values.spaceType);
  appendDynamicValue("capacity", toNumber(pickFirstNumber(values.standardCapacity)));
  appendDynamicValue(
    "extra_people_capacity",
    toNumber(pickFirstNumber(values.extraPeopleCapacity)),
  );
  appendDynamicValue("rental_period", values.rentalPeriod);
  appendDynamicValue("view_type", values.viewType);
  appendDynamicValue("check_in_time", values.checkInTime);
  appendDynamicValue("check_out_time", values.checkOutTime);
  appendDynamicValue("min_stay_days", toNumber(values.minStayDays));
  appendDynamicValue("evacuation_guarantee", toNumber(values.evacuationGuarantee));
  appendDynamicValue("renovated", values.renovated);
  appendDynamicValue("furnished", values.furnished);
  appendDynamicValue(
    "loan_amount",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanAmount) : null,
  );
  appendDynamicValue(
    "loan_installment",
    isSale && !isSaleGardenVilla && isLoanActive ? toNumber(values.loanInstallment) : null,
  );
  appendDynamicValue(
    "has_document",
    values.hasDocument || Boolean(values.documentType || values.officeDocumentType),
  );
  appendDynamicValue("document_type", values.documentType);
  appendDynamicValue("total_floors", toNumber(pickFirstNumber(values.totalFloors)));
  if (
    params.category === "apartment" &&
    (params.transaction === "sale" || params.transaction === "rent")
  ) {
    appendDynamicAliasValue(
      ["units_per_floor", "unit_per_floor"],
      toUnitsPerFloorNumber(values.unitsPerFloor),
    );
  }
  appendDynamicValue("unit_type", values.unitType);
  appendDynamicValue("unit_position", values.unitPosition);
  appendDynamicAliasValue(
    ["occupancy_status", "residency_status", "occupancy"],
    values.occupancyStatus,
  );
  appendDynamicAliasValue(["kitchen_type", "kitchen_style"], values.kitchenType);
  appendDynamicAliasValue(["pet_policy", "pets_allowed", "pet_status"], values.petPolicy);
  appendDynamicAliasValue(
    ["ready_delivery_date", "delivery_ready_date", "available_from"],
    values.readyDeliveryDate,
  );
  appendDynamicAliasValue(
    ["min_contract_months", "minimum_contract_months", "contract_months"],
    toNumber(values.minContractMonths),
  );
  appendDynamicValue(
    "density",
    params.transaction === "sale" && params.category === "land"
      ? values.density
      : toNumber(values.density),
  );
  appendDynamicValue("land_position", values.landPosition);
  appendDynamicAliasValue(["building_type", "house_building_type"], values.buildingType);
  appendDynamicValue("house_type", values.villaType);
  appendDynamicValue("villa_type", values.villaType);
  appendDynamicValue("commercial_position", values.commercialPosition);
  appendDynamicValue("ownership_status", values.ownershipStatus);
  appendDynamicValue("current_status", values.currentStatus);
  appendDynamicValue("industrial_property_type", values.industrialPropertyType);
  appendDynamicValue("access_type", values.accessType);
  appendDynamicValue("office_position", values.officePosition);
  appendDynamicValue("office_document_type", values.officeDocumentType);
  appendDynamicValue("management_room", values.managementRoom);
  appendDynamicValue("conference_room", values.conferenceRoom);
  appendDynamicValue("reception_hall", values.receptionHall);
  appendDynamicValue("signboard", values.signboard);
  appendDynamicValue("kitchen", values.kitchen);
  appendDynamicValue("separate_entrance", values.separateEntrance);
  appendDynamicValue("height", toNumber(values.ceilingHeight));
  appendDynamicAliasValue(
    ["opening_count", "frontage_count", "openings"],
    toNumber(values.openingCount),
  );
  appendFacilityCount(
    "elevator_count",
    values.facilities.includes("elevator") ? toNumber(values.elevatorCount) : null,
  );
  appendFacilityCount(
    "parking_count",
    values.facilities.includes("parking") ? toNumber(values.parkingCount) : null,
  );
  appendFacilityCount(
    "terrace_count",
    values.facilities.includes("terrace") ? toNumber(values.terraceCount) : null,
  );
  appendBaseValue("images_not_belong_to_ad", values.images_not_belong_to_ad);
  appendDynamicValue("images_not_belong_to_ad", values.images_not_belong_to_ad);
  appendDynamicValue("facade_material", values.facadeMaterial);
  appendDynamicValue("floor_material", values.floorMaterial);
  appendDynamicValue("cabinet_material", values.cabinetMaterial);
  appendDynamicValue("land_width", toNumber(values.landWidth));
  appendDynamicValue("street_width", toNumber(values.streetWidth));
  appendDynamicValue("single_room_count", toNumber(pickFirstNumber(values.singleRoomCount)));
  appendDynamicValue("double_room_count", toNumber(pickFirstNumber(values.doubleRoomCount)));
  appendDynamicValue("suite_count", toNumber(pickFirstNumber(values.suiteCount)));
  appendDynamicValue(
    "commercial_permit",
    values.commercialLicense || (values.commercialPermit ? "دارد" : ""),
  );
  appendDynamicValue("project_status", values.projectStatus);
  appendDynamicValue("installment_sale", values.saleTermsEnabled);
  appendDynamicValue(
    "sale_terms_percent",
    values.saleTermsEnabled ? toNumber(values.saleTermsPercent) : null,
  );
  appendDynamicValue(
    "sale_terms_installment_months",
    values.saleTermsEnabled ? toNumber(values.saleTermsInstallmentMonths) : null,
  );
  appendDynamicValue("builder_share", toNumber(values.builderSharePercent));
  appendDynamicValue("partnership_type", values.participationType);
  appendDynamicValue(
    "build_permit",
    values.constructionLicense ? values.constructionLicense === "دارد" : values.constructionPermit,
  );
  appendDynamicValue("has_image", values.photos.length > 0);
  appendDynamicValue("has_video", Boolean(values.video));

  appendDynamicArray("land_use", values.usageType);
  appendDynamicArray("suitable_for", values.suitableFor);
  appendDynamicArray("heating_cooling", heatingCooling);
  appendDynamicArray("facilities", facilities);
  const exchangeAllowedForForm = !formCode.startsWith("rent-");
  appendDynamicValue("has_exchange", exchangeAllowedForForm && values.exchangeEnabled);
  appendDynamicArray(
    "exchange_with",
    exchangeAllowedForForm && values.exchangeEnabled ? values.exchangeTargets : [],
  );

  appendDynamicJson("project_details", buildProjectDetailFeatures(values));
  appendDynamicJson("extra_specs", extraSpecs);
  appendDynamicJson("daily_hotel_rooms", buildDailyHotelRoomFeatures(values));
}
