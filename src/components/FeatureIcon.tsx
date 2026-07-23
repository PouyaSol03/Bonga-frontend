import type { ComponentType, SVGProps } from "react";

import LinearAirConditioner from "./(icons)/LinearAirConditioner";
import LinearBathtub from "./(icons)/LinearBathtub";
import LinearBms from "./(icons)/LinearBms";
import LinearCamera from "./(icons)/LinearCamera";
import LinearCctvCamera from "./(icons)/LinearCctvCamera";
import LinearCoffee from "./(icons)/LinearCoffee";
import LinearCooler from "./(icons)/LinearCooler";
import LinearDoor from "./(icons)/LinearDoor";
import LinearDoorElectronic from "./(icons)/LinearDoorElectronic";
import LinearDoorPhone from "./(icons)/LinearDoorPhone";
import LinearEvalator from "./(icons)/LinearEvalator";
import LinearExchange from "./(icons)/LinearExchange";
import LinearGas from "./(icons)/LinearGas";
import LinearGasStove from "./(icons)/LinearGasStove";
import LinearGym from "./(icons)/LinearGym";
import LinearHeater from "./(icons)/LinearHeater";
import LinearHood from "./(icons)/LinearHood";
import LinearJacuzzi from "./(icons)/LinearJacuzzi";
import LinearLobby from "./(icons)/LinearLobby";
import LinearMasage from "./(icons)/LinearMasage";
import LinearMeetingRoom from "./(icons)/LinearMeetingRoom";
import LinearOven from "./(icons)/LinearOven";
import LinearPaint from "./(icons)/LinearPaint";
import LinearParking from "./(icons)/LinearParking";
import LinearPhone2 from "./(icons)/LinearPhone2";
import LinearPick from "./(icons)/LinearPick";
import LinearPool from "./(icons)/LinearPool";
import LinearPower from "./(icons)/LinearPower";
import LinearRadiator from "./(icons)/LinearRadiator";
import LinearRestaurant from "./(icons)/LinearRestaurant";
import LinearRoofGarden from "./(icons)/LinearRoofGarden";
import LinearSauna from "./(icons)/LinearSauna";
import LinearShield from "./(icons)/LinearShield";
import LinearShopping from "./(icons)/LinearShopping";
import LinearTerrace from "./(icons)/LinearTerrace";
import LinearToilet from "./(icons)/LinearToilet";
import LinearTransfer from "./(icons)/LinearTransfer";
import LinearWall from "./(icons)/LinearWall";
import LinearWallpaper from "./(icons)/LinearWallpaper";
import LinearWardrobe from "./(icons)/LinearWardrobe";
import LinearWarehouse from "./(icons)/LinearWarehouse";
import LinearWater from "./(icons)/LinearWater";
import LinearWaterHeater from "./(icons)/LinearWaterHeater";
import LinearWaterHeater2 from "./(icons)/LinearWaterHeater2";
import LinearWaterPump from "./(icons)/LinearWaterPump";
import LinearYard from "./(icons)/LinearYard";

type FeatureIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const featureIconComponents: Record<string, FeatureIconComponent> = {
  "حیاط": LinearYard,
  "آسانسور": LinearEvalator,
  "پارکینگ": LinearParking,
  "کمد دیواری": LinearWardrobe,
  "تراس": LinearTerrace,
  "نقاشی": LinearPaint,
  "فر توکار": LinearOven,
  "گاز رومیزی": LinearGasStove,
  "انباری": LinearWarehouse,
  "هود": LinearHood,
  "سرویس فرنگی": LinearToilet,
  "سرویس ایرانی": LinearToilet,
  "آیفون تصویری": LinearDoorPhone,
  "دوربین مدار بسته": LinearCctvCamera,
  "حمام مستر": LinearBathtub,
  "کاغذ دیواری": LinearWallpaper,
  "روف گاردن": LinearRoofGarden,
  "نگهبانی": LinearShield,
  "درب ضد سرقت": LinearDoor,
  "درب برقی": LinearDoorElectronic,
  "سیستم هوشمند": LinearBms,
  "امتیاز برق": LinearPower,
  "امتیاز تلفن": LinearPhone2,
  "امتیاز آب": LinearWater,
  "امتیاز گاز": LinearGas,
  "چاه آب": LinearWaterPump,
  "بنا کلنگی": LinearPick,
  "دور دیوار": LinearWall,
  "کافی‌شاپ": LinearCoffee,
  "سونا": LinearSauna,
  "جکوزی": LinearJacuzzi,
  "استخر": LinearPool,
  "رستوران": LinearRestaurant,
  "فروشگاه": LinearShopping,
  "لابی": LinearLobby,
  "سالن ماساژ": LinearMasage,
  "ترانسفر فرودگاهی": LinearTransfer,
  "صرافی": LinearExchange,
  "سالن اجتماعات": LinearMeetingRoom,
  "سالن ورزشی": LinearGym,
  "سینما": LinearCamera,
  "کولر گازی": LinearAirConditioner,
  "کولر آبی": LinearCooler,
  "پکیج": LinearWaterHeater2,
  "آبگرمکن": LinearWaterHeater,
  "بخاری": LinearHeater,
  "شوفاژ": LinearRadiator,
};

function normalizeFeatureLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function FeatureIcon({ feature, className = "h-6 w-6" }: { feature: string; className?: string }) {
  const IconComponent = featureIconComponents[normalizeFeatureLabel(feature)];
  if (!IconComponent) return null;

  return <IconComponent aria-hidden="true" className={className} />;
}

export function hasFeatureIcon(feature: string) {
  return Boolean(featureIconComponents[normalizeFeatureLabel(feature)]);
}
