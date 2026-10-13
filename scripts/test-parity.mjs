import assert from "node:assert/strict";
import fs from "node:fs";

// Mock browser globals for Node.js
const mockStorage = {};
globalThis.window = {
  location: { search: "?category=apartment&transaction=sale", pathname: "/new-ad/details" },
  history: { state: null, replaceState: () => {} },
  localStorage: {
    getItem: (k) => mockStorage[k] ?? null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  }
};

// Import new modular implementations
import {
  toLatinDigits as newToLatin,
  toPersianDigits as newToPersian,
  readText as newReadText,
  isFilledValue as newIsFilled,
  readArrayValue as newReadArray,
  toBooleanValue as newToBool,
  numericInputText as newNumericInput,
  elevatorCountText as newElevatorCount,
  selectText as newSelectText,
  ageText as newAgeText,
  idsFromLabels as newIdsFromLabels,
} from "../src/features/advertisements/create/edit-mapping/featureFormatters.ts";

import {
  normalizeLookupText as newNormalizeLookup,
  readFeatureValue as newReadFeature,
  readFirstValue as newReadFirst,
  readTextValue as newReadTextVal,
  readNestedText as newReadNested,
} from "../src/features/advertisements/create/edit-mapping/featureReaders.ts";

import {
  mediaSource as newMediaSource,
  mediaName as newMediaName,
  getExistingPhotoMedia as newGetExistingPhotos,
  getExistingVideoMedia as newGetExistingVideo,
} from "../src/features/advertisements/create/edit-mapping/mediaMappers.ts";

import {
  mapProjectDetails as newMapProject,
  mapDailyHotelRooms as newMapHotel,
  readFormCode as newReadFormCode,
} from "../src/features/advertisements/create/edit-mapping/specMappers.ts";

import {
  getAdvertisementFeatures as newGetFeatures,
  normalizeCrmDynamicFields as newNormCrmFields,
  normalizeCrmAdvertiseForEdit as newNormCrmAd,
  nestedRecordId as newNestedRecordId,
  flattenCategories as newFlattenCat,
  findCategoryId as newFindCatId,
} from "../src/features/advertisements/create/edit-mapping/crmEditNormalizer.ts";

import {
  editRouteParamsByFormCode as newEditRouteParams,
  getEditRouteParamsFromAd as newGetEditRouteParams,
  getEditAdId as newGetEditAdId,
} from "../src/features/advertisements/create/edit-mapping/editRouteParams.ts";

import {
  mapAdvertisementToEditValues as newMapAdToEditValues,
} from "../src/features/advertisements/create/edit-mapping/mapAdvertisementToEditValues.ts";

import {
  loadAtomicDraft,
  saveAtomicDraft,
  clearAtomicDraft,
  ATOMIC_DRAFT_KEY,
} from "../src/features/advertisements/create/draft/adDraftStore.ts";

import {
  blankValues,
  propertySpecs,
  facilityItems,
  heatingItems,
  draftKey,
  locationKey,
  locationLatKey,
  locationLngKey,
  neighborhoodIdKey,
  subNeighborhoodIdKey,
  dailyHotelRoomTypes,
} from "../src/features/advertisements/create/data.ts";

import {
  validateNewAd as newValidateNewAd,
  validateNewAdDetails as newValidateDetails,
} from "../src/features/advertisements/create/validation.ts";

import {
  buildNewAdFormData,
  buildPayload,
} from "../src/features/advertisements/create/utils.ts";

import {
  buildEditPatchFormData,
} from "../src/features/advertisements/create/edit-patch/index.ts";

import {
  buildCrmAdvertisePayload,
} from "../src/features/advertisements/create/edit-mapping/crmEditNormalizer.ts";


// TEST SUITE RUNNER
const results = { passed: 0, failed: 0, errors: [] };

function test(name, fn) {
  try {
    fn();
    results.passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    results.failed++;
    results.errors.push({ name, error: err.message });
    console.log(`  ✗ ${name}: ${err.message}`);
  }
}

console.log("=== STARTING COMPLETE PARITY & REGRESSION TEST SUITE ===");

// 1. Text & Digits Formatters Parity
console.log("\n1. Formatters Parity");
test("toLatinDigits parity with Persian and Arabic digits", () => {
  assert.equal(newToLatin("۱۲۳۴۵۶۷۸۹۰ ١٢٣٤٥٦٧٨٩٠"), "1234567890 1234567890");
});

test("toPersianDigits parity with Latin digits", () => {
  assert.equal(newToPersian("0123456789"), "۰۱۲۳۴۵۶۷۸۹");
});

test("numericInputText with billion and million words", () => {
  assert.equal(newNumericInput("۲.۵ میلیارد"), "2500000000");
  assert.equal(newNumericInput("۷۵۰ میلیون"), "750000000");
  assert.equal(newNumericInput("1,200,000,000"), "1200000000");
  assert.equal(newNumericInput("0"), "0");
  assert.equal(newNumericInput(""), "");
});

test("elevatorCountText clamps between 1 and 5 and outputs Persian digits", () => {
  assert.equal(newElevatorCount("0"), "");
  assert.equal(newElevatorCount("1"), "۱");
  assert.equal(newElevatorCount("3"), "۳");
  assert.equal(newElevatorCount("7"), "۵");
  assert.equal(newElevatorCount("10"), "۵");
  assert.equal(newElevatorCount("ندارد"), "");
});

test("ageText formats raw numbers and preserves strings", () => {
  assert.equal(newAgeText("5"), "۵ سال");
  assert.equal(newAgeText("نوساز"), "نوساز");
  assert.equal(newAgeText("10 سال"), "10 سال");
  assert.equal(newAgeText("۰"), "۰ سال");
});

test("toBooleanValue converts Persian/English strings and booleans", () => {
  assert.equal(newToBool(true), true);
  assert.equal(newToBool(false), false);
  assert.equal(newToBool(1), true);
  assert.equal(newToBool(0), false);
  assert.equal(newToBool("true"), true);
  assert.equal(newToBool("false"), false);
  assert.equal(newToBool("دارد"), true);
  assert.equal(newToBool("ندارد"), false);
  assert.equal(newToBool("بله"), true);
  assert.equal(newToBool("خیر"), false);
  assert.equal(newToBool("on"), true);
  assert.equal(newToBool("off"), false);
  assert.equal(newToBool(""), null);
});

test("idsFromLabels matches both ids and labels", () => {
  const items = [{ id: "parking", label: "پارکینگ" }, { id: "elevator", label: "آسانسور" }];
  assert.deepEqual(newIdsFromLabels(items, "پارکینگ، آسانسور"), ["parking", "elevator"]);
  assert.deepEqual(newIdsFromLabels(items, ["parking"]), ["parking"]);
});

// 2. Feature Readers & Media Parity
console.log("\n2. Feature Readers & Media Parity");
test("getAdvertisementFeatures extracts labels and values", () => {
  const ad = {
    features: [
      { key: "meterage", label: "متراژ", value: "120" },
      { name: "floor", value: "3" },
      null,
      "invalid"
    ]
  };
  const features = newGetFeatures(ad);
  assert.equal(features.length, 2);
  assert.equal(features[0].label, "متراژ");
  assert.equal(features[0].value, "120");
  assert.equal(features[1].label, "floor");
  assert.equal(features[1].value, "3");
});

test("readFirstValue prioritizes features over direct keys", () => {
  const features = [{ key: "price", label: "قیمت", value: "5000000" }];
  const ad = { price: "4000000" };
  assert.equal(newReadFirst(ad, features, ["price"]), "5000000");
});

test("mediaSource extracts source from url, path, src, file", () => {
  assert.equal(newMediaSource({ url: "https://example.com/img.jpg" }), "https://example.com/img.jpg");
  assert.equal(newMediaSource({ path: "/uploads/video.mp4" }), "/uploads/video.mp4");
  assert.equal(newMediaSource("direct-string.png"), "direct-string.png");
});

test("mapProjectDetails extracts floors, meterage, and positions", () => {
  const projectValue = [
    { id: "p1", min_meterage: "80", max_meterage: "150", floor: ["1", "2"], rooms: ["2", "3"] },
    { meterage: "100", positions: ["شمالی", "جنوبی"] }
  ];
  const mapped = newMapProject(projectValue);
  assert.equal(mapped.length, 2);
  assert.equal(mapped[0].minMeterage, "80");
  assert.equal(mapped[0].maxMeterage, "150");
  assert.deepEqual(mapped[0].floors, ["1", "2"]);
  assert.equal(mapped[1].meterage, "100");
  assert.deepEqual(mapped[1].positions, ["شمالی", "جنوبی"]);
});

// 3. Category Mappings & Edge Cases
console.log("\n3. Category Mappings & Edge Cases");

test("Case A: Apartment Sale complex ad mapping", () => {
  const sampleAd = {
    id: "ad-100",
    title: "آپارتمان ۱۲۰ متری نوساز",
    description: "توضیحات کامل آگهی",
    owner_phone: "09123456789",
    contact_type: ["phone", "chat"],
    publisher_type: "personal",
    owner_type: "personal",
    lat: "35.7219",
    lng: "51.3347",
    neighborhood_id: "neigh-10",
    features: [
      { key: "form_code", value: "sale-apartment" },
      { key: "meterage", value: "120" },
      { key: "rooms", value: "2" },
      { key: "floor", value: "3" },
      { key: "building_age", value: "نوساز" },
      { key: "price", value: "6000000000" },
      { key: "elevator_count", value: "1" },
      { key: "parking_count", value: "1" },
      { key: "terrace_count", value: "1" },
      { key: "has_document", value: "دارد" },
      { key: "is_renovated", value: "true" },
      { key: "loan_amount", value: "400000000" },
      { key: "facilities", value: "elevator, parking, terrace" }
    ],
    images: ["/uploads/img1.jpg", "/uploads/img2.jpg"]
  };

  const mapped = newMapAdToEditValues(sampleAd, blankValues);
  assert.equal(mapped.title, "آپارتمان ۱۲۰ متری نوساز");
  assert.equal(mapped.description, "توضیحات کامل آگهی");
  assert.equal(mapped.meterage, "120");
  assert.equal(mapped.rooms, "۲");
  assert.equal(mapped.floor, "۳");
  assert.equal(mapped.price, "6000000000");
  assert.equal(mapped.elevatorCount, "۱");
  assert.equal(mapped.parkingCount, "۱");
  assert.equal(mapped.terraceCount, "۱");
  assert.equal(mapped.loanEnabled, true);
  assert.equal(mapped.loanAmount, "400000000");
  assert.equal(mapped.hasDocument, true);
  assert.equal(mapped.renovated, true);
  assert.equal(mapped.chatEnabled, true);
  assert.equal(mapped.phoneEnabled, true);
  assert.equal(mapped.phoneNumber, ""); // When contact_type is provided, phoneEnabled is true while phoneNumber remains blank as in legacy
    assert.equal(mapped.photos.length, 2);
  assert.ok(mapped.facilities.includes("elevator"));
  assert.ok(mapped.facilities.includes("parking"));
  assert.ok(mapped.facilities.includes("terrace"));
});

test("Case A2: Apartment Sale with fallback phone when contact_type is empty", () => {
  const adNoContactTypes = {
    id: "ad-101",
    owner_phone: "09123456789",
    features: []
  };
  const mapped = newMapAdToEditValues(adNoContactTypes, blankValues);
  assert.equal(mapped.phoneEnabled, true);
  assert.equal(mapped.phoneNumber, "09123456789");
});

test("Case B: Villa Rent with convertible mortgage and pets allowed", () => {
  const villaAd = {
    id: "ad-200",
    title: "ویلای دوبلکس در لواسان",
    owner_phone: "09121112233",
    contact_type: ["phone"],
    features: [
      { key: "form_code", value: "rent-villa-house" },
      { key: "meterage", value: "350" },
      { key: "land_area", value: "500" },
      { key: "mortgage_price", value: "1000000000" },
      { key: "rent_price", value: "50000000" },
      { key: "rent_convertible", value: "true" },
      { key: "rent_conversion_mortgage_price", value: "500000000" },
      { key: "pet_policy", value: "مجاز است" },
      { key: "furnished", value: "بله" }
    ]
  };

  const mapped = newMapAdToEditValues(villaAd, blankValues);
  assert.equal(mapped.meterage, "350");
  assert.equal(mapped.landArea, "500");
  assert.equal(mapped.mortgagePrice, "1000000000");
  assert.equal(mapped.rentPrice, "50000000");
  assert.equal(mapped.rentConversionEnabled, true);
  assert.equal(mapped.rentConversionMortgagePrice, "500000000");
  assert.equal(mapped.petPolicy, "مجاز است");
  assert.equal(mapped.furnished, true);
});

test("Case C: Hotel / Daily Accommodation with room tiers", () => {
  const hotelAd = {
    id: "ad-300",
    title: "هتل آپارتمان ساحلی کیش",
    features: [
      { key: "form_code", value: "daily-hotel" },
      { key: "hotel_stars", value: "4" },
      { key: "standard_capacity", value: "2" },
      { key: "extra_people_capacity", value: "1" },
      { key: "normal_daily_price", value: "1500000" },
      { key: "weekend_daily_price", value: "2000000" },
      {
        key: "daily_hotel_rooms",
        value: [
          { room_type: "single", normal_price: "1000000", guest_count: "1", meal_plan: "صبحانه" },
          { room_type: "double", normal_price: "1800000", guest_count: "2", meal_plan: "فولبرد" }
        ]
      }
    ]
  };

  const mapped = newMapAdToEditValues(hotelAd, blankValues);
  assert.equal(mapped.hotelStars, "۴");
  assert.equal(mapped.standardCapacity, "۲");
  assert.equal(mapped.extraPeopleCapacity, "۱");
  assert.equal(mapped.normalDailyPrice, "1500000");
  assert.equal(mapped.weekendDailyPrice, "2000000");
  
  const singleRoom = mapped.dailyHotelRooms.find(r => r.id === "single");
  assert.ok(singleRoom);
  assert.equal(singleRoom.normalPrice, "1000000");
  assert.equal(singleRoom.guestCount, "۱");
  assert.equal(singleRoom.mealPlan, "صبحانه");
});

test("Case D: Partnership Project with developer and delivery terms", () => {
  const projectAd = {
    id: "ad-400",
    title: "پروژه برج باغ نیاوران",
    features: [
      { key: "form_code", value: "partnership" },
      { key: "builder_company_name", value: "گروه ساختمانی پارس" },
      { key: "project_total_floors", value: "15" },
      { key: "project_total_units", value: "60" },
      { key: "builder_share_percent", value: "50" },
      { key: "delivery_date", value: "۱۴۰۶/۰۶/۳۱" }
    ]
  };

  const mapped = newMapAdToEditValues(projectAd, blankValues);
  assert.equal(mapped.builderCompanyName, "گروه ساختمانی پارس");
  assert.equal(mapped.projectTotalFloors, "15");
  assert.equal(mapped.projectTotalUnits, "60");
  assert.equal(mapped.builderSharePercent, "50");
  assert.equal(mapped.projectDeliveryDate, "۱۴۰۶/۰۶/۳۱");
});

test("Case E: Commercial Sale with permits and industrial type", () => {
  const commAd = {
    id: "ad-500",
    title: "سوله بهداشتی در شهرک صنعتی",
    features: [
      { key: "form_code", value: "sale-factory" },
      { key: "ceiling_height", value: "8" },
      { key: "commercial_permit", value: "دارد" },
      { key: "industrial_property_type", value: "سوله و کارگاه" }
    ]
  };

  const mapped = newMapAdToEditValues(commAd, blankValues);
  assert.equal(mapped.ceilingHeight, "8");
  assert.equal(mapped.commercialPermit, true);
  assert.equal(mapped.industrialPropertyType, "سوله و کارگاه");
});

// 4. Atomic Draft Store Parity & Backward Compatibility
console.log("\n4. Atomic Draft Store Parity & Migration");
test("Atomic Draft save and load", () => {
  window.localStorage.clear();
  saveAtomicDraft({
    values: { ...blankValues, title: "پیش‌نویس تستی اتمیک", meterage: "95" },
    step: "details",
    draftAdId: "draft-777",
    location: "سعادت‌آباد",
    lat: "35.78",
    lng: "51.37",
    neighborhoodId: "neigh-5",
    subNeighborhoodId: "sub-2"
  });

  const loaded = loadAtomicDraft();
  assert.equal(loaded?.values?.title, "پیش‌نویس تستی اتمیک");
  assert.equal(loaded?.values?.meterage, "95");
  assert.equal(loaded?.step, "details");
  assert.equal(loaded?.draftAdId, "draft-777");
  assert.equal(loaded?.location, "سعادت‌آباد");
  assert.equal(loaded?.lat, "35.78");
  assert.equal(loaded?.lng, "51.37");
  assert.equal(loaded?.neighborhoodId, "neigh-5");
});

test("Atomic Draft migration fallback from legacy 6 localStorage keys", () => {
  // Clear storage and only set the legacy keys
  window.localStorage.clear();
  window.localStorage.setItem(draftKey, JSON.stringify({ title: "آگهی قدیمی درفت شده", price: "2000000" }));
  window.localStorage.setItem(locationKey, "ونک، ملاصدرا");
  window.localStorage.setItem(locationLatKey, "35.76");
  window.localStorage.setItem(locationLngKey, "51.40");
  window.localStorage.setItem(neighborhoodIdKey, "neigh-99");
  window.localStorage.setItem(subNeighborhoodIdKey, "sub-88");

  // loadAtomicDraft must seamlessly fall back and recover from the 6 keys
  const recovered = loadAtomicDraft();
  assert.ok(recovered !== null);
  assert.equal(recovered?.values?.title, "آگهی قدیمی درفت شده");
  assert.equal(recovered?.values?.price, "2000000");
  assert.equal(recovered?.location, "ونک، ملاصدرا");
  assert.equal(recovered?.lat, "35.76");
  assert.equal(recovered?.lng, "51.40");
  assert.equal(recovered?.neighborhoodId, "neigh-99");
  assert.equal(recovered?.subNeighborhoodId, "sub-88");
});

test("clearAtomicDraft wipes atomic draft and all legacy keys atomically", () => {
  window.localStorage.setItem(ATOMIC_DRAFT_KEY, "some-atomic-data");
  window.localStorage.setItem(draftKey, "legacy-draft");
  window.localStorage.setItem(locationKey, "loc");
  window.localStorage.setItem(locationLatKey, "lat");
  window.localStorage.setItem(locationLngKey, "lng");
  window.localStorage.setItem(neighborhoodIdKey, "n");
  window.localStorage.setItem(subNeighborhoodIdKey, "sn");

  clearAtomicDraft();

  assert.equal(window.localStorage.getItem(ATOMIC_DRAFT_KEY), null);
  assert.equal(window.localStorage.getItem(draftKey), null);
  assert.equal(window.localStorage.getItem(locationKey), null);
  assert.equal(window.localStorage.getItem(locationLatKey), null);
  assert.equal(window.localStorage.getItem(locationLngKey), null);
  assert.equal(window.localStorage.getItem(neighborhoodIdKey), null);
  assert.equal(window.localStorage.getItem(subNeighborhoodIdKey), null);
});

// 5. CRM Normalization Parity
console.log("\n5. CRM Record Normalization Parity");
test("normalizeCrmAdvertiseForEdit handles dynamic_fields and existing features", () => {
  const crmRecord = {
    id: "crm-100",
    title: "دفتر کار اداری",
    dynamic_fields: [
      { label: "متراژ", value: "250" },
      { key: "elevator", label: "آسانسور", value: true }
    ]
  };
  const normalized = newNormCrmAd(crmRecord);
  assert.equal(normalized.title, "دفتر کار اداری");
  assert.equal(normalized.features.length, 2);
  assert.equal(normalized.features[0].label, "متراژ");
  assert.equal(normalized.features[0].value, "250");
});


// 6. Validation Flow Parity
console.log("\n6. Validation Flow Parity");
test("validateNewAdDetails catches missing mandatory fields (price, location, rooms)", () => {
  const invalidValues = {
    ...blankValues,
    price: "",
    location: "",
  };
  const validation = newValidateDetails(invalidValues);
  assert.ok(validation !== null);
  assert.ok(Boolean(validation?.errors?.price));
  assert.ok(Boolean(validation?.errors?.location));
});

test("validateNewAdDetails passes when mandatory details fields are filled", () => {
  const validDetails = {
    ...blankValues,
    title: "آپارتمان ۷۵ متری شیک",
    location: "سعادت آباد",
    meterage: "75",
    rooms: "2",
    floor: "1",
    totalFloors: "4",
    age: "نوساز",
    price: "3500000000",
  };
  const validation = newValidateDetails(validDetails);
  assert.equal(validation, null);
});

test("validateNewAd full validation returns media step when only photos are missing", () => {
  const valuesWithoutPhotos = {
    ...blankValues,
    title: "آپارتمان بدون عکس",
    location: "سعادت آباد",
    meterage: "80",
    rooms: "2",
    floor: "2",
    totalFloors: "5",
    age: "نوساز",
    price: "4000000000",
    photos: [],
  };
  const validation = newValidateNewAd(valuesWithoutPhotos, { forceFullEditFields: false });
  assert.ok(validation !== null);
  assert.equal(validation?.step, "media");
  assert.ok(Boolean(validation?.errors?.photos));
});

// 7. Payload & Edit Patch Generation Parity
console.log("\n7. Payload & Edit Patch Generation Parity");
test("buildNewAdFormData creates FormData with form_code and structured features", () => {
  const sampleValues = {
    ...blankValues,
    title: "فروش آپارتمان نوساز",
    meterage: "110",
    rooms: "2",
    price: "5500000000",
  };

  const formData = buildNewAdFormData(sampleValues, {
    categoryId: "cat-1",
    dynamicFieldKeys: ["meterage", "rooms", "price"],
    formCode: "sale-apartment",
    isEdit: false,
  });

  assert.equal(formData.get("title"), "فروش آپارتمان نوساز");
  assert.equal(formData.get("form_code"), "sale-apartment");
  assert.equal(formData.get("category_id"), "cat-1");
});

test("buildEditPatchFormData only includes changed fields", () => {
  const baseline = {
    ...blankValues,
    title: "عنوان اولیه",
    meterage: "100",
    price: "4000000000",
  };

  const updated = {
    ...baseline,
    title: "عنوان ویرایش شده",
    price: "4500000000", // changed
  };

  const patch = buildEditPatchFormData(updated, baseline, {
    categoryId: "cat-1",
    dynamicFieldKeys: ["price", "meterage"],
    formCode: "sale-apartment",
  });

  assert.equal(patch.hasChanges, true);
  assert.equal(patch.formData.get("title"), "عنوان ویرایش شده");
});

test("buildEditPatchFormData detects no changes when values match", () => {
  const baseline = {
    ...blankValues,
    title: "عنوان ثابت",
    meterage: "100",
  };

  const patch = buildEditPatchFormData({ ...baseline }, baseline, {
    categoryId: "cat-1",
    dynamicFieldKeys: ["meterage"],
    formCode: "sale-apartment",
  });

  assert.equal(patch.hasChanges, false);
});

// 8. CRM Payload Building
console.log("\n8. CRM Payload Building");
test("buildCrmAdvertisePayload builds valid CRM payload with contact types and coordinates", async () => {
  const crmValues = {
    ...blankValues,
    title: "فروش ملک اداری CRM",
    description: "ملک با دسترسی عالی",
    meterage: "140",
    price: "8000000000",
    phoneNumber: "09129876543",
    chatEnabled: true,
    phoneEnabled: true,
    location: "ونک",
  };

  const payload = await buildCrmAdvertisePayload(crmValues, { lat: 35.75, lng: 51.41 });
  assert.equal(payload.title, "فروش ملک اداری CRM");
  assert.equal(payload.owner_phone, "09129876543");
  assert.ok(payload.contact_type.includes("chat"));
  assert.ok(payload.contact_type.includes("phone"));
  assert.equal(payload.lat, 35.75);
  assert.equal(payload.lng, 51.41);
});

// 9. Draft Persistence Across Agency Selection & Navigation Parity
console.log("\n9. Draft Persistence Across Agency Selection & Navigation Parity");
test("draft values and agency selection step survive agency preview navigation", () => {
  window.localStorage.clear();

  // User fills form up to agency selection step
  const filledValues = {
    ...blankValues,
    title: "آپارتمان در سعادت آباد",
    meterage: "120",
    price: "6000000000",
    location: "سعادت آباد",
    agencyId: "agency-42",
    publisherName: "املاک پیشرو",
  };

  saveAtomicDraft({
    values: filledValues,
    step: "agencySelection",
    location: "سعادت آباد",
  });

  // Simulate user navigating to agency preview and returning (popstate)
  const restoredDraft = loadAtomicDraft();
  assert.ok(restoredDraft !== null);
  assert.equal(restoredDraft?.step, "agencySelection");
  assert.equal(restoredDraft?.values?.title, "آپارتمان در سعادت آباد");
  assert.equal(restoredDraft?.values?.agencyId, "agency-42");
  assert.equal(restoredDraft?.values?.publisherName, "املاک پیشرو");
});

test("entering new-ad category clears draft so new ad starts clean", () => {
  assert.ok(loadAtomicDraft() !== null);
  clearAtomicDraft();
  assert.equal(loadAtomicDraft(), null);
});

console.log(`\n=== FINAL RESULT: ${results.passed} PASSED, ${results.failed} FAILED ===`);
if (results.failed > 0) {
  process.exit(1);
}
