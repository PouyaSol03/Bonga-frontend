import { type ReactNode } from "react";

import type { AdvertisementCheckoutPaymentMethod } from "../../../advertisements/api/advertisement.service";
import { type ValidateDiscountCodeResult } from "../../../crm/api/crm-discount.service";
import type { PaymentMethod } from "./checkoutTypes";
export type ApiPaymentCheckoutProps = {
  appliedDiscount?: ValidateDiscountCodeResult | null;
  children?: ReactNode;
  discountError?: string | null;
  discountInput?: string;
  discountLoading?: boolean;
  gatewayMethod?: AdvertisementCheckoutPaymentMethod;
  method: PaymentMethod;
  onApplyDiscount?: () => void;
  onBack: () => void;
  onDiscountInputChange?: (value: string) => void;
  onMethodChange: (method: PaymentMethod) => void;
  onRemoveDiscount?: () => void;
  onSubmit: () => void;
  payableAmount: number;
  pending: boolean;
  totalPrice: number;
  walletMethod?: AdvertisementCheckoutPaymentMethod;
  submitLabelPrefix?: string;
};
