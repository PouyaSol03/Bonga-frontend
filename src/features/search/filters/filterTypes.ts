import { type ChipItem } from "../../advertisements/create/types";
import { type TransactionType, type CategoryKey } from "./categories";

export type IconName =
  | "bed"
  | "building"
  | "floor"
  | "location"
  | "money"
  | "orientation"
  | "ruler"
  | "settings"
  | "temperature"
  | "year"
  | "exchange"
  | "agreement"
  | "unitBed"
  | "suitable"
  | "typeBuilding"
  | "city02"
  | "houseDimensions"
  | "star";

export type RangeBlock = {
  id: string;
  kind: "range";
  title: string;
  unit?: string;
  variant: "area" | "money" | "number" | "percent";
  showUnitInTitle?: boolean;
};

export type SingleChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "single";
  options: readonly string[];
  title: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
};

export type MultiChoiceBlock = {
  icon: IconName;
  id: string;
  kind: "multi";
  options: readonly ChipItem[];
  title: string;
  more?: boolean;
  moreLimit?: number;
  moreLabel?: string;
  moreIcon?: "down" | "left";
};

export type ToggleBlock = {
  id: string;
  kind: "toggle";
  title: string;
};

export type DateBlock = {
  id: string;
  kind: "date";
  title: string;
};

export type TimeBlock = {
  id: string;
  kind: "time";
  title: string;
};

export type LoanBlock = {
  kind: "loan";
};

export type RangeGroupBlock = {
  blocks: RangeBlock[];
  id: string;
  kind: "range-group";
};

export type FilterBlock =
  | { kind: "neighborhood" }
  | RangeBlock
  | RangeGroupBlock
  | SingleChoiceBlock
  | MultiChoiceBlock
  | ToggleBlock
  | DateBlock
  | TimeBlock
  | LoanBlock
  | { kind: "advertiser" }
  | { kind: "publicationTime" }
  | { kind: "adFlags" };

export type RangeValue = {
  minimum: string;
  maximum: string;
};

export type SelectedNeighborhood = {
  id: string;
  name: string;
};

export type FilterState = {
  advertiser?: string;
  publicationTime?: string;
  transaction: TransactionType;
  category?: CategoryKey;
  neighborhoods: SelectedNeighborhood[];
  ranges: Record<string, RangeValue | undefined>;
  singles: Record<string, string | undefined>;
  multis: Record<string, string[] | undefined>;
  toggles: Record<string, boolean | undefined>;
  loanAmount: string;
  loanInstallment: string;
  featured: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
};
