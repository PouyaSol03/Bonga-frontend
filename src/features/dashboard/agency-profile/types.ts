
export type SelectedNeighborhood = {
  id: string;
  lat?: number;
  lng?: number;
  name: string;
};

export type AgencyProfileMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

export type AgencyProfileToast = {
  message: string;
  title: string;
  variant: "error" | "success" | "info" | "warning";
};

export type NeighborhoodSelectionSheetProps =
  | {
      isOpen: boolean;
      mode: "single";
      onChange: (neighborhood: SelectedNeighborhood | null) => void;
      onClose: () => void;
      selectedNeighborhood: SelectedNeighborhood | null;
      title: string;
    }
  | {
      isOpen: boolean;
      mode: "multiple";
      onChange: (neighborhoods: SelectedNeighborhood[]) => void;
      onClose: () => void;
      selectedNeighborhoods: SelectedNeighborhood[];
      title: string;
    };
