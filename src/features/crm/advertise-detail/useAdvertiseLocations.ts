import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  listCrmCategories,
  listCrmCities,
  listCrmNeighborhoods,
  type CrmRecord,
} from "../api/crm.service";
import { findRecordNameById, readHumanText, readNestedId, readNestedName, readText } from "./helpers";

export function useAdvertiseLocations({
  advertise,
  advertiseId,
  featureLocation,
  notify,
}: {
  advertise?: CrmRecord;
  advertiseId: string;
  featureLocation?: unknown;
  notify: (message: string, tone?: "error" | "success") => void;
}) {
  const neighborhoodId =
    readText(advertise, ["neighborhood_id"]) ||
    readNestedId(advertise, ["neighborhood", "district"]);
  const cityId = readText(advertise, ["city_id"]) || readNestedId(advertise, ["city"]);
  const categoryId = readText(advertise, ["category_id"]) || readNestedId(advertise, ["category"]);

  const directNeighborhoodName =
    readHumanText(advertise, ["form_neighborhood_title", "neighborhood_name", "district_name"]) ||
    readNestedName(advertise, ["neighborhood", "district"]) ||
    (typeof featureLocation === "string" ? featureLocation.trim() : "");
  const directCityName =
    readHumanText(advertise, ["city_name"]) || readNestedName(advertise, ["city"]);
  const directCategoryName =
    readHumanText(advertise, ["category_name"]) || readNestedName(advertise, ["category"]);

  const neighborhoodQuery = useQuery({
    enabled: Boolean(advertise && neighborhoodId && cityId && !directNeighborhoodName),
    queryFn: () => listCrmNeighborhoods({ cityId }),
    queryKey: ["crm", "advertise", advertiseId, "neighborhoods", cityId],
  });
  const cityQuery = useQuery({
    enabled: Boolean(advertise && cityId && !directCityName),
    queryFn: () => listCrmCities(),
    queryKey: ["crm", "advertise", advertiseId, "cities"],
  });
  const categoryQuery = useQuery({
    enabled: Boolean(advertise && categoryId && !directCategoryName),
    queryFn: listCrmCategories,
    queryKey: ["crm", "advertise", advertiseId, "categories"],
  });

  useEffect(() => {
    const error = neighborhoodQuery.error || cityQuery.error || categoryQuery.error;
    if (error) notify(getApiErrorMessage(error, "دریافت اطلاعات تکمیلی آگهی ناموفق بود."), "error");
  }, [categoryQuery.error, cityQuery.error, neighborhoodQuery.error, notify]);

  const resolvedNeighborhoodName = findRecordNameById(neighborhoodQuery.data ?? [], neighborhoodId);
  const resolvedCityName = findRecordNameById(cityQuery.data ?? [], cityId);
  const resolvedCategoryName = findRecordNameById(categoryQuery.data ?? [], categoryId);

  const neighborhoodName =
    directNeighborhoodName ||
    resolvedNeighborhoodName ||
    (neighborhoodQuery.isLoading ? "در حال دریافت نام محله..." : "نام محله در پاسخ موجود نیست");
  const cityName =
    directCityName ||
    resolvedCityName ||
    (cityQuery.isLoading ? "در حال دریافت نام شهر..." : "نام شهر در پاسخ موجود نیست");
  const categoryName =
    directCategoryName ||
    resolvedCategoryName ||
    (categoryQuery.isLoading ? "در حال دریافت دسته‌بندی..." : "دسته‌بندی آگهی");

  return { categoryName, cityName, neighborhoodName };
}
