import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useCheckoutSubmission } from "../../src/features/account/adManagement/checkout/useCheckoutSubmission";
import type { CheckoutContext } from "../../src/features/account/adManagement/checkout/useCheckoutContext";
import type { CheckoutNavigation } from "../../src/features/account/adManagement/checkout/useCheckoutNavigation";
import type { CheckoutResources } from "../../src/features/account/adManagement/checkout/useCheckoutResources";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(), showToast: vi.fn(), clearAgency: vi.fn(), clearNew: vi.fn(), storeReturn: vi.fn(),
}));
vi.mock("react-router", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("../../src/shared/hooks/useToast", () => ({ useToast: () => mocks }));
vi.mock("../../src/shared/utils/payment-return", () => ({ storePaymentReturnTarget: mocks.storeReturn }));
vi.mock("../../src/features/account/adManagement/adManagementData", () => ({
  clearAgencyAllocationCheckout: mocks.clearAgency,
  clearNewAdCheckout: mocks.clearNew,
}));
vi.mock("../../src/shared/api/api", () => ({
  getApiErrorCode: (error: { code?: string }) => error?.code,
  getApiErrorMessage: (error: { message?: string }, fallback: string) => error?.message || fallback,
}));

function setup(overrides: Partial<CheckoutContext> = {}, pending = false, target: unknown = 123) {
  const personal = vi.fn();
  const agency = vi.fn();
  const consultant = vi.fn();
  const resources = {
    checkoutPending: pending,
    personalCheckoutMutation: { mutate: personal },
    agencyCheckoutMutation: { mutate: agency },
    consultantCheckoutMutation: { mutate: consultant },
  } as unknown as CheckoutResources;
  const context = {
    routeState: { consultantId: "fallback" }, adsHomePath: "/ads",
    isAgencyCheckout: false, isConsultantCheckout: false,
    isAgencyAllocationCheckout: false, isNewAdCheckout: false, ...overrides,
  } as CheckoutContext;
  const navigation = { stateAdPath: "/state/42", publishState: { status: "pending" } } as CheckoutNavigation;
  let finish!: ReturnType<typeof useCheckoutSubmission>;
  function Probe() {
    finish = useCheckoutSubmission("42", resources, context, navigation, target, null);
    return null;
  }
  renderToStaticMarkup(<Probe />);
  return { finish, personal, agency, consultant };
}

beforeEach(() => vi.clearAllMocks());

describe("checkout submission routing and payload", () => {
  test.each(["personal", "agency", "consultant"] as const)("routes %s mutation; preserves order and deduplication", (role) => {
    const fixture = setup({ isAgencyCheckout: role === "agency", isConsultantCheckout: role === "consultant" });
    fixture.finish("wallet", ["advertise_update", "advertise_publish", "advertise_update", "advertise_special"]);
    expect(fixture[role]).toHaveBeenCalledOnce();
    const payload = fixture[role].mock.calls[0][0];
    expect(payload).toEqual({ advertiseId: "42", discount_code: undefined,
      items: ["advertise_publish", "advertise_update", "advertise_special"], paymentMethod: "wallet",
      ...(role === "agency" ? { consultantId: undefined } : {}),
    });
    const otherRoles = ["personal", "agency", "consultant"].filter((r) => r !== role);
    for (const other of otherRoles) expect(fixture[other as typeof role]).not.toHaveBeenCalled();
  });

  test("pending suppresses submission", () => {
    const fixture = setup({}, true);
    fixture.finish("gateway");
    expect(fixture.personal).not.toHaveBeenCalled();
  });

  test.each([[123, "123"], [null, "fallback"], [0, "fallback"]])("consultant ID %s uses existing truthy precedence", (target, expected) => {
    const fixture = setup({ isAgencyCheckout: true }, false, target);
    fixture.finish("by_consultant");
    expect(fixture.agency.mock.calls[0][0].consultantId).toBe(expected);
  });

  test("agency wins over consultant checkout", () => {
    const fixture = setup({ isAgencyCheckout: true, isConsultantCheckout: true });
    fixture.finish("wallet");
    expect(fixture.agency).toHaveBeenCalledOnce();
    expect(fixture.consultant).not.toHaveBeenCalled();
  });
});

describe("checkout completion", () => {
  test("by consultant clears markers before returning to status list", () => {
    const fixture = setup({ isAgencyCheckout: true, isAgencyAllocationCheckout: true, isNewAdCheckout: true });
    fixture.finish("by_consultant");
    fixture.agency.mock.calls[0][1].onSuccess({ paymentUrl: null });
    expect(mocks.clearAgency).toHaveBeenCalledWith("42");
    expect(mocks.clearNew).toHaveBeenCalledWith("42");
    expect(mocks.navigate).toHaveBeenCalledWith("/ads", { replace: true, state: { tab: "status" } });
  });

  test("wallet completion retains publish state", () => {
    const fixture = setup();
    fixture.finish("wallet");
    fixture.personal.mock.calls[0][1].onSuccess({ paymentUrl: null });
    expect(mocks.navigate).toHaveBeenCalledWith("/state/42", { replace: true, state: { status: "pending" } });
  });

  test("missing gateway URL shows exact error instead of navigation", () => {
    const fixture = setup();
    fixture.finish("gateway");
    fixture.personal.mock.calls[0][1].onSuccess({ paymentUrl: null });
    expect(mocks.showToast).toHaveBeenCalledWith("آدرس درگاه پرداخت از سرور دریافت نشد.", "خطا", "error");
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.storeReturn).not.toHaveBeenCalled();
  });

  test("waiting-for-agency error redirects without toast", () => {
    const fixture = setup();
    fixture.finish("wallet");
    fixture.personal.mock.calls[0][1].onError({ code: "AD_WAITING_FOR_AGENCY" });
    expect(mocks.navigate).toHaveBeenCalledWith("/state/42", {
      replace: true, state: { returnTo: "/ads", status: "wait_for_agency", tab: "status" },
    });
    expect(mocks.showToast).not.toHaveBeenCalled();
  });

  test("other API errors retain server message", () => {
    const fixture = setup();
    fixture.finish("wallet");
    fixture.personal.mock.calls[0][1].onError({ message: "server error" });
    expect(mocks.showToast).toHaveBeenCalledWith("server error", "خطا", "error");
  });
});
