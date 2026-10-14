export type AgencyDirectoryMapItem = {
  address?: string;
  id?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  name: string;
  neighborhoodIds?: string[];
  rank: string;
  score: string;
};

export type AgencyDirectoryMapViewProps = {
  center?: {
    latitude: number;
    longitude: number;
  };
  confirmDisabled?: boolean;
  confirmLabel?: string;
  items: AgencyDirectoryMapItem[];
  listLabel?: string;
  onBack: () => void;
  onConfirmSelection?: () => void;
  onOpenAgency: (item: AgencyDirectoryMapItem) => void;
  onOpenList: () => void;
  onSearchChange?: (value: string) => void;
  onSelectAgency: (id: string | null) => void;
  profileLabel?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  selectedAgencyId: string | null;
  title?: string;
  variant?: "directory" | "selection";
};
