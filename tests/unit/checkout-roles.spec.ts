import { beforeEach, expect, test, vi } from "vitest";
import { useCheckoutContext } from "../../src/features/account/adManagement/checkout/useCheckoutContext";
import { useCheckoutResources } from "../../src/features/account/adManagement/checkout/useCheckoutResources";
import { INDEPENDENT_CONSULTANT, REAL_ESTATE_CONSULTANT, REAL_ESTATE_MANAGER, USER } from "../../src/shared/constants/roles.constants";

const mocks = vi.hoisted(() => ({
  role: "USER", v2Role: "user", routeState: {} as Record<string, unknown>,
  session: {} as Record<string, unknown>, allocation: false, newAd: false,
  personal: vi.fn(() => ({ source: "personal" })),
  agency: vi.fn(() => ({ source: "agency" })),
  consultant: vi.fn(() => ({ source: "consultant" })),
  entitlements: vi.fn(), wallet: vi.fn(),
}));
vi.mock("../../src/shared/api/api", () => ({ getActiveV2Role: () => mocks.v2Role }));
vi.mock("../../src/shared/auth/auth-storage", () => ({
  getActiveAuthRole: () => mocks.role, getStoredAuthSession: () => mocks.session,
}));
vi.mock("../../src/features/account/adManagement/adManagementData", () => ({
  adManagementPaths: { root: "/ads" }, getAdManagementRouteState: () => mocks.routeState,
  hasAgencyAllocationCheckoutMarker: () => mocks.allocation,
  hasNewAdCheckoutMarker: () => mocks.newAd,
}));
vi.mock("../../src/features/advertisements/api/advertisement.hooks", () => ({
  useAdvertisementCheckoutQuery: mocks.personal,
  useAgencyAdvertisementCheckoutQuery: mocks.agency,
  useConsultantAdvertisementCheckoutQuery: mocks.consultant,
  useSubmitAdvertisementCheckoutMutation: () => ({ isPending: false }),
  useSubmitAgencyAdvertisementCheckoutMutation: () => ({ isPending: true }),
  useSubmitConsultantAdvertisementCheckoutMutation: () => ({ isPending: false }),
}));
vi.mock("../../src/features/packages/api/package.hooks", () => ({ useAgentEntitlementsQuery: mocks.entitlements }));
vi.mock("../../src/features/account/api/account.hooks", () => ({ useWalletQuery: mocks.wallet }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.role = USER;
  mocks.v2Role = "user";
  mocks.routeState = {};
  mocks.session = {};
  mocks.allocation = false;
  mocks.newAd = false;
});

test.each([
  [USER, "personal", false],
  [INDEPENDENT_CONSULTANT, "personal", true],
  [REAL_ESTATE_CONSULTANT, "consultant", true],
  [REAL_ESTATE_MANAGER, "agency", true],
])("role %s preserves query and business UI selection", (role, source, business) => {
  mocks.role = role;
  const context = useCheckoutContext("42");
  const resources = useCheckoutResources("42", context);
  expect(resources.checkoutQuery).toEqual({ source });
  expect(resources.checkoutPending).toBe(source === "agency");
  expect(context.combineCheckoutSteps).toBe(business);
  expect(mocks.personal).toHaveBeenCalledWith("42", source === "personal");
  expect(mocks.agency).toHaveBeenCalledWith("42", source === "agency");
  expect(mocks.consultant).toHaveBeenCalledWith("42", source === "consultant");
  expect(mocks.entitlements).toHaveBeenCalledWith({ enabled: business });
  expect(mocks.wallet).toHaveBeenCalledOnce();
});

test("ad management permission sends consultant through agency endpoint", () => {
  mocks.role = REAL_ESTATE_CONSULTANT;
  mocks.session = { managerPermissions: { manage_advertises: true } };
  expect(useCheckoutContext("42")).toMatchObject({ isAgencyCheckout: true, isConsultantCheckout: false });
});

test("explicit context false overrides legacy manager permission", () => {
  mocks.role = REAL_ESTATE_CONSULTANT;
  mocks.session = {
    contextPermissions: { real_estate_consultant: { manage_advertises: false } },
    managerPermissions: { manage_advertises: true },
  };
  expect(useCheckoutContext("42")).toMatchObject({ isAgencyCheckout: false, isConsultantCheckout: true });
});

test.each(["agency", "agent", "consultant"])("publisher %s selects endpoint independently from business role", (publisherType) => {
  mocks.routeState = { publisherType };
  expect(useCheckoutContext("42")).toMatchObject({
    isAgencyCheckout: publisherType === "agency", isConsultantCheckout: publisherType !== "agency",
    combineCheckoutSteps: publisherType === "agency", isBusinessRole: false,
  });
});

test("allocation marker wins over consultant publisher; new ad marker preserved", () => {
  mocks.routeState = { publisherType: "consultant" };
  mocks.allocation = true;
  mocks.newAd = true;
  expect(useCheckoutContext("42")).toMatchObject({
    isAgencyCheckout: true, isConsultantCheckout: false,
    isAgencyAllocationCheckout: true, isNewAdCheckout: true,
  });
});
