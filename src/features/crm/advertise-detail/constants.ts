import type { CrmRecord } from "../api/crm.service";

export type CrmAdvertiseDetailViewProps = {
  advertiseId: string;
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

export type FeatureRecord = CrmRecord & {
  label?: unknown;
  value?: unknown;
};

export const formCodeLabels: Record<string, string> = {
  partnership: "مشارکت در ساخت",
  "presale-special": "پیش‌فروش پروژه",
  "daily-apartment-suite": "اجاره روزانه آپارتمان و سوئیت",
  "daily-garden-villa": "اجاره روزانه باغ و ویلا",
  "daily-hotel": "اجاره روزانه هتل و هتل‌آپارتمان",
  "daily-office-booth": "اجاره روزانه دفتر کار و غرفه",
  "rent-apartment": "اجاره آپارتمان",
  "rent-commercial": "اجاره تجاری",
  "rent-factory-workshop": "اجاره کارخانه و کارگاه",
  "rent-garden-villa": "اجاره باغ و ویلا",
  "rent-hotel": "اجاره هتل و هتل‌آپارتمان",
  "rent-office": "اجاره اداری",
  "rent-villa-house": "اجاره خانه ویلایی",
  "rent-warehouse": "اجاره انبار و سوله",
  "sale-apartment": "فروش آپارتمان",
  "sale-commercial": "فروش تجاری",
  "sale-factory": "فروش کارخانه و کارگاه",
  "sale-garden-villa": "فروش باغ و ویلا",
  "sale-hotel": "فروش هتل و هتل‌آپارتمان",
  "sale-land": "فروش زمین",
  "sale-office": "فروش اداری",
  "sale-villa-house": "فروش خانه ویلایی",
  "sale-warehouse": "فروش انبار و سوله",
};

export const featureLabelMap: Record<string, string> = {
  advertiser_type: "نوع آگهی‌دهنده",
  area: "متراژ",
  balcony: "بالکن",
  build_permit: "مجوز ساخت",
  builder_share: "سهم سازنده",
  builder_share_percent: "سهم سازنده",
  building_age: "سال ساخت",
  building_area: "زیربنا",
  commercial_license: "مجوز تجاری",
  commercial_permit: "مجوز تجاری",
  construction_license: "مجوز ساخت",
  delivery_date: "تاریخ تحویل",
  document_type: "نوع سند",
  elevator: "آسانسور",
  exchange_with: "معاوضه",
  extra_people_capacity: "ظرفیت نفر اضافه",
  facilities: "امکانات",
  floor: "طبقه",
  furnished: "مبله",
  has_document: "سند",
  has_loan: "وام",
  heating_cooling: "سرمایش و گرمایش",
  occupancy_status: "وضعیت سکونت",
  kitchen_type: "نوع آشپزخانه",
  height: "ارتفاع سقف",
  hotel_stars: "رتبه هتل",
  land_area: "متراژ زمین",
  land_position: "موقعیت زمین",
  land_use: "کاربری",
  max_price: "حداکثر",
  min_price: "حداقل",
  mortgage_price: "رهن",
  parking: "پارکینگ",
  participation_type: "نوع مشارکت",
  partnership_type: "نوع مشارکت",
  project_status: "وضعیت پروژه",
  project_total_floors: "تعداد کل طبقات",
  project_total_units: "تعداد کل واحدها",
  renovated: "بازسازی‌شده",
  rent_price: "اجاره",
  rooms: "تعداد اتاق",
  standard_capacity: "ظرفیت استاندارد",
  storage: "انباری",
  suitable_for: "مناسب برای",
  unit_position: "موقعیت واحد",
  unit_type: "نوع واحد",
  villa_type: "نوع ویلا",
  house_type: "نوع خانه",
  capacity: "ظرفیت",
  density: "تراکم",
  total_floors: "تعداد کل طبقات",
  facade_material: "جنس نما",
  floor_material: "جنس کف",
  cabinet_material: "جنس کابینت",
  land_width: "عرض زمین",
  street_width: "عرض خیابان",
  single_room_count: "تعداد اتاق یک تخته",
  double_room_count: "تعداد اتاق دو تخته",
  suite_count: "تعداد سوییت‌ها",
  sale_terms_percent: "درصد شرایط فروش",
  sale_terms_installment_months: "تعداد ماه اقساط",
  extra_specs: "مشخصات بیشتر",
  project_details: "جزئیات واحدهای پروژه",
  daily_hotel_rooms: "جزئیات اتاق‌های هتل",
};

export const technicalFeatureKeys = new Set([
  "form_code",
  "neighborhood_id",
  "city_id",
  "category_id",
  "location",
  "price",
  "published_at",
  "is_special",
  "has_image",
  "has_video",
]);

export const priceFeatureKeys = new Set([
  "price",
  "min_price",
  "max_price",
  "mortgage_price",
  "rent_price",
]);

export const areaFeatureKeys = new Set(["area", "land_area", "building_area"]);
