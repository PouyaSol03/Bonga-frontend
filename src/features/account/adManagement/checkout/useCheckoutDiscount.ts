import { useState } from "react";

import { getApiErrorMessage } from "../../../../shared/api/api";
import {
  validateDiscountCode,
  type ValidateDiscountCodeResult,
} from "../../../crm/api/crm-discount.service";
import type { PaymentMethod } from "./checkoutTypes";
export function useCheckoutDiscount(
  totalPrice: number,
  payableAmount: number,
  setMethod: (method: PaymentMethod) => void,
) {
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<ValidateDiscountCodeResult | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  async function handleApplyDiscount() {
    const code = discountInput.trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError(null);
    try {
      const result = await validateDiscountCode({
        code,
        price: totalPrice || payableAmount,
        service: "advertise",
      });
      setAppliedDiscount(result);
      if (result.disable_gateway || result.is_free || result.final_price === 0) {
        setMethod("wallet");
      }
    } catch (err: unknown) {
      const msg = getApiErrorMessage(
        err,
        err instanceof Error && err.message ? err.message : "کد تخفیف نامعتبر است",
      );
      setDiscountError(msg);
      setAppliedDiscount(null);
    } finally {
      setDiscountLoading(false);
    }
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError(null);
  }
  return {
    discountInput,
    setDiscountInput,
    appliedDiscount,
    setAppliedDiscount,
    discountLoading,
    discountError,
    setDiscountError,
    handleApplyDiscount,
    handleRemoveDiscount,
  };
}
