import type { MoreFeatureFormKey, MoreFeatureSelectKey } from "../types";
import { projectStatusOptions } from "./projectOptions";

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
  "builderCompanyName",
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

export const floorOptions = [
  "همکف",
  ...Array.from({ length: 29 }, (_, i) => new Intl.NumberFormat("fa-IR").format(i + 1)),
  "۳۰ و بیشتر",
];
export const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"];
export const unitsPerFloorOptions = Array.from(
  { length: 30 },
  (_, index) => `${new Intl.NumberFormat("fa-IR").format(index + 1)} واحد`,
);
export const capacityOptions = [
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
  "۱۰",
  "۱۲",
  "۱۵",
  "۲۰",
  "۳۰",
  "۴۰",
  "۵۰+",
];
export const roomCountOptions = [
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸",
  "۹",
  "۱۰",
  "۱۵",
  "۲۰",
  "۳۰",
  "۵۰+",
];
export const openingCountOptions = Array.from({ length: 20 }, (_, index) =>
  new Intl.NumberFormat("fa-IR").format(index + 1),
);
export const elevatorCountOptions = Array.from({ length: 5 }, (_, index) =>
  new Intl.NumberFormat("fa-IR").format(index + 1),
);
export const projectCountOptions = Array.from({ length: 100 }, (_, index) =>
  new Intl.NumberFormat("fa-IR").format(index + 1),
);
export const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

export const ageOptions = [
  "نوساز",
  ...Array.from({ length: 29 }, (_, i) => `${new Intl.NumberFormat("fa-IR").format(i + 1)} سال`),
  "۳۰ سال و بیشتر",
];
export const saleLandUsageTypeOptions = [
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

export const landPositionOptions = ["شمالی", "جنوبی", "سه نبش", "دو نبش", "چهار نبش"];

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

export const saleLandDocumentTypeOptions = [
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

export const saleLandDensityOptions = ["کم", "متوسط", "زیاد"];

export const saleLandSuitableForOptions = [
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
export const saleHotelStarsOptions = ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"];
export const saleAccommodationTypeOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه", "مجتمع توریستی"];

export const commercialLicenseOptions = ["دائم", "موقت", "ندارد"];
export const saleCommercialPositionOptions = [
  "بر خیابان اصلی",
  "داخل پاساژ",
  "داخل کوچه",
  "بازار محله",
  "غرفه",
];
export const saleCommercialOwnershipOptions = ["مالکیت کامل", "فقط سرقفلی", "فقط مالکیت", "مالکیت مشترک"];
export const saleCommercialSuitableForOptions = [
  "فروشگاه",
  "تجاری",
  "خدماتی",
  "اداری",
  "صنعتی",
  "آموزشی",
  "درمانی",
  "انباری",
  "همه مشاغل",
];
export const currentStatusOptions = ["تخلیه", "فعال"];
export const saleOfficeCurrentStatusOptions = ["تخلیه", "فعال", "درحال بازسازی"];
export const saleOfficeSuitableForOptions = [
  "مهندسین",
  "شرکت‌ها",
  "وکلا",
  "مطب",
  "موسسه",
  "آموزشگاه",
  "آتلیه",
  "مزون",
  "اسناد رسمی",
  "دفاتر دولت",
  "صنایع",
  "خدماتی",
  "ورزشی",
  "فرهنگی",
  "مذهبی",
  "همه مشاغل",
];
export const saleOfficePositionOptions = [
  "مجتمع اداری",
  "برج اداری",
  "بر خیابان اصلی",
  "موقعیت مسکونی",
  "مجتمع پزشکان",
];
export const saleOfficeDocumentTypeOptions = ["دائم", "موقت"];
export const industrialPropertyTypeOptions = [
  "سوله",
  "انبار",
  "کارگاه",
  "کارخانه",
  "گلخانه",
  "گاوداری",
  "مرغداری",
];
export const rentIndustrialPropertyTypeOptions = [
  "سوله",
  "انبار",
  "کارگاه",
  "کارخانه",
  "گلخانه",
  "سردخانه",
  "گاوداری",
  "مرغداری",
  "سالن صنعتی",
];
export const rentCommercialSuitableForOptions = [
  "فروشگاه",
  "تجاری",
  "خدماتی",
  "اداری",
  "صنعتی",
  "آموزشی",
  "درمانی",
  "انباری",
  "همه مشاغل",
  "سایر",
];
export const industrialAccessTypeOptions = ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"];

export const rentApartmentSuitableForOptions = ["خانواده", "مجرد", "دانشجو", "زوج"];
export const rentVillaSuitableForOptions = ["خانواده", "برگزاری مراسم", "چند خانواده"];
export const rentPetPolicyOptions = ["مجاز", "غیر مجاز"];
export const rentOfficeSuitableForOptions = [
  "تجاری",
  "خدماتی",
  "اداری",
  "صنعتی",
  "آموزشی",
  "درمانی",
  "انباری",
  "مهندسین",
  "شرکت ها",
  "وکلا",
  "مطب",
  "موسسه",
  "آموزشگاه",
  "آتلیه",
  "مزون",
  "اسناد رسمی",
  "دفاتر دولت",
  "صنایع",
  "ورزشی",
  "فرهنگی",
  "مذهبی",
  "همه مشاغل",
];
export const rentCurrentStatusOptions = ["تخلیه", "فعال"];

export const dailyAccommodationTypeOptions = [
  "سویئت",
  "آپارتمان",
  "اتاق",
  "خوابگاه یا پانسیون",
  "بوم گردی",
];
export const dailyHotelAccommodationTypeOptions = ["هتل", "هتل آپارتمان", "متل", "مسافر خونه"];
export const dailyHotelStarsOptions = ["۱ ستاره", "۲ ستاره", "۳ ستاره", "۴ ستاره", "۵ ستاره"];
export const dailyRentalPeriodOptions = ["روزانه", "هفتگی", "ماهانه", "نصف روز", "بلند مدت"];
export const dailyWorkspaceRentalPeriodOptions = [
  "ساعتی",
  "روزانه",
  "هفتگی",
  "ماهانه",
  "نصف روز",
  "بلند مدت",
];
export const dailyVillaViewOptions = [
  "جنگلی",
  "کوهستان",
  "دریا",
  "رودخانه",
  "شهر",
  "دشت",
  "باغ",
  "بیابان",
];
export const dailyWorkspaceTypeOptions = [
  "اتاق کار اشتراکی",
  "اتاق کار خصوصی",
  "اتاق جلسه",
  "کلاس آموزشی",
  "سالن همایش",
  "غرفه نمایشگاه",
  "کانتر",
];

export const totalFloorsOptions = [
  ...Array.from({ length: 29 }, (_, i) => `${new Intl.NumberFormat("fa-IR").format(i + 1)} طبقه`),
  "۳۰ طبقه و بیشتر",
];

export const moreFeatureOptions: Record<MoreFeatureSelectKey, string[]> = {
  age: ageOptions,
  floor: floorOptions,
  rooms: roomOptions,
  totalFloors: totalFloorsOptions,
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
  villaType: ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ", "باغ‌ویلا"],
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