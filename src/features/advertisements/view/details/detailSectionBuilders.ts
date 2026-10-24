import type { IconName } from "../viewAdTypes";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { getFeatureIconSrc } from "../../../../shared/lib/handleFeaturesIcons";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import {
  type DetailInfoItem,
  type DetailInfoSection,
  type DetailInfoTone,
  
  buildAdvertisementFeatureMap,
  createCheckBadge,
  createChoiceRow,
  createExchangeRow,
  createGridItem,
  createLoanRow,
  filterDetailSections,
  formatAgeDetailValue,
  formatAreaDetailValue,
  formatFloorDetailValue,
  formatMeterDetailValue,
  formatRoomDetailValue,
  formatTomanDetailValue,
  formatTotalFloorsDetailValue,
  formatUnitsPerFloorDetailValue,
  getElevatorCountText,
  getFeatureValue,
  getFirstExistingFeatureValue,
  getParkingCountText,
  getResolvedAdvertisementFeatures,
  getTerraceCountText,
  getWarehouseCountText,
  isFilledValue,
  normalizeFacilityDisplayLabel,
  parseCountNumber,
  parseFeatureList,
  parseHotelStarCount,
  toText,
} from "../viewAdDetails";
import { buildSalePropertyDetailSections } from "./salePropertySections";
import { buildRentPropertyDetailSections } from "./rentPropertySections";
import { buildDailyPropertyDetailSections } from "./dailyPropertySections";
import { buildPresalePropertyDetailSections } from "./presalePropertySections";

export function buildPropertyDetailSections(ad: AdvertisementItem): DetailInfoSection[] {
  const features = getResolvedAdvertisementFeatures(ad);
  const featureMap = buildAdvertisementFeatureMap(ad);
  const formCode = toText(
    ad.form_code ?? featureMap.form_code ?? getFeatureValue(features, "form_code"),
  );

  const presaleSections = buildPresalePropertyDetailSections(features, formCode);
  if (presaleSections) return presaleSections;

  const saleSections = buildSalePropertyDetailSections(ad, features, formCode);
  if (saleSections) return saleSections;

  const rentSections = buildRentPropertyDetailSections(features, formCode);
  if (rentSections) return rentSections;

  const dailySections = buildDailyPropertyDetailSections(features, formCode);
  if (dailySections) return dailySections;

  const isApartment = formCode === "sale-apartment" || formCode === "rent-apartment";
  const isRentalForm = formCode.startsWith("rent-") || formCode.startsWith("daily-");
  const isOffice = formCode === "sale-office" || formCode === "rent-office";
  const isCommercial = formCode === "sale-commercial" || formCode === "rent-commercial";
  const isHotel = formCode === "sale-hotel" || formCode === "rent-hotel";
  const isFactory = formCode === "sale-factory" || formCode === "rent-factory-workshop";
  const areaLabel = isApartment ? "متراژ آپارتمان" : "متراژ";
  const floorLabel = isApartment ? "طبقه" : isOffice || isCommercial ? "طبقه" : "طبقه";
  const ageLabel = isOffice || isCommercial || isFactory ? "سال ساخت" : "سن ساخت";
  const totalFloorsLabel = isApartment
    ? "تعداد طبقات آپارتمان"
    : isOffice || isCommercial
      ? "تعداد کل طبقات"
      : "تعداد طبقات";
  const buildingAreaLabel = isHotel || isFactory ? "متراژ بنا" : "متراژ زیربنا";

  const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
  const hasHotelStars = isFilledValue(hotelStarsRaw);
  const starCount = parseHotelStarCount(hotelStarsRaw);
  const mainItems = [
    createGridItem({
      features,
      labels: ["land_area"],
      label: "متراژ زمین",
      formatter: formatAreaDetailValue,
      icon: "area",
    }),
    createGridItem({
      features,
      labels: ["building_area"],
      label: buildingAreaLabel,
      formatter: formatAreaDetailValue,
      icon: "area",
    }),
    createGridItem({
      features,
      labels: ["area", "apartment_area", "unit_area", "meterage"],
      label: areaLabel,
      formatter: formatAreaDetailValue,
      icon: "area",
    }),
    createGridItem({
      features,
      labels: ["rooms", "room_count", "bedrooms"],
      label: "تعداد اتاق‌ها",
      formatter: formatRoomDetailValue,
      icon: "bed",
    }),
    createGridItem({
      features,
      labels: ["building_age", "age", "construction_age"],
      label: ageLabel,
      formatter: formatAgeDetailValue,
      icon: "building",
    }),
    createGridItem({
      features,
      labels: ["floor", "unit_floor", "apartment_floor"],
      label: floorLabel,
      formatter: formatFloorDetailValue,
      icon: "building",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingItems = [
    createGridItem({
      features,
      labels: ["unit_direction", "unit_position", "direction", "unit_location"],
      label: "موقعیت واحد",
    }),
    createGridItem({
      features,
      labels: ["land_position", "ground_position", "plot_position", "land_location"],
      label: "موقعیت زمین",
    }),
    createGridItem({
      features,
      labels: ["unit_type", "building_position", "building_direction"],
      label: "موقعیت ساختمان",
    }),
    createGridItem({ features, labels: ["density"], label: "تراکم زمین" }),
    createGridItem({ features, labels: ["document_type", "document", "deed_type"], label: "سند" }),
    createGridItem({
      features,
      labels: ["total_floors", "floors", "building_floors", "apartment_floors"],
      label: totalFloorsLabel,
      formatter: formatTotalFloorsDetailValue,
      icon: "building",
    }),
    createGridItem({
      features,
      labels: ["unit_per_floor", "units_per_floor", "units_per_floor_count"],
      label: "تعداد واحد در طبقه",
      formatter: formatUnitsPerFloorDetailValue,
      icon: "building",
    }),
    createGridItem({ features, labels: ["commercial_position"], label: "موقعیت تجاری" }),
    createGridItem({ features, labels: ["office_position"], label: "موقعیت اداری" }),
    createGridItem({ features, labels: ["office_document_type"], label: "سند اداری" }),
    createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
    createGridItem({ features, labels: ["ownership_status"], label: "وضعیت مالکیت" }),
    createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
    createGridItem({
      features,
      labels: ["industrial_property_type", "property_type"],
      label: "نوع ملک",
    }),
    createGridItem({ features, labels: ["access_type", "access"], label: "دسترسی" }),
    createGridItem({
      features,
      labels: ["building_type", "house_building_type"],
      label: "نوع بنا",
    }),
    createGridItem({ features, labels: ["villa_type", "house_type"], label: "تیپ بنا" }),
    createGridItem({
      features,
      labels: ["commercial_permit", "commercial_license"],
      label: "مجوز تجاری",
    }),
    createGridItem({
      features,
      labels: ["height", "ceiling_height"],
      label: "ارتفاع سقف",
      formatter: formatMeterDetailValue,
    }),
    createGridItem({
      features,
      labels: ["opening_count", "frontage_count", "openings"],
      label: "تعداد دهنه",
    }),
    createGridItem({
      features,
      labels: ["land_width"],
      label: "عرض زمین",
      formatter: formatMeterDetailValue,
    }),
    createGridItem({
      features,
      labels: ["street_width"],
      label: "عرض گذر",
      formatter: formatMeterDetailValue,
    }),
    createGridItem({ features, labels: ["kitchen_type", "kitchen_style"], label: "نوع آشپزخانه" }),
    createGridItem({
      features,
      labels: ["occupancy_status", "residency_status", "occupancy"],
      label: "وضعیت سکونت",
    }),
    createGridItem({
      features,
      labels: ["pet_policy", "pets_allowed", "pet_status"],
      label: "حیوان خانگی",
    }),
    createGridItem({
      features,
      labels: ["ready_delivery_date", "delivery_ready_date", "available_from"],
      label: "تاریخ آماده تحویل",
      icon: "calendar",
    }),
    createGridItem({
      features,
      labels: ["min_contract_months", "minimum_contract_months", "contract_months"],
      label: "حداقل مدت قرارداد",
      formatter: (value) => {
        const text = toText(value);
        return text ? `${text} ماه` : "-";
      },
    }),
    createGridItem({ features, labels: ["single_room_count"], label: "تعداد اتاق یک تخته" }),
    createGridItem({ features, labels: ["double_room_count"], label: "تعداد اتاق دو تخته" }),
    createGridItem({ features, labels: ["suite_count"], label: "تعداد سوییت ها" }),
    createGridItem({
      features,
      labels: ["capacity", "standard_capacity"],
      label: "ظرفیت استاندارد",
    }),
    createGridItem({ features, labels: ["extra_people_capacity"], label: "ظرفیت اضافه" }),
    createGridItem({ features, labels: ["rental_period"], label: "دوره اجاره" }),
    createGridItem({ features, labels: ["view_type"], label: "چشم انداز" }),
    createGridItem({ features, labels: ["check_in_time"], label: "ساعت ورود" }),
    createGridItem({ features, labels: ["check_out_time"], label: "ساعت خروج" }),
    createGridItem({
      features,
      labels: ["min_stay_days"],
      label: "حداقل مدت اقامت",
      formatter: (value) => {
        const text = toText(value);
        return text ? `${text} روز` : "-";
      },
    }),
    createGridItem({
      features,
      labels: ["evacuation_guarantee"],
      label: "تضمین تخلیه",
      formatter: formatTomanDetailValue,
    }),
    createGridItem({ features, labels: ["project_status"], label: "وضعیت پروژه" }),
    createGridItem({ features, labels: ["delivery_date"], label: "تاریخ تحویل", icon: "calendar" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingChoiceRows = [
    createChoiceRow(features, ["land_use", "usage"], "نوع کاربری"),
    createChoiceRow(features, ["suitable_for"], "مناسب برای"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingBadges = [
    createCheckBadge(features, ["has_document"], "دارای سند"),
    createCheckBadge(features, ["build_permit"], "مجوز ساخت"),
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
    createCheckBadge(features, ["management_room"], "اتاق مدیریت"),
    createCheckBadge(features, ["conference_room"], "اتاق کنفرانس"),
    createCheckBadge(features, ["reception_hall"], "سالن پذیرش"),
    createCheckBadge(features, ["signboard"], "تابلو خور"),
    createCheckBadge(features, ["kitchen"], "آشپزخانه"),
    createCheckBadge(features, ["separate_entrance"], "ورودی مجزا"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const finishItems = [
    createGridItem({
      features,
      labels: ["floor_material", "flooring", "floor_covering", "floor_type"],
      label: "جنس کف",
    }),
    createGridItem({
      features,
      labels: ["facade_material", "facade", "building_facade"],
      label: "جنس نما",
    }),
    createGridItem({
      features,
      labels: ["cabinet_material", "cabinet", "kitchen_cabinet"],
      label: "جنس کابینت",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const loanExchangeItems = isRentalForm
    ? []
    : [createLoanRow(ad, features), createExchangeRow(features)];

  return filterDetailSections([
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
      ratingBanner:
        hasHotelStars && starCount ? { count: starCount, label: "رتبه اقامتگاه" } : undefined,
    },
    {
      title: "موقعیت و ساختمان",
      items: buildingItems,
      layout: "grid",
      columns: 2,
      choiceRows: buildingChoiceRows,
      badges: buildingBadges,
    },
    { title: "متریال و نازک‌کاری", items: finishItems, layout: "grid", columns: 2 },
    { title: "وام و معاوضه", items: loanExchangeItems, layout: "rows" },
  ]);
}

export function buildFacilitiesDetailSections(ad: AdvertisementItem): DetailInfoSection[] {
  const features = getResolvedAdvertisementFeatures(ad);
  const facilities = getFeatureValue(features, "facilities") ?? ad.facilities;
  const heatingCooling = getFeatureValue(features, "heating_cooling") ?? ad.heating_cooling;
  const elevatorCount = getElevatorCountText(features, ad);
  const parkingCount = getParkingCountText(features, ad);
  const terraceCount = getTerraceCountText(features, ad);
  const warehouseCount = getWarehouseCountText(features, ad);

  const elevatorNum = parseCountNumber(elevatorCount);
  const parkingNum = parseCountNumber(parkingCount);
  const terraceNum = parseCountNumber(terraceCount);
  const warehouseNum = parseCountNumber(warehouseCount);

  const heatingItems = Array.isArray(heatingCooling)
    ? heatingCooling
        .map((item) => toText(item))
        .filter(Boolean)
        .map((item) => ({
          icon: "apartment" as IconName,
          iconSrc: getFeatureIconSrc(item),
          label: item,
          value: "دارد",
          badge: true,
          tone: "neutral" as DetailInfoTone,
          featureIconLabel: item,
          hideFallbackIcon: true,
        }))
    : [];

  const rawList = parseFeatureList(facilities).map(normalizeFacilityDisplayLabel);
  const facilitySet = new Set(rawList);

  const hasElevator =
    (facilitySet.has("آسانسور") || facilitySet.has("elevator") || Boolean(elevatorCount)) &&
    (elevatorNum !== 0 || !elevatorCount);
  const hasParking =
    (facilitySet.has("پارکینگ") || facilitySet.has("parking") || Boolean(parkingCount)) &&
    (parkingNum !== 0 || !parkingCount);
  const hasTerrace =
    (facilitySet.has("تراس") || facilitySet.has("terrace") || Boolean(terraceCount)) &&
    (terraceNum !== 0 || !terraceCount);
  const hasWarehouse =
    (facilitySet.has("انباری") ||
      facilitySet.has("warehouse") ||
      facilitySet.has("storage") ||
      Boolean(warehouseCount)) &&
    (warehouseNum !== 0 || !warehouseCount);

  const elevatorItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("آسانسور"),
    label: "آسانسور",
    value: hasElevator ? (elevatorNum > 1 ? `(${toPersianDigits(elevatorNum)})` : "دارد") : "ندارد",
    badge: true,
    tone: (hasElevator ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "آسانسور",
    hideFallbackIcon: true,
  };

  const parkingItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("پارکینگ"),
    label: "پارکینگ",
    value: hasParking ? (parkingNum > 1 ? `(${toPersianDigits(parkingNum)})` : "دارد") : "ندارد",
    badge: true,
    tone: (hasParking ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "پارکینگ",
    hideFallbackIcon: true,
  };

  const terraceItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("تراس"),
    label: "تراس",
    value: hasTerrace ? (terraceNum > 1 ? `(${toPersianDigits(terraceNum)})` : "دارد") : "ندارد",
    badge: true,
    tone: (hasTerrace ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "تراس",
    hideFallbackIcon: true,
  };

  const warehouseItem = {
    icon: "apartment" as IconName,
    iconSrc: getFeatureIconSrc("انباری"),
    label: "انباری",
    value: hasWarehouse
      ? warehouseNum > 1
        ? `(${toPersianDigits(warehouseNum)})`
        : "دارد"
      : "ندارد",
    badge: true,
    tone: (hasWarehouse ? "neutral" : "danger") as DetailInfoTone,
    featureIconLabel: "انباری",
    hideFallbackIcon: true,
  };

  const mandatoryKeys = new Set([
    "آسانسور",
    "elevator",
    "پارکینگ",
    "parking",
    "تراس",
    "terrace",
    "انباری",
    "warehouse",
    "storage",
  ]);

  const otherFacilities = rawList
    .filter((name: string) => !mandatoryKeys.has(name))
    .map((facility: string) => ({
      icon: "apartment" as IconName,
      iconSrc: getFeatureIconSrc(facility),
      label: facility,
      value: "دارد",
      badge: true,
      tone: "neutral" as DetailInfoTone,
      featureIconLabel: facility,
      hideFallbackIcon: true,
    }));

  const facilityItems = [elevatorItem, parkingItem, terraceItem, warehouseItem, ...otherFacilities];

  const sections: DetailInfoSection[] = [];
  if (heatingItems.length) {
    sections.push({ title: "گرمایش و سرمایش", items: heatingItems, layout: "grid", columns: 2 });
  }
  if (facilityItems.length) {
    sections.push({ title: "امکانات", items: facilityItems, layout: "grid", columns: 2 });
  }

  return sections;
}