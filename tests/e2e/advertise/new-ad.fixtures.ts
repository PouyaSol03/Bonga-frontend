import type { Page, Route } from "@playwright/test";

const categoryIds = [
  "apartment",
  "land",
  "villa-house",
  "office",
  "commercial-unit",
  "factory-workshop",
  "hotel-apartment",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel-apartment",
  "daily-workspace",
  "project-presale",
  "project-partnership",
];

const publishingKeys = ["advertiser_type", "published_at", "is_special", "has_image", "has_video"];
const saleTail = ["loan_amount", "loan_installment", "has_exchange", "exchange_with", ...publishingKeys];
const rentPrice = ["price", "mortgage_price", "rent_price", "rent_conversion_policy"];

/**
 * Mirrors the active backend advertise-form whitelist.
 * E2E mocks intentionally stay form-specific because NewAdFlowPage uses the
 * server-returned field keys as the multipart serialization whitelist.
 */
const dynamicFieldsByFormCode: Record<string, string[]> = {
  "sale-apartment": [
    "price", "area", "floor", "rooms", "building_age", "total_floors", "units_per_floor",
    "unit_type", "unit_position", "document_type", "occupancy_status", "renovated", "furnished",
    "kitchen_type", "facade_material", "floor_material", "cabinet_material", "heating_cooling",
    "facilities", ...saleTail,
  ],
  "sale-villa-house": [
    "price", "land_area", "building_area", "rooms", "building_age", "land_position", "building_type",
    "villa_type", "document_type", "total_floors", "street_width", "renovated", "furnished",
    "kitchen_type", "facade_material", "floor_material", "cabinet_material", "heating_cooling",
    "facilities", ...saleTail,
  ],
  "sale-land": [
    "price", "land_area", "document_type", "land_use", "land_position", "density", "suitable_for",
    "land_width", "street_width", "build_permit", "facilities", ...saleTail,
  ],
  "sale-office": [
    "price", "area", "floor", "rooms", "building_age", "total_floors", "suitable_for", "current_status",
    "office_position", "office_document_type", "facade_material", "floor_material", "cabinet_material",
    "management_room", "conference_room", "reception_hall", "signboard", "kitchen", "separate_entrance",
    "renovated", "furnished", "heating_cooling", "facilities", ...saleTail,
  ],
  "sale-commercial": [
    "price", "area", "commercial_position", "document_type", "ownership_status", "building_age", "floor",
    "total_floors", "rooms", "opening_count", "suitable_for", "commercial_permit", "current_status",
    "heating_cooling", "facilities", ...saleTail,
  ],
  "sale-factory": [
    "price", "land_area", "land_position", "building_age", "document_type", "rooms", "building_area",
    "height", "industrial_property_type", "access_type", "current_status", "commercial_permit",
    "heating_cooling", "facilities", ...saleTail,
  ],
  "sale-hotel": [
    "price", "accommodation_type", "hotel_stars", "land_area", "building_area", "document_type",
    "land_position", "building_age", "total_floors", "single_room_count", "double_room_count", "suite_count",
    "renovated", "furnished", "floor_material", "heating_cooling", "facilities", ...saleTail,
  ],

  "rent-apartment": [
    ...rentPrice, "area", "floor", "rooms", "building_age", "suitable_for", "total_floors", "units_per_floor",
    "unit_type", "unit_position", "occupancy_status", "ready_delivery_date", "min_contract_months", "pet_policy",
    "renovated", "furnished", "kitchen_type", "facade_material", "floor_material", "cabinet_material",
    "heating_cooling", "facilities", ...publishingKeys,
  ],
  "rent-villa-house": [
    ...rentPrice, "land_area", "building_area", "rooms", "building_age", "suitable_for", "land_position",
    "building_type", "villa_type", "total_floors", "street_width", "pet_policy", "renovated", "furnished",
    "kitchen_type", "facade_material", "floor_material", "cabinet_material", "heating_cooling", "facilities",
    ...publishingKeys,
  ],
  "rent-office": [
    ...rentPrice, "area", "floor", "rooms", "building_age", "suitable_for", "office_position", "current_status",
    "ready_delivery_date", "min_contract_months", "has_document", "office_document_type", "management_room",
    "conference_room", "reception_hall", "signboard", "kitchen", "separate_entrance", "renovated", "furnished",
    "facade_material", "floor_material", "cabinet_material", "heating_cooling", "facilities", ...publishingKeys,
  ],
  "rent-commercial": [
    ...rentPrice, "area", "commercial_position", "building_age", "floor", "rooms", "opening_count", "height",
    "suitable_for", "current_status", "ready_delivery_date", "min_contract_months", "heating_cooling", "facilities",
    ...publishingKeys,
  ],
  "rent-factory-workshop": [
    ...rentPrice, "land_area", "building_area", "land_position", "building_age", "rooms", "height",
    "industrial_property_type", "access_type", "current_status", "commercial_permit", "ready_delivery_date",
    "min_contract_months", "heating_cooling", "facilities", ...publishingKeys,
  ],
  "rent-hotel": [
    ...rentPrice, "accommodation_type", "hotel_stars", "land_area", "building_area", "building_age", "land_position",
    "total_floors", "single_room_count", "double_room_count", "suite_count", "renovated", "furnished",
    "floor_material", "heating_cooling", "facilities", ...publishingKeys,
  ],

  "daily-apartment-suite": [
    "price", "accommodation_type", "area", "rooms", "capacity", "extra_people_capacity", "floor", "rental_period",
    "check_in_time", "check_out_time", "min_stay_days", "evacuation_guarantee", "pet_policy", "furnished",
    "heating_cooling", "facilities", "min_price", "max_price", "normal_daily_price", "weekend_daily_price",
    "special_daily_price", "extra_person_price", ...publishingKeys,
  ],
  "daily-garden-villa": [
    "price", "land_area", "building_area", "rooms", "capacity", "extra_people_capacity", "view_type", "villa_type",
    "rental_period", "check_in_time", "check_out_time", "min_stay_days", "evacuation_guarantee", "pet_policy",
    "furnished", "heating_cooling", "facilities", "min_price", "max_price", "normal_daily_price",
    "weekend_daily_price", "special_daily_price", "extra_person_price", ...publishingKeys,
  ],
  "daily-hotel": [
    "price", "accommodation_type", "hotel_stars", "rental_period", "min_stay_days", "check_in_time", "check_out_time",
    "pet_policy", "daily_hotel_rooms", "heating_cooling", "facilities", "min_price", "max_price", ...publishingKeys,
  ],
  "daily-office-booth": [
    "price", "space_type", "area", "rooms", "capacity", "extra_people_capacity", "floor", "rental_period",
    "check_in_time", "check_out_time", "min_stay_days", "evacuation_guarantee", "heating_cooling", "facilities",
    "min_price", "max_price", "normal_daily_price", "weekend_daily_price", "special_daily_price", "extra_person_price",
    ...publishingKeys,
  ],

  "presale-special": [
    "price", "builder_company_name", "project_type", "project_total_floors", "project_total_units", "document_type",
    "project_status", "delivery_date", "kitchen_type", "facade_material", "floor_material", "cabinet_material",
    "furnished", "project_details", "heating_cooling", "facilities", "min_meter_price", "max_meter_price",
    "installment_sale", "sale_terms_percent", "sale_terms_installment_months", "has_exchange", "exchange_with",
    ...publishingKeys,
  ],
  partnership: [
    "partnership_type", "current_status", "land_area", "land_position", "build_permit", "document_type", "land_width",
    "street_width", "builder_share", ...publishingKeys,
  ],
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
