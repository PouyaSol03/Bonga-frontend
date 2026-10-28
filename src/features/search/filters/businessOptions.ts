export const approvedBusinessCurrentStatusOptions = ["تخلیه", "فعال"];

export const approvedOfficeCurrentStatusOptions = ["تخلیه", "فعال", "درحال بازسازی"];

export const approvedOfficePositionOptions = [
  "مجتمع اداری",
  "برج اداری",
  "بر خیابان اصلی",
  "موقعیت مسکونی",
  "مجتمع پزشکان",
];

export const approvedOfficeDocumentOptions = ["دائم", "موقت"];

export const approvedCommercialLicenseOptions = ["دائم", "موقت"];

export const approvedRentIndustrialLicenseOptions = ["دائم", "موقت", "ندارد"];

export const approvedIndustrialPropertyOptions = [
  "سوله",
  "انبار",
  "کارگاه",
  "کارخانه",
  "گلخانه",
  "گاوداری",
  "مرغداری",
];

export const approvedIndustrialAccessOptions = ["جاده آسفالت", "جاده خاکی", "نزدیک بزرگراه"];

export const approvedCommercialPositionOptions = [
  "بر خیابان اصلی",
  "داخل پاساژ",
  "داخل کوچه",
  "غرفه",
  "مالکیت مشترک",
  "بازار محله",
];

export const approvedCommercialOwnershipOptions = [
  "مالکیت کامل",
  "فقط سرقفلی",
  "فقط مالکیت",
  "مالکیت مشترک",
];

export const approvedHotelAccommodationOptions = [
  "هتل",
  "هتل آپارتمان",
  "متل",
  "مسافر خونه",
  "مجتمع توریستی",
];

export const approvedHotelStarOptions = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];

export const approvedTotalFloorsOptions = [
  ...Array.from({ length: 39 }, (_, i) => new Intl.NumberFormat("fa-IR").format(i + 1)),
  "۴۰ و بیشتر",
];
