import { type ReactNode } from "react";

import type {
  AdvertisementCheckoutItem,
  AdvertisementCheckoutPaymentMethod,
} from "../../../advertisements/api/advertisement.service";
import type { AgencyPaymentMethod } from "./checkoutTypes";
export type AgencyCombinedCheckoutProps = {
  byConsultantMethod?: AdvertisementCheckoutPaymentMethod;
  children?: ReactNode;
  creditCost: number;
  creditAvailable: boolean;
  creditBalances?: { ad_credit: number; special_credit: number; renew_credit: number };
  creditMethod: AgencyPaymentMethod | null;
  creditPaymentMethod?: AdvertisementCheckoutPaymentMethod;
  creditRemaining: number;
  creditShortage: number;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: AgencyPaymentMethod;
  onBack?: () => void;
  onMethodChange: (method: AgencyPaymentMethod) => void;
  onSubmit: (extraItems?: string[]) => void;
  payableAmount: number;
  pending: boolean;
  price: number;
  showByConsultant?: boolean;
  onlyShowByConsultant?: boolean;
  showPurchaseDetails?: boolean;
  title?: string;
  upgradeItems?: AdvertisementCheckoutItem[];
  walletMethod?: AdvertisementCheckoutPaymentMethod;
};
