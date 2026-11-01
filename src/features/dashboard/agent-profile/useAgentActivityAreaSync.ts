import { useEffect } from "react";
import { getNeighborhoodInfo } from "../../locations/api/neighborhood.service";
import type { SelectedNeighborhood } from "./types";

export function useAgentActivityAreaSync({
  neighborhoodNameById,
  neighborhoodsCount,
  selectedActivityAreas,
  setSelectedActivityAreas,
}: {
  neighborhoodNameById: Map<string, string>;
  neighborhoodsCount: number;
  selectedActivityAreas: SelectedNeighborhood[];
  setSelectedActivityAreas: React.Dispatch<React.SetStateAction<SelectedNeighborhood[]>>;
}) {
  useEffect(() => {
    if (!selectedActivityAreas.length) return;

    selectedActivityAreas.forEach((area) => {
      if (area.name === area.id) {
        const found = neighborhoodNameById.get(area.id);
        if (found) {
          setSelectedActivityAreas((current) =>
            current.map((item) => (item.id === area.id ? { ...item, name: found } : item)),
          );
        } else {
          void getNeighborhoodInfo(area.id).then((info) => {
            if (info?.name) {
              setSelectedActivityAreas((current) =>
                current.map((item) => (item.id === area.id ? { ...item, name: info.name } : item)),
              );
            }
          });
        }
      }
    });
  }, [neighborhoodNameById, selectedActivityAreas, setSelectedActivityAreas]);

  useEffect(() => {
    if (!neighborhoodsCount) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedActivityAreas((current) =>
      current.map((area) => ({
        ...area,
        name: neighborhoodNameById.get(area.id) ?? area.name,
      })),
    );
  }, [neighborhoodNameById, neighborhoodsCount, setSelectedActivityAreas]);
}
