export type SearchMapQuickFilterId =
  | "category"
  | "neighborhood"
  | "area"
  | "price"
  | "rooms"
  | "floor"
  | "building_age";

export type SearchMapQuickFilterBottomSheetProps = {
  filterId: SearchMapQuickFilterId | null;
  isOpen: boolean;
  onApply: (params: URLSearchParams) => void;
  onClose: () => void;
  resultCount: number;
  search: string;
};

export type AreaBound = "minimum" | "maximum";
