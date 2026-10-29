import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../render";
import { useViewAdNavigation } from "../../src/features/advertisements/view/page/useViewAdNavigation";
import { useViewAdQuery } from "../../src/features/advertisements/view/page/useViewAdQuery";
import { useViewAdContact } from "../../src/features/advertisements/view/page/useViewAdContact";
import type { AdvertisementItem } from "../../src/features/advertisements/api/advertisement.service";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  location: { state: null as { from: string } | null },
  session: null as object | null,
  role: "user",
  allocation: false,
  detail: vi.fn(),
  agency: vi.fn(),
  preview: vi.fn(),
  engagement: vi.fn(),
}));
vi.mock("react-router", async (original) => ({
  ...(await original<typeof import("react-router")>()),
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}));
vi.mock("../../src/shared/auth/auth-storage", () => ({
  getStoredAuthSession: () => mocks.session,
  getActiveAuthRole: () => mocks.role,
}));
vi.mock("../../src/features/advertisements/view/viewAdPreviewContext", () => ({
  shouldUseAgencyAllocationPreview: () => mocks.allocation,
}));
vi.mock("../../src/features/advertisements/api/advertisement.hooks", () => ({
  useAdvertisementDetailQuery: mocks.detail,
  useAgencyAdvertisementPreviewQuery: mocks.agency,
  useAdvertisementPreviewQuery: mocks.preview,
}));
vi.mock("../../src/features/advertisements/api/advertisement.service", () => ({
  reportAdvertisementEngagement: mocks.engagement,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.location.state = null;
  mocks.session = null;
  mocks.role = "user";
  mocks.allocation = false;
  mocks.detail.mockReturnValue({ data: { id: 12 } });
  mocks.agency.mockReturnValue({ data: { id: 13 }, isError: false });
  mocks.preview.mockReturnValue({ data: { id: 14, publisher_type: "user" } });
  window.history.replaceState({}, "", "/ads/12");
});

async function navigation() {
  let current!: ReturnType<typeof useViewAdNavigation>;
  function Host() {
    current = useViewAdNavigation();
    return null;
  }
  await render(<Host />);
  return current;
}

async function query() {
  let current!: ReturnType<typeof useViewAdQuery>;
  function Host() {
    current = useViewAdQuery("12", true);
    return null;
  }
  await render(<Host />);
  return current;
}

describe("view ad route and preview selection", () => {
  it("prioritizes in-app history over static preview path, and falls back to preview management", async () => {
    window.history.replaceState({ idx: 2 }, "", "/preview-ad/12");
    mocks.location.state = { from: "/search" };
    (await navigation()).handleBack();
    expect(mocks.navigate).toHaveBeenCalledWith(-1);

    window.history.replaceState({}, "", "/preview-ad/12");
    mocks.location.state = null;
    (await navigation()).handleBack();
    expect(mocks.navigate).toHaveBeenCalledWith("/account/manage-ads/12/state-ad", {
      replace: true,
    });
  });
  it("prefers route state, then browser history, then home", async () => {
    mocks.location.state = { from: "/search?q=1" };
    (await navigation()).handleBack();
    expect(mocks.navigate).toHaveBeenLastCalledWith("/search?q=1", { replace: true });
    mocks.location.state = null;
    window.history.replaceState({ idx: 1 }, "", "/ads/12");
    (await navigation()).handleBack();
    expect(mocks.navigate).toHaveBeenLastCalledWith(-1);
    window.history.replaceState({}, "", "/ads/12");
    (await navigation()).handleBack();
    expect(mocks.navigate).toHaveBeenLastCalledWith("/home", { replace: true });
  });
  it("encodes action and pathname plus search, excludes fragment", async () => {
    window.history.replaceState({}, "", "/ads/12?source=search#images");
    const current = await navigation();
    expect(current.requireAuthorization("ثبت یادداشت")).toBe(false);
    expect(mocks.navigate).toHaveBeenCalledWith(
      `/login-required?${new URLSearchParams({ action: "ثبت یادداشت", returnTo: "/ads/12?source=search" })}`,
    );
    mocks.session = {};
    expect(current.requireAuthorization("ثبت یادداشت")).toBe(true);
    expect(mocks.navigate).toHaveBeenCalledOnce();
  });
  it("disables public detail during personal preview", async () => {
    const current = await query();
    expect(mocks.detail).toHaveBeenCalledWith(null);
    expect(mocks.agency).toHaveBeenCalledWith(null);
    expect(mocks.preview).toHaveBeenCalledWith("12");
    expect(current.ad?.id).toBe(14);
    expect(current.isPersonalPreview).toBe(true);
  });
  it("selects agency allocation preview, falling back only on error", async () => {
    mocks.allocation = true;
    expect((await query()).ad?.id).toBe(13);
    expect(mocks.preview).toHaveBeenLastCalledWith(null);
    mocks.agency.mockReturnValue({ isError: true });
    const current = await query();
    expect(mocks.preview).toHaveBeenLastCalledWith("12");
    expect(current.ad?.id).toBe(14);
    expect(current.isPersonalPreview).toBe(false);
  });
});

describe("view ad engagement and contact sheets", () => {
  it("deduplicates impressions, counts each contact open, rejects invalid ids and previews", async () => {
    let current!: ReturnType<typeof useViewAdContact>;
    let update!: (patch: Partial<Parameters<typeof useViewAdContact>[0]>) => void;
    let props: Parameters<typeof useViewAdContact>[0] = {
      adId: "12",
      ad: { id: 12, status: "published" } as AdvertisementItem,
      isPreview: false,
      isLoading: false,
      isError: false,
    };
    const { useState } = await import("react");
    function Host() {
      const [, rerender] = useState(0);
      update = (patch) => {
        props = { ...props, ...patch };
        rerender((value) => value + 1);
      };
      current = useViewAdContact(props);
      return null;
    }
    await render(<Host />);
    expect(mocks.engagement).toHaveBeenCalledExactlyOnceWith("12", "impression");
    await act(async () => current.open("agency"));
    expect(current.isAgencyContactSheetOpen).toBe(true);
    await act(async () => current.closeAgency());
    await act(async () => current.open("contact"));
    expect(mocks.engagement.mock.calls).toEqual([
      ["12", "impression"],
      ["12", "call"],
      ["12", "call"],
    ]);
    await act(async () => update({ ad: { id: 12, status: "published" } as AdvertisementItem }));
    expect(mocks.engagement).toHaveBeenCalledTimes(3);
    await act(async () =>
      update({ isPreview: true, ad: { id: 13, status: "published" } as AdvertisementItem }),
    );
    await act(async () => current.open("owner"));
    expect(current.isOwnerContactSheetOpen).toBe(true);
    expect(mocks.engagement).toHaveBeenCalledTimes(3);
    await act(async () =>
      update({
        isPreview: false,
        ad: { id: "invalid", status: "published" } as unknown as AdvertisementItem,
      }),
    );
    await act(async () => current.open("contact"));
    expect(mocks.engagement).toHaveBeenCalledTimes(3);
  });
});
