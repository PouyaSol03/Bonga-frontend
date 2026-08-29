import { useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "../../shared/api/api";
import LinearApartment from "../../shared/icons/LinearApartment";
import LinearArrowRight1 from "../../shared/icons/LinearArrowRight1";
import LinearBuilding from "../../shared/icons/LinearBuilding";
import LinearCalendar from "../../shared/icons/LinearCalendar";
import LinearCall from "../../shared/icons/LinearCall";
import LinearCategory from "../../shared/icons/LinearCategory";
import LinearClock from "../../shared/icons/LinearClock";
import LinearDocument from "../../shared/icons/LinearDocument";
import LinearEdit2 from "../../shared/icons/LinearEdit2";
import LinearGps from "../../shared/icons/LinearGps";
import LinearHome2 from "../../shared/icons/LinearHome2";
import LinearHouseDimensions from "../../shared/icons/LinearHouseDimensions";
import LinearImage from "../../shared/icons/LinearImage";
import LinearInformation from "../../shared/icons/LinearInformation";
import LinearLocation from "../../shared/icons/LinearLocation";
import LinearMapsLocation from "../../shared/icons/LinearMapsLocation";
import LinearMoney from "../../shared/icons/LinearMoney";
import LinearOwner from "../../shared/icons/LinearOwner";
import LinearUserAccount from "../../shared/icons/LinearUserAccount";
import { AdLocationMap } from "../advertisements/components/AdLocationMap";
import { getAdvertisementImageUrls } from "../advertisements/utils/advertisement-images";
import { RouteLink } from "../../shared/navigation/RouteLink";
import { backRoute } from "../../shared/navigation/navigation";
import {
  getCrmAdvertise,
  getCrmRecordId,
  listCrmCategories,
  listCrmCities,
  listCrmNeighborhoods,
  type CrmRecord,
} from "./api/crm.service";
import { getCrmAdvertiseEditPath, getCrmAdvertiseEditState } from "./crmAdvertiseNavigation";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type CrmAdvertiseDetailViewProps = {
  advertiseId: string;
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

type FeatureRecord = CrmRecord & {
  label?: unknown;
  value?: unknown;
};

const formCodeLabels: Record<string, string> = {
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

const featureLabelMap: Record<string, string> = {
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

const technicalFeatureKeys = new Set([
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

const priceFeatureKeys = new Set([
  "price",
  "min_price",
  "max_price",
  "mortgage_price",
  "rent_price",
]);

const areaFeatureKeys = new Set(["area", "land_area", "building_area"]);

function readText(record: CrmRecord | undefined, keys: string[], fallback = "") {
  if (!record) return fallback;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return fallback;
}

function readNestedName(record: CrmRecord | undefined, keys: string[]) {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const name = readText(value as CrmRecord, ["name", "title", "label"]);
      if (name) return name;
    }
  }

  return "";
}

function readNestedId(record: CrmRecord | undefined, keys: string[]) {
  if (!record) return "";

  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const id = readText(value as CrmRecord, ["id", "_id"]);
      if (id) return id;
    }
  }

  return "";
}

function looksLikeRecordId(value: string) {
  return /^[a-f\d]{20,}$/i.test(value) || /^\d{8,}$/.test(value);
}

function readHumanText(record: CrmRecord | undefined, keys: string[]) {
  const value = readText(record, keys);
  return value && !looksLikeRecordId(value) ? value : "";
}

function normalizeFeatures(advertise: CrmRecord | undefined): FeatureRecord[] {
  if (!advertise) return [];

  const result: FeatureRecord[] = [];

  for (const key of ["features", "dynamic_fields", "dynamicFields"]) {
    const value = advertise[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          result.push(item as FeatureRecord);
        }
      }
    } else if (value && typeof value === "object") {
      for (const [label, itemValue] of Object.entries(value as CrmRecord)) {
        result.push({ label, value: itemValue });
      }
    }
  }

  return result;
}

function getFeatureKey(feature: FeatureRecord) {
  return readText(feature, ["code", "key", "name", "label"]);
}

function getFeatureValue(features: FeatureRecord[], keys: string[]) {
  for (const key of keys) {
    const feature = features.find((item) => getFeatureKey(item) === key);

    if (feature && feature.value !== undefined && feature.value !== null && feature.value !== "") {
      return feature.value;
    }
  }

  return undefined;
}

function getFormName(formCode: string) {
  return formCodeLabels[formCode] ?? "فرم آگهی ثبت‌شده";
}

function toNumericValue(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;

  const normalized = value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[٬،,\s]/g, "")
    .replace(/[^0-9.-]/g, "");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function formatNumber(value: unknown) {
  const number = toNumericValue(value);
  return number === null ? "-" : new Intl.NumberFormat("fa-IR").format(number);
}

function formatMoney(value: unknown) {
  const formatted = formatNumber(value);
  return formatted === "-" ? formatted : `${formatted} تومان`;
}

function resolvePricePresentation(
  formCode: string,
  featureMap: Record<string, unknown>,
  rootPrice: unknown,
  area: unknown,
) {
  if (formCode.startsWith("rent-")) {
    return {
      primaryLabel: "رهن",
      primaryValue: formatMoney(featureMap.mortgage_price),
      secondaryLabel: "اجاره",
      secondaryValue: formatMoney(featureMap.rent_price),
    };
  }

  if (formCode.startsWith("daily-")) {
    const minPrice = featureMap.min_price ?? featureMap.daily_price;
    const maxPrice = featureMap.max_price;

    return {
      primaryLabel: maxPrice === undefined ? "قیمت روزانه" : "حداقل قیمت",
      primaryValue: formatMoney(minPrice),
      secondaryLabel: "حداکثر قیمت",
      secondaryValue: maxPrice === undefined ? "-" : formatMoney(maxPrice),
    };
  }

  if (formCode === "presale-special") {
    const minPrice = featureMap.min_price ?? featureMap.meter_price;
    const maxPrice = featureMap.max_price;

    return {
      primaryLabel: maxPrice === undefined ? "قیمت متری" : "حداقل قیمت",
      primaryValue: formatMoney(minPrice),
      secondaryLabel: maxPrice === undefined ? "قیمت هر متر" : "حداکثر قیمت",
      secondaryValue: maxPrice === undefined ? formatMoney(featureMap.meter_price) : formatMoney(maxPrice),
    };
  }

  const totalPrice = rootPrice ?? featureMap.price;
  const numericPrice = toNumericValue(totalPrice);
  const numericArea = toNumericValue(area);
  const pricePerMeter = numericPrice !== null && numericArea !== null && numericArea > 0
    ? formatMoney(Math.round(numericPrice / numericArea))
    : "محاسبه نشده";

  return {
    primaryLabel: "قیمت کل",
    primaryValue: formatMoney(totalPrice),
    secondaryLabel: "قیمت هر متر",
    secondaryValue: pricePerMeter,
  };
}

function formatArea(value: unknown) {
  const formatted = formatNumber(value);
  return formatted === "-" ? formatted : `${formatted} متر مربع`;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDisplayValue(key: string, value: unknown): string {
  if (value === undefined || value === null || value === "") return "-";
  if (key === "form_code") return getFormName(String(value));
  if (priceFeatureKeys.has(key)) return formatMoney(value);
  if (areaFeatureKeys.has(key)) return formatArea(value);

  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  if (Array.isArray(value)) {
    const values = value
      .map((item) => formatDisplayValue("", item))
      .filter((item) => item && item !== "-");

    return values.length ? values.join("، ") : "-";
  }

  if (value && typeof value === "object") {
    const objectValue = value as CrmRecord;
    return readText(objectValue, ["name", "title", "label"], "-");
  }

  if (typeof value === "number") return formatNumber(value);

  const text = String(value).trim();
  if (text === "true" || text === "1") return "دارد";
  if (text === "false" || text === "0") return "ندارد";

  return text || "-";
}

function getFeatureDisplayLabel(feature: FeatureRecord) {
  const key = getFeatureKey(feature);
  const explicitLabel = readText(feature, ["display_name", "displayName", "title"]);

  return explicitLabel || featureLabelMap[key] || key || "ویژگی";
}

function getFeatureIcon(key: string): ReactNode {
  const className = "h-5 w-5";

  if (key.includes("area") || key.includes("meter")) return <LinearHouseDimensions className={className} />;
  if (key.includes("price") || key.includes("mortgage") || key.includes("rent")) return <LinearMoney className={className} />;
  if (key.includes("floor") || key.includes("building") || key.includes("project")) return <LinearBuilding className={className} />;
  if (key.includes("document") || key.includes("permit") || key.includes("license")) return <LinearDocument className={className} />;
  if (key.includes("location") || key.includes("position")) return <LinearLocation className={className} />;
  if (key.includes("date") || key.includes("year") || key.includes("age")) return <LinearCalendar className={className} />;
  if (key.includes("owner") || key.includes("advertiser")) return <LinearOwner className={className} />;

  return <LinearApartment className={className} />;
}

function getImageUrls(advertise: CrmRecord | undefined) {
  return getAdvertisementImageUrls(advertise);
}

function findRecordNameById(records: CrmRecord[], id: string): string {
  for (const record of records) {
    if (getCrmRecordId(record) === id) {
      return readText(record, ["name", "title", "label"]);
    }

    const children = Array.isArray(record.children) ? (record.children as CrmRecord[]) : [];
    const nestedName = findRecordNameById(children, id);
    if (nestedName) return nestedName;
  }

  return "";
}

function advertiseStatusLabel(status: unknown) {
  const value = String(status ?? "").trim().toLowerCase();

  return (
    {
      wait_for_payment: "در انتظار پرداخت",
      wait_for_admin: "در انتظار بررسی",
      wait_for_agency: "در انتظار آژانس",
      accepted: "منتشرشده",
      needs_edit: "نیازمند ویرایش",
      rejected: "ردشده",
      deleted: "حذف‌شده",
      expired: "منقضی‌شده",
      "-4": "نیازمند ویرایش",
      "-3": "منقضی‌شده",
      "-2": "حذف‌شده",
      "-1": "ردشده",
      "0": "در انتظار پرداخت",
      "1": "در انتظار بررسی",
      "2": "در انتظار آژانس",
      "3": "منتشرشده",
    }[value] ?? "نامشخص"
  );
}

function statusTone(status: unknown) {
  const value = String(status ?? "").trim().toLowerCase();
  if (value === "accepted" || value === "3") return "bg-[#eaf8f1] text-[#087d4b]";
  if (["needs_edit", "rejected", "deleted", "expired", "-4", "-1", "-2", "-3"].includes(value)) {
    return "bg-[#fff0f1] text-[#c63242]";
  }
  return "bg-[#fff7df] text-[#9b6800]";
}

function InformationRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#f0f0f0] py-3.5 last:border-b-0">
      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f5f5f5] text-[#0048c4]">
        {icon}
      </Typography>
      <div className="min-w-0 flex-1">
        <Typography as="span" variant="label" size="medium" weight="medium" className="block text-sm font-medium text-[#808080]">{label}</Typography>
        <strong className="mt-1 block break-words text-sm font-bold leading-6 text-[#333333]">{value}</strong>
      </div>
    </div>
  );
}

function DetailSection({ children, icon, title }: { children: ReactNode; icon: ReactNode; title: string }) {
  return (
    <section className="rounded-xl bg-white p-5">
      <div className="flex items-center gap-2.5">
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">{icon}</Typography>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base font-bold text-[#1a1a1a]">{title}</Typography>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-64 rounded-xl bg-white" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div className="h-24 rounded-xl bg-white" key={index} />)}
      </div>
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-96 rounded-xl bg-white" />
        <div className="h-96 rounded-xl bg-white" />
      </div>
    </div>
  );
}

export function CrmAdvertiseDetailView({ advertiseId, notify, refreshNonce }: CrmAdvertiseDetailViewProps) {
  const advertiseQuery = useQuery({
    queryFn: () => getCrmAdvertise(advertiseId),
    queryKey: ["crm", "advertise", "panel-show", advertiseId, refreshNonce],
  });

  const advertise = advertiseQuery.data;
  const features = useMemo(() => normalizeFeatures(advertise), [advertise]);

  const featureMap = useMemo(() => {
    const map: Record<string, unknown> = {};
    for (const feature of features) {
      const key = getFeatureKey(feature);
      if (key && feature.value !== undefined && feature.value !== null) {
        map[key] = feature.value;
      }
    }
    return map;
  }, [features]);
  const formCode = readText(advertise, ["form_code"]) || String(getFeatureValue(features, ["form_code"]) ?? "");
  const neighborhoodId = readText(advertise, ["neighborhood_id"]) || readNestedId(advertise, ["neighborhood", "district"]) || String(getFeatureValue(features, ["neighborhood_id"]) ?? "");
  const cityId = readText(advertise, ["city_id"]) || readNestedId(advertise, ["city"]) || String(getFeatureValue(features, ["city_id"]) ?? "");
  const categoryId = readText(advertise, ["category_id"]) || readNestedId(advertise, ["category"]);

  const featureLocation = getFeatureValue(features, ["location"]);
  const directNeighborhoodName =
    readHumanText(advertise, ["form_neighborhood_title", "neighborhood_name", "district_name"]) ||
    readNestedName(advertise, ["neighborhood", "district"]) ||
    (typeof featureLocation === "string" ? featureLocation.trim() : "");
  const directCityName = readHumanText(advertise, ["city_name"]) || readNestedName(advertise, ["city"]);
  const directCategoryName = readHumanText(advertise, ["category_name"]) || readNestedName(advertise, ["category"]);

  const neighborhoodQuery = useQuery({
    enabled: Boolean(advertise && neighborhoodId && cityId && !directNeighborhoodName),
    queryFn: () => listCrmNeighborhoods({ cityId }),
    queryKey: ["crm", "advertise", advertiseId, "neighborhoods", cityId],
  });
  const cityQuery = useQuery({
    enabled: Boolean(advertise && cityId && !directCityName),
    queryFn: () => listCrmCities(),
    queryKey: ["crm", "advertise", advertiseId, "cities"],
  });
  const categoryQuery = useQuery({
    enabled: Boolean(advertise && categoryId && !directCategoryName),
    queryFn: listCrmCategories,
    queryKey: ["crm", "advertise", advertiseId, "categories"],
  });

  useEffect(() => {
    const error = advertiseQuery.error || neighborhoodQuery.error || cityQuery.error || categoryQuery.error;
    if (error) notify(getApiErrorMessage(error, "دریافت جزئیات آگهی ناموفق بود."), "error");
  }, [advertiseQuery.error, categoryQuery.error, cityQuery.error, neighborhoodQuery.error, notify]);

  if (advertiseQuery.isLoading) return <DetailSkeleton />;

  if (!advertise) {
    return (
      <section className="mx-auto grid min-h-[420px] w-full place-items-center rounded-xl bg-white p-8 text-center">
        <div className="mx-auto w-full max-w-[520px]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
            <LinearInformation className="h-7 w-7" />
          </Typography>
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-4 text-lg font-bold text-[#1a1a1a]">اطلاعات آگهی دریافت نشد</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm text-[#808080]">پاسخ قابل نمایشی از سرویس جزئیات آگهی دریافت نشد.</Typography>
          <Button unstyled className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white no-underline" onClick={() => backRoute("/crm/advertises")} type="button">
            <LinearArrowRight1 className="h-5 w-5" />
            بازگشت به آگهی‌ها
          </Button>
        </div>
      </section>
    );
  }

  const resolvedNeighborhoodName = findRecordNameById(neighborhoodQuery.data ?? [], neighborhoodId);
  const resolvedCityName = findRecordNameById(cityQuery.data ?? [], cityId);
  const resolvedCategoryName = findRecordNameById(categoryQuery.data ?? [], categoryId);
  const neighborhoodName =
    directNeighborhoodName ||
    resolvedNeighborhoodName ||
    (neighborhoodQuery.isLoading ? "در حال دریافت نام محله..." : "نام محله در پاسخ موجود نیست");
  const cityName =
    directCityName ||
    resolvedCityName ||
    (cityQuery.isLoading ? "در حال دریافت نام شهر..." : "نام شهر در پاسخ موجود نیست");
  const categoryName =
    directCategoryName ||
    resolvedCategoryName ||
    (categoryQuery.isLoading ? "در حال دریافت دسته‌بندی..." : "دسته‌بندی آگهی");
  const images = getImageUrls(advertise);
  const coverImage = images[0];
  const title = readText(advertise, ["title", "label"], "آگهی بدون عنوان");

  const rootPrice = advertise.price || undefined;
  const area = advertise.area || featureMap.area || featureMap.land_area || featureMap.building_area;
  const pricePresentation = resolvePricePresentation(formCode, featureMap, rootPrice, area);

  const ownerPhone = readText(advertise, ["owner_phone", "phone", "mobile"], "-");
  const ownerName =
    readText(advertise, ["owner_name", "publisher_name", "advertiser_name"]) ||
    readNestedName(advertise, ["owner", "user", "publisher"]) ||
    "ثبت نشده";
  const trackCode = readText(advertise, ["track_code"], "-");
  const createdAt = formatDate(advertise.created_at ?? advertise.published_at);
  const latitude = toNumericValue(advertise.lat ?? advertise.latitude);
  const longitude = toNumericValue(advertise.lng ?? advertise.long ?? advertise.longitude);
  const hasMapPosition = latitude !== null && longitude !== null;
  const savedAddress = readHumanText(advertise, ["address", "full_address", "formatted_address", "postal_address"]);
  const locationTitle = [cityName, neighborhoodName]
    .filter((value) => value && !value.includes("موجود نیست") && !value.includes("در حال دریافت"))
    .join("، ");
  const address = savedAddress || locationTitle || "آدرس ثبت نشده است";
  const description = readText(advertise, ["description", "short_description"], "توضیحی برای این آگهی ثبت نشده است.");
  const adminNote = readText(advertise, ["admin_note"]);
  const visibleFeatures = features.filter((feature) => {
    const key = getFeatureKey(feature);
    return key && !technicalFeatureKeys.has(key) && feature.value !== undefined && feature.value !== null && feature.value !== "";
  });

  return (
    <div className="pb-6" dir="rtl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4">
        <Button unstyled className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-semibold text-[#1a1a1a] no-underline transition hover:border-[#0048c4] hover:text-[#0048c4]" onClick={() => backRoute("/crm/advertises")} type="button">
          <LinearArrowRight1 className="h-5 w-5" />
          بازگشت به مدیریت آگهی‌ها
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <RouteLink
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white no-underline transition hover:bg-[#003ca4]"
            state={getCrmAdvertiseEditState(advertiseId)}
            to={getCrmAdvertiseEditPath(advertiseId)}
          >
            <LinearEdit2 className="h-5 w-5" />
            ویرایش آگهی
          </RouteLink>
          <Typography as="span" variant="label" size="medium" weight="semibold" className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-bold ${statusTone(advertise.status)}`}>
            {advertiseStatusLabel(advertise.status)}
          </Typography>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-4">
          <section className="rounded-xl bg-white p-6">
            <div className="grid h-[420px] grid-cols-[minmax(0,1fr)_140px] gap-2 overflow-hidden rounded-2xl bg-[#eef2f7]">
              <Button unstyled className="relative min-w-0 overflow-hidden bg-[#e7ebf0]" type="button">
            {coverImage ? (
                  <img alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" src={coverImage} />
            ) : (
                  <div className="grid h-full place-items-center text-[#8ea7cf]">
                <div className="text-center">
                  <LinearImage className="mx-auto h-12 w-12" />
                  <Typography as="span" variant="label" size="medium" weight="medium" className="mt-2 block text-sm font-medium">تصویری ثبت نشده است</Typography>
                </div>
              </div>
            )}
                <Typography as="span" variant="label" size="medium" weight="medium" className="absolute bottom-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-black/65 px-3 text-sm font-medium text-white backdrop-blur-sm">
                <LinearImage className="h-4 w-4" />
                  {new Intl.NumberFormat("fa-IR").format(images.length)} تصویر
              </Typography>
              </Button>
              <div className="grid grid-rows-3 gap-2">
                {(images.length > 1 ? images.slice(1, 4) : ["", "", ""]).map((image, index) => (
                  <div className="relative overflow-hidden bg-[#dfe5ec]" key={`${image}-${index}`}>
                    {image ? <img alt="" className="h-full w-full object-cover" src={image} /> : <LinearImage className="absolute inset-0 m-auto h-7 w-7 text-[#9aabc2]" />}
                    {index === 2 && images.length > 4 ? <Typography as="span" variant="title" size="large" weight="semibold" className="absolute inset-0 grid place-items-center bg-black/50 text-lg font-bold text-white">+{new Intl.NumberFormat("fa-IR").format(images.length - 4)}</Typography> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5">
              <div className="flex items-center justify-between gap-4 text-sm text-[#4d4d4d]">
                <Typography as="span" variant="body" size="medium" weight="regular" className="inline-flex items-center gap-1.5"><LinearClock className="h-4 w-4" />{createdAt}</Typography>
                <Typography as="span" variant="body" size="medium" weight="regular">کد آگهی: <strong className="text-[#1a1a1a]">{trackCode}</strong></Typography>
              </div>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-5 flex items-center gap-1.5 text-sm text-[#4d4d4d]"><LinearLocation className="h-5 w-5 text-[#0048c4]" />{locationTitle || "موقعیت ثبت نشده"}</Typography>
              <Typography as="h1" variant="headline" size="small" className="m-0 mt-2 text-2xl font-bold leading-10 text-[#1a1a1a]">{title}</Typography>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <PriceBox label={pricePresentation.primaryLabel} value={pricePresentation.primaryValue} />
                <PriceBox label={pricePresentation.secondaryLabel} value={pricePresentation.secondaryValue} />
              </div>
            </div>
          </section>

          <PublicStyleSection title="اطلاعات ملک">
            {visibleFeatures.length ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 xl:grid-cols-3">
                {visibleFeatures.map((feature, index) => {
                  const key = getFeatureKey(feature);
                  return (
                    <article className="flex min-w-0 items-start gap-3" key={`${key}-${index}`}>
                      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center text-[#808080]">
                        {getFeatureIcon(key)}
                      </Typography>
                      <div className="min-w-0">
                        <strong className="block break-words text-base font-medium leading-6 text-[#1a1a1a]">{formatDisplayValue(key, feature.value)}</strong>
                        <Typography as="span" variant="label" size="small" weight="medium" className="mt-0.5 block text-xs font-medium text-[#a6a6a6]">{getFeatureDisplayLabel(feature)}</Typography>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 rounded-xl bg-[#f7f7f7] p-4 text-sm text-[#808080]">ویژگی دیگری برای این آگهی ثبت نشده است.</Typography>
            )}
          </PublicStyleSection>

          <PublicStyleSection title="توضیحات">
            <Typography as="p" variant="body" size="large" weight="regular" className="m-0 whitespace-pre-wrap text-base leading-8 text-[#1a1a1a]">{description}</Typography>
            <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
              <div className="flex items-start gap-3"><LinearMapsLocation className="mt-0.5 h-6 w-6 shrink-0 text-[#0048c4]" /><div><Typography as="span" variant="body" size="small" weight="regular" className="text-xs text-[#808080]">آدرس</Typography><strong className="mt-1 block text-sm leading-6 text-[#1a1a1a]">{address}</strong></div></div>
            </div>
          </PublicStyleSection>

          {adminNote ? (
            <PublicStyleSection title="یادداشت مدیر"><Typography as="p" variant="body" size="medium" weight="regular" className="m-0 whitespace-pre-wrap text-sm leading-8 text-[#4d4d4d]">{adminNote}</Typography></PublicStyleSection>
          ) : null}
        </main>

        <aside className="sticky top-0 space-y-4">
          <DetailSection icon={<LinearInformation className="h-5 w-5" />} title="اطلاعات اصلی">
            <InformationRow icon={<LinearHome2 className="h-5 w-5" />} label="دسته‌بندی" value={categoryName} />
            <InformationRow icon={<LinearCategory className="h-5 w-5" />} label="فرم آگهی" value={getFormName(formCode)} />
            <InformationRow icon={<LinearMapsLocation className="h-5 w-5" />} label="محله" value={neighborhoodName} />
            <InformationRow icon={<LinearLocation className="h-5 w-5" />} label="شهر" value={cityName} />
            <InformationRow icon={<LinearMoney className="h-5 w-5" />} label={pricePresentation.primaryLabel} value={pricePresentation.primaryValue} />
            <InformationRow icon={<LinearHouseDimensions className="h-5 w-5" />} label="متراژ" value={formatArea(area)} />
          </DetailSection>

          <DetailSection icon={<LinearOwner className="h-5 w-5" />} title="اطلاعات آگهی‌دهنده">
            <InformationRow icon={<LinearUserAccount className="h-5 w-5" />} label="نام" value={ownerName} />
            <InformationRow icon={<LinearCall className="h-5 w-5" />} label="شماره تماس" value={ownerPhone} />
            <InformationRow icon={<LinearDocument className="h-5 w-5" />} label="کد پیگیری" value={trackCode} />
            <InformationRow icon={<LinearCalendar className="h-5 w-5" />} label="زمان ثبت" value={createdAt} />
          </DetailSection>

          <DetailSection icon={<LinearGps className="h-5 w-5" />} title="موقعیت جغرافیایی">
            <InformationRow icon={<LinearMapsLocation className="h-5 w-5" />} label="آدرس دقیق" value={address} />
            {hasMapPosition ? (
              <AdLocationMap
                className="mt-4"
                latitude={latitude}
                longitude={longitude}
                title="موقعیت آگهی در مدیریت"
              />
            ) : (
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-4 rounded-xl bg-[#f7f7f7] p-4 text-center text-sm text-[#808080]">
                موقعیت این آگهی روی نقشه ثبت نشده است.
              </Typography>
            )}
          </DetailSection>

          <div className="rounded-xl bg-white p-5 text-sm text-[#666666]">
            <div className="flex items-center gap-2 text-[#0048c4]">
              <LinearApartment className="h-5 w-5" />
              <strong className="text-sm">شناسه آگهی</strong>
            </div>
            <Typography as="span" variant="body" size="medium" weight="regular" className="mt-2 block break-all font-mono text-sm text-[#333333]" dir="ltr">{getCrmRecordId(advertise)}</Typography>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PriceBox({ label, value }: { label: string; value: string }) {
  return <div className="flex min-h-14 items-center justify-between rounded-xl bg-[#f7f7f7] px-4"><Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium text-[#4d4d4d]">{label}</Typography><strong className="text-base font-semibold text-[#1a1a1a]">{value}</strong></div>;
}

function PublicStyleSection({ children, title }: { children: ReactNode; title: string }) {
  return <section className="rounded-xl bg-white px-6 py-6"><Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-semibold text-[#1a1a1a]">{title}</Typography><div className="mt-6">{children}</div></section>;
}
