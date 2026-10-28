import { type FilterState } from "./filterTypes";

export const initialFilters: FilterState = {
  transaction: "sale",
  category: undefined,
  advertiser: undefined,
  publicationTime: undefined,
  neighborhoods: [],
  ranges: {},
  singles: {},
  multis: {},
  toggles: {},
  loanAmount: "",
  loanInstallment: "",
  featured: false,
  hasPhoto: false,
  hasVideo: false,
};
