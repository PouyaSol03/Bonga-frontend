import type { NewAdFormValues } from "../types";
import type { PatchAppender } from "./types";
import { getParams, pickFirstNumber, toNumber, toUnitsPerFloorNumber } from "../utils";

export function mapBuildingSpecs(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
  params: ReturnType<typeof getParams>,
): void {
  if (changed.has("floor")) appender.appendDynamic("floor", clean.floor);
  if (changed.has("rooms")) appender.appendDynamic("rooms", clean.rooms);
  if (changed.has("age")) appender.appendDynamic("building_age", clean.age);
  if (changed.has("hotelStars")) appender.appendDynamic("hotel_stars", clean.hotelStars);
  if (changed.has("accommodationType")) appender.appendDynamic("accommodation_type", clean.accommodationType);
  if (changed.has("spaceType")) appender.appendDynamic("space_type", clean.spaceType);
  if (changed.has("standardCapacity")) appender.appendDynamic("capacity", toNumber(pickFirstNumber(clean.standardCapacity)));
  if (changed.has("extraPeopleCapacity")) appender.appendDynamic("extra_people_capacity", toNumber(pickFirstNumber(clean.extraPeopleCapacity)));
  if (changed.has("rentalPeriod")) appender.appendDynamic("rental_period", clean.rentalPeriod);
  if (changed.has("viewType")) appender.appendDynamic("view_type", clean.viewType);
  if (changed.has("checkInTime")) appender.appendDynamic("check_in_time", clean.checkInTime);
  if (changed.has("checkOutTime")) appender.appendDynamic("check_out_time", clean.checkOutTime);
  if (changed.has("minStayDays")) appender.appendDynamic("min_stay_days", toNumber(clean.minStayDays));
  if (changed.has("evacuationGuarantee")) appender.appendDynamic("evacuation_guarantee", toNumber(clean.evacuationGuarantee));
  if (changed.has("renovated")) appender.appendDynamic("renovated", clean.renovated);
  if (changed.has("furnished")) appender.appendDynamic("furnished", clean.furnished);
  if (changed.has("totalFloors")) appender.appendDynamic("total_floors", toNumber(pickFirstNumber(clean.totalFloors)));

  if (changed.has("unitsPerFloor") && params.category === "apartment" && (params.transaction === "sale" || params.transaction === "rent")) {
    appender.appendDynamicAlias(["units_per_floor", "unit_per_floor"], toUnitsPerFloorNumber(clean.unitsPerFloor));
  }

  if (changed.has("unitType")) appender.appendDynamic("unit_type", clean.unitType);
  if (changed.has("unitPosition")) appender.appendDynamic("unit_position", clean.unitPosition);
  if (changed.has("occupancyStatus")) appender.appendDynamicAlias(["occupancy_status", "residency_status", "occupancy"], clean.occupancyStatus);
  if (changed.has("kitchenType")) appender.appendDynamicAlias(["kitchen_type", "kitchen_style"], clean.kitchenType);
  if (changed.has("petPolicy")) appender.appendDynamicAlias(["pet_policy", "pets_allowed", "pet_status"], clean.petPolicy);
  if (changed.has("readyDeliveryDate")) appender.appendDynamicAlias(["ready_delivery_date", "delivery_ready_date", "available_from"], clean.readyDeliveryDate);
  if (changed.has("minContractMonths")) appender.appendDynamicAlias(["min_contract_months", "minimum_contract_months", "contract_months"], toNumber(clean.minContractMonths));

  if (changed.has("density")) {
    const val = params.transaction === "sale" && params.category === "land" ? clean.density : toNumber(clean.density);
    appender.appendDynamic("density", val);
  }

  if (changed.has("landPosition")) appender.appendDynamic("land_position", clean.landPosition);
  if (changed.has("buildingType")) appender.appendDynamicAlias(["building_type", "house_building_type"], clean.buildingType);
  if (changed.has("villaType")) {
    appender.appendDynamic("house_type", clean.villaType);
    appender.appendDynamic("villa_type", clean.villaType);
  }
  if (changed.has("commercialPosition")) appender.appendDynamic("commercial_position", clean.commercialPosition);
  if (changed.has("ownershipStatus")) appender.appendDynamic("ownership_status", clean.ownershipStatus);
  if (changed.has("currentStatus")) appender.appendDynamic("current_status", clean.currentStatus);
  if (changed.has("industrialPropertyType")) appender.appendDynamic("industrial_property_type", clean.industrialPropertyType);
  if (changed.has("accessType")) appender.appendDynamic("access_type", clean.accessType);
  if (changed.has("officePosition")) appender.appendDynamic("office_position", clean.officePosition);
  if (changed.has("officeDocumentType")) appender.appendDynamic("office_document_type", clean.officeDocumentType);
  if (changed.has("ceilingHeight")) appender.appendDynamic("height", toNumber(clean.ceilingHeight));
  if (changed.has("openingCount")) appender.appendDynamicAlias(["opening_count", "frontage_count", "openings"], toNumber(clean.openingCount));
  if (changed.has("facadeMaterial")) appender.appendDynamic("facade_material", clean.facadeMaterial);
  if (changed.has("floorMaterial")) appender.appendDynamic("floor_material", clean.floorMaterial);
  if (changed.has("cabinetMaterial")) appender.appendDynamic("cabinet_material", clean.cabinetMaterial);
  if (changed.has("landWidth")) appender.appendDynamic("land_width", toNumber(clean.landWidth));
  if (changed.has("streetWidth")) appender.appendDynamic("street_width", toNumber(clean.streetWidth));
}

export function mapPermitsAndTerms(
  clean: NewAdFormValues,
  changed: Set<keyof NewAdFormValues>,
  appender: PatchAppender,
): void {
  if (changed.has("managementRoom")) appender.appendDynamic("management_room", clean.managementRoom);
  if (changed.has("conferenceRoom")) appender.appendDynamic("conference_room", clean.conferenceRoom);
  if (changed.has("receptionHall")) appender.appendDynamic("reception_hall", clean.receptionHall);
  if (changed.has("signboard")) appender.appendDynamic("signboard", clean.signboard);
  if (changed.has("kitchen")) appender.appendDynamic("kitchen", clean.kitchen);
  if (changed.has("separateEntrance")) appender.appendDynamic("separate_entrance", clean.separateEntrance);

  if (changed.has("hasDocument") || changed.has("documentType") || changed.has("officeDocumentType")) {
    appender.appendDynamic("has_document", clean.hasDocument || Boolean(clean.documentType || clean.officeDocumentType));
    appender.appendDynamic("document_type", clean.documentType);
  }

  if (changed.has("commercialLicense") || changed.has("commercialPermit")) {
    appender.appendDynamic("commercial_permit", clean.commercialLicense || (clean.commercialPermit ? "دارد" : ""));
  }
  if (changed.has("constructionLicense") || changed.has("constructionPermit")) {
    appender.appendDynamic("build_permit", clean.constructionLicense ? clean.constructionLicense === "دارد" : clean.constructionPermit);
  }

  if (changed.has("loanEnabled") || changed.has("loanAmount") || changed.has("loanInstallment")) {
    const isLoanActive = Boolean(clean.loanEnabled || clean.loanAmount || clean.loanInstallment);
    appender.appendDynamic("loan_amount", isLoanActive ? toNumber(clean.loanAmount) : null);
    appender.appendDynamic("loan_installment", isLoanActive ? toNumber(clean.loanInstallment) : null);
  }

  if (changed.has("saleTermsEnabled") || changed.has("saleTermsPercent") || changed.has("saleTermsInstallmentMonths")) {
    appender.appendDynamic("installment_sale", clean.saleTermsEnabled);
    appender.appendDynamic("sale_terms_percent", clean.saleTermsEnabled ? toNumber(clean.saleTermsPercent) : null);
    appender.appendDynamic("sale_terms_installment_months", clean.saleTermsEnabled ? toNumber(clean.saleTermsInstallmentMonths) : null);
  }

  if (changed.has("builderSharePercent")) appender.appendDynamic("builder_share", toNumber(clean.builderSharePercent));
  if (changed.has("participationType")) appender.appendDynamic("partnership_type", clean.participationType);
  if (changed.has("builderCompanyName")) appender.appendDynamicAlias(["builder_company_name", "builder_name", "developer_name"], clean.builderCompanyName);
  if (changed.has("projectType")) appender.appendDynamic("project_type", clean.projectType);
  if (changed.has("projectTotalFloors")) appender.appendDynamic("project_total_floors", toNumber(clean.projectTotalFloors));
  if (changed.has("projectTotalUnits")) appender.appendDynamic("project_total_units", toNumber(clean.projectTotalUnits));
  if (changed.has("projectDeliveryDate")) appender.appendDynamic("delivery_date", clean.projectDeliveryDate);
  if (changed.has("projectStatus")) appender.appendDynamic("project_status", clean.projectStatus);
}
