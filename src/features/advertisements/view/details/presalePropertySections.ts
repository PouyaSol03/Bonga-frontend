import type { AdvertisementItem } from "../../api/advertisement.service";
import { type DetailInfoItem, type DetailInfoSection } from "./detailCore";
import { createCheckBadge, createGridItem, filterDetailSections } from "./detailRows";
import { createExchangeRow } from "./detailFinanceRows";
import { formatPercentDetailValue, appendSuffixIfNeeded } from "./detailUnits";

export function buildPresalePropertyDetailSections(
  features: NonNullable<AdvertisementItem["features"]>,
  formCode: string,
): DetailInfoSection[] | null {
  if (formCode !== "presale-special") return null;

  const mainItems = [
    createGridItem({
      features,
      labels: ["project_total_floors", "total_floors"],
      label: "تعداد کل طبقات",
      icon: "floor",
    }),
    createGridItem({
      features,
      labels: ["project_total_units", "total_units"],
      label: "تعداد کل واحدها",
      icon: "building",
    }),
    createGridItem({
      features,
      labels: ["project_status"],
      label: "وضعیت پروژه",
      icon: "apartment",
    }),
    createGridItem({ features, labels: ["delivery_date"], label: "تاریخ تحویل", icon: "calendar" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingItems = [
    createGridItem({
      features,
      labels: ["builder_company_name", "builder_name", "developer_name"],
      label: "نام سازنده",
      icon: "building",
    }),
    createGridItem({ features, labels: ["project_status"], label: "وضعیت پروژه" }),
    createGridItem({
      features,
      labels: ["ready_delivery_date", "available_from"],
      label: "تاریخ آماده تحویل",
      icon: "calendar",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const finishItems = [
    createGridItem({ features, labels: ["floor_material"], label: "جنس کف", icon: "ceramic" }),
    createGridItem({ features, labels: ["facade_material"], label: "جنس نما", icon: "building" }),
    createGridItem({
      features,
      labels: ["cabinet_material"],
      label: "جنس کابینت",
      icon: "cabinet",
    }),
    createGridItem({ features, labels: ["kitchen_type"], label: "نوع آشپزخانه", icon: "cabinet" }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const saleTermsItems = [
    createGridItem({
      features,
      labels: ["sale_terms_percent"],
      label: "درصد شرایط",
      formatter: formatPercentDetailValue,
      icon: "tooman",
    }),
    createGridItem({
      features,
      labels: ["sale_terms_installment_months"],
      label: "تعداد اقساط",
      formatter: (v) => appendSuffixIfNeeded(v, "ماه"),
      icon: "calendar",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const badges = [
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const exchangeRow = createExchangeRow(features);

  return filterDetailSections([
    { title: "مشخصات اصلی", items: mainItems, layout: "grid", columns: 2, showIcons: true },
    { title: "موقعیت و ساختمان", items: buildingItems, layout: "grid", columns: 2, badges },
    { title: "متریال و نازک‌کاری", items: finishItems, layout: "grid", columns: 2 },
    { title: "شرایط فروش", items: saleTermsItems, layout: "grid", columns: 2 },
    { title: "معاوضه", items: exchangeRow ? [exchangeRow] : [], layout: "rows" },
  ]);
}

