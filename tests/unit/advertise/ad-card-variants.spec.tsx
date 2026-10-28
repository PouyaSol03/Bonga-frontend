import { createHash } from "node:crypto";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, test, vi } from "vitest";
import { AdCard, type AdCardData } from "../../../src/features/advertisements/components/AdCard";

const ad: AdCardData = {
  id: 42, title: "آپارتمان", agency: "آژانس", status: "فعال", imageCount: "۳",
  priceLabelPrimary: "", pricePrimary: "۱۰۰", priceLabelSecondary: "", priceSecondary: "۲۰۰",
  area: "۱۲۰", rooms: "۲", year: "۵", timeAndLocation: "تهران", imageClassName: "custom-image",
  imageUrl: "/image.jpg", badges: ["فوری"],
};

afterEach(() => window.history.replaceState(null, "", "/"));

describe("AdCard variants characterization", () => {
  test("preserves exact markup and ignored variant props", () => {
    const hashes = Object.fromEntries((["standard", "dashboard", "requestResult", "mapPreview", "carousel"] as const).flatMap((variant) =>
      [false, true].map((flags) => {
        const markup = renderToStaticMarkup(<MemoryRouter><AdCard
          ad={ad} variant={variant} className="custom-card" ariaLabel="custom-label"
          showAgency={flags} showBadges={flags} showImageCount={flags} showStatusBadge={flags}
          isSelected={flags} mapSliderCardId={42} imageLoading={flags ? "lazy" : "eager"}
          imageAction={<button>action</button>} imageMeta={<span>meta</span>} topBadge={<b>top</b>}
          mapPreviewImages={flags ? ["/one.jpg", "/two.jpg"] : []}
        /></MemoryRouter>);
        return [`${variant}/${flags}`, createHash("sha256").update(markup).digest("hex")];
      }),
    ));
    expect(hashes).toMatchInlineSnapshot(`
      {
        "carousel/false": "9cb6b6cbd6271489c4de0703b10c617f362d7cb469238f7b730e8a0de77721ea",
        "carousel/true": "5a38882eaaae31f45274581b7f206d6e10efc3d12d316dc754bff2ff61bdfaa4",
        "dashboard/false": "794b2502eeca6bcfbad8bc539d1e7191254045b8453ede884535f47cfbd02d66",
        "dashboard/true": "09a768a6f3bdd86274ab852b3a81ae975703b53d23f284dd72fc5d2c9e408a60",
        "mapPreview/false": "b0d6a5b8f8588642c332cca0d08b1084eb15f43789db01a5ccb526ea10490694",
        "mapPreview/true": "4de1105257c5015770df8983d6cb9cc0322ce6f76e65226dde3e20604afc1f3c",
        "requestResult/false": "b9e63797ce9eff1107691e4d29aa1e6b3cd17af34aa86ab0695da21cbd19e75d",
        "requestResult/true": "8aca6027c9c73f88f7a38f97cdb72aac814e026326523adfe7943f4f60f63fe8",
        "standard/false": "94169ebc01580eff0b4889e2e30c153c70247a47ffe541cfef2adac4e364f235",
        "standard/true": "03bce3c44f418ad0d6bcee4d2f8d485c7e09a933a36d1b13c0ee44b24c5c60a2",
      }
    `);
  });

  test("preserves status normalization, personal agency, and incomplete image suppression", () => {
    const hashes = Object.fromEntries([
      "رد شده", "در انتظار پرداخت", "rejected payment", "غیر‌فعال", "نیمه‌کاره", "draft", "incomplete", "-5",
      "pending", "accepted", "publish", "unknown", "-1", "-2", "-3", "0", "1", "2", "3", "تاييد شده",
    ].map((status) => {
      const markup = renderToStaticMarkup(<MemoryRouter><AdCard
        ad={{ ...ad, status, agency: " شخصی " }} showStatusBadge imageMeta={<span>meta</span>}
      /></MemoryRouter>);
      return [status, createHash("sha256").update(markup).digest("hex")];
    }));
    expect(hashes).toMatchInlineSnapshot(`
      {
        "-1": "f2093da11ea2d6939a4b5453e18be9ade95b2d796ba4051c93a03d792384be6d",
        "-2": "ce33781a732958983fd097cc0b34c1cb83592640fa1c538030592b3057b93550",
        "-3": "ba66ac2d01cc54aebd8dbd9612cedc243da4bfcec34a79cf0a2e5fd43b99f3b1",
        "-5": "fed2b1698062b17dc281b58a08aa95d62b0853a7ffa61d5c6aeb9b699f02e6fe",
        "0": "2c817b10993dc5fe8f28d5f4756dd96fc8b28f341546ebfc1a7b3a01c15be30d",
        "1": "a49b044cfe2d4ea9552bf4d4a2f31990f8c335b49933f8febfee6a65db332d53",
        "2": "4387fb4b35fad9c07b109c98d04bfddf5543998ea14ca949c4b5d1963be8706a",
        "3": "e550400abaa4f24ae6022798284f5d2ef6b7008670d9d6afaa81512f0b88da8d",
        "accepted": "8d3c5792ab698f99ce9f7acc8a566b900a1f0f5d30aaf255eaa6ac3f720811c4",
        "draft": "81dc26c7565d0f9de3510b92c8d38a17e3e32ca9ceebef3881317b1c60d10808",
        "incomplete": "9c10e76f9934fd8a02e19fa62231e9f5d9f1519f9a04a5f24d36d130dc87c5da",
        "pending": "9e6d1dd7bdf0d597a3da9e5d4d024eec372ca3bf201969e2ab924fde3466f82f",
        "publish": "48eb3ee6e51dbfa14b98d399e0f67cc37e836a9688ec614e684c26186bd614b2",
        "rejected payment": "707cea7f3f7269715776af9443b37e6ad5b773a9c8cc46a7b8b696b5d3703507",
        "unknown": "100a6f3792141db18a23e6ca3a14bd024d30920435691355b3f1d2e21e30b26c",
        "تاييد شده": "e7b7919bb1cdedb02b050db0cce5fc96e31ce28b9a0cc2571836ec7a4e0fd2de",
        "در انتظار پرداخت": "ddce78f364cc391eed56589578bbc20d0b1568feb0a86451dc413f62bcf1f21d",
        "رد شده": "adb78bb4395644240502cda6c607226013f6faf055fbe9eb40e3427dc5e7e0d7",
        "غیر‌فعال": "52b08a431790b7bdf27e5a3c2f68c831fa5709f466b7b5e23f1833110b7258f6",
        "نیمه‌کاره": "d8b7b665cffb370d10d7fa4f0bc23420eccccd884e490b3708d73ccd2679eee5",
      }
    `);
  });

  test("preserves image fallbacks and custom status class", () => {
    const hashes = Object.fromEntries((["standard", "mapPreview"] as const).flatMap((variant) =>
      ["", "/image.jpg"].map((imageUrl) => {
        const markup = renderToStaticMarkup(<MemoryRouter><AdCard ad={{ ...ad, imageUrl, statusBadgeClassName: "custom-status" }} variant={variant} showStatusBadge /></MemoryRouter>);
        return [`${variant}/${imageUrl}`, createHash("sha256").update(markup).digest("hex")];
      }),
    ));
    expect(hashes).toMatchInlineSnapshot(`
      {
        "mapPreview/": "cce7f1722883861127e5e5c638805a76d9690dc484f601f9eebe2b9761863ffb",
        "mapPreview//image.jpg": "98690c43acb9c918871bbdaf2f48d7cc027bef24e7c6aa6e2ddf3ff43e115699",
        "standard/": "33170de3c7b70f40e66aff4d5e0ce236badf2f1dd43cc6d240645090c65c06ab",
        "standard//image.jpg": "deb43bb341c6bc73c36c1ec2faee4a28ed3fc7baafdf4831735ef611edec1d75",
      }
    `);
  });

  test.each([
    ["/ads/42", undefined, "/search?q=test", { from: "/search?q=test" }],
    ["/ads/42", null, "/search", null],
    ["/ads/42", { custom: 1 }, "/search", { custom: 1 }],
    ["/elsewhere", undefined, "/search", null],
    ["/ads/42", undefined, "/ads/42", null],
  ])("preserves navigation to %s with state %j from %s", async (to, state, from, expected) => {
    window.history.replaceState(null, "", from);
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const router = createMemoryRouter([{ path: "*", element: <AdCard ad={ad} to={to} state={state} /> }]);
    try {
      await act(async () => root.render(<RouterProvider router={router} />));
      await act(async () => container.querySelector("a")!.click());
      expect(router.state.location.pathname).toBe(to);
      expect(router.state.location.state).toEqual(expected);
    } finally {
      await act(async () => root.unmount());
      router.dispose();
      container.remove();
    }
  });

  test("delete prevents navigation and image errors reveal placeholder", async () => {
    const onDelete = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const router = createMemoryRouter([{ path: "*", element: <AdCard ad={ad} onDeleteIncomplete={onDelete} /> }]);
    try {
      await act(async () => root.render(<RouterProvider router={router} />));
      expect(container.querySelector('[aria-label="۳ تصویر"]')).toBeNull();
      await act(async () => container.querySelector("button")!.click());
      expect(onDelete).toHaveBeenCalledOnce();
      expect(onDelete.mock.calls[0][0].defaultPrevented).toBe(true);
      expect(router.state.location.pathname).toBe("/");
      const image = container.querySelector("img")!;
      await act(async () => image.dispatchEvent(new Event("error")));
      expect(image.style.display).toBe("none");
    } finally {
      await act(async () => root.unmount());
      router.dispose();
      container.remove();
    }
  });
});
