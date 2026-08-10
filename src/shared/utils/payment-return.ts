export type PaymentReturnTarget = {
  kind?: "package" | "wallet_charge";
  label: string;
  path: string;
};

const PAYMENT_RETURN_TARGET_KEY = "bonga-payment-return-target";

export function storePaymentReturnTarget(target: PaymentReturnTarget) {
  window.localStorage.setItem(PAYMENT_RETURN_TARGET_KEY, JSON.stringify(target));
}

export function readPaymentReturnTarget(): PaymentReturnTarget {
  const fallback: PaymentReturnTarget = {
    kind: "wallet_charge",
    label: "بازگشت به کیف پول",
    path: "/account/wallet",
  };

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(PAYMENT_RETURN_TARGET_KEY) ?? "null",
    ) as Partial<PaymentReturnTarget> | null;

    if (!stored || typeof stored.path !== "string" || !stored.path.startsWith("/")) {
      return fallback;
    }

    return {
      kind:
        stored.kind === "package" || stored.kind === "wallet_charge"
          ? stored.kind
          : undefined,
      label:
        typeof stored.label === "string" && stored.label.trim()
          ? stored.label
          : fallback.label,
      path: stored.path,
    };
  } catch {
    return fallback;
  }
}

export function clearPaymentReturnTarget() {
  window.localStorage.removeItem(PAYMENT_RETURN_TARGET_KEY);
}
