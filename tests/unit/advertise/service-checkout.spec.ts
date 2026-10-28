import { expect, test, vi } from "vitest";
import * as service from "../../../src/features/advertisements/api/advertisement.service";
import { baseUrl } from "../../../src/shared/api/api";
import {
  setStoredAuthSession,
  type AuthRoleSlug,
} from "../../../src/shared/auth/auth-storage";

async function transport(
  run: (reply: (value: unknown) => void, requests: Request[]) => Promise<void>,
) {
  const responses: unknown[] = [];
  const requests: Request[] = [];
  const mock = vi.mocked(fetch).mockImplementation(async (input) => {
    requests.push((input as Request).clone());
    expect(responses.length, "unexpected request").toBeGreaterThan(0);
    return new Response(JSON.stringify(responses.shift()), {
      headers: { "content-type": "application/json" },
    });
  });
  try {
    await run((value) => responses.push(value), requests);
    expect(responses).toEqual([]);
  } finally {
    mock.mockClear();
  }
}

function role(role: AuthRoleSlug) {
  setStoredAuthSession({
    accessToken: "controlled-token",
    accountType: role,
    role,
    roles: [],
    expiresAt: null,
    mobile: "",
  });
}

const checkout = {
  advertise_id: 1,
  items: [],
  payment_methods: [],
  summary: {},
};

test("checkout wrappers, role paths, error code and message preservation", () =>
  transport(async (reply, requests) => {
    for (const wrapper of [
      checkout,
      { data: checkout },
      { result: checkout },
    ]) {
      reply(wrapper);
      expect(await service.getAdvertisementCheckout("a/b")).toEqual(checkout);
    }
    expect(new URL(requests[0].url).pathname).toMatch(
      /\/personal\/advertise\/a%2Fb\/checkout$/,
    );
    role("real_estate_consultant");
    reply(checkout);
    expect(await service.getAgencyAdvertisementCheckout("a/b")).toEqual(
      checkout,
    );
    expect(new URL(requests[3].url).pathname).toMatch(
      /\/agency-consultant\/advertise\/a%2Fb\/checkout$/,
    );
    expect(requests[3].headers.get("Authorization")).toBe(
      "Bearer controlled-token",
    );
    expect(requests[3].headers.has("user-type")).toBe(false);
    reply({ status: false, message: " raw ", code: "NO" });
    await expect(
      service.getConsultantAdvertisementCheckout("1"),
    ).rejects.toMatchObject({ status: 400, message: " raw ", code: "NO" });
    reply({ status: true });
    await expect(
      service.getAgencyAdvertisementCheckout("1"),
    ).rejects.toMatchObject({
      status: 500,
      message: "اطلاعات پرداخت آگهی از سرور دریافت نشد.",
    });
  }));

test("submit discount inclusion, URL priority, nested URLs and unsafe URLs", () =>
  transport(async (reply, requests) => {
    const payload = {
      advertiseId: "a/b",
      items: ["publish"],
      paymentMethod: "gateway" as const,
    };
    reply({
      payment_url: "javascript:bad",
      gateway_url: " https://gateway.test/pay ",
      data: { url: "https://other.test" },
    });
    expect(
      (
        await service.submitAdvertisementCheckout({
          ...payload,
          discount_code: " code ",
        })
      ).paymentUrl,
    ).toBe("https://gateway.test/pay");
    expect(await requests[0].json()).toEqual({
      items: ["publish"],
      payment_method: "gateway",
      discount_code: " code ",
    });
    reply({ data: { result: { payment: { intent: { url: "/pay" } } } } });
    expect(
      (await service.submitConsultantAdvertisementCheckout(payload)).paymentUrl,
    ).toBe(
      new URL(
        "/pay",
        new URL(baseUrl || window.location.origin, window.location.origin),
      ).toString(),
    );
    expect(await requests[1].json()).toEqual({
      items: ["publish"],
      payment_method: "gateway",
    });
    reply({
      data: {
        result: {
          payment: { intent: { gateway: { url: "https://deep.test" } } },
        },
      },
    });
    expect(
      (await service.submitAdvertisementCheckout(payload)).paymentUrl,
    ).toBeNull();
    reply({ payment_url: "relative", url: "data:text/plain,unsafe" });
    expect(
      (await service.submitAdvertisementCheckout(payload)).paymentUrl,
    ).toBeNull();
    reply({ status: false, message: " ", code: "DENIED" });
    await expect(
      service.submitAdvertisementCheckout(payload),
    ).rejects.toMatchObject({
      status: 400,
      code: "DENIED",
      message: "پرداخت آگهی با خطا مواجه شد.",
    });
  }));

test("agency delegated checkout omits items and discounts; numeric consultant parsing", () =>
  transport(async (reply, requests) => {
    role("real_estate_manager");
    reply({ url: "https://gateway.test" });
    await service.submitAgencyAdvertisementCheckout({
      advertiseId: "a/b",
      items: ["ignored"],
      discount_code: "ignored",
      paymentMethod: "by_consultant",
      consultantId: " 02 ",
    });
    expect(new URL(requests[0].url).pathname).toMatch(
      /\/agency\/advertise\/a%2Fb\/checkout$/,
    );
    expect(await requests[0].json()).toEqual({
      payment_method: "by_consultant",
      consultant_id: 2,
    });
    role("real_estate_consultant");
    reply({});
    await service.submitAgencyAdvertisementCheckout({
      advertiseId: "1",
      items: [],
      discount_code: "",
      paymentMethod: "wallet",
      consultantId: "invalid",
    });
    expect(new URL(requests[1].url).pathname).toMatch(
      /\/agency-consultant\/advertise\/1\/checkout$/,
    );
    expect(await requests[1].json()).toEqual({
      payment_method: "wallet",
      items: [],
    });
    reply({ status: false });
    await expect(
      service.submitAgencyAdvertisementCheckout({
        advertiseId: "1",
        items: [],
        paymentMethod: "wallet",
      }),
    ).rejects.toMatchObject({
      status: 400,
      message: "پرداخت آگهی تخصیصی با خطا مواجه شد.",
    });
  }));

test("draft object mutation, multipart finalize and update retain wire contracts", () =>
  transport(async (reply, requests) => {
    const draft = {
      id: 12,
      label: "removed",
      description: "removed",
      area: 0,
      images: ["removed"],
      contact_type: ["removed"],
    };
    reply({ result: { id: 12 } });
    expect(await service.saveAdvertiseDraft(draft)).toEqual({ id: 12 });
    expect(draft).toEqual({
      area: 0,
      images: ["removed"],
      contact_type: ["removed"],
    });
    expect(requests[0].method).toBe("PATCH");
    expect(new URL(requests[0].url).pathname).toMatch(
      /\/personal\/advertise\/12\/draft$/,
    );
    expect(await requests[0].json()).toEqual({ area: 0 });
    const payload = new FormData();
    payload.set("id", " 15 ");
    payload.set("label", " raw ");
    payload.set("consultant_id", "9");
    reply({ advertise: { id: 15 } });
    expect(await service.createAdvertisement(payload)).toEqual({ id: 15 });
    expect(new URL(requests[1].url).pathname).toMatch(
      /\/personal\/advertise\/15\/finalize$/,
    );
    expect(requests[1].method).toBe("POST");
    expect(await requests[1].text()).toContain(" raw ");
    reply({ data: { id: 15 } });
    expect(
      await service.updateAdvertisement({ advertiseId: "a/b", payload }),
    ).toEqual({ id: 15 });
    expect(requests[2].method).toBe("PATCH");
    expect(new URL(requests[2].url).pathname).toMatch(
      /\/personal\/advertise\/a%2Fb$/,
    );
    const empty = new FormData();
    reply({ id: 16 });
    expect(await service.createAdvertisement(empty)).toEqual({ id: 16 });
    expect(new URL(requests[3].url).pathname).toMatch(/\/personal\/advertise$/);
    reply({ data: { id: 17 } });
    expect(
      await service.saveAdvertiseDraft({
        payload: { label: "x", description: "y", area: 1 },
      }),
    ).toEqual({ id: 17 });
    expect(new URL(requests[4].url).pathname).toMatch(
      /\/personal\/advertise\/draft$/,
    );
    expect(await requests[4].json()).toEqual({ area: 1 });
  }));
