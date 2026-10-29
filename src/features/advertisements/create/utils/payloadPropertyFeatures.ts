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
): void {
  addFeature(features, "building_area", toNumber(values.buildingArea));
  addFeature(features, "floor", values.floor);
  addFeature(features, "rooms", values.rooms);
  addFeature(features, "building_age", values.age);
  addFeature(
    features,
    "density",
    isSale && params.category === "land" ? values.density : toNumber(values.density),
  );
  addFeature(features, "land_use", values.usageType);
  addFeature(features, "land_position", values.landPosition);
  addFeature(features, "suitable_for", values.suitableFor);
  addFeature(features, "hotel_stars", values.hotelStars);
  addFeature(features, "accommodation_type", values.accommodationType);
  addFeature(features, "standard_capacity", values.standardCapacity);
  addFeature(features, "extra_people_capacity", values.extraPeopleCapacity);
  addFeature(features, "space_type", values.spaceType);
  addFeature(features, "rental_period", values.rentalPeriod);
  addFeature(features, "view_type", values.viewType);
  addFeature(features, "check_in_time", values.checkInTime);
  addFeature(features, "check_out_time", values.checkOutTime);
  addFeature(features, "min_stay_days", toNumber(values.minStayDays));
  addFeature(features, "evacuation_guarantee", toNumber(values.evacuationGuarantee));
  addFeature(
    features,
    "commercial_permit",
    values.commercialLicense || (values.commercialPermit ? "دارد" : ""),
  );
  addFeature(
    features,
    "build_permit",
    values.constructionLicense ? values.constructionLicense === "دارد" : values.constructionPermit,
  );
  addFeature(features, "builder_company_name", values.builderCompanyName);
  addFeature(features, "project_type", values.projectType);

  if (!isRent) {
    addFeature(features, "document_type", values.documentType);
  }

  addFeature(features, "total_floors", toNumber(pickFirstNumber(values.totalFloors)));
  if (
    params.category === "apartment" &&
    (params.transaction === "sale" || params.transaction === "rent")
  ) {
    addFeature(features, "unit_per_floor", toUnitsPerFloorNumber(values.unitsPerFloor));
  }
  addFeature(features, "unit_type", values.unitType);
  addFeature(features, "unit_direction", values.unitPosition);
  addFeature(features, "occupancy_status", values.occupancyStatus);
  addFeature(features, "kitchen_type", values.kitchenType);
  addFeature(features, "pet_policy", values.petPolicy);
  addFeature(features, "ready_delivery_date", values.readyDeliveryDate);
  addFeature(features, "min_contract_months", toNumber(values.minContractMonths));
  addFeature(features, "renovated", values.renovated);
  addFeature(features, "furnished", values.furnished);
  addFeature(features, "facade_material", values.facadeMaterial);
  addFeature(features, "floor_material", values.floorMaterial);
  addFeature(features, "cabinet_material", values.cabinetMaterial);
  addFeature(features, "building_type", values.buildingType);
  addFeature(features, "villa_type", values.villaType);
  addFeature(features, "commercial_position", values.commercialPosition);
  addFeature(features, "ownership_status", values.ownershipStatus);
  addFeature(features, "current_status", values.currentStatus);
  addFeature(features, "industrial_property_type", values.industrialPropertyType);
  addFeature(features, "access_type", values.accessType);
  addFeature(features, "office_position", values.officePosition);
  addFeature(features, "office_document_type", values.officeDocumentType);
  addFeature(
    features,
    "has_document",
    values.hasDocument || Boolean(values.documentType || values.officeDocumentType),
  );
  addFeature(features, "management_room", values.managementRoom);
  addFeature(features, "conference_room", values.conferenceRoom);
  addFeature(features, "reception_hall", values.receptionHall);
  addFeature(features, "signboard", values.signboard);
  addFeature(features, "kitchen", values.kitchen);
  addFeature(features, "separate_entrance", values.separateEntrance);
  addFeature(features, "land_width", toNumber(values.landWidth));
  addFeature(features, "street_width", toNumber(values.streetWidth));
  addFeature(features, "ceiling_height", toNumber(values.ceilingHeight));
  addFeature(features, "opening_count", toNumber(values.openingCount));
  addFeature(
    features,
    "elevator_count",
    values.facilities.includes("elevator") ? toNumber(values.elevatorCount) : null,
  );
  addFeature(
    features,
    "parking_count",
    values.facilities.includes("parking") ? toNumber(values.parkingCount) : null,
  );
  addFeature(
    features,
    "terrace_count",
    values.facilities.includes("terrace") ? toNumber(values.terraceCount) : null,
  );
  addFeature(features, "images_not_belong_to_ad", values.images_not_belong_to_ad);
  addFeature(features, "single_room_count", toNumber(pickFirstNumber(values.singleRoomCount)));
  addFeature(features, "double_room_count", toNumber(pickFirstNumber(values.doubleRoomCount)));
  addFeature(features, "suite_count", toNumber(pickFirstNumber(values.suiteCount)));

  if (params.category === "daily-hotel-apartment") {
    addFeature(features, "daily_hotel_rooms", buildDailyHotelRoomFeatures(values));
  }
}
