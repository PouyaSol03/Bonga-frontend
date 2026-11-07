import {
  getNeighborhoodId,
  type NeighborhoodDto,
} from "../../../locations/api/neighborhood.service";
import type { SelectedNeighborhood } from "./types";

export const neighborhoodSearchDebounceMs = 250;

export { getNeighborhoodId };

export function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    lat: Number.isFinite(Number(neighborhood.lat)) ? Number(neighborhood.lat) : undefined,
    lng: Number.isFinite(Number(neighborhood.lng)) ? Number(neighborhood.lng) : undefined,
    name: neighborhood.name,
  };
}
