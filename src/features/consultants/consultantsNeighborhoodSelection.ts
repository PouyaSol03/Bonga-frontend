import type { NeighborhoodDto } from "../locations/api/neighborhood.service";

const selectedNeighborhoodStorageKey =
  "bonga-consultants-selected-neighborhood";

type StoredConsultantsNeighborhood = {
  cityId?: string;
  id: string;
  name: string;
};

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? "");
}

export function readConsultantsSelectedNeighborhood(
  expectedCityId?: string,
): NeighborhoodDto | null {
  try {
    const storedValue = window.sessionStorage.getItem(
      selectedNeighborhoodStorageKey,
    );

    if (!storedValue) return null;

    const parsedValue = JSON.parse(
      storedValue,
    ) as Partial<StoredConsultantsNeighborhood>;
    const id = typeof parsedValue.id === "string" ? parsedValue.id : "";
    const name = typeof parsedValue.name === "string" ? parsedValue.name : "";
    const cityId =
      typeof parsedValue.cityId === "string" ? parsedValue.cityId : undefined;

    if (!id || !name) return null;

    if (expectedCityId && cityId && expectedCityId !== cityId) {
      clearConsultantsSelectedNeighborhood();
      return null;
    }

    return { city_id: cityId, id, name };
  } catch {
    return null;
  }
}

export function saveConsultantsSelectedNeighborhood(
  neighborhood: NeighborhoodDto,
  selectedCityId?: string,
) {
  const id = getNeighborhoodId(neighborhood);

  if (!id || !neighborhood.name) return;

  try {
    window.sessionStorage.setItem(
      selectedNeighborhoodStorageKey,
      JSON.stringify({
        cityId:
          selectedCityId ??
          (neighborhood.city_id === undefined || neighborhood.city_id === null
            ? undefined
            : String(neighborhood.city_id)),
        id,
        name: neighborhood.name,
      } satisfies StoredConsultantsNeighborhood),
    );
  } catch {
    // Ignore storage failures.
  }
}

export function clearConsultantsSelectedNeighborhood() {
  try {
    window.sessionStorage.removeItem(selectedNeighborhoodStorageKey);
  } catch {
    // Ignore storage failures.
  }
}
