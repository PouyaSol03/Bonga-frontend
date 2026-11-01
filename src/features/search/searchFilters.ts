import type { AdvertisementSearchFilters } from "../advertisements/api/advertisement.service";

export const searchMapMinQueryLength = 1;

const featureFilterParamKeys = new Set([
  "land_area",
  "land_area_min",
  "land_area_max",
  "building_area",
  "building_area_min",
  "building_area_max",
  "total_floors",
  "units_per_floor",
  "unit_type",
  "unit_position",
  "document_type",
  "land_use",
  "suitable_for",
  "occupancy_status",
  "pet_policy",
  "ready_delivery_date",
  "min_contract_months",
  "min_contract_months_min",
  "min_contract_months_max",
  "rent_conversion_policy",
  "kitchen_type",
  "renovated",
  "furnished",
  "land_position",
  "building_type",
  "villa_type",
  "commercial_position",
  "ownership_status",
  "accommodation_type",
  "hotel_stars",
  "office_position",
  "office_document_type",
  "has_document",
  "management_room",
  "conference_room",
  "reception_hall",
  "signboard",
  "kitchen",
  "separate_entrance",
  "facade_material",
  "floor_material",
  "cabinet_material",
  "current_status",
  "industrial_property_type",
  "access_type",
  "density",
  "density_min",
  "density_max",
  "land_width",
  "land_width_min",
  "land_width_max",
  "street_width",
  "street_width_min",
  "street_width_max",
  "build_permit",
  "commercial_permit",
  "height",
  "height_min",
  "height_max",
  "opening_count",
  "opening_count_min",
  "opening_count_max",
  "space_type",
  "standard_capacity",
  "rental_period",
  "view_type",
  "check_in_time",
  "check_out_time",
  "min_stay_days",
  "min_stay_days_min",
  "min_stay_days_max",
  "evacuation_guarantee",
  "evacuation_guarantee_min",
  "evacuation_guarantee_max",
  "normal_daily_price",
  "normal_daily_price_min",
  "normal_daily_price_max",
  "weekend_daily_price",
  "weekend_daily_price_min",
  "weekend_daily_price_max",
  "special_daily_price",
  "special_daily_price_min",
  "special_daily_price_max",
  "extra_person_price",
  "extra_person_price_min",
  "extra_person_price_max",
  "project_type",
  "project_status",
  "delivery_date",
  "project_total_floors",
  "project_total_floors_min",
  "project_total_floors_max",
  "project_total_units",
  "project_total_units_min",
  "project_total_units_max",
  "sale_terms_percent",
  "sale_terms_percent_min",
  "sale_terms_percent_max",
  "sale_terms_installment_months",
  "sale_terms_installment_months_min",
  "sale_terms_installment_months_max",
  "builder_share",
  "builder_share_min",
  "builder_share_max",
  "partnership_type",
  "installment_sale",
  "min_meter_price",
  "max_meter_price",
  "heating_cooling",
  "facilities",
]);

const standardSearchParamKeys = new Set([
  "area_max",
  "area_min",
  "building_age",
  "category_id",
  "categoryId",
  "floor",
  "form_code",
  "from_code",
  "has_image",
  "has_video",
  "is_special",
  "neighborhood_id",
  "neighborhoods",
  "price_max",
  "price_min",
  "published_at",
  "query",
  "q",
  "qsearch",
  "rooms",
  "city_id",
  "page",
  "per_page",
  "view",
  "focus",
  "returnTo",
]);

export function getSearchQuery(params: URLSearchParams) {
  return (params.get("query") || params.get("qsearch") || params.get("q") || "").trim();
}

export function getApiSearchQuery(params: URLSearchParams) {
  const query = getSearchQuery(params);

  return query.length >= searchMapMinQueryLength ? query : undefined;
}

export function readSearchFilters(params: URLSearchParams): AdvertisementSearchFilters {
  const featureFilters: Record<string, string> = {};

  featureFilterParamKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      featureFilters[key] = value;
    }
  });

  params.forEach((value, key) => {
    if (!standardSearchParamKeys.has(key) && value && !featureFilters[key]) {
      featureFilters[key] = value;
    }
  });

  return {
    areaMax: params.get("area_max") || undefined,
    areaMin: params.get("area_min") || undefined,
    buildingAge: params.get("building_age") || undefined,
    categoryId: params.get("category_id") || undefined,
    floor: params.get("floor") || undefined,
    formCode: params.get("form_code") || params.get("from_code") || undefined,
    hasImage: params.get("has_image") || undefined,
    hasVideo: params.get("has_video") || undefined,
    isSpecial: params.get("is_special") || undefined,
    neighborhoodId: params.get("neighborhood_id") || params.get("neighborhoods") || undefined,
    priceMax: params.get("price_max") || undefined,
    priceMin: params.get("price_min") || undefined,
    publishedAt: params.get("published_at") || undefined,
    query: getApiSearchQuery(params),
    rooms: params.get("rooms") || undefined,
    featureFilters,
  };
}
