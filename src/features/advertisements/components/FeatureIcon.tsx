import type { ComponentType, SVGProps } from "react";

import LinearAirConditioner from "../../../shared/icons/LinearAirConditioner";
import LinearApartment from "../../../shared/icons/LinearApartment";
import LinearBathtub from "../../../shared/icons/LinearBathtub";
import LinearBed from "../../../shared/icons/LinearBed";
import LinearBms from "../../../shared/icons/LinearBms";
import LinearBuilding from "../../../shared/icons/LinearBuilding";
import LinearCamera from "../../../shared/icons/LinearCamera";
import LinearCctvCamera from "../../../shared/icons/LinearCctvCamera";
import LinearCoffee from "../../../shared/icons/LinearCoffee";
import LinearCooler from "../../../shared/icons/LinearCooler";
import LinearDoor from "../../../shared/icons/LinearDoor";
import LinearDoorElectronic from "../../../shared/icons/LinearDoorElectronic";
import LinearDoorPhone from "../../../shared/icons/LinearDoorPhone";
import LinearEvalator from "../../../shared/icons/LinearEvalator";
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
import LinearSettingBuilding from "../../../shared/icons/LinearSettingBuilding";
import LinearShield from "../../../shared/icons/LinearShield";
import LinearShopping from "../../../shared/icons/LinearShopping";
import LinearTerrace from "../../../shared/icons/LinearTerrace";
import LinearToilet from "../../../shared/icons/LinearToilet";
import LinearTransfer from "../../../shared/icons/LinearTransfer";
import LinearUnderfloorHeating from "../../../shared/icons/LinearUnderfloorHeating";
import LinearWall from "../../../shared/icons/LinearWall";
import LinearWallpaper from "../../../shared/icons/LinearWallpaper";
import LinearWardrobe from "../../../shared/icons/LinearWardrobe";
import LinearWarehouse from "../../../shared/icons/LinearWarehouse";
import LinearWater from "../../../shared/icons/LinearWater";
import LinearWaterCooler from "../../../shared/icons/LinearWaterCooler";
import LinearWaterHeater from "../../../shared/icons/LinearWaterHeater";
import LinearWaterPump from "../../../shared/icons/LinearWaterPump";
import LinearYard from "../../../shared/icons/LinearYard";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function normalizeFeatureLabel(value: string) {
  return value
    .trim()
    .replace(/[\u200c\u200f]/g, " ")
    .replace(/\s+/g, " ");
}

const featureIconComponents: Record<string, SvgIconComponent> = {
  "آسانسور": LinearEvalator,
  "پارکینگ": LinearParking,
  "انباری": LinearWarehouse,
  "تراس": LinearTerrace,
  "بالکن": LinearTerrace,
  "حیاط": LinearYard,
  "کمد دیواری": LinearWardrobe,
  "نقاشی": LinearPaint,
  "کاغذ دیواری": LinearWallpaper,
  "گاز رومیزی": LinearGasStove,
  "گازرومیزی": LinearGasStove,
  "فر توکار": LinearOven,
  "فرتوکار": LinearOven,
  "هود": LinearHood,
  "سرویس ایرانی": LinearToilet,
  "سرویس فرنگی": LinearToilet,
  "سرویس فرهنگی": LinearToilet,
  "سرویس": LinearToilet,
  "حمام مستر": LinearBathtub,
  "دوربین مدار بسته": LinearCctvCamera,
  "دوربین امنیتی": LinearCctvCamera,
  "دوربین": LinearCctvCamera,
  "آیفون تصویری": LinearDoorPhone,
  "روف گاردن": LinearRoofGarden,
  "درب برقی": LinearDoorElectronic,
  "کرکره برقی": LinearDoorElectronic,
  "درب ضد سرقت": LinearDoor,
  "نگهبانی": LinearShield,
  "سیستم امنیتی": LinearShield,
  "سیستم هوشمند": LinearBms,
  "امتیاز برق": LinearPower,
  "برق تک فاز": LinearPower,
  "برق سه فاز": LinearPower,
  "امتیاز گاز": LinearGas,
  "امتیاز آب": LinearWater,
  "امتیازآب": LinearWater,
  "امتیاز تلفن": LinearPhone2,
  "دور دیوار": LinearWall,
  "دور دیوار/حصار": LinearWall,
  "بنا کلنگی": LinearPick,
  "چاه آب": LinearWaterPump,
  "استخر": LinearPool,
  "استخر آب گرم": LinearPool,
  "استخر روباز": LinearPool,
  "استخرروباز": LinearPool,
  "استخر سرپوشیده": LinearPool,
  "استخر پوشیده": LinearPool,
  "جکوزی": LinearJacuzzi,
  "سونا": LinearSauna,
  "لابی": LinearLobby,
  "سالن ورزشی": LinearGym,
  "کافی شاپ": LinearCoffee,
  "رستوران": LinearRestaurant,
  "فروشگاه": LinearShopping,
  "ترانسفر فرودگاهی": LinearTransfer,
  "سالن ماساژ": LinearMasage,
  "سالن اجتماعات": LinearMeetingRoom,
  "اتاق جلسات": LinearMeetingRoom,
  "سینما": LinearCamera,
  "کولر گازی": LinearAirConditioner,
  "کولر آبی": LinearWaterCooler,
  "داکت اسپلیت": LinearAirConditioner,
  "داکت اسپیلت": LinearAirConditioner,
  "چیلر": LinearAirConditioner,
  "فن کوئل": LinearAirConditioner,
  "فن‌کوئل": LinearAirConditioner,
  "سیستم تهویه مطبوع": LinearAirConditioner,
  "بخاری": LinearHeater,
  "شوفاژ": LinearRadiator,
  "گرمایش ازکف": LinearUnderfloorHeating,
  "گرمایش از کف": LinearUnderfloorHeating,
  "آبگرمکن": LinearWaterHeater,
  "آبگرم کن": LinearWaterHeater,
  "پکیج": LinearWaterHeater,
  "موتورخانه": LinearSettingBuilding,
  "شومینه": LinearHeater,
  "تخت خواب": LinearBed,
  "سرویس خواب": LinearBed,
  "اتاق مستر": LinearBed,
};

function resolveFeatureIcon(feature: string): SvgIconComponent {
  const normalized = normalizeFeatureLabel(feature);
  const exact = featureIconComponents[normalized];
  if (exact) return exact;

  if (normalized.includes("آسانسور")) return LinearEvalator;
  if (normalized.includes("پارکینگ")) return LinearParking;
  if (normalized.includes("تراس") || normalized.includes("بالکن")) return LinearTerrace;
  if (normalized.includes("انباری") || normalized.includes("قفسه")) return LinearWarehouse;
  if (normalized.includes("استخر")) return LinearPool;
  if (normalized.includes("سرویس")) return LinearToilet;
  if (normalized.includes("دوربین")) return LinearCctvCamera;
  if (normalized.includes("درب") || normalized.includes("کرکره")) return LinearDoor;
  if (normalized.includes("برق")) return LinearPower;
  if (normalized.includes("گاز")) return LinearGas;
  if (normalized.includes("آب")) return LinearWater;
  if (normalized.includes("تلفن")) return LinearPhone2;
  if (normalized.includes("اتاق") || normalized.includes("تخت")) return LinearBed;
  if (normalized.includes("گرمایش") || normalized.includes("بخاری") || normalized.includes("شومینه")) return LinearHeater;
  if (normalized.includes("کولر") || normalized.includes("تهویه") || normalized.includes("چیلر") || normalized.includes("کوئل")) return LinearCooler;

  // The previous implementation returned an <img> URL under /public/icons/features,
  // but that asset directory is not part of this project. Keep every facility visible
  // with an in-bundle icon instead of rendering a broken or empty icon slot.
  return LinearApartment;
}

export function FeatureIcon({
  feature,
  className = "h-6 w-6",
}: {
  feature: string;
  className?: string;
}) {
  const Icon = resolveFeatureIcon(feature);

  return <Icon aria-hidden="true" className={className} />;
}
