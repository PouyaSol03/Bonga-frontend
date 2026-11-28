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
        "blankArea": "7c931c86186352c09a23057ef176d95859c69fb4fe4d29e5f78706643ec20859",
        "blankValues": "645c0ccf3c959bf7b4161149ac5696fe51012b02eeade43584983a3cb27135e7",
        "commercialFallback": "d00485bffa15fff098fc13372bf71dcb28804e0170e5add536c9e94c70212f92",
        "customProperties": "ae8e14b38a8d98a0a905843813d7e80266759c2a529773520c3eff768dcfd006",
        "daily-apartment-suite": "f3aa86775d7df1ca240cc4ffd9e21794a98a56d726e5541cd7d99a3242d04087",
        "daily-garden-villa": "1ffe6b408cec6e3e665d9c167612b88105f4febcfa93085342d26aad384ef1de",
        "daily-hotel": "9277ccdd39e262916582afe14b36d8e3714806579843e72ac9029cf52e2c3f37",
        "daily-office-booth": "5eed84e756f2330e29b2178741f2a2e6bb7d975d9a36673fef6133cac11fcf15",
        "default": "4a65ca3dbb885a13ccadab00ab2208c09cbf8559d7a290b63d65b360aa0f973c",
        "emptyProperties": "d00485bffa15fff098fc13372bf71dcb28804e0170e5add536c9e94c70212f92",
        "englishCategory": "4a65ca3dbb885a13ccadab00ab2208c09cbf8559d7a290b63d65b360aa0f973c",
        "explicitAge": "0d1e2cf3d410ccb4f3f56f47755d2a70546cd695c638e224a9f9b09455072345",
        "factoryFallback": "bdb257816e324c6b0c2654e98ca2424f3d66db0864a96ab616a688b9ab69ca41",
        "factoryLandFallback": "3e7ebfe791a0aa3df0de305c58a332e7231e4c527a46b02b019136fc5d7095e0",
        "filteredProperties": "2fe5b4024022068d07e7ee1fc1f1581f37e1f8bdb826860d6124e8cc5fde8b5b",
        "hotelAreaFallback": "5320a060e6c554b331950b04296dfe339574b2c5d3ac4af1b0798cc3f42c0b58",
        "landFallback": "70f3b7e0e1a5211b56086c7726f9328753aa5e92e2886181b5b2931b090c60b1",
        "newBuilding": "d20e121d2fc3260b52d2917e318f1240179b7c5c558554315173f7d0b56f3fe0",
        "partnershipPrecedence": "a852e4a408eec8f659df748aa69c92980aab36c60d9e78b3c7e3bb9c702df1a6",
        "persianDaily": "0a9aef1dc146e19d5d1a2e578759a74fc231eb882dd1ad4ea06bc0f916a298ef",
        "persianRent": "5901b63fd377489031d47a8e9792440b487bad0570f76205ed7a7b58d91c0034",
        "persianSale": "70f3b7e0e1a5211b56086c7726f9328753aa5e92e2886181b5b2931b090c60b1",
        "presaleFallback": "c6ae5dcb1b6fb8d3459ef5999b21222a0c48030c2b655937a6f6aafb5a20e152",
        "presalePrecedence": "d6f2fe2256e3bb9d1f0a96dd9d952d5183d974e8b2cc36ba94e7a43f59de857a",
        "project-partnership": "a852e4a408eec8f659df748aa69c92980aab36c60d9e78b3c7e3bb9c702df1a6",
        "project-presale": "d6f2fe2256e3bb9d1f0a96dd9d952d5183d974e8b2cc36ba94e7a43f59de857a",
        "rent-apartment": "b6889c988366f7662c6c2e3f3520113aa9d67204b146486d63435bf0573e3413",
        "rent-commercial": "3152350f13a2d751060fcb77eaadf455ae88d57a8a84ab7879056a064540a2ff",
        "rent-factory": "af1618e0693d328d6aa5febcd134cb63ce14ed1fca1e7b2b17a7da2ef1dc965b",
        "rent-hotel": "e31b62ee79db61e431d58a7d64aaf1ddb11ccae56f926bb57600b938a250e2c3",
        "rent-office": "3152350f13a2d751060fcb77eaadf455ae88d57a8a84ab7879056a064540a2ff",
        "rent-villa-house": "b6889c988366f7662c6c2e3f3520113aa9d67204b146486d63435bf0573e3413",
        "rentLabels": "edbcb82087fa88519b2ae049707e55f1efcba574c0b15b25857f79156b69f84a",
        "sale-apartment": "0d1e2cf3d410ccb4f3f56f47755d2a70546cd695c638e224a9f9b09455072345",
        "sale-commercial": "d00485bffa15fff098fc13372bf71dcb28804e0170e5add536c9e94c70212f92",
        "sale-factory": "bdb257816e324c6b0c2654e98ca2424f3d66db0864a96ab616a688b9ab69ca41",
        "sale-garden-villa": "4a65ca3dbb885a13ccadab00ab2208c09cbf8559d7a290b63d65b360aa0f973c",
        "sale-hotel": "febf0c767e0b03f4aa918166a0856e46ad397537dd31714760edc76c1dcf4b81",
        "sale-land": "70f3b7e0e1a5211b56086c7726f9328753aa5e92e2886181b5b2931b090c60b1",
        "sale-office": "4a65ca3dbb885a13ccadab00ab2208c09cbf8559d7a290b63d65b360aa0f973c",
        "shareNegotiable": "9a16e1f28d484d568a87624d9043aebb3cc00dbd648bae4ef2937c99f9d7a283",
        "sharePercent": "fa5ec2342485f348dc1211e8d12a360aa17bc50abe4f7b90bbba53df17430adc",
        "sharePrice": "2a889b84c658fcb610e5ddc6432ab8a80450c24d46edd96beeb3c287da56260c",
        "totalLabel": "4a65ca3dbb885a13ccadab00ab2208c09cbf8559d7a290b63d65b360aa0f973c",
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
        "daily-hotel/false/false": "7fb80039a9a5139f6da426194fab1b3430b8ebbad4df314af6549e8d9ee7fc66",
        "daily-hotel/false/true": "71455b9456a162eed61f285aefb831297f44484e51cd7fccc8bc4b8823f4c9a7",
        "daily-hotel/true/false": "19d57cee980944556f9c34a7a398dbc0687b064be067b9d8911a4670e36b6db1",
        "daily-hotel/true/true": "9277ccdd39e262916582afe14b36d8e3714806579843e72ac9029cf52e2c3f37",
        "partnership/false/false": "d8317b6264c19f7e21e68fa0790b16cbdadc4a65efc6e46b5f6ab5f52ecd96af",
        "partnership/false/true": "a852e4a408eec8f659df748aa69c92980aab36c60d9e78b3c7e3bb9c702df1a6",
        "partnership/true/false": "d8317b6264c19f7e21e68fa0790b16cbdadc4a65efc6e46b5f6ab5f52ecd96af",
        "partnership/true/true": "a852e4a408eec8f659df748aa69c92980aab36c60d9e78b3c7e3bb9c702df1a6",
        "presale/false/false": "b69cbd896b10a3036b7907748e0dfa78d08b45d93a51e5ecb28e9e4fb300903e",
        "presale/false/true": "9b96a5f39de4c257043d5a6087e06b430aea2da9673372995f927cf17f6de06c",
        "presale/true/false": "7f28e6e69f60f7343b8b8af6b6f06a511d7896a144db1a65937ace343af30161",
        "presale/true/true": "d6f2fe2256e3bb9d1f0a96dd9d952d5183d974e8b2cc36ba94e7a43f59de857a",
        "rent-apartment/false/false": "25b3b16126a77ed9241a4ee346152f9627a64843486918052d6cbd4a4f024d47",
        "rent-apartment/false/true": "fdee3ad6d4bb997ebb5b63cc71adc1fe4a6c8e1a878978a1c15b287154d8819a",
        "rent-apartment/true/false": "aa1fea548cbc1c43f9e028942484ed15b96ab33d3fd86fb47f9f2e66f38b5d2a",
        "rent-apartment/true/true": "b6889c988366f7662c6c2e3f3520113aa9d67204b146486d63435bf0573e3413",
        "sale-apartment/false/false": "ab869c51f87db92ee2c84a4466c0667839253cb5831a27fd2ec90f8a41e6975c",
        "sale-apartment/false/true": "0d1e2cf3d410ccb4f3f56f47755d2a70546cd695c638e224a9f9b09455072345",
        "sale-apartment/true/false": "ab869c51f87db92ee2c84a4466c0667839253cb5831a27fd2ec90f8a41e6975c",
        "sale-apartment/true/true": "0d1e2cf3d410ccb4f3f56f47755d2a70546cd695c638e224a9f9b09455072345",
      }
    `);
  });

  test("preserves title truncation boundaries and trailing whitespace", () => {
    expect(truncateAdCardText("a".repeat(50))).toBe("a".repeat(50));
    expect(truncateAdCardText("a".repeat(51))).toBe(`${"a".repeat(49)}…`);
    expect(truncateAdCardText(`${"a".repeat(48)}   `)).toBe(`${"a".repeat(48)}…`);
  });
});
