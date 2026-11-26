import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { DashboardPaymentMobilePage } from "../../src/features/dashboard/payment/DashboardPaymentMobilePage";
import { DashboardPaymentDesktopPage } from "../../src/features/dashboard/payment/DashboardPaymentDesktopPage";
import type { PackageItem } from "../../src/features/packages/api/package.service";

let mockedRole = "real_estate_consultant";

vi.mock("../../src/shared/hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock("../../src/shared/auth/auth-storage", () => ({
  getActiveAuthRole: () => mockedRole,
  getStoredAuthSession: () => ({ mobile: "09123456789" }),
}));

vi.mock("../../src/features/account/api/account.hooks", () => ({
  useWalletQuery: () => ({ data: { credit: 1000 }, isLoading: false, isError: false }),
}));

vi.mock("../../src/features/packages/api/package.hooks", () => ({
  usePackagePaymentMutation: () => ({ isPending: false, mutate: vi.fn() }),
  usePackagesQuery: () => ({ data: [], isLoading: false, isError: false }),
}));

const mockPackages: PackageItem[] = [
  {
    id: "pkg-1",
    title: "اعتبار پنل ۱ ماهه",
    kind: "panel_subscription",
    real_price: 100000,
    final_price: 90000,
    discount_percent: 10,
  } as unknown as PackageItem,
  {
    id: "pkg-2",
    title: "بسته ۱۰۰ عددی آگهی",
    kind: "credit_bundle",
    real_price: 500000,
    final_price: 450000,
    discount_percent: 10,
    ad_credit: 100,
  } as unknown as PackageItem,
];

describe("Consultant payment restriction (Issue #102)", () => {
  it("hides panel credit tab and plans for consultant on mobile", () => {
    mockedRole = "real_estate_consultant";

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DashboardPaymentMobilePage
          error={null}
          isError={false}
          isLoading={false}
          packages={mockPackages}
          refetch={() => {}}
        />
      </MemoryRouter>,
    );

    // Tab switcher should be hidden for consultant
    expect(markup).not.toContain("نوع افزایش اعتبار");
    // Only package bundle is rendered
    expect(markup).toContain("بسته ۱۰۰ عددی آگهی");
    expect(markup).not.toContain("اعتبار پنل ۱ ماهه");
  });

  it("shows panel credit tab and plans for agency manager on mobile", () => {
    mockedRole = "real_estate_manager";

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DashboardPaymentMobilePage
          error={null}
          isError={false}
          isLoading={false}
          packages={mockPackages}
          refetch={() => {}}
        />
      </MemoryRouter>,
    );

    // Tab switcher should be visible for agency
    expect(markup).toContain("نوع افزایش اعتبار");
    expect(markup).toContain("اعتبار پنل");
    expect(markup).toContain("بسته‌ها");
  });

  it("hides panel credit section for consultant on desktop", () => {
    mockedRole = "real_estate_consultant";

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DashboardPaymentDesktopPage
          error={null}
          isError={false}
          isLoading={false}
          packages={mockPackages}
          refetch={() => {}}
        />
      </MemoryRouter>,
    );

    // "اعتبار پنل" section heading should not exist for consultant
    expect(markup).not.toContain("اعتبار پنل");
    // "بسته‌ها" section heading and plan should exist
    expect(markup).toContain("بسته‌ها");
    expect(markup).toContain("بسته ۱۰۰ عددی آگهی");
  });

  it("shows both panel credit and packages sections for agency manager on desktop", () => {
    mockedRole = "real_estate_manager";

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <DashboardPaymentDesktopPage
          error={null}
          isError={false}
          isLoading={false}
          packages={mockPackages}
          refetch={() => {}}
        />
      </MemoryRouter>,
    );

    expect(markup).toContain("اعتبار پنل");
    expect(markup).toContain("اعتبار پنل ۱ ماهه");
    expect(markup).toContain("بسته‌ها");
    expect(markup).toContain("بسته ۱۰۰ عددی آگهی");
  });
});
