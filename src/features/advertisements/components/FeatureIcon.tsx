import type { ComponentType, SVGProps } from "react";

import LinearAirConditioner from "../../../shared/icons/LinearAirConditioner";
import LinearBathtub from "../../../shared/icons/LinearBathtub";
import LinearBms from "../../../shared/icons/LinearBms";
import LinearCamera from "../../../shared/icons/LinearCamera";
import LinearCctvCamera from "../../../shared/icons/LinearCctvCamera";
import LinearCoffee from "../../../shared/icons/LinearCoffee";
import LinearCooler from "../../../shared/icons/LinearCooler";
import LinearDoor from "../../../shared/icons/LinearDoor";
import LinearDoorElectronic from "../../../shared/icons/LinearDoorElectronic";
import LinearDoorPhone from "../../../shared/icons/LinearDoorPhone";
import LinearEvalator from "../../../shared/icons/LinearEvalator";
import LinearExchange from "../../../shared/icons/LinearExchange";
import LinearGas from "../../../shared/icons/LinearGas";
import LinearGasStove from "../../../shared/icons/LinearGasStove";
import LinearGym from "../../../shared/icons/LinearGym";
import LinearHeater from "../../../shared/icons/LinearHeater";
import LinearHood from "../../../shared/icons/LinearHood";
import LinearJacuzzi from "../../../shared/icons/LinearJacuzzi";
import LinearLobby from "../../../shared/icons/LinearLobby";
import LinearMasage from "../../../shared/icons/LinearMasage";
import LinearMeetingRoom from "../../../shared/icons/LinearMeetingRoom";
import LinearOven from "../../../shared/icons/LinearOven";
import LinearPaint from "../../../shared/icons/LinearPaint";
import LinearParking from "../../../shared/icons/LinearParking";
import LinearPhone2 from "../../../shared/icons/LinearPhone2";
import LinearPick from "../../../shared/icons/LinearPick";
import LinearPool from "../../../shared/icons/LinearPool";
import LinearPower from "../../../shared/icons/LinearPower";
import LinearRadiator from "../../../shared/icons/LinearRadiator";
import LinearRestaurant from "../../../shared/icons/LinearRestaurant";
import LinearRoofGarden from "../../../shared/icons/LinearRoofGarden";
import LinearSauna from "../../../shared/icons/LinearSauna";
import LinearShield from "../../../shared/icons/LinearShield";
import LinearShopping from "../../../shared/icons/LinearShopping";
import LinearTerrace from "../../../shared/icons/LinearTerrace";
import LinearToilet from "../../../shared/icons/LinearToilet";
import LinearTransfer from "../../../shared/icons/LinearTransfer";
import LinearWall from "../../../shared/icons/LinearWall";
import LinearWallpaper from "../../../shared/icons/LinearWallpaper";
import LinearWardrobe from "../../../shared/icons/LinearWardrobe";
import LinearWarehouse from "../../../shared/icons/LinearWarehouse";
import LinearWater from "../../../shared/icons/LinearWater";
import LinearWaterHeater from "../../../shared/icons/LinearWaterHeater";
import LinearWaterHeater2 from "../../../shared/icons/LinearWaterHeater2";
import LinearWaterPump from "../../../shared/icons/LinearWaterPump";
import LinearYard from "../../../shared/icons/LinearYard";

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
