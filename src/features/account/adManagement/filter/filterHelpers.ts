import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import type {
  AdManagementFilters,
  AdManagementSelectedNeighborhood,
} from "../adManagementData";

export const neighborhoodSearchDebounceMs = 250;

export const statusOptions = ["در انتظار", "فعال", "غیر فعال", "نیمه کاره"];

export const emptyFilters: AdManagementFilters = {
  neighborhoods: [],
};

export function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function toSelectedNeighborhood(
  neighborhood: NeighborhoodDto,
): AdManagementSelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    name: neighborhood.name,
  };
}

export function buildFilters({
  neighborhoods,
  propertyType,
  propertyTypes,
  publisher,
  status,
  transaction,
}: AdManagementFilters): AdManagementFilters {
  return {
    neighborhoods,
    propertyType: propertyTypes?.[0] ?? propertyType,
    propertyTypes,
    publisher,
    status,
    transaction,
  };
}

export function getInitialPropertyTypes(filters: AdManagementFilters) {
  return filters.propertyTypes ?? (filters.propertyType ? [filters.propertyType] : []);
}
