import type { ViewAdDetails } from "./viewAdTypes";

export const viewAdDemo: ViewAdDetails = {
  adCode: "456854",
  agency: "املاک جلیلیان",
  agencyLocation: "صیاد شیرازی",
  age: "۲ روز پیش",
  description: `سلام
✴️به شما همراه گرامی
✴️مشارکت زمین ۶۰۰ متری الهیه.

✅️شرایط:
✴️نصف نقد و نصف مشارکت
✴️حاشیه بلوار ،
✴️مشارکت برابر عرف منطقه.
✴️نقدی زمان عقد قرارداد مشارکت دریافت می‌گردد
✴️ملکی
✴️مشارکت زمین بزرگ برای سازندگان مجتمع ساز الهیه
✴️معاوضه ویلایی ۳۶۰ متری تجاری مسکونی حاشیه کلاهدوز با الهیه
✴️معاوضه زمین ۵۰۰متری حاشیه هنرستان با الهیه
✴️ما بهترین ها را به شما عزیزان معرفی خواهیم کرد.
✴️لطفا فقط سازندگان و ملکان محترم تماس بگیرن
✅️همکاری نداریم. فقط سازنده
✴️کارشناس ارشد بازاریابی و فروش: ✔️نیک رفتار`,
  headline: "۱۳۰متر - دونبش جنوبی - معاوضه با آپارتمان شما",
  locationTitle: "فروش آپارتمان در محله صیاد شیرازی",
  pricePerMeter: "42 میلیون",
  status: "در انتظار پرداخت",
  title: "فروش آپارتمان در محله صیاد شیرازی",
  totalPrice: "12٫5 میلیارد",
  propertyInfoPreview: [
    { icon: "area", label: "متراژ آپارتمان", value: "130 متر" },
    { icon: "bed", label: "تعداد اتاق‌ها", value: "3 اتاق" },
    { icon: "building", label: "سال ساخت", value: "1 سال" },
    { icon: "apartment", label: "طبقه آپارتمان", value: "طبقه 4" },
  ],
  propertyInfoRows: [
    { icon: "ruler", label: "متراژ واحد", value: "130 متر" },
    { icon: "bed", label: "تعداد اتاق‌ها", value: "3 اتاق" },
    { icon: "apartment", label: "سال ساخت", value: "1 سال" },
    { icon: "floor", label: "طبقه واحد", value: "1 سال" },
    { icon: "navigation", label: "موقعیت واحد", value: "شمالی" },
    { icon: "document", label: "نوع سند", value: "ملکی" },
    { icon: "navigation", label: "موقعیت زمین", value: "شمالی" },
    { icon: "floor", label: "طبقات آپارتمان", value: "4 طبقه" },
    { icon: "ceramic", label: "جنس کف", value: "سرامیک" },
    { icon: "floor", label: "تیپ واحد", value: "تک واحدی" },
    { icon: "cabinet", label: "جنس کابینت", value: "ام دی اف" },
    { icon: "loan", label: "وام", value: "دارد" },
    { icon: "tooman", label: "مبلغ وام", value: "1٫5 میلیارد" },
    { icon: "tooman", label: "مبلغ قسط", value: "500 میلیون" },
    { icon: "exchange", label: "معاوضه با", value: "خودرو، زمین" },
  ],
  features: [
    { icon: "elevator", label: "", value: "آسانسور" },
    { icon: "parking", label: "", value: "پارکینگ" },
    { icon: "terrace", label: "", value: "تراس" },
    { icon: "cooler", label: "", value: "کولر گازی" },
  ],
  equipmentSections: [
    {
      icon: "building",
      title: "امکانات",
      items: [
        { icon: "elevator", label: "", value: "آسانسور" },
        { icon: "parking", label: "", value: "پارکینگ" },
        { icon: "terrace", label: "", value: "تراس" },
        { icon: "yard", label: "", value: "حیاط" },
        { icon: "warehouse", label: "", value: "انباری" },
        { icon: "cooler", label: "", value: "کولر گازی" },
      ],
    },
    {
      icon: "building",
      title: "سرمایش و گرمایش",
      items: [
        { icon: "cooler", label: "", value: "کولر گازی" },
        { icon: "waterCooler", label: "", value: "کولر گازی" },
        { icon: "waterHeater", label: "", value: "پکیج" },
        { icon: "radiator", label: "", value: "شوفاژ" },
        { icon: "underfloorHeating", label: "", value: "گرمایش از کف" },
        { icon: "cooler", label: "", value: "شوفاژ" },
      ],
    },
  ],
  rows: [
    { icon: "checklist", label: "ثبت بازخورد" },
    { icon: "building", label: "آژانس‌های محله صیاد شیرازی" },
    { icon: "info", label: "گزارش تخلف آگهی" },
  ],
};

export function parseAdIdFromPath(pathname: string): number | null {
  const match = /^\/ads\/(\d+)(?:\/[a-z-]+)?\/?$/.exec(pathname);
  if (!match) return null;

  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
}
