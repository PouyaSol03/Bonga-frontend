import type { AgencySort } from "../agencies/api/agency.service";
import type { AgencyDirectoryMapItem } from "./map/AgencyMap.types";

export type DirectoryMode = "agency" | "consultant";

export type DirectoryItem = AgencyDirectoryMapItem & {
  badge?: string;
};

export type SortOptionId = AgencySort;

export type SortOption = {
  id: SortOptionId;
  label: string;
};
