import type { MoreFeatureField } from "../types";
import {
  ageOptions,
  documentTypeOptions,
  floorOptions,
  rentPetPolicyOptions,
  roomOptions,
  saleLandDensityOptions,
  saleLandPositionOptions,
  saleOfficePositionOptions,
  totalFloorsOptions,
  capacityOptions,
  dailyRentalPeriodOptions,
  rentApartmentSuitableForOptions,
  saleLandDocumentTypeOptions,
  rentVillaSuitableForOptions,
  saleLandUsageTypeOptions,
  saleLandSuitableForOptions,
  dailyVillaViewOptions,
  dailyWorkspaceRentalPeriodOptions,
  saleOfficeSuitableForOptions,
  saleOfficeCurrentStatusOptions,
  saleOfficeDocumentTypeOptions,
  rentOfficeSuitableForOptions,
  rentCurrentStatusOptions,
  openingCountOptions,
  saleCommercialSuitableForOptions,
  currentStatusOptions,
  rentCommercialSuitableForOptions,
  rentIndustrialPropertyTypeOptions,
  industrialAccessTypeOptions,
  industrialPropertyTypeOptions,
} from "./propertyOptions";
import { projectStatusOptions } from "./projectOptions";
const saleApartmentUnitsPerFloorOptions = Array.from(
  { length: 30 },
  (_, index) => `${new Intl.NumberFormat("fa-IR").format(index + 1)} واحد`,
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

const saleApartmentUnitPositionOptions = ["جلو", "عقب", "وسط", "کنج", "دوبلکس", "پنت هاوس"];

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
const saleApartmentKitchenTypeOptions = ["اپن", "جزیره", "بسته", "نیمه اپن"];

const saleApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select", options: totalFloorsOptions },
  {
    key: "unitsPerFloor",
    label: "تعداد واحد در طبقه",
    control: "select",
    options: saleApartmentUnitsPerFloorOptions,
  },
  {
    key: "unitType",
    label: "موقعیت ساختمان",
    control: "select",
    options: saleApartmentBuildingPositionOptions,
  },
  {
    key: "unitPosition",
    label: "موقعیت واحد",
    control: "select",
    options: saleApartmentUnitPositionOptions,
  },
  {
    key: "documentType",
    label: "سند",
    control: "select",
    options: saleApartmentDocumentTypeOptions,
  },
  {
    key: "occupancyStatus",
    label: "وضعیت سکونت",
    control: "select",
    options: saleApartmentOccupancyStatusOptions,
  },
  {
    key: "kitchenType",
    label: "نوع آشپزخانه",
    control: "select",
    options: saleApartmentKitchenTypeOptions,
  },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const apartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select", options: totalFloorsOptions },
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
  {
    key: "rentalPeriod",
    label: "دوره اجاره",
    control: "select",
    options: dailyRentalPeriodOptions,
  },
  { key: "checkInTime", label: "ساعت ورود", control: "time" },
  { key: "checkOutTime", label: "ساعت خروج", control: "time" },
  { key: "minStayDays", label: "حداقل مدت اقامت", control: "number", leftText: "روز" },
  { key: "evacuationGuarantee", label: "تضمین تخلیه", control: "number", leftText: "تومان" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
];

const rentApartmentMoreFeatureFields: MoreFeatureField[] = [
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: rentApartmentSuitableForOptions,
  },
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select", options: totalFloorsOptions },
  {
    key: "unitsPerFloor",
    label: "تعداد واحد در طبقه",
    control: "select",
    options: saleApartmentUnitsPerFloorOptions,
  },
  {
    key: "unitType",
    label: "موقعیت ساختمان",
    control: "select",
    options: saleApartmentBuildingPositionOptions,
  },
  {
    key: "unitPosition",
    label: "موقعیت واحد",
    control: "select",
    options: saleApartmentUnitPositionOptions,
  },
  {
    key: "occupancyStatus",
    label: "وضعیت سکونت",
    control: "select",
    options: saleApartmentOccupancyStatusOptions,
  },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  {
    key: "kitchenType",
    label: "نوع آشپزخانه",
    control: "select",
    options: saleApartmentKitchenTypeOptions,
  },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const saleVillaHouseBuildingTypeOptions = ["ویلایی مستقل", "شهرکی", "آپارتمانی"];
const saleVillaHouseTypeOptions = ["فلت", "تک طبقه", "دوبلکس", "تریبلکس", "خونه باغ"];

const saleVillaHouseMoreFeatureFields: MoreFeatureField[] = [
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
  },
  {
    key: "buildingType",
    label: "نوع بنا",
    control: "select",
    options: saleVillaHouseBuildingTypeOptions,
  },
  { key: "villaType", label: "تیپ بنا", control: "select", options: saleVillaHouseTypeOptions },
  { key: "documentType", label: "سند", control: "select", options: saleLandDocumentTypeOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select", options: totalFloorsOptions },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  {
    key: "kitchenType",
    label: "نوع آشپزخانه",
    control: "select",
    options: saleApartmentKitchenTypeOptions,
  },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
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
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: rentVillaSuitableForOptions,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
  },
  {
    key: "buildingType",
    label: "نوع بنا",
    control: "select",
    options: saleVillaHouseBuildingTypeOptions,
  },
  { key: "villaType", label: "تیپ بنا", control: "select", options: saleVillaHouseTypeOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select", options: totalFloorsOptions },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  { key: "petPolicy", label: "حیوان خانگی", control: "select", options: rentPetPolicyOptions },
  { key: "renovated", label: "بازسازی", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  {
    key: "kitchenType",
    label: "نوع آشپزخانه",
    control: "select",
    options: saleApartmentKitchenTypeOptions,
  },
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
  {
    key: "usageType",
    label: "نوع کاربری",
    control: "multiSelect",
    options: saleLandUsageTypeOptions,
  },
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
  },
  { key: "density", label: "تراکم زمین", control: "select", options: saleLandDensityOptions },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: saleLandSuitableForOptions,
  },
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض گذر", control: "number", leftText: "متر" },
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
];

const officeMoreFeatureFields: MoreFeatureField[] = [
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
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
  {
    key: "rentalPeriod",
    label: "دوره اجاره",
    control: "select",
    options: dailyRentalPeriodOptions,
  },
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
  {
    key: "rentalPeriod",
    label: "دوره اجاره",
    control: "select",
    options: dailyWorkspaceRentalPeriodOptions,
  },
  { key: "checkInTime", label: "ساعت ورود", control: "time" },
  { key: "checkOutTime", label: "ساعت خروج", control: "time" },
  { key: "minStayDays", label: "حداقل مدت اقامت", control: "number", leftText: "روز" },
  { key: "evacuationGuarantee", label: "تضمین تخلیه", control: "number", leftText: "تومان" },
];

const saleOfficeMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select", options: totalFloorsOptions },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: saleOfficeSuitableForOptions,
  },
  {
    key: "currentStatus",
    label: "وضعیت فعلی",
    control: "select",
    options: saleOfficeCurrentStatusOptions,
  },
  {
    key: "officePosition",
    label: "موقعیت اداری",
    control: "select",
    options: saleOfficePositionOptions,
  },
  {
    key: "officeDocumentType",
    label: "سند اداری",
    control: "select",
    options: saleOfficeDocumentTypeOptions,
  },
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
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: rentOfficeSuitableForOptions,
  },
  {
    key: "officePosition",
    label: "موقعیت اداری",
    control: "select",
    options: saleOfficePositionOptions,
  },
  {
    key: "currentStatus",
    label: "وضعیت فعلی",
    control: "select",
    options: rentCurrentStatusOptions,
  },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
  { key: "hasDocument", label: "دارای سند", control: "toggle" },
  {
    key: "officeDocumentType",
    label: "سند اداری",
    control: "select",
    options: saleOfficeDocumentTypeOptions,
  },
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
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select", options: totalFloorsOptions },
];

const saleCommercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "age", label: "سال ساخت", control: "select", options: ageOptions },
  { key: "floor", label: "طبقه", control: "select", options: floorOptions },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select", options: totalFloorsOptions },
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "openingCount", label: "تعداد دهنه", control: "select", options: openingCountOptions },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: saleCommercialSuitableForOptions,
  },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: currentStatusOptions },
];

const rentCommercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "openingCount", label: "تعداد دهنه", control: "select", options: openingCountOptions },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  {
    key: "suitableFor",
    label: "مناسب برای",
    control: "multiSelect",
    options: rentCommercialSuitableForOptions,
  },
  {
    key: "currentStatus",
    label: "وضعیت فعلی",
    control: "select",
    options: rentCurrentStatusOptions,
  },
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
  {
    key: "industrialPropertyType",
    label: "نوع ملک",
    control: "select",
    options: rentIndustrialPropertyTypeOptions,
  },
  { key: "accessType", label: "دسترسی", control: "select", options: industrialAccessTypeOptions },
  {
    key: "currentStatus",
    label: "وضعیت فعلی",
    control: "select",
    options: rentCurrentStatusOptions,
  },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
  { key: "readyDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "minContractMonths", label: "حداقل مدت قرارداد", control: "number", leftText: "ماه" },
];

const saleFactoryWorkshopMoreFeatureFields: MoreFeatureField[] = [
  { key: "rooms", label: "تعداد اتاق", control: "select", options: roomOptions },
  { key: "buildingArea", label: "متراژ بنا", control: "number", leftText: "متر مربع" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  {
    key: "industrialPropertyType",
    label: "نوع ملک",
    control: "select",
    options: industrialPropertyTypeOptions,
  },
  { key: "accessType", label: "دسترسی", control: "select", options: industrialAccessTypeOptions },
  { key: "currentStatus", label: "وضعیت فعلی", control: "select", options: currentStatusOptions },
  { key: "commercialLicense", label: "مجوز تجاری", control: "select", options: ["دائم", "موقت"] },
];

const hotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات", control: "select", options: totalFloorsOptions },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

const saleHotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
  },
  { key: "age", label: "سن ساخت", control: "select", options: ageOptions },
  { key: "totalFloors", label: "تعداد طبقات", control: "select", options: totalFloorsOptions },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
];

const rentHotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  {
    key: "landPosition",
    label: "موقعیت زمین",
    control: "select",
    options: saleLandPositionOptions,
  },
  { key: "totalFloors", label: "تعداد طبقات", control: "select", options: totalFloorsOptions },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "select" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "select" },
  { key: "suiteCount", label: "تعداد سوییت ها", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "با لوازم و مبله", control: "toggle" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
];

const projectPresaleMoreFeatureFields: MoreFeatureField[] = [
  { key: "builderCompanyName", label: "نام سازنده/شرکت", control: "input" },
  { key: "projectStatus", label: "وضعیت پروژه", control: "select", options: projectStatusOptions },
  { key: "projectDeliveryDate", label: "تاریخ آماده تحویل", control: "date" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  {
    key: "kitchenType",
    label: "نوع آشپزخانه",
    control: "select",
    options: saleApartmentKitchenTypeOptions,
  },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
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
