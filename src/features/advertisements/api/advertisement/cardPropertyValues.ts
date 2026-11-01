import type { AdvertisementItem } from "./item-types";
import { readFeatureValue, toText, formatFeatureUnit } from "./card-values";

export function readCardPropertyValues(item: AdvertisementItem) {
  const area =
    readFeatureValue(item, [
      "area",
      "meterage",
      "building_area",
      "land_area",
      "متراژ",
      "buildingArea",
      "landArea",
    ]) ?? item.area;
  const rooms = readFeatureValue(item, ["rooms", "اتاق", "خواب"]) ?? item.rooms;
  const buildingAge =
    readFeatureValue(item, ["building_age", "سال ساخت", "age", "year"]) ?? item.year;
  const landArea =
    readFeatureValue(item, ["land_area", "landArea", "متراژ زمین"]) ?? item.land_area;
  const documentType =
    readFeatureValue(item, ["document_type", "documentType", "نوع سند", "سند"]) ??
    item.document_type ??
    item.documentType;
  const commercialPosition =
    readFeatureValue(item, ["commercial_position", "commercialPosition", "موقعیت تجاری"]) ??
    item.commercial_position ??
    item.commercialPosition;
  const landPosition =
    readFeatureValue(item, ["land_position", "landPosition", "موقعیت زمین", "position"]) ??
    item.land_position ??
    item.landPosition;
  const category = toText(
    item.category ??
      item.category_name ??
      item.category_title ??
      readFeatureValue(item, ["category", "دسته بندی"]),
  );
  const formCode = toText(item.form_code ?? readFeatureValue(item, ["form_code"]));
  const projectMinMeterPrice = readFeatureValue(item, [
    "min_meter_price",
    "min_price",
    "meter_price",
  ]);
  const projectMaxMeterPrice = readFeatureValue(item, ["max_meter_price", "max_price"]);
  const floorRaw = readFeatureValue(item, ["floor", "طبقه", "طبقه واحد", "طبقه آپارتمان"]);
  const floor =
    floorRaw !== undefined && floorRaw !== null && floorRaw !== ""
      ? typeof floorRaw === "number" || /^\d+$/.test(String(floorRaw).trim())
        ? `طبقه ${toText(floorRaw)}`
        : toText(floorRaw)
      : undefined;
  const buildingAreaRaw = readFeatureValue(item, [
    "building_area",
    "buildingArea",
    "زیربنا",
    "متراژ بنا",
  ]);
  const buildingArea =
    buildingAreaRaw !== undefined && buildingAreaRaw !== null && buildingAreaRaw !== ""
      ? formatFeatureUnit(buildingAreaRaw, "متر مربع", "")
      : undefined;
  return {
    area,
    rooms,
    buildingAge,
    landArea,
    documentType,
    commercialPosition,
    landPosition,
    category,
    formCode,
    projectMinMeterPrice,
    projectMaxMeterPrice,
    floor,
    buildingArea,
  };
}
