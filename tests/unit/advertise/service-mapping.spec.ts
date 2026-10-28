import { describe, expect, test } from "vitest";
import {
  getAdvertisementPublisherName,
  mapAdvertisementToAdCard,
  readFeatureValue,
} from "../../../src/features/advertisements/api/advertisement.service";

describe("advertisement card characterization", () => {
  test("empty card retains placeholders and index identity", () => {
    expect(mapAdvertisementToAdCard({}, 4)).toMatchObject({
      id: 5,
      title: "آگهی ملک",
      agency: "",
      status: "",
      area: "-",
      rooms: "-",
      year: "-",
      imageCount: "0",
      imageClassName: "ad-card__image--1",
      imageUrl: undefined,
      pricePrimary: "توافقی",
      priceSecondary: "",
      badges: [],
      timeAndLocation: "",
    });
  });

  test("direct values precede features; labels precede keys; dynamic fields follow features", () => {
    const item = {
      area: 0,
      features: [
        { key: "area", label: "other", value: 99 },
        { label: "ROOMS", value: false },
        { label: "year", value: "" },
      ],
      dynamicFields: [{ label: "year", value: "ساخت 5" }],
    };
    expect(readFeatureValue(item, ["area"])).toBe(0);
    expect(readFeatureValue(item, ["rooms"])).toBe(false);
    expect(readFeatureValue(item, ["other"])).toBe(99);
    expect(readFeatureValue(item, ["year"])).toBeUndefined();
    expect(
      readFeatureValue({ dynamicFields: item.dynamicFields }, ["year"]),
    ).toBe("ساخت 5");
    expect(readFeatureValue(item, ["missing"])).toBeUndefined();
  });

  test.each([
    [
      {
        publisher_type: "agent",
        agent: { name: " Agent " },
        consultant: { name: "Other" },
      },
      "Agent",
    ],
    [
      { owner_type: "agent", consultant: { name: " Consultant " } },
      "Consultant",
    ],
    [{ publisher_type: "AGENCY", agency: " Agency " }, "Agency"],
    [{ publisher_type: "agency", agency: { name: " Company " } }, "Company"],
    [
      { publisher_type: "agent", publisher_agent_name: " Fallback " },
      "Fallback",
    ],
    [
      { owner_profile: { first_name: " First ", last_name: " Last " } },
      "First Last",
    ],
    [
      { owner_profile: { display_name: " Display " }, owner_name: "Other" },
      "Display",
    ],
    [{ owner_name: " Owner " }, "Owner"],
  ])("publisher fallback %j", (item, expected) => {
    expect(getAdvertisementPublisherName(item)).toBe(expected);
  });

  test("feature units, badges, location and whitespace remain unchanged", () => {
    const card = mapAdvertisementToAdCard(
      {
        id: 0,
        title: " Title ",
        area: 120,
        rooms: 0,
        year: "ساخت 3",
        neighborhood: { name: " Center " },
        published_days: 0,
        is_special: "1",
        is_ladder: true,
        badges: ["ignored"],
        floor: "02",
        capacity: 4,
        hotel_stars: 3,
        total_units: 10,
        total_floors: "2 طبقه",
        builder_share: 25,
        current_status: " raw ",
      },
      0,
    );
    expect(card).toMatchObject({
      id: 0,
      title: " Title ",
      area: "120 متر مربع",
      rooms: "0 اتاق",
      year: "3 سال",
      badges: ["ویژه", "بروزرسانی"],
      timeAndLocation: "0 روز پیش در  Center ",
      floor: "طبقه 02",
      capacity: "4 نفر",
      stars: "3 ستاره",
      totalUnits: "10 واحد",
      totalFloors: "2 طبقه",
      builderShare: "25٪",
      currentStatus: " raw ",
    });
    const badges = ["custom"];
    expect(mapAdvertisementToAdCard({ badges }, 0).badges).toBe(badges);
  });

  test.each([
    [
      {
        form_code: "rent-apartment",
        rent_price: 1_000_000,
        mortgage_price: 2_000_000,
      },
      ["اجاره:", "۱ میلیون", "رهن:", "۲ میلیون"],
    ],
    [
      {
        form_code: "daily-hotel",
        normal_daily_price: 1_000_000,
        weekend_daily_price: 2_000_000,
      },
      ["قیمت", "۱ میلیون", "", "۲ میلیون"],
    ],
    [
      {
        form_code: "presale-special",
        min_meter_price: 1_000_000,
        max_meter_price: 1_000_000,
      },
      ["قیمت متری:", "۱ میلیون", "حداکثر قیمت متری", "۱ میلیون"],
    ],
    [
      { form_code: "partnership", builder_share: "25%" },
      ["درصد مشارکت:", "25 درصد", "", ""],
    ],
    [{ form_code: "partnership" }, ["درصد مشارکت:", "توافقی", "", ""]],
    [
      { price: "negotiable", price_label: " raw " },
      [" raw ", "negotiable", "", ""],
    ],
  ])("pricing %j", (item, expected) => {
    const card = mapAdvertisementToAdCard(item, 0);
    expect([
      card.priceLabelPrimary,
      card.pricePrimary,
      card.priceLabelSecondary,
      card.priceSecondary,
    ]).toEqual(expected);
  });
});
