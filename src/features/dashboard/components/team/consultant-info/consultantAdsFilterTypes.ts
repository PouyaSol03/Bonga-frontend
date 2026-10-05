import type {
  AdManagementPropertyType,
  AdManagementSelectedNeighborhood,
  AdManagementTransaction,
} from "../../../../account/adManagement/adManagementData";

export type ConsultantAdsFilterState = {
  neighborhoods: AdManagementSelectedNeighborhood[];
  transaction?: AdManagementTransaction;
  propertyTypes: AdManagementPropertyType[];
  status?: string;
};

export const emptyConsultantAdsFilterState: ConsultantAdsFilterState = {
  neighborhoods: [],
  propertyTypes: [],
  status: undefined,
  transaction: undefined,
};

export const CONSULTANT_AD_STATUS_OPTIONS = [
  "فعال",
  "منقضی شده",
  "در انتظار پرداخت",
  "معامله موفق",
  "معامله ناموفق",
  "همه",
];
