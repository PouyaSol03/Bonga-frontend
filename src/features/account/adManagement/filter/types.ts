import type {
  AdManagementPropertyType,
  AdManagementSelectedNeighborhood,
  AdManagementTransaction,
} from "../adManagementData";

export type PublisherFilterOption = {
  id: string;
  image?: string;
  name: string;
  type: "agency" | "consultant";
};

export type PropertyTypeSelectionScreenProps = {
  initialPropertyTypes: AdManagementPropertyType[];
  transaction: AdManagementTransaction;
  onBack: () => void;
  onConfirm: (propertyTypes: AdManagementPropertyType[]) => void;
};

export type NeighborhoodPickerRowProps = {
  onChange: (neighborhoods: AdManagementSelectedNeighborhood[]) => void;
  selectedNeighborhoods: AdManagementSelectedNeighborhood[];
};
