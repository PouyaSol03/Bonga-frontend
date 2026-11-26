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
        "carousel/false": "46792247701b3b8445ab319ab5efd1037325fb36d360987b025cf96c3be86664",
        "carousel/true": "df7b4ce6c8bf5054fdc59abea2e758c648599ed4ef3a884f5be1fce937d93182",
        "dashboard/false": "fb84456e75206bb33fbe546c777a54273c93ac6f8f0108c61872d28a17f2c981",
        "dashboard/true": "73ccf8d77ae0d2f0a1651ca1288eecfbe832bf03bf3d99848aeafd46ec1dca8f",
        "mapPreview/false": "a986daf33e4f497bc4045867d4fa7888bb59c56c0de6b047dd3e164016704744",
        "mapPreview/true": "cb7367d73ac80aa2aa2d0978088a90bddb147b936cb1c4578bd5298328e1c17e",
        "requestResult/false": "695460898a05a8f2422c961b634975b6c9d4c7f0b806ee2ac77132ebb5c88b79",
        "requestResult/true": "e7604114125927bbc5457093cff6cd2f6433f2b5d76f9b9d332bc4c684529b52",
        "standard/false": "0626cde63dac8ae8f023710866ebaa78c3123216603d6c8e469da325f8959734",
        "standard/true": "0b387ee544fcfd478cbd1876d4127849f0ab43486343c444fa23215df0df2258",
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
        "-1": "9c1d4100bf9fa0105b81e7d8940b85d445169b34d03b21a8872e11d16103f308",
        "-2": "e7c0987c4da9b03194af2b057e7070d00184223ee7588dbf83784aa1b4e28af3",
        "-3": "b348df049ba5237b2941e07113584c6ba9b8a026e1e847bef92d05c06187575c",
        "-5": "1937d5bbb7c1f3b7a0644b6e0e9fb4b880ce235c2b68a07cfae2e62a73169523",
        "0": "59e9f5dc3d844a2231b2ea59ccbd33c61c59687f188f4d344b61b4f812b5c443",
        "1": "65dcac9fa06c0f65d5a76dda4fa9d16c16bd66934d1e9ba7c1c738f66e95e130",
        "2": "53ae0cc3839e75365430194e1b70e6162ab29ed4348846a4999bb59305b2e5dd",
        "3": "a157edd78b85ca5cc8ee7310c6c809b53016d6d5045f90a1aed747e812957f39",
        "accepted": "64cf3f1b98a2f7f754c0a720be0bdfaa53a63a37bc8a8643dfda551a24b94df8",
        "draft": "520e4bacc5761b81fc3da6c65d790bce0a48d4fc1a21740a309a17be7576e7ae",
        "incomplete": "532e2e0573b1e9a93a0265573431513c0765ccf8d77e9481402f58022ea80d48",
        "pending": "c9c312dcdf1e06c7e0a9fa66d632457b06153183a3afdaabb07c51c372d359f0",
        "publish": "50e0991efb1965e6f0c46b387b5f383b64d731fae888a4b1af2406cf86910b15",
        "rejected payment": "b7388516c3a0017214932afd1b30d1cfaa539abefaa5e2ddef19d445ca9925fb",
        "unknown": "83a3354dbe37f9f6c52134025970f8ae2b59d3298fa129f267073dd06f0fee23",
        "تاييد شده": "8e0fa59791d68e0eca26832fff9d5051b69cd4e55b382cda97c6c5fc432172f2",
        "در انتظار پرداخت": "db0a28e900e3cdfc4b66f22c6863da3822dce4fcf9f48dec89a31b6476a63833",
        "رد شده": "395f338979c1505c5887c79d50a67f2dc63900efbb2384120ca6424f996daab7",
        "غیر‌فعال": "83bb2248d87fda0d549c6f6d8a2a722bdc35ffd38b9e882e6e86645cb7c7aa0a",
        "نیمه‌کاره": "d4f45aa04d32b33136ca8dc78d597fe0bc6626894552188457c7eef2fcf07124",
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
        "mapPreview/": "c6b27b5859703dc21452195c34933151ea112af4eaa05bfae75eea94e74aba24",
        "mapPreview//image.jpg": "08a45511f3f79709be55918a8c0340caa49a59957bcc33203d713ab7a7fa491f",
        "standard/": "553e2a3f74900a5c5b6250cf0dd773742007380b365c0689953826f6e34a78c2",
        "standard//image.jpg": "26aa328d3439883d91a50c131118389eca3c34564fab502d3197e5c5f525a813",
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
