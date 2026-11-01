import { exchangeTargets } from "../../advertisements/create/data";

export const approvedSaleFilterAgeOptions = [
  "نوساز",
  ...Array.from({ length: 29 }, (_, i) => `${new Intl.NumberFormat("fa-IR").format(i + 1)} سال`),
  "۳۰ سال و بیشتر",
];

export const approvedSaleFilterDocumentTypeOptions = [
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

export const approvedSaleFilterLandUseOptions = [
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

export const approvedSaleFilterLandPositionOptions = [
  "شمالی",
  "جنوبی",
  "غربی",
  "شرقی",
  "دوممر",
  "دونبش",
  "سه نبش",
  "چهارنبش",
];

export const approvedSaleFilterSuitableForOptions = [
  "ساخت آپارتمان",
  "ساخت ویلا",
  "سرمایه‌گذاری",
  "تجمیع با ملک مجاور",
];

export const approvedSaleFilterBuildingPositionOptions = [
  "شمالی",
  "جنوبی",
  "شرقی",
  "غربی",
  "دونبش",
  "سه نبش",
  "دوممر",
];

export const approvedSaleFilterUnitPositionOptions = [
  "جلو",
  "عقب",
  "وسط",
  "کنج",
  "دوبلکس",
  "پنت هاوس",
];

export const approvedSaleFilterVillaBuildingTypeOptions = ["ویلایی مستقل", "شهرکی", "آپارتمانی"];

export const approvedSaleFilterVillaTypeOptions = [
  "تک طبقه",
  "دو طبقه",
  "سه طبقه",
  "دوبلکس",
  "تریبلکس",
  "فورلکس",
];

export const approvedSaleFilterFloorOptions = [
  "همکف",
  ...Array.from({ length: 39 }, (_, i) => new Intl.NumberFormat("fa-IR").format(i + 1)),
  "۴۰ و بیشتر",
];

export const approvedSaleFilterUnitsPerFloorOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "+۸"];

export const approvedSaleFilterExchangeTargets = exchangeTargets;
