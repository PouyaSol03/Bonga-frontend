import { type NeighborhoodDto } from "../../locations/api/neighborhood.service";
import { type SelectedNeighborhood } from "./filterTypes";

export const minNeighborhoodSearchLength = 2;

export const neighborhoodSearchDebounceMs = 250;

export function getNeighborhoodOptionId(
  neighborhood: Pick<NeighborhoodDto, "_id" | "id" | "name">,
) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodOptionId(neighborhood),
    name: neighborhood.name,
  };
}
