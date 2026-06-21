// src/lib/buildingInfoIcons.ts

const buildingInfoIconMap: Record<string, string> = {
  "area": "area.svg",
  "infrastructure": "infrastructure.svg",
  "roomsCount": "bed.svg",
  "apartmentAge": "apartment-age.svg",
  "usage": "usage.svg",
  "floor": "floor.svg",
  "ceilingHeight": "ceilingHeight.svg",
  "date": "date.svg",
  "dish": "dish.svg",
  "extraPeople": "extraPeople.svg",
  "goodFor": "goodFor.svg",
  "license": "license.svg",
  "maximumPeople": "maximumPeople.svg",
  "participationType": "participationType.svg",
  "position": "position.svg",
  "projectStatus": "projectStatus.svg",
  "ruler": "ruler.svg",
  "sanad": "sanad.svg",
};

interface LabelConfig {
  key: string;
  prefix?: string;
  suffix?: string;
}

const labelToKeyMap: Record<string, LabelConfig> = {
  "area": { key: "area", suffix: " متر" },
  "land_area": { key: "area", suffix: " متر" },
  "building_area": { key: "infrastructure", suffix: " متر" },
  "rooms": { key: "roomsCount", suffix: " اتاق" },
  "building_age": { key: "apartmentAge", suffix: " سال" },
  "document_type": { key: "sanad" },
  "has_document": { key: "sanad" },
  "has_loan": { key: "participationType" },
  "renovated": { key: "projectStatus" },
  "suitable_for": { key: "goodFor" },
  "usage": { key: "usage" },
  "floor": { key: "floor", prefix: "طبقه " },
  "delivery_date": { key: "date" },
  "project_status": { key: "projectStatus" },
  "construction_license": { key: "license" },
  "land_position": { key: "position" },
  "commercial_license": { key: "license" },
  "standard_capacity": { key: "maximumPeople", suffix: " نفر" },
  "extra_people_capacity": { key: "extraPeople", suffix: " نفر" },
  "participation_type": { key: "participationType" },
  "builder_share_percent": { key: "participationType", suffix: " درصد" },

  "طبقه آپارتمان": { key: "floor", prefix: "طبقه " },
  "طبقه واحد": { key: "floor", prefix: "طبقه " },
  "تعداد کل طبقات": { key: "floor" },

  // بقیه لِیبل‌ها همراه با واحدهاشون
  "سال ساخت": { key: "apartmentAge", suffix: " سال" },
  "سن بنا": { key: "apartmentAge", suffix: " سال" },
  "تعداد اتاق‌ها": { key: "roomsCount", suffix: " اتاق" },
  "تعداد اتاق": { key: "roomsCount", suffix: " اتاق" },
  "تعداد کل واحدها": { key: "roomsCount", suffix: " واحد" },
  "زیربنا": { key: "infrastructure", suffix: " متر" },
  "متراژ بنا": { key: "infrastructure", suffix: " متر" },
  "متراژ آپارتمان": { key: "area", suffix: " متر" },
  "متراژ زمین": { key: "area", suffix: " متر" },
  "ظرفیت استاندارد": { key: "maximumPeople", suffix: " نفر" },
  "تعدادنفر اضافه": { key: "extraPeople", suffix: " نفر" },
  "ارتفاع سقف": { key: "ceilingHeight", suffix: "متر" },

  // مواردی که مقدارشون عدد نیست و متن هست (نیازی به پسوند/پیشوند ندارند)
  "کاربری": { key: "usage" },
  "نوع سند": { key: "sanad" },
  "سند": { key: "sanad" },
  "وام": { key: "participationType" },
  "بازسازی شده": { key: "projectStatus" },
  "موقعیت زمین": { key: "position" },
  "موقعیت واحد": { key: "position" },
  "مناسب برای": { key: "goodFor" },
  "مجوز تجاری": { key: "apartmentAge" },
  "تاریخ تحویل": { key: "date" },
  "وضعیت پروژه": { key: "projectStatus" },
  "مجوز ساخت": { key: "license" },
  "نوع ویلا": { key: "usage" },
  "قابل معاوضه با": { key: "participationType" },
  "معاوضه با": { key: "participationType" },
};

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function addPrefixOnce(value: string, prefix: string) {
  return value.startsWith(prefix.trim()) ? value : `${prefix}${value}`;
}

function addSuffixOnce(value: string, suffix: string) {
  if (!/\d|[۰-۹]/.test(value)) {
    return value;
  }

  return value.endsWith(suffix.trim()) ? value : `${value}${suffix}`;
}

export function getBuildingInfo(label: string, rawValue: string | number) {
  const normalizedLabel = normalizeLabel(label);
  const config = labelToKeyMap[normalizedLabel];

  // ۱. پیدا کردن کلید انگلیسی برای آیکن
  const finalKey = config ? config.key : normalizedLabel;
  const iconName = buildingInfoIconMap[finalKey];
  const iconSrc = iconName ? `/icons/infos/${iconName}` : null;

  // ۲. فرمت‌دهی هوشمند به مقدار (Value) بر اساس کانفیگِ خودِ لِیبل
  let formattedValue = String(rawValue);

  if (config) {
    if (config.prefix) {
      formattedValue = addPrefixOnce(formattedValue, config.prefix); // اضافه کردن متن قبل از عدد
    }
    if (config.suffix) {
      formattedValue = addSuffixOnce(formattedValue, config.suffix); // اضافه کردن متن بعد از عدد
    }
  }

  return {
    iconSrc,
    formattedValue,
  };
}
