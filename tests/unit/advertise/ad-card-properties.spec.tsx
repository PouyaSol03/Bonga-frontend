import { createHash } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { AdCardBody, type AdCardData, truncateAdCardText } from "../../../src/features/advertisements/components/AdCard";

const ad: AdCardData = {
  id: 42, title: "عنوان", agency: "آژانس", status: "فعال", imageCount: "۳",
  priceLabelPrimary: "", pricePrimary: "۱۰۰", priceLabelSecondary: "", priceSecondary: "۲۰۰",
  area: "۱۲۰ متر", rooms: "۲ اتاق", year: "ساخت ۵", landArea: "۳۰۰",
  documentType: "سند", commercialPosition: "نبش", landPosition: "شمالی", floor: "۳",
  buildingArea: "۲۰۰", capacity: "۶ نفر", stars: "۴ ستاره", rentalPeriod: "شبانه",
  projectType: "اداری", totalFloors: "۱۰ طبقه", totalUnits: "۲۰ واحد", builderShare: "۴۰٪",
  currentStatus: "در حال ساخت", timeAndLocation: "اکنون تهران", imageClassName: "custom-image", badges: ["فوری", "ویژه", "جدید"],
};

function body(overrides: Partial<AdCardData>, hasSecondaryPrice = true, showBadges = true) {
  return renderToStaticMarkup(<AdCardBody ad={{ ...ad, ...overrides }} hasSecondaryPrice={hasSecondaryPrice} showBadges={showBadges} />);
}

const cases: Record<string, Partial<AdCardData>> = {
  ...Object.fromEntries([
    "sale-apartment", "sale-land", "sale-garden-villa", "sale-office", "sale-commercial", "sale-factory", "sale-hotel",
    "rent-apartment", "rent-villa-house", "rent-hotel", "rent-office", "rent-commercial", "rent-factory",
    "daily-apartment-suite", "daily-garden-villa", "daily-hotel", "daily-office-booth", "project-presale", "project-partnership",
  ].map((formCode) => [formCode, { formCode }])),
  default: { commercialPosition: "", landPosition: "", landArea: "" },
  commercialFallback: {}, factoryFallback: { commercialPosition: "" },
  landFallback: { commercialPosition: "", landPosition: "", rooms: "" },
  partnershipPrecedence: { formCode: "daily-hotel-presale-partnership" },
  presalePrecedence: { formCode: "rent-hotel-presale" },
  persianDaily: { title: "اجاره روزانه اقامتگاه" },
  persianRent: { title: "رهن سوله" }, persianSale: { category: "کلنگی" },
  englishCategory: { category: " OFFICE " },
  customProperties: { properties: [{ icon: <b>icon</b>, value: " سفارشی " }, { icon: null, value: "-" }, { icon: null, value: " " }] },
  emptyProperties: { properties: [] }, filteredProperties: { properties: [{ icon: null, value: "-" }] },
  blankValues: { area: "-", rooms: " ", year: "ساخت", documentType: "", commercialPosition: "" },
  newBuilding: { formCode: "sale-apartment", year: "ساخت نوساز" },
  explicitAge: { formCode: "sale-apartment", year: "۵ سال" },
  blankArea: { formCode: "sale-apartment", area: "متر مربع" },
  rentLabels: { formCode: "rent-office", priceLabelPrimary: "ودیعه", priceLabelSecondary: "ودیعه:" },
  totalLabel: { formCode: "sale-office", priceLabelPrimary: "قیمت کل:" },
  sharePrice: { formCode: "partnership", builderShare: "", pricePrimary: "۵۰%" },
  shareNegotiable: { formCode: "partnership", builderShare: "", pricePrimary: "توافقی" },
  sharePercent: { formCode: "partnership", builderShare: "۳۰ درصد" },
  presaleFallback: { formCode: "presale", projectType: "" },
  factoryLandFallback: { formCode: "rent-factory", buildingArea: "" },
  hotelAreaFallback: { formCode: "sale-hotel", landArea: "" },
};

describe("AdCard property and price characterization", () => {
  test("preserves exact category-dependent markup", () => {
    const hashes = Object.fromEntries(Object.entries(cases).map(([name, overrides]) => [name,
      createHash("sha256").update(body(overrides)).digest("hex"),
    ]));
    expect(hashes).toMatchInlineSnapshot(`
      {
        "blankArea": "f1c8805630d3a1232ad2e41f47dcfda650961012b989b1ca68a6f3c1371f89bd",
        "blankValues": "7b4f8662fdea7d0650cab0d4782ed93f0670466c3715cdf7195d61784450fd7b",
        "commercialFallback": "e2d3ae06529aa78700e2b6920ecc990668dbd3475d340125a1437f5b43efade9",
        "customProperties": "a198e06dbf235d567612e2a6cb63e6acbc6884267de6310e6ed10ba1983af6c7",
        "daily-apartment-suite": "0c6b7b9f4bb8fa2b4ab5dd93d4e2de33bb8161070e69088189d6cc30b6723314",
        "daily-garden-villa": "87294401fc2a6fb87af6222ab8158ac7d3247123b6c7f3d68d2d575beefda649",
        "daily-hotel": "fe6e92e5aa791c6e6d3b183ae7156815a429825d9764df797d7aab30a25abe05",
        "daily-office-booth": "7d8cb29b1e0af08e4f84359b4ccd0d80094304e68b6d79cedf0c15c9177056f0",
        "default": "c1c6998af2ffe7a81b0b33f0c97d7f853db1472acc0d75d509eb68d0c88ae342",
        "emptyProperties": "e2d3ae06529aa78700e2b6920ecc990668dbd3475d340125a1437f5b43efade9",
        "englishCategory": "c1c6998af2ffe7a81b0b33f0c97d7f853db1472acc0d75d509eb68d0c88ae342",
        "explicitAge": "506fd994f193fa44f22497c014e5cb4f09cf8801ec7cf8b1bf2cd8d053214c26",
        "factoryFallback": "63d6a1b75d4b1c59c21b4f3fdab54b85ee97c18768a17c2d0c46618e0749c107",
        "factoryLandFallback": "e19adddc6cbd91aa3cf9a26d4919d81c9a00e6a184d0a4ac2677c768b4b9b1ab",
        "filteredProperties": "29adb636a5ad6559d8236ec44a9c991ce3a2c7e0be0862330597694adad5ca69",
        "hotelAreaFallback": "22d8d8f8e6cfefcce8ca3badb9bc03c55da371c04fc6acbeae99ea1c9bedb1af",
        "landFallback": "ca0520c81401c1ef4a6a07fb88b72b192e8bf7dfce3d2034a491157ee2e2f312",
        "newBuilding": "3f272725f07f38d6087f306f60303d3eab0a5612e37f2d1da92a8b9746d35d4e",
        "partnershipPrecedence": "411ca676a54951fb9cc0f7325d82722d5f88318a0b7fdacf703fcae2832ace15",
        "persianDaily": "279cbc05ce9b09c96f5ecf20392c8e05ad8168bca16f944886a64701effcdd88",
        "persianRent": "7e87c44b4210c2564538743fdf8930e978013db6c135c15a7e6131ac9598cedd",
        "persianSale": "ca0520c81401c1ef4a6a07fb88b72b192e8bf7dfce3d2034a491157ee2e2f312",
        "presaleFallback": "2cdb38906111ed4eaf7ccf9ba7ac79ed212f632c2813b8e49ee0a13ed7d65286",
        "presalePrecedence": "38d08d52d70964b5cd2b6f3d26f3315651de79997ab100c8183cdf216dcd7a7e",
        "project-partnership": "411ca676a54951fb9cc0f7325d82722d5f88318a0b7fdacf703fcae2832ace15",
        "project-presale": "38d08d52d70964b5cd2b6f3d26f3315651de79997ab100c8183cdf216dcd7a7e",
        "rent-apartment": "5b7bbad850d6614af08d99a5efc198a634a20b5784e829f751938aa198aab95c",
        "rent-commercial": "6ae6577d99224d36191b2a88a9a85b4e6929209a2021d7fb535b7f0ab0e8fe45",
        "rent-factory": "d82b2a0f82a0f8b04a2c751efbf2f60056aa69215d9ea378fd37459bca44a093",
        "rent-hotel": "4719a83004fa96d990f8cd5d6949d20dae43830d2134d4f66d86b649b1d728a1",
        "rent-office": "6ae6577d99224d36191b2a88a9a85b4e6929209a2021d7fb535b7f0ab0e8fe45",
        "rent-villa-house": "5b7bbad850d6614af08d99a5efc198a634a20b5784e829f751938aa198aab95c",
        "rentLabels": "ea2a5d7d5047a338ffceb5666496f0652aa0b57478e19b04eebafa7ae60c2b6b",
        "sale-apartment": "506fd994f193fa44f22497c014e5cb4f09cf8801ec7cf8b1bf2cd8d053214c26",
        "sale-commercial": "e2d3ae06529aa78700e2b6920ecc990668dbd3475d340125a1437f5b43efade9",
        "sale-factory": "63d6a1b75d4b1c59c21b4f3fdab54b85ee97c18768a17c2d0c46618e0749c107",
        "sale-garden-villa": "c1c6998af2ffe7a81b0b33f0c97d7f853db1472acc0d75d509eb68d0c88ae342",
        "sale-hotel": "65fc571ab2f9556d39670a03c354ad230f352206aa9d3e8018e9b66f1d31bb7d",
        "sale-land": "ca0520c81401c1ef4a6a07fb88b72b192e8bf7dfce3d2034a491157ee2e2f312",
        "sale-office": "c1c6998af2ffe7a81b0b33f0c97d7f853db1472acc0d75d509eb68d0c88ae342",
        "shareNegotiable": "e2266481b15736f6e19d9343d508d2b32fb8562478c6b78ef8eeb78edb43f666",
        "sharePercent": "d423ce3f9746e7ca55e78739cb4445786c53c395e1f1c57054de2dad81be13d7",
        "sharePrice": "4be090916d18dc992698c67e33b9f278521a59f9092432f10a76b63efd97724b",
        "totalLabel": "c1c6998af2ffe7a81b0b33f0c97d7f853db1472acc0d75d509eb68d0c88ae342",
      }
    `);
  });

  test("preserves secondary price and badges flags", () => {
    const hashes = Object.fromEntries(["sale-apartment", "rent-apartment", "daily-hotel", "presale", "partnership"].flatMap((formCode) =>
      [false, true].flatMap((secondary) => [false, true].map((badges) => [
        `${formCode}/${secondary}/${badges}`, createHash("sha256").update(body({ formCode }, secondary, badges)).digest("hex"),
      ])),
    ));
    expect(hashes).toMatchInlineSnapshot(`
      {
        "daily-hotel/false/false": "da1fa324e6ec0d794908fa0f12a53e8867c798c7e4f1926dfe62b1ae3663fb6a",
        "daily-hotel/false/true": "f344cbd906ca2e700234b211266a5e1e02e2a43002396856a0c3e974d158c37b",
        "daily-hotel/true/false": "50bcb25cffd6ad1a026600062c3bef283c5e3e3fe658502af31c13b73ce17544",
        "daily-hotel/true/true": "fe6e92e5aa791c6e6d3b183ae7156815a429825d9764df797d7aab30a25abe05",
        "partnership/false/false": "41ccfa8b327d6b6817a58d1d453ecf45248e52168c6102ece2643071371f8cdc",
        "partnership/false/true": "411ca676a54951fb9cc0f7325d82722d5f88318a0b7fdacf703fcae2832ace15",
        "partnership/true/false": "41ccfa8b327d6b6817a58d1d453ecf45248e52168c6102ece2643071371f8cdc",
        "partnership/true/true": "411ca676a54951fb9cc0f7325d82722d5f88318a0b7fdacf703fcae2832ace15",
        "presale/false/false": "cb6ff19c780975ac0ce049e6d91e43831ca13850d41d9721ac751f1c1e89c4cc",
        "presale/false/true": "58f0d0a71b45e187a2885a0e73e94a2a1fc2a5164b0be1bcbe5378834ac84c65",
        "presale/true/false": "961262947cd912c93bf7f6108e85d9e9eed9d2e858a2fc590f7b82c3f2188f4c",
        "presale/true/true": "38d08d52d70964b5cd2b6f3d26f3315651de79997ab100c8183cdf216dcd7a7e",
        "rent-apartment/false/false": "32a4f6a95a33539adc4cb0ec77a7bbb32394eaac492bc131c121bf2aac905276",
        "rent-apartment/false/true": "db775d1f6971bbea3d4228309f65bc3f3ef38377edb4503955d2c315a4cb8393",
        "rent-apartment/true/false": "f7e632835c77164e22fee132652a2c8ada29f752bae20475a8efa57e9b2a153d",
        "rent-apartment/true/true": "5b7bbad850d6614af08d99a5efc198a634a20b5784e829f751938aa198aab95c",
        "sale-apartment/false/false": "97c0450f8f3153776c67ba292764fc4fea58981f3cce5d8455524a6d110e5103",
        "sale-apartment/false/true": "506fd994f193fa44f22497c014e5cb4f09cf8801ec7cf8b1bf2cd8d053214c26",
        "sale-apartment/true/false": "97c0450f8f3153776c67ba292764fc4fea58981f3cce5d8455524a6d110e5103",
        "sale-apartment/true/true": "506fd994f193fa44f22497c014e5cb4f09cf8801ec7cf8b1bf2cd8d053214c26",
      }
    `);
  });

  test("preserves title truncation boundaries and trailing whitespace", () => {
    expect(truncateAdCardText("a".repeat(50))).toBe("a".repeat(50));
    expect(truncateAdCardText("a".repeat(51))).toBe(`${"a".repeat(49)}…`);
    expect(truncateAdCardText(`${"a".repeat(48)}   `)).toBe(`${"a".repeat(48)}…`);
  });
});
