import { expect, test } from "@playwright/test";

import {
  basicPropertyFieldsByListingType,
  moreFeatureFieldsByListingType,
  saleCommercialFacilityItems,
  saleCommercialHeatingItems,
  saleFactoryFacilityItems,
  saleFactoryHeatingItems,
  saleOfficeFacilityItems,
  saleOfficeHeatingItems,
  saleHotelFacilityItems,
  saleHotelHeatingItems,
  saleLandFacilityItems,
  saleVillaHouseFacilityItems,
  saleVillaHouseHeatingItems,
  rentApartmentFacilityItems,
  rentCommercialFacilityItems,
  rentFactoryFacilityItems,
  rentVillaHouseFacilityItems,
  rentOfficeFacilityItems,
  rentHotelFacilityItems,
  rentHeatingItems,
  rentConversionPolicyOptions,
  dailyRentHeatingItems,
  dailyStayFacilityItems,
  dailyHotelFacilityItems,
  dailyWorkspaceFacilityItems,
  projectHeatingItems,
  projectFacilityItems,
  projectStatusOptions,
  projectTypeOptions,
  participationTypeOptions,
  partnershipCurrentStatusOptions,
} from "../../src/features/advertisements/create/data";
import { getFilterBlocks } from "../../src/features/search/SearchMapFilterPage";
import { buildPropertyDetailSections, mapAdToDetails } from "../../src/features/advertisements/view/viewAdDetails";
import {
  calculateRentPriceConversion,
  RENT_CONVERSION_MORTGAGE_UNIT,
  RENT_CONVERSION_RENT_PER_UNIT,
} from "../../src/features/advertisements/create/rentPriceConversion";

function labels(fields: readonly { label: string }[]) {
  return fields.map((field) => field.label);
}

function optionLabels(items: readonly { label: string }[]) {
  return items.map((item) => item.label);
}

function blockTitles(transaction: "sale" | "rent" | "project", category: Parameters<typeof getFilterBlocks>[1]) {
  return getFilterBlocks(transaction, category).map((block) => {
    if (block.kind === "neighborhood") return "موقعیت آگهی";
    if (block.kind === "loan") return "وام";
    if (block.kind === "advertiser") return "آگهی‌دهنده";
    if (block.kind === "publicationTime") return "زمان انتشار";
    if (block.kind === "adFlags") return "ویژگی‌های آگهی";
    return block.title;
  });
}

test("sale villa-house create contract matches requested fields", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:villa-house"])).toEqual([
    "متراژ زمین",
    "متراژ زیربنا",
    "تعداد اتاق",
    "سن ساخت",
  ]);

  expect(labels(moreFeatureFieldsByListingType["sale:villa-house"])).toEqual([
    "موقعیت زمین",
    "نوع بنا",
    "تیپ بنا",
    "سند",
    "تعداد طبقات",
    "عرض گذر",
    "بازسازی",
    "با لوازم و مبله",
    "نوع آشپزخانه",
    "جنس نما",
    "جنس کف",
    "جنس کابینت",
  ]);

  expect(optionLabels(saleVillaHouseHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(saleVillaHouseFacilityItems)).toEqual(expect.arrayContaining(["استخر", "سالن ورزشی", "زمین بازی"]));
});

test("sale land create contract matches requested fields", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:land"])).toEqual(["متراژ زمین", "سند"]);
  expect(labels(moreFeatureFieldsByListingType["sale:land"])).toEqual([
    "نوع کاربری",
    "موقعیت زمین",
    "تراکم زمین",
    "مناسب برای",
    "عرض زمین",
    "عرض گذر",
    "مجوز ساخت",
  ]);
  expect(optionLabels(saleLandFacilityItems)).toEqual([
    "امتیاز برق",
    "امتیاز آب",
    "امتیاز گاز",
    "امتیاز تلفن",
    "دور دیوار/حصار",
    "بنا کلنگی",
    "نگهبانی",
    "چاه آب",
  ]);
});

test("sale commercial create and filter contracts stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:commercial-unit"])).toEqual([
    "متراژ",
    "موقعیت تجاری",
    "سند",
    "وضعیت مالکیت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["sale:commercial-unit"])).toEqual([
    "سال ساخت",
    "طبقه",
    "تعداد کل طبقات",
    "تعداد اتاق",
    "تعداد دهنه",
    "مناسب برای",
    "مجوز تجاری",
    "وضعیت فعلی",
  ]);
  expect(optionLabels(saleCommercialHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(saleCommercialFacilityItems)).toEqual(expect.arrayContaining(["آسانسور", "پارکینگ", "حیاط"]));

  const titles = blockTitles("sale", "commercial-unit");
  for (const title of ["موقعیت تجاری", "وضعیت مالکیت", "سال ساخت", "مجوز تجاری", "وضعیت فعلی", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }
});

test("sale factory-workshop create and filter contracts stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:factory-workshop"])).toEqual([
    "متراژ زمین",
    "موقعیت زمین",
    "سال ساخت",
    "سند",
  ]);
  expect(labels(moreFeatureFieldsByListingType["sale:factory-workshop"])).toEqual([
    "تعداد اتاق",
    "متراژ بنا",
    "ارتفاع سقف",
    "نوع ملک",
    "دسترسی",
    "وضعیت فعلی",
    "مجوز تجاری",
  ]);
  expect(optionLabels(saleFactoryHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(saleFactoryFacilityItems)).toEqual([
    "برق تک فاز",
    "برق سه فاز",
    "امتیاز آب",
    "امتیاز گاز",
    "امتیاز تلفن",
    "دور دیوار/حصار",
    "بنا کلنگی",
    "نگهبانی",
    "چاه آب",
  ]);

  const titles = blockTitles("sale", "factory-workshop");
  for (const title of ["متراژ زمین", "موقعیت زمین", "سال ساخت", "سند", "نوع ملک", "دسترسی", "وضعیت فعلی", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }
});

test("view-ad property details expose commercial and industrial saved fields", () => {
  const commercialAd = {
    features: [
      { label: "form_code", value: "sale-commercial" },
      { label: "commercial_position", value: "داخل پاساژ" },
      { label: "ownership_status", value: "مالکیت کامل" },
      { label: "current_status", value: "فعال" },
      { label: "commercial_permit", value: "دائم" },
    ],
  } as any;
  const commercialLabels = buildPropertyDetailSections(commercialAd).flatMap((section) => section.items.map((item) => item.label));
  expect(commercialLabels).toEqual(expect.arrayContaining(["موقعیت تجاری", "وضعیت مالکیت", "وضعیت فعلی", "مجوز تجاری"]));

  const factoryAd = {
    features: [
      { label: "form_code", value: "sale-factory" },
      { label: "industrial_property_type", value: "سوله" },
      { label: "access_type", value: "جاده آسفالت" },
      { label: "height", value: 6 },
      { label: "current_status", value: "فعال" },
    ],
  } as any;
  const factoryLabels = buildPropertyDetailSections(factoryAd).flatMap((section) => section.items.map((item) => item.label));
  expect(factoryLabels).toEqual(expect.arrayContaining(["نوع ملک", "دسترسی", "ارتفاع سقف", "وضعیت فعلی"]));
});


test("sale office create, filters, and view-ad contracts stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:office"])).toEqual([
    "متراژ", "طبقه", "تعداد اتاق", "سال ساخت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["sale:office"])).toEqual([
    "تعداد کل طبقات", "مناسب برای", "وضعیت فعلی", "موقعیت اداری", "سند اداری",
    "جنس نما", "جنس کف", "جنس کابینت", "اتاق مدیریت", "اتاق کنفرانس",
    "سالن پذیرش", "تابلو خور", "آشپزخانه", "ورودی مجزا", "بازسازی شده", "مبله با لوازم",
  ]);
  expect(optionLabels(saleOfficeHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(saleOfficeFacilityItems)).toEqual(expect.arrayContaining(["آسانسور", "پارکینگ", "روف گاردن", "سونا"]));
  const titles = blockTitles("sale", "office");
  for (const title of ["متراژ", "طبقه", "تعداد اتاق", "سال ساخت", "موقعیت اداری", "سند اداری", "جنس نما", "اتاق مدیریت", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "sale-office" },
    { label: "office_position", value: "برج اداری" },
    { label: "office_document_type", value: "دائم" },
    { label: "management_room", value: true },
    { label: "conference_room", value: true },
  ] } as any;
  const sections = buildPropertyDetailSections(ad);
  const viewLabels = sections.flatMap((section) => [...section.items.map((item) => item.label), ...(section.badges ?? []).map((item) => item.label)]);
  expect(viewLabels).toEqual(expect.arrayContaining(["موقعیت اداری", "سند اداری", "اتاق مدیریت", "اتاق کنفرانس"]));
});

test("sale hotel create, filters, and view-ad contracts stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["sale:hotel-apartment"])).toEqual([
    "نوع اقامتگاه", "رتبه اقامتگاه", "متراژ زمین", "متراژ بنا", "سند",
  ]);
  expect(labels(moreFeatureFieldsByListingType["sale:hotel-apartment"])).toEqual([
    "موقعیت زمین", "سن ساخت", "تعداد طبقات", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته",
    "تعداد سوییت ها", "بازسازی شده", "با لوازم و مبله", "جنس کف",
  ]);
  expect(optionLabels(saleHotelHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(saleHotelFacilityItems)).toEqual(expect.arrayContaining(["استخر روباز", "استخر سرپوشیده", "سینما", "کافی شاپ", "رستوران", "فروشگاه"]));
  const titles = blockTitles("sale", "hotel-apartment");
  for (const title of ["نوع اقامتگاه", "رتبه اقامتگاه", "متراژ زمین", "متراژ بنا", "سند", "موقعیت زمین", "سن ساخت", "تعداد اتاق یک تخته", "جنس کف", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "sale-hotel" },
    { label: "accommodation_type", value: "هتل" },
    { label: "hotel_stars", value: "۵ ستاره" },
    { label: "single_room_count", value: 4 },
    { label: "double_room_count", value: 10 },
    { label: "suite_count", value: 3 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining(["نوع اقامتگاه", "رتبه اقامتگاه", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته", "تعداد سوییت ها"]));
});


test("rent price conversion follows the 1m mortgage to 30k rent rule", () => {
  expect(RENT_CONVERSION_MORTGAGE_UNIT).toBe(1_000_000);
  expect(RENT_CONVERSION_RENT_PER_UNIT).toBe(30_000);

  const converted = calculateRentPriceConversion(800_000_000, 15_000_000, 600_000_000);

  expect(converted.convertedMortgage).toBe(600_000_000);
  expect(converted.convertedRent).toBe(21_000_000);
  expect(converted.mortgageDelta).toBe(-200_000_000);
  expect(converted.rentDelta).toBe(6_000_000);
});

test("rent price conversion can move in both mortgage and rent directions", () => {
  const base = calculateRentPriceConversion(600_000_000, 12_000_000, 600_000_000);
  expect(base.convertedRent).toBe(12_000_000);
  expect(base.mortgageDelta).toBe(0);
  expect(base.rentDelta).toBe(0);

  const moreMortgage = calculateRentPriceConversion(600_000_000, 12_000_000, 800_000_000);
  expect(moreMortgage.convertedMortgage).toBe(800_000_000);
  expect(moreMortgage.convertedRent).toBe(6_000_000);
  expect(moreMortgage.mortgageDelta).toBe(200_000_000);
  expect(moreMortgage.rentDelta).toBe(-6_000_000);
});


test("rent apartment create, filters, and view-ad contracts stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:apartment"])).toEqual([
    "متراژ آپارتمان", "طبقه", "تعداد اتاق", "سن ساخت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:apartment"])).toEqual([
    "مناسب برای", "تعداد طبقات آپارتمان", "تعداد واحد در طبقه", "موقعیت ساختمان",
    "موقعیت واحد", "وضعیت سکونت", "تاریخ آماده تحویل", "حداقل مدت قرارداد",
    "حیوان خانگی", "بازسازی", "با لوازم و مبله", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ]);

  const apartmentFields = moreFeatureFieldsByListingType["rent:apartment"];
  expect(apartmentFields.find((field) => field.key === "suitableFor")?.options).toEqual(["خانواده", "مجرد", "دانشجو", "زوج"]);
  expect(apartmentFields.find((field) => field.key === "unitType")?.options).toEqual(["شمالی", "جنوبی", "شرقی", "غربی", "دونبش", "سه نبش", "دوممر"]);
  expect(apartmentFields.find((field) => field.key === "unitPosition")?.options).toEqual(["جلو", "عقب", "وسط", "کنج", "دوبلکس", "پنت هاوس"]);
  expect(apartmentFields.find((field) => field.key === "petPolicy")?.options).toEqual(["مجاز", "غیر مجاز"]);
  expect(optionLabels(rentHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(rentApartmentFacilityItems)).toEqual(expect.arrayContaining(["آسانسور", "سرویس فرهنگی", "فرتوکار", "سونا"]));
  expect(rentConversionPolicyOptions).toEqual(["قابل تبدیل نیست", "رهن قابل تبدیل", "اجاره قابل تبدیل"]);

  const titles = blockTitles("rent", "apartment");
  for (const title of ["مناسب برای", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "حیوان خانگی", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "rent-apartment" },
    { label: "occupancy_status", value: "تخلیه" },
    { label: "pet_policy", value: "مجاز" },
    { label: "ready_delivery_date", value: "۱۴۰۵/۰۶/۱۰" },
    { label: "min_contract_months", value: 12 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining(["وضعیت سکونت", "حیوان خانگی", "تاریخ آماده تحویل", "حداقل مدت قرارداد"]));
});

test("rent villa-house create, filters, and facilities match requested contract", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:villa-house"])).toEqual([
    "متراژ زمین", "متراژ بنا", "تعداد اتاق", "سن ساخت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:villa-house"])).toEqual([
    "مناسب برای", "موقعیت زمین", "نوع بنا", "تیپ بنا", "تعداد طبقات", "عرض گذر",
    "حیوان خانگی", "بازسازی", "با لوازم و مبله", "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت",
  ]);
  const fields = moreFeatureFieldsByListingType["rent:villa-house"];
  expect(fields.find((field) => field.key === "suitableFor")?.options).toEqual(["خانواده", "برگزاری مراسم", "چند خانواده"]);
  expect(fields.find((field) => field.key === "buildingType")?.options).toEqual(["ویلایی مستقل", "شهرکی", "آپارتمانی"]);
  expect(fields.find((field) => field.key === "villaType")?.options).toEqual(["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"]);
  expect(optionLabels(rentVillaHouseFacilityItems)).toEqual(expect.arrayContaining(["استخر", "سونا", "سالن ورزشی", "زمین بازی"]));
  const titles = blockTitles("rent", "villa-house");
  for (const title of ["نوع بنا", "تیپ بنا", "حیوان خانگی", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) expect(titles).toContain(title);
});

test("rent office create, filters, and view-ad contracts match requested fields", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:office"])).toEqual(["متراژ", "طبقه", "تعداد اتاق", "سال ساخت"]);
  expect(labels(moreFeatureFieldsByListingType["rent:office"])).toEqual([
    "مناسب برای", "موقعیت اداری", "وضعیت فعلی", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "دارای سند", "سند اداری",
    "اتاق مدیریت", "اتاق کنفرانس", "سالن پذیرش", "تابلو خور", "آشپزخانه", "ورودی مجزا",
    "بازسازی شده", "با لوازم و مبله", "جنس نما", "جنس کف", "جنس کابینت",
  ]);
  const fields = moreFeatureFieldsByListingType["rent:office"];
  expect(fields.find((field) => field.key === "currentStatus")?.options).toEqual(["تخلیه", "فعال"]);
  expect(fields.find((field) => field.key === "officePosition")?.options).toEqual(["مجتمع اداری", "برج اداری", "بر خیابان اصلی", "موقعیت مسکونی", "مجتمع پزشکان"]);
  expect(optionLabels(rentOfficeFacilityItems)).toEqual(expect.arrayContaining(["آسانسور", "کمد دیواری", "روف گاردن"]));
  const titles = blockTitles("rent", "office");
  for (const title of ["تاریخ آماده تحویل", "حداقل مدت قرارداد", "دارای سند", "سند اداری", "اتاق مدیریت", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) expect(titles).toContain(title);

  const ad = { features: [
    { label: "form_code", value: "rent-office" },
    { label: "office_position", value: "برج اداری" },
    { label: "office_document_type", value: "دائم" },
    { label: "ready_delivery_date", value: "۱۴۰۵/۰۶/۱۰" },
    { label: "min_contract_months", value: 6 },
    { label: "management_room", value: true },
  ] } as any;
  const sections = buildPropertyDetailSections(ad);
  const viewLabels = sections.flatMap((section) => [...section.items.map((item) => item.label), ...(section.badges ?? []).map((item) => item.label)]);
  expect(viewLabels).toEqual(expect.arrayContaining(["موقعیت اداری", "سند اداری", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "اتاق مدیریت"]));
});

test("rent hotel create, filters, and view-ad contracts match requested fields", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:hotel-apartment"])).toEqual([
    "نوع اقامتگاه", "رتبه اقامتگاه", "متراژ زمین", "متراژ بنا", "سن ساخت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:hotel-apartment"])).toEqual([
    "موقعیت زمین", "تعداد طبقات", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته", "تعداد سوییت ها",
    "بازسازی شده", "با لوازم و مبله", "جنس کف",
  ]);
  expect(optionLabels(rentHotelFacilityItems)).toEqual(expect.arrayContaining(["استخر روباز", "استخر سرپوشیده", "سینما", "کافی شاپ", "رستوران", "فروشگاه"]));
  const titles = blockTitles("rent", "hotel-apartment");
  for (const title of ["نوع اقامتگاه", "رتبه اقامتگاه", "متراژ زمین", "متراژ بنا", "سن ساخت", "موقعیت زمین", "تعداد سوییت ها", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) expect(titles).toContain(title);

  const ad = { features: [
    { label: "form_code", value: "rent-hotel" },
    { label: "accommodation_type", value: "هتل" },
    { label: "hotel_stars", value: "۵ ستاره" },
    { label: "single_room_count", value: 10 },
    { label: "double_room_count", value: 20 },
    { label: "suite_count", value: 4 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining(["نوع اقامتگاه", "رتبه اقامتگاه", "تعداد اتاق یک تخته", "تعداد اتاق دو تخته", "تعداد سوییت ها"]));
});


test("rent conversion policy is exposed directly on view-ad pricing", () => {
  const details = mapAdToDetails({
    id: "rent-policy-test",
    title: "آپارتمان اجاره‌ای",
    features: [
      { label: "form_code", value: "rent-apartment" },
      { label: "mortgage_price", value: 500_000_000 },
      { label: "rent_price", value: 12_000_000 },
      { label: "rent_conversion_policy", value: "رهن قابل تبدیل" },
    ],
  } as any);

  expect(details.pricePrimaryLabel).toBe("رهن");
  expect(details.priceSecondaryLabel).toBe("اجاره");
  expect(details.rentConversionPolicy).toBe("رهن قابل تبدیل");
});


test("rent commercial-unit create, filters, facilities, and view-ad stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:commercial-unit"])).toEqual([
    "متراژ", "موقعیت تجاری", "سال ساخت", "طبقه",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:commercial-unit"])).toEqual([
    "تعداد اتاق", "تعداد دهنه", "ارتفاع سقف", "مناسب برای", "وضعیت فعلی",
    "تاریخ آماده تحویل", "حداقل مدت قرارداد",
  ]);
  const fields = moreFeatureFieldsByListingType["rent:commercial-unit"];
  expect(fields.find((field) => field.key === "suitableFor")?.options).toEqual([
    "فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "همه مشاغل", "سایر",
  ]);
  expect(fields.find((field) => field.key === "currentStatus")?.options).toEqual(["تخلیه", "فعال"]);
  expect(optionLabels(rentCommercialFacilityItems)).toEqual(expect.arrayContaining([
    "آسانسور", "کرکره برقی", "برق تک فاز", "برق سه فاز", "امتیاز آب", "امتیاز گاز", "امتیاز تلفن",
  ]));
  const titles = blockTitles("rent", "commercial-unit");
  for (const title of ["موقعیت تجاری", "تعداد دهنه", "ارتفاع سقف", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "rent-commercial" },
    { label: "commercial_position", value: "داخل پاساژ" },
    { label: "opening_count", value: 2 },
    { label: "height", value: 4 },
    { label: "ready_delivery_date", value: "۱۴۰۵/۰۶/۱۰" },
    { label: "min_contract_months", value: 12 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining([
    "موقعیت تجاری", "تعداد دهنه", "ارتفاع سقف", "تاریخ آماده تحویل", "حداقل مدت قرارداد",
  ]));
});

test("rent factory-workshop create, filters, facilities, and view-ad stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:factory-workshop"])).toEqual([
    "متراژ زمین", "متراژ بنا", "موقعیت زمین", "سال ساخت",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:factory-workshop"])).toEqual([
    "تعداد اتاق", "ارتفاع سقف", "نوع ملک", "دسترسی", "وضعیت فعلی", "مجوز تجاری",
    "تاریخ آماده تحویل", "حداقل مدت قرارداد",
  ]);
  const fields = moreFeatureFieldsByListingType["rent:factory-workshop"];
  expect(fields.find((field) => field.key === "industrialPropertyType")?.options).toEqual([
    "سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "سردخانه", "گاوداری", "مرغداری", "سالن صنعتی",
  ]);
  expect(fields.find((field) => field.key === "accessType")?.options).toEqual([
    "جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه",
  ]);
  expect(optionLabels(rentFactoryFacilityItems)).toEqual([
    "برق تک فاز", "برق سه فاز", "امتیاز آب", "امتیاز گاز", "امتیاز تلفن",
    "دور دیوار/حصار", "بنا کلنگی", "نگهبانی", "چاه آب",
  ]);
  const titles = blockTitles("rent", "factory-workshop");
  for (const title of ["متراژ زمین", "متراژ بنا", "موقعیت زمین", "سال ساخت", "نوع ملک", "دسترسی", "تاریخ آماده تحویل", "حداقل مدت قرارداد", "تبدیل رهن و اجاره", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "rent-factory-workshop" },
    { label: "land_area", value: 1000 },
    { label: "building_area", value: 700 },
    { label: "land_position", value: "جنوبی" },
    { label: "building_age", value: "۵ سال" },
    { label: "industrial_property_type", value: "سردخانه" },
    { label: "access_type", value: "جاده آسفالت" },
    { label: "ready_delivery_date", value: "۱۴۰۵/۰۶/۱۰" },
    { label: "min_contract_months", value: 12 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining([
    "متراژ زمین", "متراژ بنا", "موقعیت زمین", "سال ساخت", "نوع ملک", "دسترسی", "تاریخ آماده تحویل", "حداقل مدت قرارداد",
  ]));
});


test("daily apartment-suite create, filters, facilities, and view-ad stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:daily-apartment-suite"])).toEqual([
    "نوع اقامتگاه", "متراژ", "تعداد اتاق", "ظرفیت استاندارد",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:daily-apartment-suite"])).toEqual([
    "ظرفیت اضافه", "طبقه", "دوره اجاره", "ساعت ورود", "ساعت خروج",
    "حداقل مدت اقامت", "تضمین تخلیه", "با لوازم و مبله", "حیوان خانگی",
  ]);
  expect(optionLabels(dailyRentHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(dailyStayFacilityItems)).toEqual(expect.arrayContaining([
    "استخر آب گرم", "اینترنت پر سرعت", "ماشین لباسشویی", "دستگاه قهوه ساز", "فضا سبز/باغ",
  ]));
  const titles = blockTitles("rent", "daily-apartment-suite");
  for (const title of ["نوع اقامتگاه", "ظرفیت استاندارد", "ظرفیت اضافه", "دوره اجاره", "ساعت ورود", "تضمین تخلیه", "روزهای عادی", "آخر هفته", "روزهای خاص", "امکانات"]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "daily-apartment-suite" },
    { label: "accommodation_type", value: "آپارتمان" },
    { label: "standard_capacity", value: 4 },
    { label: "extra_people_capacity", value: 2 },
    { label: "rental_period", value: "روزانه" },
    { label: "check_in_time", value: "14:00" },
    { label: "normal_daily_price", value: 2_000_000 },
    { label: "weekend_daily_price", value: 2_500_000 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining(["نوع اقامتگاه", "ظرفیت استاندارد", "ظرفیت اضافه", "دوره اجاره", "ساعت ورود", "روزهای عادی (شنبه تا چهارشنبه)", "آخر هفته (چهار شنبه تا جمعه)"]));
});

test("daily garden-villa create and filter contracts match requested fields", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:daily-garden-villa"])).toEqual([
    "متراژ زمین", "متراژ بنا", "تعداد اتاق", "ظرفیت استاندارد",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:daily-garden-villa"])).toEqual([
    "ظرفیت اضافه", "چشم انداز", "تیپ بنا", "دوره اجاره", "ساعت ورود", "ساعت خروج",
    "حداقل مدت اقامت", "تضمین تخلیه", "حیوان خانگی", "با لوازم و مبله",
  ]);
  const fields = moreFeatureFieldsByListingType["rent:daily-garden-villa"];
  expect(fields.find((field) => field.key === "viewType")?.options).toEqual([
    "جنگلی", "کوهستان", "دریا", "رودخانه", "شهر", "دشت", "باغ", "بیابان",
  ]);
  const titles = blockTitles("rent", "daily-garden-villa");
  for (const title of ["متراژ زمین", "متراژ بنا", "چشم انداز", "تیپ بنا", "دوره اجاره", "روزهای عادی", "هزینه هر نفر اضافه", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }
});

test("daily hotel create, rooms, filters, facilities, and view-ad stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:daily-hotel-apartment"])).toEqual([
    "رتبه اقامتگاه", "نوع اقامتگاه",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:daily-hotel-apartment"])).toEqual([]);
  expect(optionLabels(dailyHotelFacilityItems)).toEqual(expect.arrayContaining([
    "سینما", "کافی شاپ", "رستوران", "فروشگاه", "استخر آب گرم", "فضا سبز/باغ",
  ]));
  const titles = blockTitles("rent", "daily-hotel-apartment");
  for (const title of ["نوع اقامتگاه", "رتبه اقامتگاه", "دوره اجاره", "ساعت ورود", "حداقل مدت اقامت", "بازه قیمت", "سرمایش و گرمایش", "امکانات"]) {
    expect(titles).toContain(title);
  }
  const ad = { features: [
    { label: "form_code", value: "daily-hotel" },
    { label: "accommodation_type", value: "هتل" },
    { label: "hotel_stars", value: "۵ ستاره" },
    { label: "daily_hotel_rooms", value: [{ room_type: "single", guest_count: 1, normal_price: 1_000_000 }] },
    { label: "min_price", value: 1_000_000 },
    { label: "max_price", value: 5_000_000 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining(["نوع اقامتگاه", "رتبه اقامتگاه", "جزئیات اتاق‌های هتل", "حداقل قیمت", "حداکثر قیمت"]));
});

test("daily workspace create, filters, facilities, and view-ad stay aligned", () => {
  expect(labels(basicPropertyFieldsByListingType["rent:daily-workspace"])).toEqual([
    "نوع فضا", "متراژ", "تعداد اتاق", "ظرفیت استاندارد",
  ]);
  expect(labels(moreFeatureFieldsByListingType["rent:daily-workspace"])).toEqual([
    "ظرفیت اضافه", "طبقه", "دوره اجاره", "ساعت ورود", "ساعت خروج", "حداقل مدت اقامت", "تضمین تخلیه",
  ]);
  expect(optionLabels(dailyWorkspaceFacilityItems)).toEqual(expect.arrayContaining([
    "ویدئو پرژکتور", "تخته وایت برد", "پرینتر/اسکنر", "تلفن کنفرانس", "کامپیوتر/لبتاب", "سیستم تلفن",
  ]));
  const titles = blockTitles("rent", "daily-workspace");
  for (const title of ["نوع فضا", "ظرفیت استاندارد", "ظرفیت اضافه", "دوره اجاره", "ساعت ورود", "تضمین تخلیه", "روزهای عادی", "هزینه هر نفر اضافه", "امکانات"]) {
    expect(titles).toContain(title);
  }
});


test("project create, filters, and view-ad contracts stay aligned", () => {
  expect(projectTypeOptions).toEqual(["مسکونی", "تجاری", "اداری"]);
  expect(projectStatusOptions).toEqual(["در حال ساخت", "آماده تحویل"]);
  expect(optionLabels(projectHeatingItems)).toContain("موتورخانه");
  expect(optionLabels(projectFacilityItems)).toEqual(expect.arrayContaining(["آسانسور", "پارکینگ", "روف گاردن", "استخر", "جکوزی", "سونا"]));

  const titles = blockTitles("project", "project-presale");
  for (const title of [
    "نوع پروژه", "تعداد کل طبقات", "تعداد کل واحد ها", "سند", "وضعیت پروژه", "تاریخ تحویل",
    "نوع آشپزخانه", "جنس نما", "جنس کف", "جنس کابینت", "با لوازم و مبله",
    "متراژ", "طبقه", "تعداد اتاق", "موقعیت", "درصد شرایط", "تعداد اقساط",
    "قیمت متری", "سرمایش و گرمایش", "امکانات", "معاوضه با",
  ]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "presale-special" },
    { label: "builder_company_name", value: "سازنده نمونه" },
    { label: "project_type", value: "مسکونی" },
    { label: "project_total_floors", value: 12 },
    { label: "project_total_units", value: 48 },
    { label: "document_type", value: "تک برگ" },
    { label: "project_status", value: "در حال ساخت" },
    { label: "delivery_date", value: "1406/06/01" },
    { label: "min_meter_price", value: 100000000 },
    { label: "max_meter_price", value: 130000000 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining([
    "نام سازنده/شرکت", "نوع پروژه", "تعداد کل طبقات", "تعداد کل واحد ها", "سند",
    "وضعیت پروژه", "تاریخ تحویل", "حداقل قیمت متری", "حداکثر قیمت متری",
  ]));
});

test("partnership create, filters, and view-ad contracts stay aligned", () => {
  expect(participationTypeOptions).toEqual([
    "مشارکت در ساخت", "تهاتر", "سرمایه گذاری در خرید", "سرمایه گذاری مشترک در ساخت",
  ]);
  expect(partnershipCurrentStatusOptions).toEqual([
    "بنا قدیمی", "زمین خالی", "درحال ساخت", "ساختمان نوساز",
  ]);

  const titles = blockTitles("project", "project-partnership");
  for (const title of [
    "نوع مشارکت", "وضعیت فعلی ملک", "متراژ زمین", "موقعیت زمین", "مجوز ساخت",
    "نوع سند", "عرض زمین", "عرض گذر", "درصد مشارکت / درصد سهم",
  ]) {
    expect(titles).toContain(title);
  }

  const ad = { features: [
    { label: "form_code", value: "partnership" },
    { label: "partnership_type", value: "مشارکت در ساخت" },
    { label: "current_status", value: "زمین خالی" },
    { label: "land_area", value: 600 },
    { label: "land_position", value: "دونبش" },
    { label: "build_permit", value: true },
    { label: "document_type", value: "تک برگ" },
    { label: "land_width", value: 20 },
    { label: "street_width", value: 12 },
    { label: "builder_share", value: 55 },
  ] } as any;
  const viewLabels = buildPropertyDetailSections(ad).flatMap((section) => section.items.map((item) => item.label));
  expect(viewLabels).toEqual(expect.arrayContaining([
    "نوع مشارکت", "وضعیت فعلی ملک", "متراژ زمین", "موقعیت زمین", "مجوز ساخت",
    "نوع سند", "عرض زمین", "عرض گذر", "درصد مشارکت / درصد سهم",
  ]));
});

test("approved sale apartment filter follows supplied SVG field order", () => {
  expect(blockTitles("sale", "apartment")).toEqual([
    "موقعیت آگهی",
    "متراژ",
    "قیمت",
    "وام",
    "سن ساخت",
    "تعداد اتاق",
    "طبقه",
    "تعداد واحد در طبقه",
    "نوع سند",
    "موقعیت ساختمان",
    "موقعیت واحد",
    "سرمایش و گرمایش",
    "امکانات",
    "معاوضه با",
    "آگهی‌دهنده",
    "زمان انتشار",
    "ویژگی‌های آگهی",
  ]);
});

test("approved sale land filter follows supplied SVG field order", () => {
  expect(blockTitles("sale", "land")).toEqual([
    "موقعیت آگهی",
    "متراژ زمین",
    "عرض زمین",
    "قیمت",
    "نوع سند",
    "نوع کاربری",
    "موقعیت زمین",
    "سن ساخت",
    "تراکم زمین",
    "مناسب برای",
    "مجوز ساخت",
    "وام",
    "سرمایش و گرمایش",
    "امکانات",
    "معاوضه با",
    "آگهی‌دهنده",
    "زمان انتشار",
    "ویژگی‌های آگهی",
  ]);
});

test("approved sale garden-villa filter follows supplied villa SVG field order", () => {
  expect(blockTitles("sale", "garden-villa")).toEqual([
    "موقعیت آگهی",
    "متراژ زمین",
    "متراژ بنا",
    "قیمت",
    "وام",
    "تعداد اتاق",
    "سن ساخت",
    "موقعیت زمین",
    "نوع بنا",
    "تیپ بنا",
    "نوع سند",
    "تعداد طبقات",
    "سرمایش و گرمایش",
    "امکانات",
    "معاوضه با",
    "آگهی‌دهنده",
    "زمان انتشار",
    "ویژگی‌های آگهی",
  ]);
});
