import type { Page, Route } from "@playwright/test";

const categoryIds = [
  "apartment",
  "land",
  "villa-house",
  "garden-villa",
  "office",
  "commercial-unit",
  "warehouse",
  "hotel-apartment",
  "factory-workshop",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel-apartment",
  "daily-workspace",
  "project-presale",
  "project-partnership",
];

const dynamicFieldsByFormCode: Record<string, string[]> = {
  "sale-apartment": ["area", "floor", "rooms", "building_age", "price"],
  "sale-land": ["land_area", "land_use", "land_position", "document_type", "price"],
  "sale-villa-house": ["land_area", "building_area", "rooms", "building_age", "price"],
  "sale-garden-villa": ["land_area", "building_area", "rooms", "building_age", "price"],
  "sale-office": ["area", "suitable_for", "rooms", "document_type", "price"],
  "sale-commercial": ["area", "suitable_for", "document_type", "building_age", "price"],
  "sale-warehouse": ["land_area", "building_area", "land_position", "suitable_for", "price"],
  "sale-hotel": ["hotel_stars", "area", "document_type", "land_position", "building_age", "price"],
  "sale-factory": ["land_area", "building_area", "document_type", "price"],
  "rent-apartment": ["area", "floor", "rooms", "building_age", "mortgage_price", "rent_price"],
  "rent-villa-house": ["land_area", "building_area", "rooms", "building_age", "mortgage_price", "rent_price"],
  "rent-garden-villa": ["land_area", "building_area", "rooms", "building_age", "mortgage_price", "rent_price"],
  "daily-apartment-suite": ["area", "rooms", "capacity", "extra_people_capacity", "min_price", "max_price"],
  "daily-garden-villa": ["area", "rooms", "capacity", "extra_people_capacity", "min_price", "max_price"],
  "daily-hotel": ["hotel_stars", "daily_hotel_rooms", "min_price", "max_price"],
  "daily-office-booth": ["area", "rooms", "capacity", "extra_people_capacity", "min_price", "max_price"],
  "rent-office": ["area", "floor", "rooms", "building_age", "mortgage_price", "rent_price"],
  "rent-commercial": ["area", "floor", "rooms", "building_age", "suitable_for", "mortgage_price", "rent_price"],
  "rent-warehouse": ["land_area", "building_area", "land_position", "ceiling_height", "suitable_for", "commercial_license", "mortgage_price", "rent_price"],
  "rent-hotel": ["land_area", "building_area", "land_position", "building_age", "mortgage_price", "rent_price"],
  "rent-factory-workshop": ["land_area", "building_area", "mortgage_price", "rent_price"],
  "presale-special": ["project_total_floors", "project_total_units", "project_status", "delivery_date", "min_price", "max_price"],
  partnership: ["partnership_type", "land_area", "construction_license", "document_type", "builder_share"],
};

function json(route: Route, body: unknown) {
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export async function seedAuthenticatedUser(page: Page) {
  await page.addInitScript(() => {
    // AppRouter sends every route back to onboarding when no city is stored.
    // Seed the same default Mashhad values used by the application itself so
    // E2E tests can open /new-ad/* directly in a fresh browser context.
    window.localStorage.setItem("bonga-selected-city", "مشهد");
    window.localStorage.setItem("bonga-selected-city-id", "000000000000000000000101");
    window.localStorage.setItem("bonga-selected-city-lat", "36.2605");
    window.localStorage.setItem("bonga-selected-city-lng", "59.5986");

    window.localStorage.setItem(
      "bonga-auth-session",
      JSON.stringify({
        accessToken: "playwright-test-token",
        accountType: "user",
        activeRole: "user",
        expiresAt: Date.now() + 60 * 60 * 1000,
        mobile: "09120000000",
        role: "user",
        roles: [{ id: "user", name: "کاربر", slug: "user" }],
      }),
    );
  });
}

export async function mockNewAdApis(
  page: Page,
  options: {
    onCreate?: (body: string) => void;
  } = {},
) {
  await page.route("**/public/category/list**", (route) =>
    json(route, {
      status: true,
      data: categoryIds.map((id, index) => ({
        id: String(index + 1),
        name: id,
        parent_id: null,
        code: id,
        priority: index + 1,
        priority_on_first_page: index + 1,
        slug: id,
        slug_of_first_page: id,
        track_code: index + 1,
        children: [],
      })),
    }),
  );

  await page.route("**/public/advertise-form/*", (route) => {
    const url = new URL(route.request().url());
    const formCode = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    const fieldKeys = dynamicFieldsByFormCode[formCode] ?? [];

    return json(route, {
      status: true,
      data: {
        code: formCode,
        title: formCode,
        fields: fieldKeys.map((key) => ({
          key,
          label: key,
          options: [],
          required: false,
          type: "text",
          unit: "",
        })),
      },
    });
  });

  await page.route("**/public/location-search**", (route) =>
    json(route, {
      status: true,
      data: [
        {
          id: "1001",
          neighborhood_id: "1001",
          neighborhood_name: "سجاد",
          name: "سجاد",
          city_id: "101",
          lat: 36.321,
          lng: 59.561,
          matched_by: ["neighborhood"],
        },
      ],
    }),
  );

  await page.route("**/public/neighborhood/infoWithLoc**", (route) =>
    json(route, {
      status: true,
      data: {
        id: "1001",
        city_id: "101",
        name: "سجاد",
        lat: 36.321,
        lng: 59.561,
        sub_neighbors: [
          { id: "10011", name: "سجاد ۱", lat: 36.3212, lng: 59.5612 },
        ],
      },
    }),
  );

  await page.route("**/public/neighborhood/list**", (route) =>
    json(route, {
      status: true,
      data: [
        {
          id: "1001",
          city_id: "101",
          name: "سجاد",
          lat: 36.321,
          lng: 59.561,
          sub_neighbors: [{ id: "10011", name: "سجاد ۱" }],
        },
        {
          id: "1002",
          city_id: "101",
          name: "احمدآباد",
          lat: 36.305,
          lng: 59.58,
          sub_neighbors: [{ id: "10021", name: "احمدآباد ۱" }],
        },
      ],
    }),
  );

  await page.route("**/public/neighborhood/1001**", (route) =>
    json(route, {
      status: true,
      data: {
        id: "1001",
        city_id: "101",
        name: "سجاد",
        lat: 36.321,
        lng: 59.561,
        sub_neighbors: [{ id: "10011", name: "سجاد ۱", lat: 36.3212, lng: 59.5612 }],
      },
    }),
  );

  await page.route("**/public/agencies**", (route) =>
    json(route, {
      status: true,
      page: 1,
      per_page: 20,
      total: 2,
      data: [
        {
          id: "agency-1",
          name: "آژانس املاک سجاد",
          address: "مشهد، بلوار سجاد",
          lat: 36.321,
          lng: 59.561,
          score: 4.8,
          rank: 1,
          neighborhood_ids: ["1001"],
        },
        {
          id: "agency-2",
          name: "آژانس املاک احمدآباد",
          address: "مشهد، احمدآباد",
          lat: 36.305,
          lng: 59.58,
          score: 4.5,
          rank: 2,
          neighborhood_ids: ["1002"],
        },
      ],
    }),
  );

  await page.route("https://map.exirfirm.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );

  await page.route("**/me/show**", (route) =>
    json(route, {
      status: true,
      data: {
        id: "pw-user",
        name: "کاربر",
        family: "تست",
        mobile: "09120000000",
        phone: "09120000000",
        authorized: 1,
        authorize_date: "2026-08-18T00:00:00.000Z",
        city_id: "000000000000000000000101",
        roles: [{ id: "user", name: "کاربر", slug: "user" }],
      },
    }),
  );

  await page.route("**/me/advertise/create**", async (route) => {
    const body = route.request().postDataBuffer()?.toString("utf8") ?? "";
    options.onCreate?.(body);

    return json(route, {
      status: true,
      data: {
        id: 901,
        title: "آگهی تست Playwright",
        status: "wait_for_payment",
        form_code: "sale-apartment",
        images: [{ url: "/uploads/playwright-test.png", is_main: true }],
      },
    });
  });

  await page.route("**/me/advertise/checkout/*", (route) =>
    json(route, {
      status: true,
      data: {
        advertise_id: 901,
        items: [],
        payment_methods: [],
        state: "wait_for_payment",
        summary: {
          credit_cost: 0,
          items_count: 0,
          payable_amount: 0,
          total_price: 0,
        },
      },
    }),
  );
}

export async function seedLocation(page: Page) {
  const seed = () => {
    window.localStorage.setItem("bonga-new-ad-location", "مشهد، محله سجاد");
    window.localStorage.setItem("bonga-new-ad-location-lat", "36.321");
    window.localStorage.setItem("bonga-new-ad-location-lng", "59.561");
    window.localStorage.setItem("bonga-new-ad-neighborhood-id", "1001");
  };

  // NewAdFlowPage clears its draft/location storage on `pagehide`.
  // Register the seed as an init script so a test-triggered reload restores
  // the location before React reads its initial form values.
  await page.addInitScript(seed);

  // Also make it available immediately in the current document.
  await page.evaluate(seed);
}
