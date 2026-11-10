import type { AdvertisementItem } from "../../api/advertisement.service";
import { type DetailInfoItem, type DetailInfoSection, toText } from "./detailCore";
import { createCheckBadge, createChoiceRow, createGridItem, filterDetailSections } from "./detailRows";
import { formatAgeDetailValue, formatAreaDetailValue, formatFloorDetailValue, formatMeterDetailValue, formatRoomDetailValue, formatTotalFloorsDetailValue, formatUnitsPerFloorDetailValue } from "./detailUnits";
import { getFirstExistingFeatureValue, isFilledValue } from "./featureValues";
import { parseHotelStarCount } from "./advertiserAndPricing";
import { saleFinishSection } from "./salePropertySections";

export function buildRentPropertyDetailSections(
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (!formCode.startsWith("rent-")) return null;

  const contractMonthsFormatter = (value: unknown) => {
    const text = toText(value);
    return text ? `${text} ماه` : "-";
  };

  if (formCode === "rent-apartment") {
    const mainItems = [
      createGridItem({
        features,
        labels: ["area", "meterage", "apartment_area", "unit_area"],
        label: "متراژ آپارتمان",
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
        labels: ["floor", "unit_floor", "apartment_floor"],
        label: "طبقه آپارتمان",
        formatter: formatFloorDetailValue,
        icon: "building",
      }),
      createGridItem({
        features,
        labels: ["building_age", "age", "construction_age"],
        label: "سن ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({
        features,
        labels: ["unit_type", "building_position", "building_direction"],
        label: "موقعیت ساختمان",
      }),
      createGridItem({
        features,
        labels: ["unit_position", "unit_direction", "direction", "unit_location"],
        label: "موقعیت واحد",
      }),
      createGridItem({
        features,
        labels: ["total_floors", "floors", "building_floors", "apartment_floors"],
        label: "تعداد طبقات آپارتمان",
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
      createGridItem({
        features,
        labels: ["occupancy_status", "residency_status", "occupancy"],
        label: "وضعیت سکونت",
      }),
      createGridItem({
        features,
        labels: ["min_contract_months", "minimum_contract_months", "contract_months"],
        label: "حداقل مدت قرارداد",
        formatter: contractMonthsFormatter,
      }),
      createGridItem({
        features,
        labels: ["ready_delivery_date", "delivery_ready_date", "available_from"],
        label: "تاریخ آماده تحویل",
        icon: "calendar",
      }),
      createGridItem({
        features,
        labels: ["pet_policy", "pets_allowed", "pet_status"],
        label: "حیوان خانگی",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter(
      (item): item is DetailInfoItem => item !== null,
    );

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      {
        title: "موقعیت و ساختمان",
        items: buildingItems,
        layout: "grid",
        columns: 2,
        choiceRows,
        badges,
      },
      saleFinishSection(features, { kitchen: true }),
    ]);
  }

  if (formCode === "rent-villa-house" || formCode === "rent-garden-villa") {
    const mainItems = [
      createGridItem({
        features,
        labels: ["land_area", "area"],
        label: "متراژ زمین",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({
        features,
        labels: ["building_area"],
        label: "متراژ بنا",
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
        label: "سال ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({
        features,
        labels: ["land_position", "ground_position", "plot_position", "land_location"],
        label: "موقعیت زمین",
      }),
      createGridItem({
        features,
        labels: ["building_type", "house_building_type"],
        label: "نوع بنا",
      }),
      createGridItem({ features, labels: ["villa_type", "house_type"], label: "تیپ بنا" }),
      createGridItem({
        features,
        labels: ["total_floors", "floors", "building_floors"],
        label: "تعداد طبقات",
        formatter: formatTotalFloorsDetailValue,
        icon: "building",
      }),
      createGridItem({
        features,
        labels: ["street_width"],
        label: "عرض گذر",
        formatter: formatMeterDetailValue,
      }),
      createGridItem({
        features,
        labels: ["pet_policy", "pets_allowed", "pet_status"],
        label: "حیوان خانگی",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter(
      (item): item is DetailInfoItem => item !== null,
    );

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      {
        title: "موقعیت و ساختمان",
        items: buildingItems,
        layout: "grid",
        columns: 2,
        choiceRows,
        badges,
      },
      saleFinishSection(features, { kitchen: true }),
    ]);
  }

  if (formCode === "rent-office") {
    const mainItems = [
      createGridItem({
        features,
        labels: ["area", "meterage"],
        label: "متراژ",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({
        features,
        labels: ["floor", "unit_floor"],
        label: "طبقه",
        formatter: formatFloorDetailValue,
        icon: "building",
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
        label: "سال ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({ features, labels: ["office_position"], label: "موقعیت اداری" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({ features, labels: ["office_document_type"], label: "سند اداری" }),
      createGridItem({
        features,
        labels: ["min_contract_months", "minimum_contract_months", "contract_months"],
        label: "حداقل مدت قرارداد",
        formatter: contractMonthsFormatter,
      }),
      createGridItem({
        features,
        labels: ["ready_delivery_date", "delivery_ready_date", "available_from"],
        label: "تاریخ آماده تحویل",
        icon: "calendar",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter(
      (item): item is DetailInfoItem => item !== null,
    );

    const badges = [
      createCheckBadge(features, ["management_room"], "اتاق مدیریت"),
      createCheckBadge(features, ["conference_room"], "اتاق کنفرانس"),
      createCheckBadge(features, ["reception_hall"], "سالن پذیرش"),
      createCheckBadge(features, ["signboard"], "تابلو خور"),
      createCheckBadge(features, ["separate_entrance"], "ورودی مجزا"),
      createCheckBadge(features, ["kitchen"], "آشپزخانه"),
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      {
        title: "موقعیت و ساختمان",
        items: buildingItems,
        layout: "grid",
        columns: 2,
        choiceRows,
        badges,
      },
      saleFinishSection(features),
    ]);
  }

  if (formCode === "rent-commercial") {
    const mainItems = [
      createGridItem({
        features,
        labels: ["area", "meterage"],
        label: "متراژ",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({ features, labels: ["commercial_position"], label: "موقعیت تجاری" }),
      createGridItem({
        features,
        labels: ["building_age", "age", "construction_age"],
        label: "سال ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
      createGridItem({
        features,
        labels: ["floor", "unit_floor"],
        label: "طبقه",
        formatter: formatFloorDetailValue,
        icon: "building",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({
        features,
        labels: ["rooms", "room_count", "bedrooms"],
        label: "تعداد اتاق",
        formatter: formatRoomDetailValue,
        icon: "bed",
      }),
      createGridItem({
        features,
        labels: ["opening_count", "frontage_count", "openings"],
        label: "تعداد دهنه",
      }),
      createGridItem({
        features,
        labels: ["ceiling_height", "height"],
        label: "ارتفاع سقف",
        formatter: formatMeterDetailValue,
      }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({
        features,
        labels: ["min_contract_months", "minimum_contract_months", "contract_months"],
        label: "حداقل مدت قرارداد",
        formatter: contractMonthsFormatter,
      }),
      createGridItem({
        features,
        labels: ["ready_delivery_date", "delivery_ready_date", "available_from"],
        label: "تاریخ آماده تحویل",
        icon: "calendar",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const choiceRows = [createChoiceRow(features, ["suitable_for"], "مناسب برای")].filter(
      (item): item is DetailInfoItem => item !== null,
    );

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, choiceRows },
    ]);
  }

  if (formCode === "rent-factory-workshop" || formCode === "rent-warehouse") {
    const mainItems = [
      createGridItem({
        features,
        labels: ["land_area", "area"],
        label: "متراژ زمین",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({
        features,
        labels: ["building_area"],
        label: "متراژ بنا",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({
        features,
        labels: ["land_position", "ground_position", "plot_position", "land_location"],
        label: "موقعیت زمین",
      }),
      createGridItem({
        features,
        labels: ["building_age", "age", "construction_age"],
        label: "سال ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({
        features,
        labels: ["rooms", "room_count", "bedrooms"],
        label: "تعداد اتاق",
        formatter: formatRoomDetailValue,
        icon: "bed",
      }),
      createGridItem({
        features,
        labels: ["ceiling_height", "height"],
        label: "ارتفاع سقف",
        formatter: formatMeterDetailValue,
      }),
      createGridItem({
        features,
        labels: ["industrial_property_type", "property_type"],
        label: "نوع ملک",
      }),
      createGridItem({ features, labels: ["access_type", "access"], label: "دسترسی" }),
      createGridItem({ features, labels: ["current_status"], label: "وضعیت فعلی" }),
      createGridItem({
        features,
        labels: ["commercial_permit", "commercial_license"],
        label: "مجوز تجاری",
      }),
      createGridItem({
        features,
        labels: ["min_contract_months", "minimum_contract_months", "contract_months"],
        label: "حداقل مدت قرارداد",
        formatter: contractMonthsFormatter,
      }),
      createGridItem({
        features,
        labels: ["ready_delivery_date", "delivery_ready_date", "available_from"],
        label: "تاریخ آماده تحویل",
        icon: "calendar",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    return filterDetailSections([
      { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2 },
    ]);
  }

  if (formCode === "rent-hotel") {
    const hotelStarsRaw = getFirstExistingFeatureValue(features, ["hotel_stars"]);
    const hasHotelStars = isFilledValue(hotelStarsRaw);
    const starCount = parseHotelStarCount(hotelStarsRaw);

    const mainItems = [
      createGridItem({ features, labels: ["accommodation_type"], label: "نوع اقامتگاه" }),
      createGridItem({
        features,
        labels: ["document_type", "document", "deed_type"],
        label: "نوع سند",
      }),
      createGridItem({
        features,
        labels: ["land_area", "area"],
        label: "متراژ زمین",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
      createGridItem({
        features,
        labels: ["building_area"],
        label: "متراژ بنا",
        formatter: formatAreaDetailValue,
        icon: "area",
      }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const buildingItems = [
      createGridItem({
        features,
        labels: ["land_position", "ground_position", "plot_position", "land_location"],
        label: "موقعیت زمین",
      }),
      createGridItem({
        features,
        labels: ["building_age", "age", "construction_age"],
        label: "سال ساخت",
        formatter: formatAgeDetailValue,
        icon: "building",
      }),
      createGridItem({
        features,
        labels: ["total_floors", "floors", "building_floors"],
        label: "تعداد طبقات",
        formatter: formatTotalFloorsDetailValue,
        icon: "building",
      }),
      createGridItem({ features, labels: ["single_room_count"], label: "اتاق یک تخته" }),
      createGridItem({ features, labels: ["double_room_count"], label: "اتاق دو تخته" }),
      createGridItem({ features, labels: ["suite_count"], label: "تعداد سوییت" }),
    ].filter((item): item is DetailInfoItem => item !== null);

    const badges = [
      createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
      createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    ].filter((item): item is DetailInfoItem => item !== null);

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
      { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
      saleFinishSection(features, { cabinet: false, facade: false, floor: true }),
    ]);
  }

  return null;
}

