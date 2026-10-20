import type { AdvertisementItem } from "../../api/advertisement.service";
import { blankValues, locationKey } from "../data";
import type { NewAdFormValues } from "../types";
import { getAdvertisementFeatures } from "./crmEditNormalizer";
import {
  ageText,
  elevatorCountText,
  numericInputText,
  readArrayValue,
  readContactTypes,
  readFirstValue,
  readNestedText,
  readPublisherName,
  readRegistrantType,
  readSocialValue,
  readText,
  readTextValue,
  selectText,
  toBooleanValue,
} from "./featureReaders";
import { mapAdvertisementSpecs } from "./mapAdvertisementSpecs";
import { getExistingPhotoMedia, getExistingVideoMedia } from "./mediaMappers";
import { syncEditLocationStorage } from "./syncEditLocationStorage";

export { syncEditLocationStorage } from "./syncEditLocationStorage";

export function mapAdvertisementToEditValues(
  ad: AdvertisementItem,
  base: NewAdFormValues,
): NewAdFormValues {
  const features = getAdvertisementFeatures(ad);
  const next: NewAdFormValues = {
    ...blankValues,
    ...base,
    dailyHotelRooms: base.dailyHotelRooms.length
      ? base.dailyHotelRooms
      : blankValues.dailyHotelRooms,
    photos: base.photos.length > 0 ? base.photos : getExistingPhotoMedia(ad),
    video: base.video ? base.video : getExistingVideoMedia(ad),
  };
  const setText = (
    key: keyof NewAdFormValues,
    value: unknown,
    transform: (value: unknown) => string = readText,
  ) => {
    const text = transform(value);
    if (text) {
      (next[key] as string) = text;
    }
  };
  const setArray = (key: "suitableFor" | "usageType", value: unknown) => {
    const items = readArrayValue(value);
    if (items.length) {
      next[key] = items;
    }
  };
  const setBool = (key: keyof NewAdFormValues, value: unknown) => {
    const booleanValue = toBooleanValue(value);
    if (booleanValue !== null) {
      (next[key] as boolean) = booleanValue;
    }
  };
  const contactTypes = readContactTypes(ad);
  const contacts =
    ad.contacts && typeof ad.contacts === "object" ? (ad.contacts as Record<string, unknown>) : {};

  const confirmedLocation =
    typeof window !== "undefined" && !base.location
      ? window.localStorage.getItem(locationKey)?.trim()
      : "";
  if (confirmedLocation) {
    next.location = confirmedLocation;
  } else {
    setText(
      "location",
      readFirstValue(
        ad,
        features,
        ["location"],
        ["location", "address", "form_neighborhood_title"],
      ),
    );
    if (!next.location) {
      next.location = readNestedText(ad, [
        "neighborhood",
        "neighborhood_name",
        "district",
        "district_name",
        "city",
        "city_name",
      ]);
    }
  }

  setText(
    "meterage",
    readFirstValue(ad, features, ["area", "meterage"], ["area", "meterage"]),
    numericInputText,
  );
  setText(
    "landArea",
    readFirstValue(ad, features, ["land_area"], ["land_area", "landArea"]),
    numericInputText,
  );
  setText(
    "buildingArea",
    readFirstValue(ad, features, ["building_area"], ["building_area", "buildingArea"]),
    numericInputText,
  );
  setText(
    "floor",
    readFirstValue(
      ad,
      features,
      ["floor", "unit_floor", "apartment_floor"],
      ["floor", "unit_floor", "apartment_floor"],
    ),
    selectText,
  );
  setText("rooms", readFirstValue(ad, features, ["rooms"], ["rooms"]), selectText);
  setText(
    "age",
    readFirstValue(ad, features, ["building_age"], ["building_age", "age", "year"]),
    ageText,
  );
  setText("density", readFirstValue(ad, features, ["density"], ["density"]));
  setArray(
    "usageType",
    readFirstValue(ad, features, ["land_use", "usage"], ["land_use", "usageType"]),
  );
  setText(
    "landPosition",
    readFirstValue(ad, features, ["land_position"], ["land_position", "landPosition"]),
  );
  setText(
    "documentType",
    readFirstValue(ad, features, ["document_type"], ["document_type", "documentType"]),
  );
  setArray(
    "suitableFor",
    readFirstValue(ad, features, ["suitable_for"], ["suitable_for", "suitableFor"]),
  );
  setText(
    "hotelStars",
    readFirstValue(ad, features, ["hotel_stars"], ["hotel_stars", "hotelStars"]),
    selectText,
  );
  setText(
    "accommodationType",
    readFirstValue(
      ad,
      features,
      ["accommodation_type"],
      ["accommodation_type", "accommodationType"],
    ),
  );
  setText("spaceType", readFirstValue(ad, features, ["space_type"], ["space_type", "spaceType"]));
  setText(
    "standardCapacity",
    readFirstValue(
      ad,
      features,
      ["standard_capacity", "capacity"],
      ["standard_capacity", "capacity"],
    ),
    selectText,
  );
  setText(
    "extraPeopleCapacity",
    readFirstValue(
      ad,
      features,
      ["extra_people_capacity"],
      ["extra_people_capacity", "extraPeopleCapacity"],
    ),
    selectText,
  );
  setText(
    "commercialLicense",
    readFirstValue(
      ad,
      features,
      ["commercial_license", "commercial_permit"],
      ["commercial_license", "commercialLicense"],
    ),
  );
  setText(
    "constructionLicense",
    readFirstValue(
      ad,
      features,
      ["construction_license", "build_permit"],
      ["construction_license", "constructionLicense"],
    ),
  );
  setText(
    "participationType",
    readFirstValue(
      ad,
      features,
      ["participation_type", "partnership_type"],
      ["participation_type", "partnershipType"],
    ),
  );
  setText(
    "builderCompanyName",
    readFirstValue(
      ad,
      features,
      ["builder_company_name", "builder_name", "developer_name"],
      ["builder_company_name", "builderCompanyName"],
    ),
  );
  setText(
    "projectType",
    readFirstValue(ad, features, ["project_type"], ["project_type", "projectType"]),
  );
  setText(
    "projectTotalFloors",
    readFirstValue(
      ad,
      features,
      ["project_total_floors"],
      ["project_total_floors", "projectTotalFloors"],
    ),
    numericInputText,
  );
  setText(
    "projectTotalUnits",
    readFirstValue(
      ad,
      features,
      ["project_total_units"],
      ["project_total_units", "projectTotalUnits"],
    ),
    numericInputText,
  );
  setText(
    "projectStatus",
    readFirstValue(ad, features, ["project_status"], ["project_status", "projectStatus"]),
  );
  setText(
    "projectDeliveryDate",
    readFirstValue(ad, features, ["delivery_date"], ["delivery_date", "projectDeliveryDate"]),
  );
  setText(
    "saleTermsPercent",
    readFirstValue(
      ad,
      features,
      ["sale_terms_percent"],
      ["sale_terms_percent", "saleTermsPercent"],
    ),
    numericInputText,
  );
  setText(
    "saleTermsInstallmentMonths",
    readFirstValue(
      ad,
      features,
      ["sale_terms_installment_months"],
      ["sale_terms_installment_months", "saleTermsInstallmentMonths"],
    ),
    numericInputText,
  );
  setText(
    "builderSharePercent",
    readFirstValue(
      ad,
      features,
      ["builder_share", "builder_share_percent"],
      ["builder_share", "builderSharePercent"],
    ),
    numericInputText,
  );
  setText(
    "totalFloors",
    readFirstValue(ad, features, ["total_floors"], ["total_floors", "totalFloors"]),
    selectText,
  );
  setText(
    "unitsPerFloor",
    readFirstValue(
      ad,
      features,
      ["unit_per_floor", "units_per_floor"],
      ["unit_per_floor", "units_per_floor", "unitsPerFloor"],
    ),
    selectText,
  );
  setText("unitType", readFirstValue(ad, features, ["unit_type"], ["unit_type", "unitType"]));
  setText(
    "unitPosition",
    readFirstValue(
      ad,
      features,
      ["unit_position", "unit_direction"],
      ["unit_position", "unitPosition"],
    ),
  );
  setText(
    "occupancyStatus",
    readFirstValue(
      ad,
      features,
      ["occupancy_status", "residency_status", "occupancy"],
      ["occupancy_status", "residency_status", "occupancyStatus"],
    ),
  );
  setText(
    "kitchenType",
    readFirstValue(
      ad,
      features,
      ["kitchen_type", "kitchen_style"],
      ["kitchen_type", "kitchen_style", "kitchenType"],
    ),
  );
  setText(
    "petPolicy",
    readFirstValue(
      ad,
      features,
      ["pet_policy", "pets_allowed", "pet_status"],
      ["pet_policy", "petPolicy"],
    ),
  );
  setText(
    "readyDeliveryDate",
    readFirstValue(
      ad,
      features,
      ["ready_delivery_date", "delivery_ready_date", "available_from"],
      ["ready_delivery_date", "readyDeliveryDate"],
    ),
  );
  setText(
    "minContractMonths",
    readFirstValue(
      ad,
      features,
      ["min_contract_months", "minimum_contract_months", "contract_months"],
      ["min_contract_months", "minContractMonths"],
    ),
    numericInputText,
  );
  setText(
    "rentalPeriod",
    readFirstValue(ad, features, ["rental_period"], ["rental_period", "rentalPeriod"]),
  );
  setText("viewType", readFirstValue(ad, features, ["view_type"], ["view_type", "viewType"]));
  setText(
    "checkInTime",
    readFirstValue(ad, features, ["check_in_time"], ["check_in_time", "checkInTime"]),
  );
  setText(
    "checkOutTime",
    readFirstValue(ad, features, ["check_out_time"], ["check_out_time", "checkOutTime"]),
  );
  setText(
    "minStayDays",
    readFirstValue(ad, features, ["min_stay_days"], ["min_stay_days", "minStayDays"]),
    numericInputText,
  );
  setText(
    "evacuationGuarantee",
    readFirstValue(
      ad,
      features,
      ["evacuation_guarantee"],
      ["evacuation_guarantee", "evacuationGuarantee"],
    ),
    numericInputText,
  );
  setText(
    "facadeMaterial",
    readFirstValue(ad, features, ["facade_material"], ["facade_material", "facadeMaterial"]),
  );
  setText(
    "floorMaterial",
    readFirstValue(ad, features, ["floor_material"], ["floor_material", "floorMaterial"]),
  );
  setText(
    "cabinetMaterial",
    readFirstValue(ad, features, ["cabinet_material"], ["cabinet_material", "cabinetMaterial"]),
  );
  setText(
    "buildingType",
    readFirstValue(
      ad,
      features,
      ["building_type", "house_building_type"],
      ["building_type", "buildingType"],
    ),
  );
  setText(
    "villaType",
    readFirstValue(ad, features, ["villa_type", "house_type"], ["villa_type", "villaType"]),
  );
  setText(
    "commercialPosition",
    readFirstValue(
      ad,
      features,
      ["commercial_position"],
      ["commercial_position", "commercialPosition"],
    ),
  );
  setText(
    "ownershipStatus",
    readFirstValue(ad, features, ["ownership_status"], ["ownership_status", "ownershipStatus"]),
  );
  setText(
    "currentStatus",
    readFirstValue(ad, features, ["current_status"], ["current_status", "currentStatus"]),
  );
  setText(
    "industrialPropertyType",
    readFirstValue(
      ad,
      features,
      ["industrial_property_type", "property_type"],
      ["industrial_property_type", "industrialPropertyType"],
    ),
  );
  setText(
    "accessType",
    readFirstValue(ad, features, ["access_type", "access"], ["access_type", "accessType"]),
  );
  setText(
    "landWidth",
    readFirstValue(ad, features, ["land_width"], ["land_width", "landWidth"]),
    numericInputText,
  );
  setText(
    "streetWidth",
    readFirstValue(ad, features, ["street_width"], ["street_width", "streetWidth"]),
    numericInputText,
  );
  setText(
    "ceilingHeight",
    readFirstValue(ad, features, ["ceiling_height", "height"], ["ceiling_height", "ceilingHeight"]),
    numericInputText,
  );
  setText(
    "openingCount",
    readFirstValue(
      ad,
      features,
      ["opening_count", "frontage_count", "openings"],
      ["opening_count", "openingCount"],
    ),
    numericInputText,
  );
  setText(
    "elevatorCount",
    readFirstValue(ad, features, ["elevator_count"], ["elevator_count", "elevatorCount"]),
    elevatorCountText,
  );
  setText(
    "parkingCount",
    readFirstValue(ad, features, ["parking_count"], ["parking_count", "parkingCount"]),
    elevatorCountText,
  );
  setText(
    "terraceCount",
    readFirstValue(ad, features, ["terrace_count"], ["terrace_count", "terraceCount"]),
    elevatorCountText,
  );
  setText(
    "singleRoomCount",
    readFirstValue(ad, features, ["single_room_count"], ["single_room_count", "singleRoomCount"]),
    selectText,
  );
  setText(
    "doubleRoomCount",
    readFirstValue(ad, features, ["double_room_count"], ["double_room_count", "doubleRoomCount"]),
    selectText,
  );
  setText(
    "suiteCount",
    readFirstValue(ad, features, ["suite_count"], ["suite_count", "suiteCount"]),
    selectText,
  );
  setText("price", readFirstValue(ad, features, ["price"], ["price"]), numericInputText);
  setText(
    "mortgagePrice",
    readFirstValue(ad, features, ["mortgage_price"], ["mortgage_price", "mortgagePrice"]),
    numericInputText,
  );
  setText(
    "rentPrice",
    readFirstValue(ad, features, ["rent_price"], ["rent_price", "rentPrice"]),
    numericInputText,
  );
  setText(
    "rentConversionMortgagePrice",
    readFirstValue(
      ad,
      features,
      ["rent_conversion_mortgage_price", "rent_conversion_mortgage"],
      ["rent_conversion_mortgage_price", "rentConversionMortgagePrice"],
    ),
    numericInputText,
  );
  setText(
    "rentConversionPolicy",
    readFirstValue(
      ad,
      features,
      ["rent_conversion_policy", "rent_convertibility", "conversion_policy"],
      ["rent_conversion_policy", "rentConversionPolicy"],
    ),
  );
  setBool(
    "rentConversionEnabled",
    readFirstValue(
      ad,
      features,
      ["rent_conversion_enabled", "rent_convertible", "is_rent_convertible"],
      ["rent_conversion_enabled", "rentConversionEnabled"],
    ),
  );
  setText(
    "minPrice",
    readFirstValue(
      ad,
      features,
      ["min_meter_price", "min_price", "daily_price", "meter_price"],
      ["min_meter_price", "min_price", "minPrice"],
    ),
    numericInputText,
  );
  setText(
    "maxPrice",
    readFirstValue(
      ad,
      features,
      ["max_meter_price", "max_price"],
      ["max_meter_price", "max_price", "maxPrice"],
    ),
    numericInputText,
  );
  setText(
    "normalDailyPrice",
    readFirstValue(
      ad,
      features,
      ["normal_daily_price"],
      ["normal_daily_price", "normalDailyPrice"],
    ),
    numericInputText,
  );
  setText(
    "weekendDailyPrice",
    readFirstValue(
      ad,
      features,
      ["weekend_daily_price"],
      ["weekend_daily_price", "weekendDailyPrice"],
    ),
    numericInputText,
  );
  setText(
    "specialDailyPrice",
    readFirstValue(
      ad,
      features,
      ["special_daily_price"],
      ["special_daily_price", "specialDailyPrice"],
    ),
    numericInputText,
  );
  setText(
    "extraPersonPrice",
    readFirstValue(
      ad,
      features,
      ["extra_person_price"],
      ["extra_person_price", "extraPersonPrice"],
    ),
    numericInputText,
  );
  const rawLoanAmount =
    readFirstValue(ad, features, ["loan_amount"], ["loan_amount", "loanAmount"]) ?? ad.loan?.amount;
  const rawLoanInstallment =
    readFirstValue(ad, features, ["loan_installment"], ["loan_installment", "loanInstallment"]) ??
    ad.loan?.installment;
  setText("loanAmount", rawLoanAmount, numericInputText);
  setText("loanInstallment", rawLoanInstallment, numericInputText);
  setText(
    "virtualTourLink",
    readFirstValue(
      ad,
      features,
      ["virtual_tour_link", "virtual_tour", "tour_3d", "tour3d"],
      ["virtual_tour_link", "virtualTourLink"],
    ),
  );
  setText("title", readFirstValue(ad, features, ["title"], ["title", "label", "name"]));
  next.description = readText(ad.description);
  setText("publisherName", readPublisherName(ad, features));
  setText(
    "agencyId",
    readTextValue(
      ad,
      features,
      ["agency_id", "agencyId", "publisher_agency_id"],
      ["agency_id", "agencyId", "publisher_agency_id"],
    ),
  );
  const resolvedConsultantId = readFirstValue(
    ad,
    features,
    ["assigned_consultant_id", "consultant_id"],
    ["assigned_consultant_id", "assignedConsultantId", "consultant_id", "consultantId"],
  );
  if (resolvedConsultantId) {
    next.consultantAssignmentSelected = false;
    next.consultantId = String(
      resolvedConsultantId && typeof resolvedConsultantId === "object" && "id" in resolvedConsultantId
        ? (resolvedConsultantId as { id: unknown }).id
        : resolvedConsultantId,
    );
  }
  setText(
    "ownerPhone",
    readTextValue(ad, features, ["owner_contact_phone"], ["owner_contact_phone"]),
  );
  setText(
    "ownerFullName",
    readTextValue(
      ad,
      features,
      ["owner_contact_name", "owner_name"],
      ["owner_contact_name", "owner_name"],
    ),
  );
  setText(
    "ownerExactAddress",
    readTextValue(
      ad,
      features,
      ["owner_contact_address", "owner_address"],
      ["owner_contact_address", "owner_address"],
    ),
  );
  setText("telegram", readSocialValue(ad, "telegram"));
  setText("whatsapp", readSocialValue(ad, "whatsapp"));

  mapAdvertisementSpecs(ad, features, next);

  const registrantType = readRegistrantType(ad, features);
  if (registrantType) next.registrantType = registrantType;
  if (!next.registrantType && next.publisherName) next.registrantType = "agency";

  if (contactTypes.length) {
    next.chatEnabled = contactTypes.includes("chat");
    next.phoneEnabled = contactTypes.includes("phone");
  } else {
    const chatContact = toBooleanValue(contacts.chat);
    next.chatEnabled = chatContact ?? next.chatEnabled;
    const phoneNumber = readText(contacts.phone) || readText(ad.owner_phone);
    next.phoneEnabled = Boolean(phoneNumber || next.phoneEnabled);
    if (phoneNumber) next.phoneNumber = phoneNumber;
  }

  syncEditLocationStorage(ad, features, next);

  return next;
}
