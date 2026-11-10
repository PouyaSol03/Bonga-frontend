import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LatLngTuple } from "leaflet";
import {
  getCrmRecordId,
  listCrmCities,
  listCrmNeighborhoods,
  listCrmSubNeighborhoods,
  type CrmRecord,
} from "../api/crm.service";
import { DEFAULT_CENTER, readText } from "../CrmLayout";
import {
  buildBoundaryItems,
  getCitySnapshotFromUrl,
  parseSubNeighborhoods,
} from "./urlAndRecordHelpers";

export function useCrmLocationMapData({
  cityId,
  refreshNonce,
}: {
  cityId: string;
  refreshNonce?: number;
}) {
  const citySnapshot = getCitySnapshotFromUrl();

  const citiesQuery = useQuery({
    queryFn: () => listCrmCities(),
    queryKey: ["crm", "cities", "map", refreshNonce],
  });

  const neighborhoodsQuery = useQuery({
    enabled: Boolean(cityId),
    queryFn: () => listCrmNeighborhoods({ cityId, perPage: 500 }),
    queryKey: ["crm", "neighborhoods", cityId, refreshNonce],
  });

  const baseNeighborhoods = neighborhoodsQuery.data ?? [];
  const neighborhoodIds = useMemo(
    () => baseNeighborhoods.map((item) => getCrmRecordId(item)).filter(Boolean),
    [baseNeighborhoods],
  );

  const subNeighborhoodsQuery = useQuery({
    enabled: Boolean(cityId) && neighborhoodIds.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        neighborhoodIds.map(
          async (neighborhoodId) =>
            [neighborhoodId, await listCrmSubNeighborhoods({ neighborhoodId })] as const,
        ),
      );

      return Object.fromEntries(entries) as Record<string, CrmRecord[]>;
    },
    queryKey: ["crm", "sub-neighborhoods", "map", cityId, neighborhoodIds.join(","), refreshNonce],
  });

  const neighborhoods = useMemo<CrmRecord[]>(
    () =>
      baseNeighborhoods.map((neighborhood) => {
        const neighborhoodId = getCrmRecordId(neighborhood);
        const standaloneSubNeighborhoods = subNeighborhoodsQuery.data?.[neighborhoodId];
        const enrichedNeighborhood: CrmRecord = {
          ...neighborhood,
          sub_neighbors:
            standaloneSubNeighborhoods ??
            (subNeighborhoodsQuery.isSuccess
              ? []
              : parseSubNeighborhoods(neighborhood.sub_neighbors)),
        };

        return enrichedNeighborhood;
      }),
    [baseNeighborhoods, subNeighborhoodsQuery.data, subNeighborhoodsQuery.isSuccess],
  );

  const city = citiesQuery.data?.find((item) => getCrmRecordId(item) === cityId);
  const cityName = city
    ? readText(city, ["name"], citySnapshot.name || `شهر ${cityId}`)
    : citySnapshot.name || `شهر ${cityId}`;

  const cityLat = Number(city?.lat);
  const cityLng = Number(city?.lng);
  const cityCenter: LatLngTuple = [
    city && Number.isFinite(cityLat) ? cityLat : (citySnapshot.lat ?? DEFAULT_CENTER[0]),
    city && Number.isFinite(cityLng) ? cityLng : (citySnapshot.lng ?? DEFAULT_CENTER[1]),
  ];

  const boundaries = useMemo(() => buildBoundaryItems(neighborhoods), [neighborhoods]);
  const allBoundaryPoints = useMemo(() => boundaries.flatMap((item) => item.points), [boundaries]);

  const isLoading =
    neighborhoodsQuery.isLoading ||
    (neighborhoodIds.length > 0 && subNeighborhoodsQuery.isLoading);

  const isError = neighborhoodsQuery.isError || subNeighborhoodsQuery.isError;

  const refetch = () => {
    void neighborhoodsQuery.refetch();
    void subNeighborhoodsQuery.refetch();
  };

  return {
    allBoundaryPoints,
    baseNeighborhoods,
    boundaries,
    cityCenter,
    cityName,
    isError,
    isLoading,
    neighborhoodIds,
    neighborhoods,
    refetch,
  };
}
