import type {
  BasicPropertyField,
  ChipItem,
  MoreFeatureField,
  MoreFeatureFormKey,
  MoreFeatureSelectKey,
  NewAdFormValues,
} from "./types";

export const locationKey = "bonga-new-ad-location";
export const draftKey = "bonga-new-ad-draft";

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

  projectTotalFloors: "",
  projectTotalUnits: "",
  projectStatus: "",
  projectDeliveryDate: "",
  projectDetails: [],

  saleTermsEnabled: false,
  saleTermsPercent: "",
  saleTermsInstallmentMonths: "",

  selectedSpecs: [],
  heatingCooling: [],
  facilities: [],

  price: "",
  loanEnabled: false,
  loanAmount: "",
  loanInstallment: "",
  exchangeEnabled: false,
  exchangeTargets: [],

  photos: [],
  hasVideo: false,
  video: null,
  hasVirtualTour: false,

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
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
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
  { id: "radiator", label: "رادیاتور" },
  { id: "heater", label: "بخاری" },
  { id: "water-heater", label: "آبگرمکن" },
  { id: "floor-heating", label: "گرمایش از کف" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "chiller", label: "چیلر" },
  { id: "split", label: "اسپلیت" },
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
  "ceilingHeight",
  "singleRoomCount",
  "doubleRoomCount",
  "suiteCount",
];

export const floorOptions = ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
export const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"];

export const ageOptions = [
  "نوساز",
  "۱ سال",
  "۲ سال",
  "۳ سال",
  "۴ سال",
  "۵ سال",
  "۱۰ سال",
  "۱۵ سال+",
];

export const usageTypeOptions = [
  "مسکونی",
  "تجاری",
  "اداری",
  "صنعتی",
  "کشاورزی",
  "باغی",
  "مختلط",
];

export const landPositionOptions = [
  "شمالی",
  "جنوبی",
  "شرقی",
  "غربی",
  "دو نبش",
  "بر خیابان",
  "داخل کوچه",
];

export const documentTypeOptions = [
  "شش دانگ",
  "تک برگ",
  "منگوله‌دار",
  "قولنامه‌ای",
  "اوقافی",
  "تعاونی",
];

export const suitableForOptions = [
  "دفتر کار",
  "مطب",
  "آموزشگاه",
  "فروشگاه",
  "رستوران",
  "کافه",
  "نمایشگاه",
  "انبار",
  "کارگاه",
  "شرکت",
];

export const hotelStarsOptions = [
  "۱ ستاره",
  "۲ ستاره",
  "۳ ستاره",
  "۴ ستاره",
  "۵ ستاره",
];

const saleApartmentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions, required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleVillaHouseBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleLandBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "density", label: "تراکم", control: "input", numeric: true, leftText: "درصد", required: true },
  { key: "usageType", label: "نوع کاربری", control: "select", options: usageTypeOptions, required: true },
  { key: "landPosition", label: "موقعیت", control: "select", options: landPositionOptions, required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
];

const saleOfficeBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
];

const saleCommercialUnitBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
];

const saleWarehouseBasicFields: BasicPropertyField[] = [
  { key: "buildingArea", label: "متراژ زیربنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "suitableFor", label: "مناسب برای", control: "select", options: suitableForOptions, required: true },
];

const saleHotelApartmentBasicFields: BasicPropertyField[] = [
  { key: "hotelStars", label: "ستاره هتل", control: "select", options: hotelStarsOptions, required: true },
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "landPosition", label: "موقعیت زمین", control: "select", options: landPositionOptions, required: true },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions, required: true },
];

const saleFactoryWorkshopBasicFields: BasicPropertyField[] = [
  { key: "landArea", label: "متراژ زمین", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "buildingArea", label: "متراژ بنا", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "documentType", label: "نوع سند", control: "select", options: documentTypeOptions, required: true },
];

const dailyRentBasicFields: BasicPropertyField[] = [
  { key: "meterage", label: "متراژ", control: "input", numeric: true, leftText: "متر مربع", required: true },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions, required: true },
  { key: "standardCapacity", label: "ظرفیت استاندارد", control: "input", numeric: true, leftText: "نفر", required: true },
  { key: "extraPeopleCapacity", label: "تعداد نفرات اضافه", control: "input", numeric: true, leftText: "نفر", required: true },
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

  "rent:apartment": saleApartmentBasicFields,
  "rent:villa-house": saleVillaHouseBasicFields,
  "rent:garden-villa": saleVillaHouseBasicFields,
  "rent:office": saleOfficeBasicFields,
  "rent:commercial-unit": saleCommercialUnitBasicFields,
  "rent:warehouse": saleWarehouseBasicFields,
  "rent:hotel-apartment": saleHotelApartmentBasicFields,
  "rent:factory-workshop": saleFactoryWorkshopBasicFields,

  "rent:daily-apartment-suite": dailyRentBasicFields,
  "rent:daily-garden-villa": dailyRentBasicFields,
  "rent:daily-workspace": dailyRentBasicFields,

  // اجاره روزانه هتل فعلاً جدا می‌ماند تا با عکس بعدی دقیق طراحی شود
  "rent:daily-hotel-apartment": [],
};

export const moreFeatureOptions: Record<MoreFeatureSelectKey, string[]> = {
  floor: floorOptions,
  rooms: roomOptions,
  totalFloors: ["۱ طبقه", "۲ طبقه", "۳ طبقه", "۴ طبقه", "۵ طبقه", "۶ طبقه", "۷ طبقه", "۸ طبقه و بیشتر"],
  unitType: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش"],
  unitPosition: ["جلو", "عقب", "وسط", "کنج", "دوبلکس"],
  documentType: ["شش دانگ", "قولنامه‌ای", "تک برگ", "منگوله‌دار", "اوقافی", "تعاونی"],
  facadeMaterial: ["سنگ", "آجر", "سیمان", "کامپوزیت", "شیشه", "رومی", "ترکیبی"],
  floorMaterial: ["سرامیک", "سنگ", "پارکت", "لمینت", "موزاییک", "کفپوش"],
  cabinetMaterial: ["MDF", "های‌گلاس", "ممبران", "فلزی", "چوبی", "ندارد"],
  landPosition: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش", "بر خیابان", "داخل کوچه"],
  villaType: ["فلت", "دوبلکس", "تریپلکس", "مدرن", "کلاسیک", "باغ‌ویلا"],
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

const gardenVillaMoreFeatureFields: MoreFeatureField[] = [
  { key: "villaType", label: "تیپ ویلا", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const landMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض خیابان", control: "number", leftText: "متر" },
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
];

const officeMoreFeatureFields: MoreFeatureField[] = [
  { key: "floor", label: "طبقه", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const commercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
  { key: "floor", label: "طبقه", control: "select" },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
];

const warehouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
];

const hotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "number" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "number" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "number" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

export const moreFeatureFieldsByCategory: Record<string, MoreFeatureField[]> = {
  apartment: apartmentMoreFeatureFields,
  "daily-apartment-suite": apartmentMoreFeatureFields,
  "villa-house": villaHouseMoreFeatureFields,
  "garden-villa": gardenVillaMoreFeatureFields,
  "daily-garden-villa": gardenVillaMoreFeatureFields,
  land: landMoreFeatureFields,
  office: officeMoreFeatureFields,
  "daily-workspace": officeMoreFeatureFields,
  "commercial-unit": commercialUnitMoreFeatureFields,
  warehouse: warehouseMoreFeatureFields,
  "hotel-apartment": hotelApartmentMoreFeatureFields,
  "daily-hotel-apartment": hotelApartmentMoreFeatureFields,
  "factory-workshop": [],
};

