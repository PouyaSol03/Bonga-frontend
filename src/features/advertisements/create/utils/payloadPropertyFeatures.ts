import type { NewAdFormValues } from "../types";
import { pickFirstNumber, toNumber, toUnitsPerFloorNumber } from "./formatters";
import {
  addFeature,
  buildDailyHotelRoomFeatures,
  type NewAdFeature,
} from "./featureBuilders";

type PayloadParams = {
  category: string;
  transaction: string;
};

export function appendPayloadPropertyFeatures(
  features: NewAdFeature[],
  values: NewAdFormValues,
  params: PayloadParams,
  isSale: boolean,
  isRent: boolean,
  options?: { dynamicFieldKeys?: Iterable<string> },
): void {
  const dynamicKeys = options?.dynamicFieldKeys ? new Set(options.dynamicFieldKeys) : null;
  const addDynamicFeature = (key: string, value: unknown) => {
    if (dynamicKeys && !dynamicKeys.has(key)) return;
    addFeature(features, key, value);
  };

  addDynamicFeature("building_area", toNumber(values.buildingArea));
  addDynamicFeature("floor", values.floor);
  addDynamicFeature("rooms", values.rooms);
  addDynamicFeature("building_age", values.age);
  addDynamicFeature(
    "density",
    isSale && params.category === "land" ? values.density : toNumber(values.density),
  );
  addDynamicFeature("land_use", values.usageType);
  addDynamicFeature("land_position", values.landPosition);
  addDynamicFeature("suitable_for", values.suitableFor);
  addDynamicFeature("hotel_stars", values.hotelStars);
  addDynamicFeature("accommodation_type", values.accommodationType);
  addDynamicFeature("standard_capacity", values.standardCapacity);
  addDynamicFeature("extra_people_capacity", values.extraPeopleCapacity);
  addDynamicFeature("space_type", values.spaceType);
  addDynamicFeature("rental_period", values.rentalPeriod);
  addDynamicFeature("view_type", values.viewType);
  addDynamicFeature("check_in_time", values.checkInTime);
  addDynamicFeature("check_out_time", values.checkOutTime);
  addDynamicFeature("min_stay_days", toNumber(values.minStayDays));
  addDynamicFeature("evacuation_guarantee", toNumber(values.evacuationGuarantee));
  addDynamicFeature(
    "commercial_permit",
    values.commercialLicense || (values.commercialPermit ? "دارد" : ""),
  );

  const isLandOrPartnership =
    params.category === "land" ||
    params.category === "project-partnership" ||
    params.category.startsWith("project");
  if (isLandOrPartnership) {
    const hasBuildPermit = values.constructionLicense
      ? values.constructionLicense === "دارد"
      : Boolean(values.constructionPermit);
    if (hasBuildPermit) {
      addDynamicFeature("build_permit", true);
    }
  }

  addDynamicFeature("builder_company_name", values.builderCompanyName);
  addDynamicFeature("project_type", values.projectType);

  if (!isRent) {
    addDynamicFeature("document_type", values.documentType);
  }

  addDynamicFeature("total_floors", toNumber(pickFirstNumber(values.totalFloors)));
  if (
    params.category === "apartment" &&
    (params.transaction === "sale" || params.transaction === "rent")
  ) {
    addDynamicFeature("unit_per_floor", toUnitsPerFloorNumber(values.unitsPerFloor));
  }
  addDynamicFeature("unit_type", values.unitType);
  addDynamicFeature("unit_direction", values.unitPosition);
  addDynamicFeature("occupancy_status", values.occupancyStatus);
  addDynamicFeature("kitchen_type", values.kitchenType);
  addDynamicFeature("pet_policy", values.petPolicy);
  addDynamicFeature("ready_delivery_date", values.readyDeliveryDate);
  addDynamicFeature("min_contract_months", toNumber(values.minContractMonths));
  addDynamicFeature("renovated", values.renovated);
  addDynamicFeature("furnished", values.furnished);
  addDynamicFeature("facade_material", values.facadeMaterial);
  addDynamicFeature("floor_material", values.floorMaterial);
  addDynamicFeature("cabinet_material", values.cabinetMaterial);
  addDynamicFeature("building_type", values.buildingType);
  addDynamicFeature("villa_type", values.villaType);
  addDynamicFeature("commercial_position", values.commercialPosition);
  addDynamicFeature("ownership_status", values.ownershipStatus);
  addDynamicFeature("current_status", values.currentStatus);
  addDynamicFeature("industrial_property_type", values.industrialPropertyType);
  addDynamicFeature("access_type", values.accessType);
  addDynamicFeature("office_position", values.officePosition);
  addDynamicFeature("office_document_type", values.officeDocumentType);
  addDynamicFeature(
    "has_document",
    values.hasDocument || Boolean(values.documentType || values.officeDocumentType),
  );
  addDynamicFeature("management_room", values.managementRoom);
  addDynamicFeature("conference_room", values.conferenceRoom);
  addDynamicFeature("reception_hall", values.receptionHall);
  addDynamicFeature("signboard", values.signboard);
  addDynamicFeature("kitchen", values.kitchen);
  addDynamicFeature("separate_entrance", values.separateEntrance);
  addDynamicFeature("land_width", toNumber(values.landWidth));
  addDynamicFeature("street_width", toNumber(values.streetWidth));
  addDynamicFeature("ceiling_height", toNumber(values.ceilingHeight));
  addDynamicFeature("opening_count", toNumber(values.openingCount));
  addDynamicFeature(
    "elevator_count",
    values.facilities.includes("elevator") ? toNumber(values.elevatorCount) : null,
  );
  addDynamicFeature(
    "parking_count",
    values.facilities.includes("parking") ? toNumber(values.parkingCount) : null,
  );
  addDynamicFeature(
    "terrace_count",
    values.facilities.includes("terrace") ? toNumber(values.terraceCount) : null,
  );
  addDynamicFeature("images_not_belong_to_ad", values.images_not_belong_to_ad);
  addDynamicFeature("single_room_count", toNumber(pickFirstNumber(values.singleRoomCount)));
  addDynamicFeature("double_room_count", toNumber(pickFirstNumber(values.doubleRoomCount)));
  addDynamicFeature("suite_count", toNumber(pickFirstNumber(values.suiteCount)));

  if (params.category === "daily-hotel-apartment") {
    addDynamicFeature("daily_hotel_rooms", buildDailyHotelRoomFeatures(values));
  }
}
