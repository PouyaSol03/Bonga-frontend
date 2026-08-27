import type {
  BasicPropertyField,
  ChipItem,
  MoreFeatureField,
  MoreFeatureFormKey,
  MoreFeatureSelectKey,
  NewAdFormValues,
  DailyHotelRoomConfig,
  DailyHotelRoomTypeId,
} from "./types";

export const locationKey = "bonga-new-ad-location";
export const locationLatKey = "bonga-new-ad-location-lat";
export const locationLngKey = "bonga-new-ad-location-lng";
export const neighborhoodIdKey = "bonga-new-ad-neighborhood-id";
export const subNeighborhoodIdKey = "bonga-new-ad-sub-neighborhood-id";
export const draftKey = "bonga-new-ad-draft";

export const dailyHotelRoomTypes: {
  id: DailyHotelRoomTypeId;
  label: string;
}[] = [
  { id: "single", label: "اتاق یک تخته" },
  { id: "double", label: "اتاق دو تخته" },
  { id: "triple", label: "اتاق سه تخته" },
  { id: "quad", label: "اتاق چهار تخته" },
  { id: "quint", label: "اتاق پنج تخته" },
  { id: "suite", label: "سوییت" },
];

export const dailyHotelRoomCapacityOptions = Array.from({ length: 20 }, (_, index) => `${index + 1}`);

export const dailyHotelMealPlanOptions = [
  "بدون وعده غذایی",
  "صبحانه",
  "ناهار",
  "شام",
  "صبحانه، ناهار",
  "صبحانه، شام",
  "ناهار، شام",
  "صبحانه، ناهار، شام",
];

function createDefaultDailyHotelRooms(): DailyHotelRoomConfig[] {
  return dailyHotelRoomTypes.map((room) => ({
    id: room.id,
    label: room.label,
    guestCount: "",
    extraGuestCount: "",
    mealPlan: "",
    normalPrice: "",
    weekendPrice: "",
    specialPrice: "",
  }));
}

export const blankValues: NewAdFormValues = {
  location: "",

  meterage: "",
  landArea: "",
  buildingArea: "",

  floor: "",
  rooms: "",
  age: "",

  density: "",
  usageType: [],
  landPosition: "",
  documentType: "",
  suitableFor: [],
  hotelStars: "",
  accommodationType: "",
  spaceType: "",
  standardCapacity: "",
  extraPeopleCapacity: "",
  commercialLicense: "",
  constructionLicense: "",
  participationType: "",
  builderCompanyName: "",
  projectType: "",

  projectTotalFloors: "",
  projectTotalUnits: "",
  projectStatus: "",
  projectDeliveryDate: "",
  projectDetails: [],

  saleTermsEnabled: false,
  saleTermsPercent: "",
  saleTermsInstallmentMonths: "",
  builderSharePercent: "",

  selectedSpecs: [],
  heatingCooling: [],
  facilities: [],

  price: "",
  mortgagePrice: "",
  rentPrice: "",
  rentConversionEnabled: false,
  rentConversionMortgagePrice: "",
  rentConversionPolicy: "قابل تبدیل نیست",
  minPrice: "",
  maxPrice: "",
  normalDailyPrice: "",
  weekendDailyPrice: "",
  specialDailyPrice: "",
  extraPersonPrice: "",
  loanEnabled: false,
  loanAmount: "",
  loanInstallment: "",
  exchangeEnabled: false,
  exchangeTargets: [],

  photos: [],
  hasVideo: false,
  video: null,
  hasVirtualTour: false,
  virtualTourLink: "",

  registrantType: "",
  publisherName: "",
  agencyId: "",
  chatEnabled: false,
  phoneEnabled: false,
  phoneNumber: "",
  ownerFullName: "",
  ownerExactAddress: "",
  telegram: "",
  whatsapp: "",

  title: "",
  description: "",

  targetOwnerType: "",
  targetOwnerId: "",

  totalFloors: "",
  unitsPerFloor: "",
  unitType: "",
  unitPosition: "",
  occupancyStatus: "",
  kitchenType: "",
  petPolicy: "",
  readyDeliveryDate: "",
  minContractMonths: "",
  rentalPeriod: "",
  viewType: "",
  checkInTime: "",
  checkOutTime: "",
  minStayDays: "",
  evacuationGuarantee: "",
  renovated: false,
  furnished: false,
  facadeMaterial: "",
  floorMaterial: "",
  cabinetMaterial: "",
  buildingType: "",
  villaType: "",
  commercialPosition: "",
  ownershipStatus: "",
  currentStatus: "",
  industrialPropertyType: "",
  accessType: "",
  officePosition: "",
  officeDocumentType: "",
  hasDocument: false,
  managementRoom: false,
  conferenceRoom: false,
  receptionHall: false,
  signboard: false,
  kitchen: false,
  separateEntrance: false,
  landWidth: "",
  streetWidth: "",
  constructionPermit: false,
  commercialPermit: false,
  ceilingHeight: "",
  openingCount: "",
  elevatorCount: "",
  singleRoomCount: "",
  doubleRoomCount: "",
  suiteCount: "",
  dailyHotelRooms: createDefaultDailyHotelRooms(),
};

export const projectStatusOptions = [
  "در حال ساخت",
  "آماده تحویل",
];

export const projectTypeOptions = [
  "مسکونی",
  "تجاری",
  "اداری",
];

export const partnershipCurrentStatusOptions = [
  "بنا قدیمی",
  "زمین خالی",
  "درحال ساخت",
  "ساختمان نوساز",
];

export const projectFloorOptions = [
  "همکف",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸ و بیشتر",
];

export const projectRoomOptions = [
  "بدون اتاق",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵+",
];

export const projectPositionOptions = [
  "شمالی",
  "جنوبی",
  "شرقی",
  "غربی",
];

export const propertySpecs: ChipItem[] = [
  { id: "total-floors", label: "تعداد کل طبقات" },
  { id: "furnished", label: "با لوازم و مبله شده" },
  { id: "facade", label: "جنس نما" },
  { id: "floor-material", label: "جنس کف" },
];

export const heatingItems: ChipItem[] = [
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "water-cooler", label: "کولر آبی" },
  { id: "package", label: "پکیج" },
  { id: "heater", label: "بخاری" },
  { id: "water-heater", label: "آبگرمکن" },
  { id: "fireplace", label: "شوفاژ" },
];

export const facilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "lobby", label: "لابی" },
  { id: "guard", label: "نگهبانی" },
  { id: "yard", label: "حیاط" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "sauna", label: "سونا" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "camera", label: "دوربین مدار بسته" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "power", label: "امتیاز برق" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فر توکار" },
];

export const saleApartmentHeatingItems: ChipItem[] = [
  { id: "water-cooler", label: "کولر آبی" },
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "heater", label: "بخاری" },
  { id: "radiator", label: "شوفاژ" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
  { id: "water-heater", label: "آبگرم کن" },
  { id: "package", label: "پکیج" },
  { id: "central-boiler", label: "موتورخانه" },
];

export const saleApartmentFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فر توکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
];

export const projectHeatingItems: ChipItem[] = saleApartmentHeatingItems;
export const projectFacilityItems: ChipItem[] = saleApartmentFacilityItems;

export const saleVillaHouseHeatingItems: ChipItem[] = [
  { id: "water-cooler", label: "کولر آبی" },
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن‌کوئل" },
  { id: "heater", label: "بخاری" },
  { id: "radiator", label: "شوفاژ" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
  { id: "water-heater", label: "آبگرم کن" },
  { id: "package", label: "پکیج" },
  { id: "central-boiler", label: "موتورخانه" },
];

export const saleVillaHouseFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فر توکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" },
];

export const saleOfficeHeatingItems: ChipItem[] = saleVillaHouseHeatingItems;

export const saleOfficeFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فر توکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
];

export const saleCommercialHeatingItems: ChipItem[] = saleVillaHouseHeatingItems;

export const saleCommercialFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "yard", label: "حیاط" },
];

export const saleFactoryHeatingItems: ChipItem[] = saleVillaHouseHeatingItems;

export const saleHotelHeatingItems: ChipItem[] = saleVillaHouseHeatingItems;

export const saleHotelFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "terrace", label: "تراس" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "outdoor-pool", label: "استخر روباز" },
  { id: "indoor-pool", label: "استخر سرپوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "cinema", label: "سینما" },
  { id: "coffee-shop", label: "کافی شاپ" },
  { id: "restaurant", label: "رستوران" },
  { id: "shop", label: "فروشگاه" },
];

export const saleFactoryFacilityItems: ChipItem[] = [
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "phone", label: "امتیاز تلفن" },
  { id: "walled", label: "دور دیوار/حصار" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "guard", label: "نگهبانی" },
  { id: "water-well", label: "چاه آب" },
];

export const rentHeatingItems: ChipItem[] = [
  { id: "water-cooler", label: "کولر آبی" },
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "duct-split", label: "داکت اسپیلت" },
  { id: "chiller", label: "چیلر" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "heater", label: "بخاری" },
  { id: "radiator", label: "شوفاژ" },
  { id: "floor-heating", label: "گرمایش ازکف" },
  { id: "fireplace", label: "شومینه" },
  { id: "water-heater", label: "آبگرم کن" },
  { id: "package", label: "پکیج" },
  { id: "central-boiler", label: "موتورخانه" },
];

export const rentApartmentFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فرتوکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
];

export const rentVillaHouseFacilityItems: ChipItem[] = [
  ...rentApartmentFacilityItems,
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" },
];

export const rentOfficeFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
];

export const rentCommercialFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "electric-shutter", label: "کرکره برقی" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "yard", label: "حیاط" },
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "phone", label: "امتیاز تلفن" },
];

export const rentFactoryFacilityItems: ChipItem[] = [
  { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "phone", label: "امتیاز تلفن" },
  { id: "walled", label: "دور دیوار/حصار" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "guard", label: "نگهبانی" },
  { id: "water-well", label: "چاه آب" },
];

export const rentHotelFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "terrace", label: "تراس" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "outdoor-pool", label: "استخر روباز" },
  { id: "indoor-pool", label: "استخر سرپوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "cinema", label: "سینما" },
  { id: "coffee-shop", label: "کافی شاپ" },
  { id: "restaurant", label: "رستوران" },
  { id: "shop", label: "فروشگاه" },
];

export const dailyRentHeatingItems: ChipItem[] = rentHeatingItems;

export const dailyStayFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "yard", label: "حیاط" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "western", label: "سرویس فرهنگی" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فرتوکار" },
  { id: "guard", label: "نگهبانی" },
  { id: "camera", label: "دوربین امنیتی" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" },
  { id: "heated-pool", label: "استخر آب گرم" },
  { id: "outdoor-pool", label: "استخرروباز" },
  { id: "covered-pool", label: "استخر پوشیده" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "playground", label: "زمین بازی" },
  { id: "internet", label: "اینترنت پر سرعت" },
  { id: "tv", label: "تلویزیون" },
  { id: "audio", label: "سیستم صوتی" },
  { id: "washing-machine", label: "ماشین لباسشویی" },
  { id: "fridge", label: "یخچال" },
  { id: "stove-microwave", label: "اجاق گاز مایکروفر" },
  { id: "hall", label: "سالن" },
  { id: "cookware", label: "لوازم آشپزی" },
  { id: "clean-linen", label: "ملحفه و حوله تمیز" },
  { id: "hairdryer", label: "سشوار" },
  { id: "iron", label: "اتو" },
  { id: "dishwasher", label: "ظرفشویی" },
  { id: "outdoor-space", label: "فضا بیرونی" },
  { id: "ventilation", label: "سیستم تهویه مطبوع" },
  { id: "coffee-maker", label: "دستگاه قهوه ساز" },
  { id: "security-system", label: "سیستم امنیتی" },
  { id: "workspace", label: "فضا کار" },
  { id: "balcony", label: "بالکن" },
  { id: "service", label: "سرویس" },
  { id: "bedding", label: "سرویس خواب" },
  { id: "bed", label: "تخت خواب" },
  { id: "furniture", label: "مبلمان" },
  { id: "hygiene-pack", label: "پک بهداشتی" },
  { id: "serving-items", label: "ظروف و لوازم پذیرایی" },
  { id: "dining-table", label: "میزناهار خوری" },
  { id: "kitchen", label: "آشپزخانه" },
  { id: "master-room", label: "اتاق مستر" },
  { id: "barbecue", label: "باربیکیو" },
  { id: "gazebo", label: "آلاچیق" },
  { id: "garden", label: "فضا سبز/باغ" },
];

export const dailyHotelFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" }, { id: "parking", label: "پارکینگ" }, { id: "terrace", label: "تراس" },
  { id: "iranian", label: "سرویس ایرانی" }, { id: "western", label: "سرویس فرهنگی" }, { id: "lobby", label: "لابی" },
  { id: "roof", label: "روف گاردن" }, { id: "heated-pool", label: "استخر آب گرم" }, { id: "outdoor-pool", label: "استخرروباز" },
  { id: "covered-pool", label: "استخر پوشیده" }, { id: "jacuzzi", label: "جکوزی" }, { id: "sauna", label: "سونا" },
  { id: "gym", label: "سالن ورزشی" }, { id: "playground", label: "زمین بازی" }, { id: "cinema", label: "سینما" },
  { id: "coffee-shop", label: "کافی شاپ" }, { id: "restaurant", label: "رستوران" }, { id: "shop", label: "فروشگاه" },
  { id: "gas-stove", label: "گازرومیزی" }, { id: "hood", label: "هود" }, { id: "oven", label: "فرتوکار" },
  { id: "guard", label: "نگهبانی" }, { id: "camera", label: "دوربین امنیتی" }, { id: "bms", label: "سیستم هوشمند" },
  { id: "internet", label: "اینترنت پر سرعت" }, { id: "tv", label: "تلویزیون" }, { id: "audio", label: "سیستم صوتی" },
  { id: "washing-machine", label: "ماشین لباسشویی" }, { id: "fridge", label: "یخچال" }, { id: "stove-microwave", label: "اجاق گاز مایکروفر" },
  { id: "cookware", label: "لوازم آشپزی" }, { id: "clean-linen", label: "ملحفه و حوله تمیز" }, { id: "hairdryer", label: "سشوار" },
  { id: "iron", label: "اتو" }, { id: "dishwasher", label: "ظرفشویی" }, { id: "outdoor-space", label: "فضا بیرونی" },
  { id: "ventilation", label: "سیستم تهویه مطبوع" }, { id: "coffee-maker", label: "دستگاه قهوه ساز" }, { id: "security-system", label: "سیستم امنیتی" },
  { id: "workspace", label: "فضا کار" }, { id: "bedding", label: "سرویس خواب" }, { id: "bed", label: "تخت خواب" },
  { id: "furniture", label: "مبلمان" }, { id: "hygiene-pack", label: "پک بهداشتی" }, { id: "serving-items", label: "ظروف و لوازم پذیرایی" },
  { id: "dining-table", label: "میزناهار خوری" }, { id: "kitchen", label: "آشپزخانه" }, { id: "master-room", label: "اتاق مستر" },
  { id: "barbecue", label: "باربیکیو" }, { id: "gazebo", label: "آلاچیق" }, { id: "garden", label: "فضا سبز/باغ" },
];

export const dailyWorkspaceFacilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" }, { id: "parking", label: "پارکینگ" }, { id: "warehouse", label: "انباری" },
  { id: "internet", label: "اینترنت پر سرعت" }, { id: "projector", label: "ویدئو پرژکتور" }, { id: "whiteboard", label: "تخته وایت برد" },
  { id: "audio", label: "سیستم صوتی" }, { id: "printer-scanner", label: "پرینتر/اسکنر" }, { id: "office-furniture", label: "میزوصندلی اداری" },
  { id: "reception", label: "پذیرایی" }, { id: "fax", label: "دستگاه فکس" }, { id: "conference-phone", label: "تلفن کنفرانس" },
  { id: "computer-laptop", label: "کامپیوتر/لبتاب" }, { id: "monitor", label: "مانیتور" }, { id: "tv", label: "تلویزیون" },
  { id: "copier", label: "دستگاه کپی" }, { id: "ventilation", label: "سیستم تهویه مطبوع" }, { id: "filing", label: "قفسه وفایلینگ" },
  { id: "meeting-room", label: "اتاق جلسات" }, { id: "rest-room", label: "اتاق استراحت" }, { id: "coffee-maker", label: "دستگاه قهوه ساز" },
  { id: "air-purifier", label: "دستگاه تصفیه هوا" }, { id: "camera", label: "دوربین" }, { id: "single-phase-power", label: "برق تک فاز" },
  { id: "three-phase-power", label: "برق سه فاز" }, { id: "water", label: "امتیازآب" }, { id: "gas", label: "امتیاز گاز" },
  { id: "phone", label: "امتیاز تلفن" }, { id: "voip-cctv", label: "voipمداربسته" }, { id: "private-phone-room", label: "اتاق تلفن خصوصی" },
  { id: "phone-system", label: "سیستم تلفن" },
];

export const saleLandFacilityItems: ChipItem[] = [
  { id: "power", label: "امتیاز برق" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "phone", label: "امتیاز تلفن" },
  { id: "walled", label: "دور دیوار/حصار" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "guard", label: "نگهبانی" },
  { id: "water-well", label: "چاه آب" },
];

export const landFacilityItems: ChipItem[] = [
  { id: "power", label: "امتیاز برق" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "guard", label: "نگهبانی" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "walled", label: "دور دیوار" },
  { id: "water-well", label: "چاه آب" },
];

export const exchangeTargets = [
  "خودرو",
  "آپارتمان",
  "خانه ویلایی",
  "زمین",
  "ویلا",
  "واحد اداری",
  "واحد تجاری",
  "هتل",
];

export const rentConversionPolicyOptions = [
  "قابل تبدیل نیست",
  "رهن قابل تبدیل",
  "اجاره قابل تبدیل",
];

export const moreFeatureKeys: MoreFeatureFormKey[] = [
  "age",
  "buildingArea",
  "floor",
  "rooms",
  "totalFloors",
  "unitsPerFloor",
  "unitType",
  "unitPosition",
  "documentType",
  "usageType",
  "suitableFor",
  "occupancyStatus",
  "kitchenType",
  "petPolicy",
  "readyDeliveryDate",
  "projectDeliveryDate",
  "projectStatus",
  "minContractMonths",
  "rentalPeriod",
  "viewType",
  "checkInTime",
  "checkOutTime",
  "minStayDays",
  "evacuationGuarantee",
  "extraPeopleCapacity",
  "renovated",
  "furnished",
  "facadeMaterial",
  "floorMaterial",
  "cabinetMaterial",
  "landPosition",
  "buildingType",
  "villaType",
  "commercialPosition",
  "ownershipStatus",
  "currentStatus",
  "industrialPropertyType",
  "accessType",
  "officePosition",
  "officeDocumentType",
  "hasDocument",
  "density",
  "landWidth",
  "streetWidth",
  "constructionPermit",
  "commercialPermit",
  "managementRoom",
  "conferenceRoom",
  "receptionHall",
  "signboard",
  "kitchen",
  "separateEntrance",
  "commercialLicense",
  "ceilingHeight",
  "openingCount",
  "singleRoomCount",
  "doubleRoomCount",
  "suiteCount",
];

export const floorOptions = ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
export const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"];
export const unitsPerFloorOptions = Array.from({ length: 8 }, (_, index) =>
  new Intl.NumberFormat("fa-IR").format(index + 1),
);
export const capacityOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۲", "۱۵", "۲۰", "۳۰", "۴۰", "۵۰+"];
export const roomCountOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۵", "۲۰", "۳۰", "۵۰+"];
export const openingCountOptions = Array.from({ length: 20 }, (_, index) => new Intl.NumberFormat("fa-IR").format(index + 1));
export const elevatorCountOptions = Array.from({ length: 5 }, (_, index) => new Intl.NumberFormat("fa-IR").format(index + 1));
export const projectCountOptions = Array.from({ length: 100 }, (_, index) => new Intl.NumberFormat("fa-IR").format(index + 1));
export const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});
export const yesNoOptions = ["دارد", "ندارد"];
export const participationTypeOptions = [
  "مشارکت در ساخت",
  "تهاتر",
  "سرمایه گذاری در خرید",
  "سرمایه گذاری مشترک در ساخت",
];

export const ageOptions = [
  "نوساز",
  "۱ سال",
  "۲ سال",
  "۳ سال",
  "۴ سال",
  "۱۰ سال",
  "۱۵ سال",
  "۲۰ سال",
  "بیشتر از ۳۰ سال",
];

export const usageTypeOptions = [
  "مسکونی",
  "تجاری",
  "اداری",
  "صنعتی",
  "کشاورزی",
  "گلخانه",
  "مسکونی تجاری",
];

const saleLandUsageTypeOptions = [
  "مسکونی",
  "اداری",
  "تجاری",
  "صنعتی",
  "کشاورزی",
  "باغی",
  "آموزشی",
  "درمانی",
  "مذهبی",
  "ورزشی",
  "خدماتی",
  "گردشگری و توریستی",
  "پارکینگ",
  "حریم",
  "فاقد کاربری",
];

export const landPositionOptions = [
  "شمالی",
  "جنوبی",
  "سه نبش",
  "دو نبش",
  "چهار نبش",
];

export const saleLandPositionOptions = [
  "شمالی",
  "جنوبی",
  "غربی",
  "شرقی",
  "دوممر",
  "دونبش",
  "سه نبش",
  "چهارنبش",
];

export const documentTypeOptions = [
  "ملکی",
  "آستانه",
  "اوقاف",
  "موقوفه",
  "قولنامه",
  "وکالت",
];

const saleLandDocumentTypeOptions = [
  "تک برگ",
  "منگوله‌دار",
  "آستانه",
  "اوقافی",
  "موقوفه",
  "وکالت محضری",
  "قولنامه",
  "مشاع",
  "در دست اقدام",
  "آماده انتقال",
];

const saleLandDensityOptions = ["کم", "متوسط", "زیاد"];

const saleLandSuitableForOptions = [
  "ساخت آپارتمان",
  "ساخت ویلا",
  "سرمایه‌گذاری",
  "تجمیع با ملک مجاور",
];

export const suitableForOptions = [
  "مهندسین",
  "وکلا",
  "درمانگاه",
  "مطب",
  "موسسه",
  "آموزشگاه",
  "شرکت ها",
  "آتلیه",
  "مزون",
  "اسناد رسمی",
  "پوشاک",
  "ابزارآلات",
  "کترینگ",
  "رستوران",
  "کافه",
  "انبار",
  "کارگاه",
  "صنایع پلاستیکی",
  "صنایع چوبی",
];

export const hotelStarsOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];
const saleHotelStarsOptions = ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"];
const saleAccommodationTypeOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه", "مجتمع توریستی"];

export const commercialLicenseOptions = ["دائم", "موقت", "ندارد"];
export const constructionLicenseOptions = yesNoOptions;

const saleCommercialPositionOptions = ["بر خیابان اصلی", "داخل پاساژ", "داخل کوچه", "بازار محله", "غرفه"];
const saleCommercialOwnershipOptions = ["مالکیت کامل", "فقط سرقفلی", "فقط مالکیت", "مالکیت مشترک"];
const saleCommercialSuitableForOptions = ["فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "همه مشاغل"];
const currentStatusOptions = ["تخلیه", "فعال"];
const saleOfficeCurrentStatusOptions = ["تخلیه", "فعال", "درحال بازسازی"];
const saleOfficeSuitableForOptions = [
  "مهندسین", "شرکت‌ها", "وکلا", "مطب", "موسسه", "آموزشگاه", "آتلیه", "مزون",
  "اسناد رسمی", "دفاتر دولت", "صنایع", "خدماتی", "ورزشی", "فرهنگی", "مذهبی", "همه مشاغل",
];
const saleOfficePositionOptions = ["مجتمع اداری", "برج اداری", "بر خیابان اصلی", "موقعیت مسکونی", "مجتمع پزشکان"];
const saleOfficeDocumentTypeOptions = ["دائم", "موقت"];
const industrialPropertyTypeOptions = ["سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "گاوداری", "مرغداری"];
const rentIndustrialPropertyTypeOptions = ["سوله", "انبار", "کارگاه", "کارخانه", "گلخانه", "سردخانه", "گاوداری", "مرغداری", "سالن صنعتی"];
const rentCommercialSuitableForOptions = ["فروشگاه", "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "همه مشاغل", "سایر"];
const industrialAccessTypeOptions = ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"];

const rentApartmentSuitableForOptions = ["خانواده", "مجرد", "دانشجو", "زوج"];
const rentVillaSuitableForOptions = ["خانواده", "برگزاری مراسم", "چند خانواده"];
export const rentPetPolicyOptions = ["مجاز", "غیر مجاز"];
const rentOfficeSuitableForOptions = [
  "تجاری", "خدماتی", "اداری", "صنعتی", "آموزشی", "درمانی", "انباری", "مهندسین",
  "شرکت ها", "وکلا", "مطب", "موسسه", "آموزشگاه", "آتلیه", "مزون", "اسناد رسمی",
  "دفاتر دولت", "صنایع", "ورزشی", "فرهنگی", "مذهبی", "همه مشاغل",
];
const rentCurrentStatusOptions = ["تخلیه", "فعال"];

export const dailyAccommodationTypeOptions = ["سویئت", "آپارتمان", "اتاق", "خوابگاه یا پانسیون", "بوم گردی"];
export const dailyHotelAccommodationTypeOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه"];
export const dailyHotelStarsOptions = ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"];
export const dailyRentalPeriodOptions = ["روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"];
export const dailyWorkspaceRentalPeriodOptions = ["ساعتی", "روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"];
export const dailyVillaViewOptions = ["جنگلی", "کوهستان", "دریا", "رودخانه", "شهر", "دشت", "باغ", "بیابان"];
export const dailyWorkspaceTypeOptions = ["اتاق کار اشتراکی", "اتاق کار خصوصی", "اتاق جلسه", "کلاس آموزشی", "سالن همایش", "غرفه نمایشگاه", "کانتر"];

const saleApartmentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ آپارتمان", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleVillaHouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleLandBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions, required: true },
];

const saleOfficeBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const saleCommercialUnitBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "commercialPosition", label: "موقعیت تجاری", control: "select", options: saleCommercialPositionOptions, required: true },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions, required: true },
  { key: "ownershipStatus", label: "وضعیت مالکیت", control: "select", options: saleCommercialOwnershipOptions, required: true },
];

const saleWarehouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: suitableForOptions, required: true },
];

const saleHotelApartmentBasicFields: BasicPropertyField[] = [
  { key: "accommodationType", label: "نوع اقامتگاه", control: "select", options: saleAccommodationTypeOptions, required: true },
  { key: "hotelStars", label: "رتبه اقامتگاه", control: "select", options: saleHotelStarsOptions, required: true },
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions, required: true },
];

const saleFactoryWorkshopBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions, required: true },
];

const rentApartmentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ آپارتمان", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentVillaHouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentOfficeBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const rentCommercialUnitBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "commercialPosition", label: "موقعیت تجاری", control: "select", options: saleCommercialPositionOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
];

const rentWarehouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "input", numeric: true, leftText: "متر", required: true },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: suitableForOptions, required: true },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: commercialLicenseOptions, required: true },
];

const rentHotelApartmentBasicFields: BasicPropertyField[] = [
  { key: "accommodationType", label: "نوع اقامتگاه", control: "select", options: saleAccommodationTypeOptions, required: true },
  { key: "hotelStars", label: "رتبه اقامتگاه", control: "select", options: saleHotelStarsOptions, required: true },
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentFactoryWorkshopBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions, required: true },
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions, required: true },
];

const dailyApartmentBasicFields: BasicPropertyField[] = [
  { key: "accommodationType", label: "نوع اقامتگاه", control: "select", options: dailyAccommodationTypeOptions, required: true },
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "standardCapacity", label: "ظرفیت استاندارد", control: "select", options: capacityOptions, required: true },
];

const dailyVillaBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "standardCapacity", label: "ظرفیت استاندارد", control: "select", options: capacityOptions, required: true },
];

const dailyWorkspaceBasicFields: BasicPropertyField[] = [
  { key: "spaceType", label: "نوع فضا", control: "select", options: dailyWorkspaceTypeOptions, required: true },
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "standardCapacity", label: "ظرفیت استاندارد", control: "select", options: capacityOptions, required: true },
];

const dailyHotelRentBasicFields: BasicPropertyField[] = [
  { key: "hotelStars", label: "رتبه اقامتگاه", control: "select", options: dailyHotelStarsOptions, required: true },
  { key: "accommodationType", label: "نوع اقامتگاه", control: "select", options: dailyHotelAccommodationTypeOptions, required: true },
];

export const defaultBasicPropertyFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
];

export const basicPropertyFieldsByListingType: Record<string, BasicPropertyField[]> = {
  "sale:apartment": saleApartmentBasicFields,
  "sale:villa-house": saleVillaHouseBasicFields,
  "sale:garden-villa": saleVillaHouseBasicFields,
  "sale:land": saleLandBasicFields,
  "sale:office": saleOfficeBasicFields,
  "sale:commercial-unit": saleCommercialUnitBasicFields,
  "sale:warehouse": saleWarehouseBasicFields,
  "sale:hotel-apartment": saleHotelApartmentBasicFields,
  "sale:factory-workshop": saleFactoryWorkshopBasicFields,

  "rent:apartment": rentApartmentBasicFields,
  "rent:villa-house": rentVillaHouseBasicFields,
  "rent:garden-villa": saleVillaHouseBasicFields,
  "rent:office": rentOfficeBasicFields,
  "rent:commercial-unit": rentCommercialUnitBasicFields,
  "rent:warehouse": rentWarehouseBasicFields,
  "rent:hotel-apartment": rentHotelApartmentBasicFields,
  "rent:factory-workshop": rentFactoryWorkshopBasicFields,

  "rent:daily-apartment-suite": dailyApartmentBasicFields,
  "rent:daily-garden-villa": dailyVillaBasicFields,
  "rent:daily-workspace": dailyWorkspaceBasicFields,
  "rent:daily-hotel-apartment": dailyHotelRentBasicFields,
};

export const moreFeatureOptions: Record<MoreFeatureSelectKey, string[]> = {
  age: ageOptions,
  floor: floorOptions,
  rooms: roomOptions,
  totalFloors: ["۱ طبقه", "۲ طبقه", "۳ طبقه", "۴ طبقه", "۵ طبقه", "۶ طبقه", "۷ طبقه", "۸ طبقه و بیشتر"],
  unitsPerFloor: unitsPerFloorOptions,
  unitType: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش"],
  unitPosition: ["جلو", "عقب", "وسط", "کنج", "دوبلکس"],
  documentType: documentTypeOptions,
  occupancyStatus: ["تخلیه", "مالک", "مستاجر دارد"],
  kitchenType: ["اپن", "جزیره", "بسته", "نیمه اپن"],
  facadeMaterial: ["سنگ", "آجر", "سیمان", "کامپوزیت", "شیشه", "رومی", "ترکیبی"],
  floorMaterial: ["سرامیک", "سنگ", "پارکت", "لمینت", "موزاییک", "کفپوش"],
  cabinetMaterial: ["MDF", "های‌گلاس", "ممبران", "فلزی", "چوبی", "ندارد"],
  landPosition: landPositionOptions,
  buildingType: ["ویلایی مستقل", "شهرکی", "آپارتمانی"],
  villaType: ["فلت", "دوبلکس", "تریپلکس", "مدرن", "کلاسیک", "باغ‌ویلا"],
  commercialPosition: saleCommercialPositionOptions,
  ownershipStatus: saleCommercialOwnershipOptions,
  currentStatus: currentStatusOptions,
  industrialPropertyType: industrialPropertyTypeOptions,
  accessType: industrialAccessTypeOptions,
  officePosition: saleOfficePositionOptions,
  officeDocumentType: saleOfficeDocumentTypeOptions,
  petPolicy: rentPetPolicyOptions,
  density: saleLandDensityOptions,
  commercialLicense: commercialLicenseOptions,
  singleRoomCount: roomCountOptions,
  doubleRoomCount: roomCountOptions,
  suiteCount: roomCountOptions,
  extraPeopleCapacity: capacityOptions,
  rentalPeriod: dailyRentalPeriodOptions,
  viewType: dailyVillaViewOptions,
  openingCount: openingCountOptions,
  projectStatus: projectStatusOptions,
};

const saleApartmentUnitsPerFloorOptions = Array.from({ length: 8 }, (_, index) =>
  new Intl.NumberFormat("fa-IR").format(index + 1),
);

const saleApartmentBuildingPositionOptions = [
  "شمالی",
  "جنوبی",
  "شرقی",
  "غربی",
  "دونبش",
  "سه نبش",
  "دوممر",
];

const saleApartmentUnitPositionOptions = [
  "جلو",
  "عقب",
  "وسط",
  "کنج",
  "دوبلکس",
  "پنت هاوس",
];

const saleApartmentDocumentTypeOptions = [
  "تک برگ",
  "منگوله دار",
  "آستانه",
  "اوقافی",
  "موقوفه",
  "وکالت محضری",
  "قولنامه",
  "مشاع",
  "در دست اقدام",
  "آماده انتقال",
];

const saleApartmentOccupancyStatusOptions = ["تخلیه", "مالک", "مستاجر دارد"];
export const saleApartmentKitchenTypeOptions = ["اپن", "جزیره", "بسته", "نیمه اپن"];

const saleApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select" },
  { key: "unitsPerFloor", label: "تعداد واحد در طبقه", control: "select", options: saleApartmentUnitsPerFloorOptions },
  { key: "unitType", label: "موقعیت ساختمان", control: "select", options: saleApartmentBuildingPositionOptions },
  { key: "unitPosition", label: "موقعیت واحد", control: "select", options: saleApartmentUnitPositionOptions },
  { key: "documentType", label: "سند", control: "select", options: saleApartmentDocumentTypeOptions },
  { key: "occupancyStatus", label: "وضعیت سکونت", control: "select", options: saleApartmentOccupancyStatusOptions },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "kitchenType", label: "نوع آشپزخانه", control: "select", options: saleApartmentKitchenTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const apartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select" },
  { key: "unitsPerFloor", label: "تعداد واحد در طبقه", control: "select" },
  { key: "unitType", label: "جهت ساختمان", control: "select" },
  { key: "unitPosition", label: "موقعیت واحد", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const dailyApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "extraPeopleCapacity", label: "ظرفیت اضافه", control: "select", options: capacityOptions },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
  { key: "rentalPeriod", label: "دوره اجاره", control: "select", options: dailyRentalPeriodOptions },
  { key: "checkInTime", label: "ساعت ورود", control: "time" },
  { key: "checkOutTime", label: "ساعت خروج", control: "time" },
  { key: "minStayDays", label: "حداقل مدت اقامت", control: "number", leftText: "روز" },
  { key: "evacuationGuarantee", label: "تضمین تخلیه", control: "number", leftText: "تومان" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
];

const rentApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: rentApartmentSuitableForOptions },
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select" },
  { key: "unitsPerFloor", label: "تعداد واحد در طبقه", control: "select", options: saleApartmentUnitsPerFloorOptions },
  { key: "unitType", label: "موقعیت ساختمان", control: "select", options: saleApartmentBuildingPositionOptions },
  { key: "unitPosition", label: "موقعیت واحد", control: "select", options: saleApartmentUnitPositionOptions },
  { key: "occupancyStatus", label: "وضعیت سکونت", control: "select", options: saleApartmentOccupancyStatusOptions },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "kitchenType", label: "نوع آشپزخانه", control: "select", options: saleApartmentKitchenTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const saleVillaHouseBuildingTypeOptions = ["ویلایی مستقل", "شهرکی", "آپارتمانی"];
const saleVillaHouseTypeOptions = ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"];

const saleVillaHouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions },
  { key: "buildingType", label: "نوع بنا", control: "select", options: saleVillaHouseBuildingTypeOptions },
  { key: "villaType", label: "تیپ بنا", control: "select", options: saleVillaHouseTypeOptions },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "kitchenType", label: "نوع آشپزخانه", control: "select", options: saleApartmentKitchenTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const villaHouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landPosition", label: "موقعیت زمین", control: "select" },
  { key: "villaType", label: "تیپ ویلا", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const rentVillaHouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: rentVillaSuitableForOptions },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions },
  { key: "buildingType", label: "نوع بنا", control: "select", options: saleVillaHouseBuildingTypeOptions },
  { key: "villaType", label: "تیپ بنا", control: "select", options: saleVillaHouseTypeOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "kitchenType", label: "نوع آشپزخانه", control: "select", options: saleApartmentKitchenTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const gardenVillaMoreFeatureFields: MoreFeatureField[] = [
  { key: "villaType", label: "تیپ ویلا", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const rentGardenVillaMoreFeatureFields: MoreFeatureField[] = gardenVillaMoreFeatureFields.filter(
  (field) => field.key !== "documentType",
);

const landMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض خیابان", control: "number", leftText: "متر" },
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
];

const saleLandMoreFeatureFields: MoreFeatureField[] = [
  { key: "usageType", label: "نوع کاربری", control: "multiSelect", options: saleLandUsageTypeOptions },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions },
  { key: "density", label: "تراکم زمین", control: "select", options: saleLandDensityOptions },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: saleLandSuitableForOptions },
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
];

const officeMoreFeatureFields: MoreFeatureField[] = [
  { key: "floor", label: "طبقه", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const dailyVillaMoreFeatureFields: MoreFeatureField[] = [
  { key: "extraPeopleCapacity", label: "ظرفیت اضافه", control: "select", options: capacityOptions },
  { key: "viewType", label: "چشم انداز", control: "select", options: dailyVillaViewOptions },
  { key: "villaType", label: "تیپ بنا", control: "select", options: saleVillaHouseTypeOptions },
  { key: "rentalPeriod", label: "دوره اجاره", control: "select", options: dailyRentalPeriodOptions },
  { key: "checkInTime", label: "ساعت ورود", control: "time" },
  { key: "checkOutTime", label: "ساعت خروج", control: "time" },
  { key: "minStayDays", label: "حداقل مدت اقامت", control: "number", leftText: "روز" },
  { key: "evacuationGuarantee", label: "تضمین تخلیه", control: "number", leftText: "تومان" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
];

const dailyHotelMoreFeatureFields: MoreFeatureField[] = [];

const dailyOfficeMoreFeatureFields: MoreFeatureField[] = [
  { key: "extraPeopleCapacity", label: "ظرفیت اضافه", control: "select", options: capacityOptions },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
  { key: "rentalPeriod", label: "دوره اجاره", control: "select", options: dailyWorkspaceRentalPeriodOptions },
  { key: "checkInTime", label: "ساعت ورود", control: "time" },
  { key: "checkOutTime", label: "ساعت خروج", control: "time" },
  { key: "minStayDays", label: "حداقل مدت اقامت", control: "number", leftText: "روز" },
  { key: "evacuationGuarantee", label: "تضمین تخلیه", control: "number", leftText: "تومان" },
];

const saleOfficeMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: saleOfficeSuitableForOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: saleOfficeCurrentStatusOptions },
  { key: "officePosition", label: "موقعیت اداری", control: "select", options: saleOfficePositionOptions },
  { key: "officeDocumentType", label: "سند اداری", control: "select", options: saleOfficeDocumentTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
  { key: "managementRoom", label: "اتاق مدیریت", control: "toggle" },
  { key: "conferenceRoom", label: "اتاق کنفرانس", control: "toggle" },
  { key: "receptionHall", label: "سالن پذیرش", control: "toggle" },
  { key: "signboard", label: "تابلو خور", control: "toggle" },
  { key: "kitchen", label: "آشپزخانه", control: "toggle" },
  { key: "separateEntrance", label: "ورودی مجزا", control: "toggle" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

const rentOfficeMoreFeatureFields: MoreFeatureField[] = [
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: rentOfficeSuitableForOptions },
  { key: "officePosition", label: "موقعیت اداری", control: "select", options: saleOfficePositionOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: rentCurrentStatusOptions },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
  { key: "hasDocument", label: "دارای سند", control: "toggle" },
  { key: "officeDocumentType", label: "سند اداری", control: "select", options: saleOfficeDocumentTypeOptions },
  { key: "managementRoom", label: "اتاق مدیریت", control: "toggle" },
  { key: "conferenceRoom", label: "اتاق کنفرانس", control: "toggle" },
  { key: "receptionHall", label: "سالن پذیرش", control: "toggle" },
  { key: "signboard", label: "تابلو خور", control: "toggle" },
  { key: "kitchen", label: "آشپزخانه", control: "toggle" },
  { key: "separateEntrance", label: "ورودی مجزا", control: "toggle" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const commercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
  { key: "floor", label: "طبقه", control: "select" },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
];

const saleCommercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "openingCount", label: "تعداد دهنه", control: "select", options: openingCountOptions },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: saleCommercialSuitableForOptions },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: currentStatusOptions },
];

const rentCommercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "openingCount", label: "تعداد دهنه", control: "select", options: openingCountOptions },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "suitableFor", label: "مناسب برای", control: "multiSelect", options: rentCommercialSuitableForOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: rentCurrentStatusOptions },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
];

const warehouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
];

const rentFactoryWorkshopMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "industrialPropertyType", label: "نوع ملک", control: "select", options: rentIndustrialPropertyTypeOptions },
  { key: "accessType", label: "دسترسی", control: "select", options: industrialAccessTypeOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: rentCurrentStatusOptions },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
];

const saleFactoryWorkshopMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "buildingArea", label: "متراژ بنا", control: "number", leftText: "متر مربع" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "industrialPropertyType", label: "نوع ملک", control: "select", options: industrialPropertyTypeOptions },
  { key: "accessType", label: "دسترسی", control: "select", options: industrialAccessTypeOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: currentStatusOptions },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
];

const hotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

const saleHotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
];

const rentHotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: saleLandPositionOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
];

const projectPresaleMoreFeatureFields: MoreFeatureField[] = [
  { key: "projectStatus", label: "وضعیت پروژه", control: "select", options: projectStatusOptions },
  { key: "projectDeliveryDate", label: "تاریخ تحویل", control: "date" },
  { key: "kitchenType", label: "نوع آشپزخانه", control: "select", options: saleApartmentKitchenTypeOptions },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
];

const projectPartnershipMoreFeatureFields: MoreFeatureField[] = [
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions },
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
];

export const moreFeatureFieldsByCategory: Record<string, MoreFeatureField[]> = {
  apartment: apartmentMoreFeatureFields,
  "daily-apartment-suite": dailyApartmentMoreFeatureFields,
  "villa-house": villaHouseMoreFeatureFields,
  "garden-villa": gardenVillaMoreFeatureFields,
  "daily-garden-villa": dailyVillaMoreFeatureFields,
  land: landMoreFeatureFields,
  office: officeMoreFeatureFields,
  "daily-workspace": dailyOfficeMoreFeatureFields,
  "commercial-unit": commercialUnitMoreFeatureFields,
  warehouse: warehouseMoreFeatureFields,
  "hotel-apartment": hotelApartmentMoreFeatureFields,
  "daily-hotel-apartment": dailyHotelMoreFeatureFields,
  "factory-workshop": [],
};

export const moreFeatureFieldsByListingType: Record<string, MoreFeatureField[]> = {
  "project:project-presale": projectPresaleMoreFeatureFields,
  "project:project-partnership": projectPartnershipMoreFeatureFields,
  "sale:apartment": saleApartmentMoreFeatureFields,
  "sale:villa-house": saleVillaHouseMoreFeatureFields,
  "sale:land": saleLandMoreFeatureFields,
  "sale:office": saleOfficeMoreFeatureFields,
  "sale:commercial-unit": saleCommercialUnitMoreFeatureFields,
  "sale:factory-workshop": saleFactoryWorkshopMoreFeatureFields,
  "sale:hotel-apartment": saleHotelApartmentMoreFeatureFields,
  "rent:apartment": rentApartmentMoreFeatureFields,
  "rent:villa-house": rentVillaHouseMoreFeatureFields,
  "rent:garden-villa": rentGardenVillaMoreFeatureFields,
  "rent:office": rentOfficeMoreFeatureFields,
  "rent:commercial-unit": rentCommercialUnitMoreFeatureFields,
  "rent:warehouse": [],
  "rent:hotel-apartment": rentHotelApartmentMoreFeatureFields,
  "rent:factory-workshop": rentFactoryWorkshopMoreFeatureFields,
  "rent:daily-apartment-suite": dailyApartmentMoreFeatureFields,
  "rent:daily-garden-villa": dailyVillaMoreFeatureFields,
  "rent:daily-workspace": dailyOfficeMoreFeatureFields,
  "rent:daily-hotel-apartment": dailyHotelMoreFeatureFields,
};
