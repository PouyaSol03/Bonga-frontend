import type { LatLngTuple } from "leaflet";
import type { CrmRecord } from "../api/crm.service";

export type SubNeighborhoodRecord = CrmRecord & {
  geofence?: unknown;
  id: string;
  name: string;
};

export type BoundaryKind = "neighborhood" | "sub-neighborhood";

export type BoundaryItem = {
  id: string;
  kind: BoundaryKind;
  name: string;
  neighborhoodId: string;
  parentName?: string;
  points: LatLngTuple[];
  subId?: string;
};

export type EditTarget =
  | {
      kind: "neighborhood";
      neighborhoodId: string;
    }
  | {
      kind: "new-neighborhood";
    }
  | {
      isNew: boolean;
      kind: "sub-neighborhood";
      neighborhoodId: string;
      subId: string;
    };
