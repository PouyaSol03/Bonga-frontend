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
  usageType: "",
  landPosition: "",
  documentType: "",
  suitableFor: "",
  hotelStars: "",
  standardCapacity: "",
  extraPeopleCapacity: "",
  commercialLicense: "",
  constructionLicense: "",
  participationType: "",

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
  minPrice: "",
  maxPrice: "",
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
  chatEnabled: false,
  phoneEnabled: false,
  telegram: "",
  whatsapp: "",

  title: "",
  description: "",

  totalFloors: "",
  unitType: "",
  unitPosition: "",
  renovated: false,
  furnished: false,
  facadeMaterial: "",
  floorMaterial: "",
  cabinetMaterial: "",
  villaType: "",
  landWidth: "",
  streetWidth: "",
  constructionPermit: false,
  commercialPermit: false,
  ceilingHeight: "",
  singleRoomCount: "",
  doubleRoomCount: "",
  suiteCount: "",
  dailyHotelRooms: createDefaultDailyHotelRooms(),
};

export const projectStatusOptions = [
  "در حال ساخت",
  "آماده تحویل",
  "پیش‌فروش",
  "تحویل شده",
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

export const landFacilityItems: ChipItem[] = [
  { id: "power", label: "امتیاز برق" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "water", label: "امتیاز آب" },
  { id: "guard", label: "نگهبانی" },
  { id: "old-building", label: "بنا کلنگی" },
  { id: "walled", label: "دور دیوار" },
  { id: "water-well", label: "چاه آب" },
];

export const exchangeTargets = ["خودرو", "زمین", "واحد مسکونی"];

export const moreFeatureKeys: MoreFeatureFormKey[] = [
  "floor",
  "rooms",
  "totalFloors",
  "unitType",
  "unitPosition",
  "documentType",
  "renovated",
  "furnished",
  "facadeMaterial",
  "floorMaterial",
  "cabinetMaterial",
  "landPosition",
  "villaType",
  "density",
  "landWidth",
  "streetWidth",
  "constructionPermit",
  "commercialPermit",
  "commercialLicense",
  "ceilingHeight",
  "singleRoomCount",
  "doubleRoomCount",
  "suiteCount",
];

export const floorOptions = ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
export const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"];
export const capacityOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۲", "۱۵", "۲۰", "۳۰", "۴۰", "۵۰+"];
export const roomCountOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۱۰", "۱۵", "۲۰", "۳۰", "۵۰+"];
export const yesNoOptions = ["دارد", "ندارد"];
export const participationTypeOptions = [
  "مشارکت در ساخت",
  "تهاتر",
  "مشارکت نقدی",
  "سرمایه‌گذاری مشترک",
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

export const landPositionOptions = [
  "شمالی",
  "جنوبی",
  "سه نبش",
  "دو نبش",
  "چهار نبش",
];

export const documentTypeOptions = [
  "ملکی",
  "آستانه",
  "اوقاف",
  "موقوفه",
  "قولنامه",
  "وکالت",
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

export const commercialLicenseOptions = ["دائم", "موقت", "ندارد"];
export const constructionLicenseOptions = yesNoOptions;

const saleApartmentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ آپارتمان", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleVillaHouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleLandBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "usageType", label: "کاربری", control: "select", options: usageTypeOptions, required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
];

const saleOfficeBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
];

const saleCommercialUnitBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleWarehouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
];

const saleHotelApartmentBasicFields: BasicPropertyField[] = [
  { key: "hotelStars", label: "رتبه‌بندی هتل", control: "select", options: hotelStarsOptions, required: true },
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleFactoryWorkshopBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
];

const rentApartmentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentOfficeBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه آپارتمان", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentCommercialUnitBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه آپارتمان", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق ها", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
];

const rentWarehouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "input", numeric: true, leftText: "متر", required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: commercialLicenseOptions, required: true },
];

const rentHotelApartmentBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const rentFactoryWorkshopBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
];

const dailyRentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "standardCapacity", label: "ظرفیت استاندارد", control: "select", options: capacityOptions, required: true },
  { key: "extraPeopleCapacity", label: "تعداد نفرات اضافه", control: "select", options: capacityOptions, required: true },
];

const dailyHotelRentBasicFields: BasicPropertyField[] = [
  { key: "hotelStars", label: "رتبه‌بندی هتل", control: "select", options: hotelStarsOptions, required: true },
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
  "rent:villa-house": saleVillaHouseBasicFields,
  "rent:garden-villa": saleVillaHouseBasicFields,
  "rent:office": rentOfficeBasicFields,
  "rent:commercial-unit": rentCommercialUnitBasicFields,
  "rent:warehouse": rentWarehouseBasicFields,
  "rent:hotel-apartment": rentHotelApartmentBasicFields,
  "rent:factory-workshop": rentFactoryWorkshopBasicFields,

  "rent:daily-apartment-suite": dailyRentBasicFields,
  "rent:daily-garden-villa": dailyRentBasicFields,
  "rent:daily-workspace": dailyRentBasicFields,
  "rent:daily-hotel-apartment": dailyHotelRentBasicFields,
};

export const moreFeatureOptions: Record<MoreFeatureSelectKey, string[]> = {
  floor: floorOptions,
  rooms: roomOptions,
  totalFloors: ["۱ طبقه", "۲ طبقه", "۳ طبقه", "۴ طبقه", "۵ طبقه", "۶ طبقه", "۷ طبقه", "۸ طبقه و بیشتر"],
  unitType: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش"],
  unitPosition: ["جلو", "عقب", "وسط", "کنج", "دوبلکس"],
  documentType: documentTypeOptions,
  facadeMaterial: ["سنگ", "آجر", "سیمان", "کامپوزیت", "شیشه", "رومی", "ترکیبی"],
  floorMaterial: ["سرامیک", "سنگ", "پارکت", "لمینت", "موزاییک", "کفپوش"],
  cabinetMaterial: ["MDF", "های‌گلاس", "ممبران", "فلزی", "چوبی", "ندارد"],
  landPosition: landPositionOptions,
  villaType: ["فلت", "دوبلکس", "تریپلکس", "مدرن", "کلاسیک", "باغ‌ویلا"],
  commercialLicense: commercialLicenseOptions,
  singleRoomCount: roomCountOptions,
  doubleRoomCount: roomCountOptions,
  suiteCount: roomCountOptions,
};

const apartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select" },
  { key: "unitType", label: "تیپ واحد", control: "select" },
  { key: "unitPosition", label: "موقعیت واحد", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const rentApartmentMoreFeatureFields: MoreFeatureField[] = apartmentMoreFeatureFields.filter(
  (field) => field.key !== "documentType",
);

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

const rentVillaHouseMoreFeatureFields: MoreFeatureField[] = villaHouseMoreFeatureFields.filter(
  (field) => field.key !== "documentType",
);

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

const officeMoreFeatureFields: MoreFeatureField[] = [
  { key: "floor", label: "طبقه", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const rentOfficeMoreFeatureFields: MoreFeatureField[] = officeMoreFeatureFields;

const commercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
  { key: "floor", label: "طبقه", control: "select" },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
];

const rentCommercialUnitMoreFeatureFields: MoreFeatureField[] = [];

const warehouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select" },
];

const hotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

const rentHotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

export const moreFeatureFieldsByCategory: Record<string, MoreFeatureField[]> = {
  apartment: apartmentMoreFeatureFields,
  "daily-apartment-suite": rentApartmentMoreFeatureFields,
  "villa-house": villaHouseMoreFeatureFields,
  "garden-villa": gardenVillaMoreFeatureFields,
  "daily-garden-villa": rentGardenVillaMoreFeatureFields,
  land: landMoreFeatureFields,
  office: officeMoreFeatureFields,
  "daily-workspace": rentOfficeMoreFeatureFields,
  "commercial-unit": commercialUnitMoreFeatureFields,
  warehouse: warehouseMoreFeatureFields,
  "hotel-apartment": hotelApartmentMoreFeatureFields,
  "daily-hotel-apartment": [],
  "factory-workshop": [],
};

export const moreFeatureFieldsByListingType: Record<string, MoreFeatureField[]> = {
  "rent:apartment": rentApartmentMoreFeatureFields,
  "rent:villa-house": rentVillaHouseMoreFeatureFields,
  "rent:garden-villa": rentGardenVillaMoreFeatureFields,
  "rent:office": rentOfficeMoreFeatureFields,
  "rent:commercial-unit": rentCommercialUnitMoreFeatureFields,
  "rent:warehouse": [],
  "rent:hotel-apartment": rentHotelApartmentMoreFeatureFields,
  "rent:factory-workshop": [],
  "rent:daily-apartment-suite": rentApartmentMoreFeatureFields,
  "rent:daily-garden-villa": rentGardenVillaMoreFeatureFields,
  "rent:daily-workspace": rentOfficeMoreFeatureFields,
  "rent:daily-hotel-apartment": [],
};
