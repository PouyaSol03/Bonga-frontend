import { expect, test, vi } from "vitest";
import * as service from "../../../src/features/advertisements/api/advertisement.service";
import { setStoredAuthSession } from "../../../src/shared/auth/auth-storage";

function session() {
  setStoredAuthSession({
    accessToken: "controlled-token",
    accountType: "user",
    role: "user",
    roles: [],
    expiresAt: null,
    mobile: "",
  });
}

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

function path(request: Request) {
  return new URL(request.url).pathname;
}

test("list aliases, feature precedence, falsy values and pagination", () =>
  transport(async (reply, requests) => {
    session();
    reply({
      data: [{ id: 1 }],
      meta: { current_page: 2, last_page: 3, total: 21 },
    });
    expect(
      await service.getAdvertisementList({
        cityId: " 7 ",
        page: 1,
        filters: {
          areaMin: 0,
          query: " raw ",
          formCode: "sale-land",
          neighborhoodId: "8",
          hasImage: false,
          rooms: " ",
          featureFilters: { from_code: "override", query: "feature", floor: 0 },
        },
      }),
    ).toEqual({ data: [{ id: 1 }], hasNextPage: true, page: 2, total: 21 });
    expect(Object.fromEntries(new URL(requests[0].url).searchParams)).toEqual({
      area_min: "0",
      form_code: "sale-land",
      from_code: "override",
      has_image: "false",
      neighborhood_id: "8",
      neighborhoods: "8",
      query: "feature",
      floor: "0",
      city_id: " 7 ",
      page: "1",
      per_page: "10",
    });
    expect(path(requests[0])).toMatch(/\/public\/advertise$/);
    expect(requests[0].headers.has("Authorization")).toBe(false);
    expect(requests[0].headers.has("user-type")).toBe(false);
    expect(requests[0].credentials).toBe("include");
    reply([{ id: 2 }]);
    expect(await service.getAdvertisementList({})).toEqual({
      data: [{ id: 2 }],
      hasNextPage: false,
      page: 1,
      total: 1,
    });
    reply({ data: [], has_more: true, total: 0 });
    expect((await service.getAdvertisementList({})).hasNextPage).toBe(true);
  }));

test("map literal geofence separators and nested response candidates", () =>
  transport(async (reply, requests) => {
    reply({ data: { result: { results: [{ id: 3 }] } } });
    expect(
      await service.getAdvertisementMap({
        east: 1,
        west: 0,
        north: 2,
        south: 0,
        geofence: "1,2|3,4",
        filters: { query: "a b", hasVideo: false },
      }),
    ).toEqual([{ id: 3 }]);
    expect(requests[0].url).toContain("geofence=1,2|3,4");
    expect(requests[0].url).toContain("query=a%20b");
    expect(requests[0].url).toContain("has_video=false");
    expect(requests[0].url).toContain("limit=100");
    reply({ advertises: [], data: [{ id: 9 }] });
    expect(
      await service.getAdvertisementMap({
        east: 1,
        west: 0,
        north: 2,
        south: 0,
      }),
    ).toEqual([]);
  }));

test("detail authenticated public path, loan mutation, account category and malformed response", () =>
  transport(async (reply, requests) => {
    session();
    reply({
      data: {
        id: 1,
        loan: { amount: 0 },
        features: [
          { label: "loan_amount", value: 99 },
          { key: "monthly_installment", value: 4 },
        ],
      },
    });
    expect((await service.getAdvertisementDetail("a/b")).loan).toEqual({
      amount: 0,
      installment: 4,
    });
    expect(path(requests[0])).toMatch(/\/public\/advertise\/a%2Fb$/);
    expect(requests[0].headers.get("Authorization")).toBe(
      "Bearer controlled-token",
    );
    expect(requests[0].headers.has("user-type")).toBe(false);
    reply({
      advertise: { id: 2, category_title: "existing" },
      category: " category ",
    });
    expect(await service.getMyAdvertisementDetail("a/b")).toMatchObject({
      category: "category",
      category_title: "existing",
    });
    expect(path(requests[1])).toMatch(/\/me\/advertise\/get\/a%2Fb$/);
    expect(requests[1].headers.get("user-type")).toBe("user");
    reply({ status: true });
    await expect(service.getAdvertisementDetail("1")).rejects.toMatchObject({
      status: 500,
      message: "ساختار اطلاعات آگهی از سرور قابل استفاده نیست.",
    });
  }));

test("form normalization aliases, invalid fields and blank-code error", () =>
  transport(async (reply, requests) => {
    reply({
      result: {
        slug: " sale-land ",
        dynamicFields: [
          {
            key: " area ",
            options: [
              { value: 0, label: " Zero " },
              { value: false },
              { value: {} },
            ],
            required: "true",
          },
          { key: " " },
        ],
      },
    });
    expect(await service.getAdvertiseFormDefinition(" sale-land ")).toEqual({
      code: "sale-land",
      title: undefined,
      fields: [
        {
          key: "area",
          label: "area",
          options: [
            { value: 0, label: "Zero" },
            { value: false, label: "false" },
          ],
          dependsOn: undefined,
          optionsEndpoint: undefined,
          required: false,
          type: "",
          unit: "",
        },
      ],
    });
    expect(path(requests[0])).toMatch(/\/public\/advertise-form\/sale-land$/);
    await expect(service.getAdvertiseFormDefinition(" ")).rejects.toMatchObject(
      { status: 400 },
    );
    reply({ invalid: true });
    await expect(service.getAdvertiseFormDefinition("x")).rejects.toMatchObject(
      { status: 500 },
    );
  }));

test("daily views coercion, top viewed and payments paths", () =>
  transport(async (reply, requests) => {
    reply({
      data: [
        { count: "-2", date: " date " },
        { count: "bad", date: "x" },
        { count: 1 },
      ],
      total_view: "bad",
    });
    expect(await service.getAdvertisementDailyViews("a/b")).toEqual({
      data: [{ count: 0, date: "date" }],
      totalView: 0,
    });
    expect(path(requests[0])).toMatch(
      /\/public\/advertise\/view\/preview-chart\/a%2Fb$/,
    );
    reply({ data: [{ id: 8 }] });
    expect(await service.getTopViewedAdvertisements()).toEqual([{ id: 8 }]);
    expect(path(requests[1])).toMatch(/\/public\/advertise\/top-viewed$/);
    reply({ data: [{ id: 9 }] });
    expect(await service.getAdvertisementPayments("a/b")).toEqual([{ id: 9 }]);
    expect(path(requests[2])).toMatch(
      /\/personal\/advertise\/a%2Fb\/payments$/,
    );
  }));

test("report, feedback, removal, owner contact and engagement wire contracts", () =>
  transport(async (reply, requests) => {
    session();
    reply({ list: [{ id: "2", name: "reason" }], data: [] });
    expect(await service.getAdvertiseReportReasons()).toEqual([
      { id: "2", name: "reason" },
    ]);
    expect(path(requests[0])).toMatch(/\/personal\/advertise\/report-reasons$/);
    reply({});
    await service.submitAdvertiseReport({
      advertiseId: "a/b",
      description: " text ",
      reportReasonId: "02",
    });
    expect(path(requests[1])).toMatch(/\/personal\/advertise\/report\/a%2Fb$/);
    expect(await requests[1].json()).toEqual({
      description: "text",
      report_reason_id: 2,
    });
    const feedback = {
      response_speed: false,
      area_knowledge: true,
      honesty: false,
      effective_followup: true,
      ads_are_updated: false,
    };
    reply({});
    await service.submitAdvertiseFeedback({ advertiseId: "a/b", feedback });
    expect(path(requests[2])).toMatch(/\/me\/advertise\/feedback\/a\/b$/);
    expect(await requests[2].json()).toEqual(feedback);
    reply({});
    await service.deleteAdvertisement({
      advertiseId: "a/b",
      description: " raw ",
    });
    expect(path(requests[3])).toMatch(/\/me\/advertise\/delete\/a%2Fb$/);
    expect(await requests[3].json()).toEqual({ description: " raw " });
    reply({});
    await service.removeAgencyAdvertisement("a/b");
    expect(requests[4].method).toBe("DELETE");
    expect(await requests[4].json()).toEqual({
      reason: "deal_done",
      description: "حذف توسط آژانس",
    });
    reply({ result: { id: 4 } });
    expect(
      await service.updateOwnerContact({
        advertiseId: "a/b",
        ownerContactName: "",
        ownerContactAddress: " raw ",
      }),
    ).toEqual({ id: 4 });
    expect(requests[5].method).toBe("PATCH");
    expect(path(requests[5])).toMatch(
      /\/personal\/advertise\/a%2Fb\/owner-contact$/,
    );
    expect(await requests[5].json()).toEqual({
      owner_contact_name: "",
      owner_contact_address: " raw ",
    });
    await service.reportAdvertisementEngagement("01", "call");
    reply({});
    await service.reportAdvertisementEngagement(" 12 ", "impression");
    expect(path(requests[6])).toMatch(/\/advertisements\/12\/engagement$/);
    expect(await requests[6].json()).toEqual({
      event_type: "impression",
      idempotency_key: expect.stringMatching(/^[\da-f-]{14}7[\da-f-]+$/),
    });
  }));
