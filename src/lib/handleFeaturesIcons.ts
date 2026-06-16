// src/lib/featureIcons.ts

const featureIconMap: Record<string, string> = {
  "حیاط": "yard.svg",
  "آسانسور": "evalator.svg",
  "پارکینگ": "parking.svg",
  "کمد دیواری": "wardrobe.svg",
  "تراس": "terrace.svg",
  "نقاشی": "paint.svg",
  "فر توکار": "oven.svg",
  "گاز رومیزی": "gas-stove.svg",
  "انباری": "warehouse.svg",
  "هود": "hood.svg",
  "سرویس فرنگی": "toilet-western.svg",
  "سرویس ایرانی": "toilet-iranian.svg",
  "آیفون تصویری": "door-phone.svg",
  "دوربین مدار بسته": "cctv-camera.svg",

  "حمام مستر": "bathtub.svg",
  "کاغذ دیواری": "wallpaper.svg",
  "روف گاردن": "roof-garden.svg",
  "نگهبانی": "shield.svg",
  "درب ضد سرقت": "door.svg",
  "درب برقی": "door-electronic.svg",
  "سیستم هوشمند": "bms.svg",
  "امتیاز برق": "power.svg",

  "امتیاز تلفن": "phone_2.svg",
  "امتیاز آب": "water.svg",
  "امتیاز گاز": "gas.svg",
  "چاه آب": "water-pump.svg",
  "بنا کلنگی": "pick.svg",
  "دور دیوار": "wall.svg",

  "کافی‌شاپ": "coffee.svg",
  "سونا": "sauna.svg",
  "جکوزی": "jacuzzi.svg",
  "استخر": "pool.svg",
  "رستوران": "restaurant.svg",
  "فروشگاه": "shopping.svg",
  "لابی": "lobby.svg",
  "سالن ماساژ": "masage.svg",
  "ترانسفر فرودگاهی": "transfer.svg",
  "صرافی": "exchange.svg",
  "سالن اجتماعات": "meeting-room.svg",
  "سالن ورزشی": "gym.svg",
  "سینما": "camera.svg",
};

function normalizeFeatureLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function getFeatureIconSrc(feature: string) {
  const normalizedFeature = normalizeFeatureLabel(feature);
  const iconName = featureIconMap[normalizedFeature];

  if (!iconName) return null;

  return `/icons/fetures/${iconName}`;
}