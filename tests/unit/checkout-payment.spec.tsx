import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, test, vi } from "vitest";
vi.mock("../../src/shared/hooks/useToast", () => ({ useToast: () => ({ showToast: vi.fn() }) }));
import { ApiPaymentCheckoutView } from "../../src/features/account/adManagement/IndependentConsultantAdPaymentPage";

function renderPayment(overrides: Partial<React.ComponentProps<typeof ApiPaymentCheckoutView>> = {}) {
  const props = {
    method: "wallet" as const,
    onBack: () => {},
    onMethodChange: () => {},
    onSubmit: () => {},
    payableAmount: 100,
    pending: false,
    totalPrice: 150,
    walletMethod: { method: "wallet", balance: 20 },
    gatewayMethod: { method: "gateway", available: true },
    ...overrides,
  };
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter><ApiPaymentCheckoutView {...props} /></MemoryRouter>
    </QueryClientProvider>,
  );
  return container;
}

function submit(container: HTMLElement) {
  return container.querySelector("footer button") as HTMLButtonElement;
}

describe("checkout payment behavior", () => {
  test("insufficient wallet stays selectable; submission disabled; top-up shown", () => {
    const container = renderPayment();
    const wallet = [...container.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("کیف پول"),
    )!;
    expect(wallet.disabled).toBe(false);
    expect(wallet.getAttribute("aria-pressed")).toBe("true");
    expect(container.textContent).toContain("افزایش موجودی");
    expect(submit(container).disabled).toBe(true);
  });

  test("server shortage wins over a sufficient local balance", () => {
    expect(submit(renderPayment({ walletMethod: { method: "wallet", balance: 200, shortage: 1 } })).disabled).toBe(true);
  });

  test("discount replaces server required amount and shortage", () => {
    const container = renderPayment({
      payableAmount: 10,
      appliedDiscount: { code: "SAVE", final_price: 10, discount_percent: 90, valid: true, discount_amount: 90, is_free: false, disable_gateway: false, message: "" },
      walletMethod: { method: "wallet", balance: 20, required: 100, shortage: 80 },
    });
    expect(submit(container).disabled).toBe(false);
    expect(container.textContent).not.toContain("افزایش موجودی");
    expect(container.textContent).toContain("SAVE (90٪ تخفیف)");
  });

  test("full discount permits free submission without wallet or gateway", () => {
    const container = renderPayment({
      appliedDiscount: { code: "FREE", final_price: 0, discount_percent: 100, is_free: true, valid: true, discount_amount: 100, disable_gateway: true, message: "" },
      payableAmount: 0,
      walletMethod: undefined,
      gatewayMethod: undefined,
    });
    expect(submit(container).disabled).toBe(false);
    expect(submit(container).textContent).toBe("تأیید و ثبت رایگان");
    expect(container.textContent).toContain("درگاه پرداخت برای تخفیف ۱۰۰٪ غیرفعال است");
  });

  test("pending always disables submission", () => {
    expect(submit(renderPayment({ method: "online", pending: true })).disabled).toBe(true);
  });

  test("missing gateway disables online submission", () => {
    expect(submit(renderPayment({ method: "online", gatewayMethod: undefined })).disabled).toBe(true);
  });
});
