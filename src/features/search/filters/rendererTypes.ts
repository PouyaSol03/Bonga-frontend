import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import { type FilterBlock, type FilterState, type RangeValue } from "./filterTypes";

export type FilterBlockRendererProps = {
  applyButtonLabel: ReactNode;
  block: FilterBlock;
  filters: FilterState;
  focusTarget?: string | null;
  nextBlock?: FilterBlock;
  onApply: () => void;
  previousBlock?: FilterBlock;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  setRangeValue: (id: string, key: keyof RangeValue, value: string) => void;
  setSingleValue: (id: string, value: string) => void;
  setToggleValue: (id: string, checked: boolean) => void;
  toggleMultiValue: (id: string, value: string) => void;
};
