export type SelectedNeighborhood = {
  id: string;
  lat?: number;
  lng?: number;
  name: string;
};

type BaseNeighborhoodSelectionSheetProps = {
  cityId?: string;
  cityName?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export type NeighborhoodSelectionSheetProps = BaseNeighborhoodSelectionSheetProps &
  (
    | {
        mode: "single";
        onChange: (neighborhood: SelectedNeighborhood | null) => void;
        selectedNeighborhood: SelectedNeighborhood | null;
        selectedNeighborhoods?: never;
      }
    | {
        mode?: "multiple";
        onChange: (neighborhoods: SelectedNeighborhood[]) => void;
        selectedNeighborhoods: SelectedNeighborhood[];
        selectedNeighborhood?: never;
      }
  );
