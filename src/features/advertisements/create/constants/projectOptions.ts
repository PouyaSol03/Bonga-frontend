export const projectStatusOptions = ["در حال ساخت", "آماده تحویل"];

export const projectTypeOptions = ["مسکونی", "تجاری", "اداری"];

export const partnershipCurrentStatusOptions = [
  "بنا قدیمی",
  "زمین خالی",
  "درحال ساخت",
  "ساختمان نوساز",
];

export const projectFloorOptions = [
  "همکف",
  ...Array.from({ length: 39 }, (_, i) => new Intl.NumberFormat("fa-IR").format(i + 1)),
  "۴۰ و بیشتر",
];

export const projectRoomOptions = [
  "بدون اتاق",
  "۱",
  "۲",
  "۳",
  "۴",
  "۵",
  "۶",
  "۷",
  "۸+",
];

export const projectPositionOptions = ["شمالی", "جنوبی", "شرقی", "غربی"];

export const participationTypeOptions = [
  "مشارکت در ساخت",
  "تهاتر",
  "سرمایه گذاری در خرید",
  "سرمایه گذاری مشترک در ساخت",
];

