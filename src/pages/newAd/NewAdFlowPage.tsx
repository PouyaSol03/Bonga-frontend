import { useEffect, useRef, useState, type ReactNode } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { PageFrame } from "../../app/PageFrame";
import { BottomSheet, BottomSheetActionList } from "../../components/BottomSheet";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { getStoredAuthSession, storeLoginRedirectPath } from "../../auth/auth-storage";

type FlowStep = "details" | "moreFeatures" | "media";
type RegistrantType = "" | "personal" | "agency";
type SelectKey = "floor" | "rooms" | "age";

type MoreFeatureSelectKey =
  | "floor"
  | "rooms"
  | "totalFloors"
  | "unitType"
  | "unitPosition"
  | "documentType"
  | "facadeMaterial"
  | "floorMaterial"
  | "cabinetMaterial"
  | "landPosition"
  | "villaType";

type MoreFeatureNumberKey =
  | "density"
  | "landWidth"
  | "streetWidth"
  | "ceilingHeight"
  | "singleRoomCount"
  | "doubleRoomCount"
  | "suiteCount";

type MoreFeatureToggleKey =
  | "renovated"
  | "furnished"
  | "constructionPermit"
  | "commercialPermit";

type MoreFeatureFormKey =
  | MoreFeatureSelectKey
  | MoreFeatureNumberKey
  | MoreFeatureToggleKey;

type MoreFeatureField = {
  key: MoreFeatureFormKey;
  label: string;
  control: "select" | "number" | "toggle";
  leftText?: string;
};

type SheetState =
  | {
    kind: "select";
    key: SelectKey;
    title: string;
    options: string[];
  }
  | {
    kind: "exchange";
    title: string;
    options: string[];
  };

type ChipItem = { id: string; label: string };

type UploadedMediaFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  file: File;
};

type NewAdFormValues = {
  location: string;
  meterage: string;
  floor: string;
  rooms: string;
  age: string;
  totalFloors: string;
  unitType: string;
  unitPosition: string;
  documentType: string;
  renovated: boolean;
  furnished: boolean;
  facadeMaterial: string;
  floorMaterial: string;
  cabinetMaterial: string;
  landPosition: string;
  villaType: string;
  density: string;
  landWidth: string;
  streetWidth: string;
  constructionPermit: boolean;
  commercialPermit: boolean;
  ceilingHeight: string;
  singleRoomCount: string;
  doubleRoomCount: string;
  suiteCount: string;
  selectedSpecs: string[];
  heatingCooling: string[];
  facilities: string[];
  price: string;
  loanEnabled: boolean;
  loanAmount: string;
  loanInstallment: string;
  exchangeEnabled: boolean;
  exchangeTargets: string[];
  photos: UploadedMediaFile[];
  hasVideo: boolean;
  video: UploadedMediaFile | null;
  hasVirtualTour: boolean;
  registrantType: RegistrantType;
  chatEnabled: boolean;
  phoneEnabled: boolean;
  telegram: string;
  whatsapp: string;
  title: string;
  description: string;
};

type MoreFeaturesFormValues = Pick<NewAdFormValues, MoreFeatureFormKey>;

const locationKey = "bonga-new-ad-location";
const draftKey = "bonga-new-ad-draft";

const blankValues: NewAdFormValues = {
  location: "",
  meterage: "",
  floor: "",
  rooms: "",
  age: "",
  selectedSpecs: [],
  heatingCooling: [],
  facilities: [],
  price: "",
  loanEnabled: false,
  loanAmount: "",
  loanInstallment: "",
  exchangeEnabled: false,
  exchangeTargets: [],
  photos: [],
  hasVideo: false,
  video: null,
  hasVirtualTour: false,
  registrantType: "",
  chatEnabled: false,
  phoneEnabled: false,
  telegram: "",
  whatsapp: "",
  title: "",
  description: "",
  totalFloors: "",
  unitType: "",
  unitPosition: "",
  documentType: "",
  renovated: false,
  furnished: false,
  facadeMaterial: "",
  floorMaterial: "",
  cabinetMaterial: "",
  landPosition: "",
  villaType: "",
  density: "",
  landWidth: "",
  streetWidth: "",
  constructionPermit: false,
  commercialPermit: false,
  ceilingHeight: "",
  singleRoomCount: "",
  doubleRoomCount: "",
  suiteCount: "",
};

const propertySpecs: ChipItem[] = [
  { id: "total-floors", label: "تعداد کل طبقات" },
  { id: "furnished", label: "با لوازم و مبله شده" },
  { id: "facade", label: "جنس نما" },
  { id: "floor-material", label: "جنس کف" },
];

const heatingItems: ChipItem[] = [
  { id: "gas-cooler", label: "کولر گازی" },
  { id: "water-cooler", label: "کولر آبی" },
  { id: "package", label: "پکیج" },
  { id: "radiator", label: "رادیاتور" },
  { id: "heater", label: "بخاری" },
  { id: "water-heater", label: "آبگرمکن" },
  { id: "floor-heating", label: "گرمایش از کف" },
  { id: "fan-coil", label: "فن کوئل" },
  { id: "chiller", label: "چیلر" },
  { id: "split", label: "اسپلیت" },
  { id: "fireplace", label: "شوفاژ" },
];

const facilityItems: ChipItem[] = [
  { id: "elevator", label: "آسانسور" },
  { id: "parking", label: "پارکینگ" },
  { id: "warehouse", label: "انباری" },
  { id: "terrace", label: "تراس" },
  { id: "lobby", label: "لابی" },
  { id: "guard", label: "نگهبانی" },
  { id: "yard", label: "حیاط" },
  { id: "roof", label: "روف گاردن" },
  { id: "pool", label: "استخر" },
  { id: "sauna", label: "سونا" },
  { id: "jacuzzi", label: "جکوزی" },
  { id: "gym", label: "سالن ورزشی" },
  { id: "camera", label: "دوربین مدار بسته" },
  { id: "bms", label: "سیستم هوشمند" },
  { id: "western", label: "سرویس فرنگی" },
  { id: "iranian", label: "سرویس ایرانی" },
  { id: "wardrobe", label: "کمد دیواری" },
  { id: "door", label: "درب ضد سرقت" },
  { id: "video", label: "آیفون تصویری" },
  { id: "power", label: "امتیاز برق" },
  { id: "water", label: "امتیاز آب" },
  { id: "gas", label: "امتیاز گاز" },
  { id: "gas-stove", label: "گاز رومیزی" },
  { id: "hood", label: "هود" },
  { id: "oven", label: "فر توکار" },
];

const exchangeTargets = ["خودرو", "زمین", "واحد مسکونی"];

const moreFeatureKeys: MoreFeatureFormKey[] = [
  "floor",
  "rooms",
  "totalFloors",
  "unitType",
  "unitPosition",
  "documentType",
  "renovated",
  "furnished",
  "facadeMaterial",
  "floorMaterial",
  "cabinetMaterial",
  "landPosition",
  "villaType",
  "density",
  "landWidth",
  "streetWidth",
  "constructionPermit",
  "commercialPermit",
  "ceilingHeight",
  "singleRoomCount",
  "doubleRoomCount",
  "suiteCount",
];

const floorOptions = ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸ و بیشتر"];
const roomOptions = ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"];

const moreFeatureOptions: Record<MoreFeatureSelectKey, string[]> = {
  floor: floorOptions,
  rooms: roomOptions,
  totalFloors: ["۱ طبقه", "۲ طبقه", "۳ طبقه", "۴ طبقه", "۵ طبقه", "۶ طبقه", "۷ طبقه", "۸ طبقه و بیشتر"],
  unitType: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش"],
  unitPosition: ["جلو", "عقب", "وسط", "کنج", "دوبلکس"],
  documentType: ["شش دانگ", "قولنامه‌ای", "تک برگ", "منگوله‌دار", "اوقافی", "تعاونی"],
  facadeMaterial: ["سنگ", "آجر", "سیمان", "کامپوزیت", "شیشه", "رومی", "ترکیبی"],
  floorMaterial: ["سرامیک", "سنگ", "پارکت", "لمینت", "موزاییک", "کفپوش"],
  cabinetMaterial: ["MDF", "های‌گلاس", "ممبران", "فلزی", "چوبی", "ندارد"],
  landPosition: ["شمالی", "جنوبی", "شرقی", "غربی", "دو نبش", "بر خیابان", "داخل کوچه"],
  villaType: ["فلت", "دوبلکس", "تریپلکس", "مدرن", "کلاسیک", "باغ‌ویلا"],
};

const apartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "totalFloors", label: "تعداد طبقات آپارتمان", control: "select" },
  { key: "unitType", label: "تیپ واحد", control: "select" },
  { key: "unitPosition", label: "موقعیت واحد", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const villaHouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landPosition", label: "موقعیت زمین", control: "select" },
  { key: "villaType", label: "تیپ ویلا", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const gardenVillaMoreFeatureFields: MoreFeatureField[] = [
  { key: "villaType", label: "تیپ ویلا", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const landMoreFeatureFields: MoreFeatureField[] = [
  { key: "density", label: "تراکم", control: "number", leftText: "درصد" },
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "streetWidth", label: "عرض خیابان", control: "number", leftText: "متر" },
  { key: "constructionPermit", label: "مجوز ساخت", control: "toggle" },
];

const officeMoreFeatureFields: MoreFeatureField[] = [
  { key: "floor", label: "طبقه", control: "select" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
  { key: "facadeMaterial", label: "جنس نما", control: "select" },
  { key: "floorMaterial", label: "جنس کف", control: "select" },
  { key: "cabinetMaterial", label: "جنس کابینت", control: "select" },
];

const commercialUnitMoreFeatureFields: MoreFeatureField[] = [
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
  { key: "rooms", label: "تعداد اتاق", control: "select" },
  { key: "floor", label: "طبقه", control: "select" },
  { key: "totalFloors", label: "تعداد کل طبقات", control: "select" },
];

const warehouseMoreFeatureFields: MoreFeatureField[] = [
  { key: "landWidth", label: "عرض زمین", control: "number", leftText: "متر" },
  { key: "ceilingHeight", label: "ارتفاع سقف", control: "number", leftText: "متر" },
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "commercialPermit", label: "مجوز تجاری", control: "toggle" },
];

const hotelApartmentMoreFeatureFields: MoreFeatureField[] = [
  { key: "documentType", label: "نوع سند", control: "select" },
  { key: "totalFloors", label: "تعداد طبقات", control: "select" },
  { key: "singleRoomCount", label: "تعداد اتاق یک تخته", control: "number" },
  { key: "doubleRoomCount", label: "تعداد اتاق دو تخته", control: "number" },
  { key: "suiteCount", label: "تعداد سوییت‌ها", control: "number" },
  { key: "renovated", label: "بازسازی شده", control: "toggle" },
  { key: "furnished", label: "مبله با لوازم", control: "toggle" },
];

const moreFeatureFieldsByCategory: Record<string, MoreFeatureField[]> = {
  apartment: apartmentMoreFeatureFields,
  "daily-apartment-suite": apartmentMoreFeatureFields,
  "villa-house": villaHouseMoreFeatureFields,
  "garden-villa": gardenVillaMoreFeatureFields,
  "daily-garden-villa": gardenVillaMoreFeatureFields,
  land: landMoreFeatureFields,
  office: officeMoreFeatureFields,
  "daily-workspace": officeMoreFeatureFields,
  "commercial-unit": commercialUnitMoreFeatureFields,
  warehouse: warehouseMoreFeatureFields,
  "hotel-apartment": hotelApartmentMoreFeatureFields,
  "daily-hotel-apartment": hotelApartmentMoreFeatureFields,
  "factory-workshop": [],
};

function getMoreFeatureFields() {
  const { category } = getParams();
  return moreFeatureFieldsByCategory[category] ?? [];
}

function pickMoreFeatures(values: NewAdFormValues): MoreFeaturesFormValues {
  return {
    floor: values.floor,
    rooms: values.rooms,
    totalFloors: values.totalFloors,
    unitType: values.unitType,
    unitPosition: values.unitPosition,
    documentType: values.documentType,
    renovated: values.renovated,
    furnished: values.furnished,
    facadeMaterial: values.facadeMaterial,
    floorMaterial: values.floorMaterial,
    cabinetMaterial: values.cabinetMaterial,
    landPosition: values.landPosition,
    villaType: values.villaType,
    density: values.density,
    landWidth: values.landWidth,
    streetWidth: values.streetWidth,
    constructionPermit: values.constructionPermit,
    commercialPermit: values.commercialPermit,
    ceilingHeight: values.ceilingHeight,
    singleRoomCount: values.singleRoomCount,
    doubleRoomCount: values.doubleRoomCount,
    suiteCount: values.suiteCount,
  };
}

function getMoreFeatureTags(
  values: NewAdFormValues,
  fields: MoreFeatureField[] = getMoreFeatureFields(),
) {
  return fields.reduce<string[]>((tags, field) => {
    const value = values[field.key];

    if (field.control === "toggle") {
      if (value === true) tags.push(field.label);
      return tags;
    }

    if (typeof value === "string" && value.trim()) {
      tags.push(`${field.label}: ${value}`);
    }

    return tags;
  }, []);
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") ?? "",
    label: params.get("label") ?? "آگهی ملک",
    transaction: params.get("transaction") ?? "",
  };
}

function getDraft(): Partial<NewAdFormValues> {
  try {
    return JSON.parse(window.localStorage.getItem(draftKey) ?? "{}") as Partial<NewAdFormValues>;
  } catch {
    window.localStorage.removeItem(draftKey);
    return {};
  }
}

function getDefaultValues(): NewAdFormValues {
  return {
    ...blankValues,
    ...getDraft(),
    photos: [],
    video: null,
    location: window.localStorage.getItem(locationKey) ?? "",
  };
}

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeNumberInput(value: string) {
  return normalizeDigits(value).replace(/[^\d,]/g, "");
}

function toNumber(value: string) {
  const normalized = normalizeDigits(value).replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) && normalized ? number : null;
}

function labels(items: ChipItem[], ids: string[]) {
  return items.filter((item) => ids.includes(item.id)).map((item) => item.label);
}

function buildPayload(values: NewAdFormValues) {
  const params = getParams();
  return {
    transaction: params.transaction,
    category: params.category,
    category_label: params.label,
    location: values.location,
    property: {
      more_features: {
        total_floors: values.totalFloors || null,
        unit_type: values.unitType || null,
        unit_position: values.unitPosition || null,
        document_type: values.documentType || null,
        renovated: values.renovated,
        furnished: values.furnished,
        facade_material: values.facadeMaterial || null,
        floor_material: values.floorMaterial || null,
        cabinet_material: values.cabinetMaterial || null,
        land_position: values.landPosition || null,
        villa_type: values.villaType || null,
        density: toNumber(values.density),
        land_width: toNumber(values.landWidth),
        street_width: toNumber(values.streetWidth),
        construction_permit: values.constructionPermit,
        commercial_permit: values.commercialPermit,
        ceiling_height: toNumber(values.ceilingHeight),
        single_room_count: toNumber(values.singleRoomCount),
        double_room_count: toNumber(values.doubleRoomCount),
        suite_count: toNumber(values.suiteCount),
      },
      meterage: toNumber(values.meterage),
      floor: values.floor,
      rooms: values.rooms,
      age: values.age,
      extra_specs: labels(propertySpecs, values.selectedSpecs),
    },
    heating_cooling: labels(heatingItems, values.heatingCooling),
    facilities: labels(facilityItems, values.facilities),
    price: {
      amount: toNumber(values.price),
      loan_enabled: values.loanEnabled,
      loan_amount: values.loanEnabled ? toNumber(values.loanAmount) : null,
      loan_installment: values.loanEnabled ? toNumber(values.loanInstallment) : null,
      exchange_enabled: values.exchangeEnabled,
      exchange_targets: values.exchangeEnabled ? values.exchangeTargets : [],
    },
    media: {
      photos: values.photos.map((photo) => ({
        name: photo.name,
        size: photo.size,
        type: photo.type,
      })),
      has_video: values.hasVideo,
      video:
        values.hasVideo && values.video
          ? {
            name: values.video.name,
            size: values.video.size,
            type: values.video.type,
          }
          : null,
      has_virtual_tour: values.hasVirtualTour,
    },
    owner: {
      registrant_type: values.registrantType || null,
      contact_methods: { chat: values.chatEnabled, phone: values.phoneEnabled },
      social: { telegram: values.telegram, whatsapp: values.whatsapp },
    },
    content: { title: values.title, description: values.description },
  };
}

function buildNewAdFormData(values: NewAdFormValues) {
  const payload = buildPayload(values);
  const formData = new FormData();

  formData.append("payload", JSON.stringify(payload));

  values.photos.forEach((photo) => {
    formData.append("photos[]", photo.file);
  });

  if (values.hasVideo && values.video) {
    formData.append("video", values.video.file);
  }

  return formData;
}

function useRequireAuth() {
  useEffect(() => {
    if (getStoredAuthSession()) return;
    storeLoginRedirectPath(`${window.location.pathname}${window.location.search}`);
    navigateTo("/login/phone");
  }, []);
}

function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <header className="shrink-0 bg-[#f0f0f0] pt-2 [direction:rtl]">
      <div className="flex h-20 items-center gap-2 px-4">
        <button
          aria-label="بازگشت"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.history.length > 1
              ? window.history.back()
              : navigateTo("/new-ad/category");
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 7l5 5-5 5M20 12H4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>

        <h1 className="m-0 min-w-0 flex-1 truncate text-right text-xl font-semibold leading-7 text-[#1a1a1a]">
          {title}
        </h1>
      </div>
    </header>
  );
}

function Section({
  title,
  icon,
  warning,
  children,
}: {
  title: string;
  icon: string;
  warning?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className="border-b-[10px] border-[#f0f0f0] bg-white px-4 py-7 text-right last:border-b-0 [direction:rtl]"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={`/icons/add_advertisement/${icon}`}
            alt=""
            className="h-6 w-6 shrink-0 object-contain"
          />

          <h2 className="m-0 min-w-0 truncate text-right font-semibold leading-7 text-[#1a1a1a]">
            {title}
          </h2>
        </div>

        {warning ? (
          <img src="/icons/add_advertisement/warning.svg" alt="" />
        ) : (
          <span className="h-7 w-7 shrink-0" />
        )}
      </div>

      {children}
    </section>
  );
}

function InputBox({ value, placeholder, leftText, numeric, onChange }: { value: string; placeholder: string; leftText?: string; numeric?: boolean; onChange: (value: string) => void }) {
  return (
    <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4] [direction:ltr]">
      {value ? (
        <button aria-label="پاک کردن" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#cccccc] text-[#a6a6a6]" onClick={() => onChange("")} type="button">×</button>
      ) : leftText ? <span className="shrink-0 text-[#a6a6a6]">{leftText}</span> : null}
      <input
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6] [direction:rtl]"
        inputMode={numeric ? "numeric" : "text"}
        onChange={(event) => onChange(numeric ? normalizeNumberInput(event.target.value) : event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function SelectBox({
  value,
  placeholder,
  onClick,
}: {
  value: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:rtl]"
      onClick={onClick}
      type="button"
    >
      <span
        className={`min-w-0 flex-1 truncate text-right ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value || placeholder}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[#4d4d4d]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 10l5 5 5-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function LocationBox({ value, label }: { value: string; label: string }) {
  return (
    <button
      className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:rtl]"
      onClick={() => {
        const search = window.location.search || `?label=${encodeURIComponent(label)}`;
        navigateTo(`/new-ad/location${search}`);
      }}
      type="button"
    >
      <span
        className={`min-w-0 flex-1 truncate text-right ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
          }`}
      >
        {value || "تعیین مکان"}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0 text-[#4d4d4d]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <button className="flex h-9 items-center gap-2 rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]" onClick={onRemove} type="button"><span>{label}</span><span className="text-base leading-none">×</span></button>;
}

function Chip({
  item,
  selected,
  onClick,
}: {
  item: ChipItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`flex h-9 items-center justify-center gap-1.5 rounded-[8px] border px-3 text-sm font-medium leading-5 transition-colors ${selected
        ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]"
        : "border-[#cccccc] bg-white text-[#4d4d4d]"
        }`}
      onClick={onClick}
      type="button"
    >
      <span>{item.label}</span>

      <FeaturesIcons
        feature={item.label}
        className={`h-5 w-5 shrink-0 object-contain transition-all ${selected
          ? "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(95%)_saturate(2950%)_hue-rotate(211deg)_brightness(88%)_contrast(105%)]"
          : "[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(178deg)_brightness(95%)_contrast(85%)]"
          }`}
      />
    </button>
  );
}

function SwitchButton({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      aria-checked={checked}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-out ${checked ? "bg-[#0048c4]" : "bg-[#d1d1d1]"
        }`}
      onClick={() => onChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={`absolute left-1 top-1 h-4 w-4 rounded-full transition-transform duration-200 ease-out ${checked
          ? "translate-x-5 bg-white"
          : "translate-x-0 bg-[#808080]"
          }`}
      />
    </button>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-16 items-center justify-between border-y border-[#cccccc] [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <span className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </span>
    </div>
  );
}

function Footer({
  primary,
  onPrimary,
  onBack,
}: {
  primary: string;
  onPrimary: () => void;
  onBack: () => void;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]">
      <button
        className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white [direction:rtl]"
        onClick={onPrimary}
        type="button"
      >
        <span>{primary}</span>
        <span className="text-xl leading-none">←</span>
      </button>

      <button
        className="flex h-12 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4] [direction:rtl]"
        onClick={onBack}
        type="button"
      >
        <span className="text-xl leading-none">→</span>
        <span>مرحله قبل</span>
      </button>
    </footer>
  );
}

function toggleArray(current: string[], id: string) {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}
function DetailsStep({
  label,
  onNext,
  onMoreFeatures,
}: {
  label: string;
  onNext: () => void;
  onMoreFeatures: () => void;
}) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [showAllHeating, setShowAllHeating] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const values = watch();
  const moreFeatureFields = getMoreFeatureFields();
  const moreFeatureTags = getMoreFeatureTags(values, moreFeatureFields);
  const initialVisibleChipCount = 8;

  const visibleHeating = showAllHeating
    ? heatingItems
    : heatingItems.slice(0, initialVisibleChipCount);

  const visibleFacilities = showAllFacilities
    ? facilityItems
    : facilityItems.slice(0, initialVisibleChipCount);

  const setField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => {
    setValue(key as never, value as never, { shouldDirty: true });
  };

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
        <Section icon="location.svg" title="موقعیت ملک">
          <LocationBox label={label} value={values.location} />
        </Section>

        <Section icon="info.svg" title="مشخصات ملک">
          <div className="space-y-4">
            <InputBox numeric leftText="متر مربع" onChange={(value) => setField("meterage", value)} placeholder="متراژ *" value={values.meterage} />
            <SelectBox
              onClick={() =>
                setSheet({
                  kind: "select",
                  key: "floor",
                  title: "طبقه",
                  options: floorOptions,
                })
              }
              placeholder="طبقه *"
              value={values.floor}
            />

            <SelectBox
              onClick={() =>
                setSheet({
                  kind: "select",
                  key: "rooms",
                  title: "تعداد اتاق",
                  options: roomOptions,
                })
              }
              placeholder="تعداد اتاق *"
              value={values.rooms}
            />

            <SelectBox
              onClick={() =>
                setSheet({
                  kind: "select",
                  key: "age",
                  title: "سن ساخت",
                  options: ["نوساز", "۱ سال", "۲ سال", "۵ سال", "۱۰ سال", "۱۵ سال+"],
                })
              }
              placeholder="سن ساخت *"
              value={values.age}
            />

            {moreFeatureTags.length ? (
              <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
                {moreFeatureTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex h-9 items-center rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {moreFeatureFields.length ? (
              <button
                className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]"
                onClick={onMoreFeatures}
                type="button"
              >
                <span>ثبت مشخصات بیشتر</span>
                <span>‹</span>
              </button>
            ) : null}
          </div>
        </Section>

        <Section icon="tempreture.svg" title="سرمایش و گرمایش">
          <div className="flex flex-wrap justify-start gap-2" dir="rtl">
            {visibleHeating.map((item) => (
              <Chip key={item.id} item={item} selected={values.heatingCooling.includes(item.id)} onClick={() => setField("heatingCooling", toggleArray(values.heatingCooling, item.id))} />
            ))}
          </div>
          {heatingItems.length > initialVisibleChipCount ? (
            <MoreButton
              count={heatingItems.length - initialVisibleChipCount}
              expanded={showAllHeating}
              onClick={() => setShowAllHeating((current) => !current)}
            />
          ) : null}
        </Section>

        <Section icon="features.svg" title="امکانات">
          <div className="flex flex-wrap justify-start gap-2" dir="rtl">
            {visibleFacilities.map((item) => (
              <Chip
                key={item.id}
                item={item}
                selected={values.facilities.includes(item.id)}
                onClick={() =>
                  setField("facilities", toggleArray(values.facilities, item.id))
                }
              />
            ))}
          </div>
          {facilityItems.length > initialVisibleChipCount ? (
            <MoreButton
              count={facilityItems.length - initialVisibleChipCount}
              expanded={showAllFacilities}
              onClick={() => setShowAllFacilities((current) => !current)}
            />
          ) : null}
        </Section>

        <Section icon="money.svg" title="اطلاعات قیمت">
          <div className="space-y-4">
            <InputBox numeric leftText="تومان" onChange={(value) => setField("price", value)} placeholder="قیمت *" value={values.price} />
            <Toggle checked={values.loanEnabled} label="وام دارد" onChange={(checked) => setField("loanEnabled", checked)} />
            {values.loanEnabled ? (
              <div className="space-y-3">
                <InputBox numeric leftText="تومان" onChange={(value) => setField("loanAmount", value)} placeholder="مبلغ وام" value={values.loanAmount} />
                <InputBox numeric leftText="تومان" onChange={(value) => setField("loanInstallment", value)} placeholder="قسط وام" value={values.loanInstallment} />
              </div>
            ) : null}
            <Toggle checked={values.exchangeEnabled} label="معاوضه می‌شود" onChange={(checked) => setField("exchangeEnabled", checked)} />
            {values.exchangeEnabled ? (
              <div className="rounded-[14px] border border-[#e0e0e0] px-4 py-4">
                <div className="mb-4 flex items-center justify-between text-base font-medium leading-6 [direction:rtl]">
                  <span className="[direction:rtl]">معاوضه با</span>

                  <button
                    className="flex items-center gap-1 text-[#0048c4]"
                    onClick={() =>
                      setSheet({
                        kind: "exchange",
                        title: "معاوضه با",
                        options: exchangeTargets,
                      })
                    }
                    type="button"
                  >
                    <span>انتخاب</span>
                    <span>‹</span>
                  </button>
                </div>
                {values.exchangeTargets.length ? (
                  <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                    {values.exchangeTargets.map((target) => <Tag key={target} label={target} onRemove={() => setField("exchangeTargets", values.exchangeTargets.filter((item) => item !== target))} />)}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </Section>
      </main>

      <Footer onBack={() => navigateTo("/new-ad/category")} onPrimary={onNext} primary="مرحله بعد" />

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-6"
        handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
        heightClassName="h-auto max-h-[calc(100dvh-102px)]"
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        panelPaddingClassName="pt-3"
        showBackButton={false}
        showHandle
        showHeader
        showHeaderDivider
        title={sheet?.title ?? "انتخاب"}
        titleAlign="center"
      >
        <BottomSheetActionList
          align="center"
          isOpen={Boolean(sheet)}
          items={(sheet?.options ?? []).map((option) => ({
            id: option,
            title: option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet) return;

            if (sheet.kind === "select") {
              setField(sheet.key, item.title);
              setSheet(null);
              return;
            }

            if (sheet.kind === "exchange") {
              setField(
                "exchangeTargets",
                toggleArray(values.exchangeTargets, item.title),
              );
            }
          }}
          selectedId={
            sheet?.kind === "select"
              ? values[sheet.key]
              : undefined
          }
          showCheckIcon={sheet?.kind === "exchange"}
          showDividers={false}
        />
      </BottomSheet>
    </>
  );
}

function MoreButton({
  count,
  expanded,
  onClick,
}: {
  count: number;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="mx-auto mt-5 flex h-9 items-center justify-center gap-1.5 rounded-full px-4 !text-sm !font-medium leading-5 text-[#0048C4] transition-colors active:bg-[#0048c40f]"
      onClick={onClick}
      type="button"
    >
      <span>
        {expanded ? "نمایش کمتر" : `نمایش ${count} مورد بیشتر`}
      </span>

      <svg
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d={expanded ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function CompactToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex h-14 items-center justify-between [direction:ltr]">
      <SwitchButton checked={checked} onChange={onChange} />

      <span className="text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
        {label}
      </span>
    </div>
  );
}

function MoreFeaturesFooter({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)] [direction:ltr]">
      <button
        className="h-12 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white"
        onClick={onConfirm}
        type="button"
      >
        تایید
      </button>

      <button
        className="h-12 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]"
        onClick={onCancel}
        type="button"
      >
        انصراف
      </button>
    </footer>
  );
}

function MoreFeaturesStep({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { getValues, setValue } = useFormContext<NewAdFormValues>();
  const fields = getMoreFeatureFields();

  const [sheet, setSheet] = useState<{
    key: MoreFeatureSelectKey;
    title: string;
  } | null>(null);

  const [draft, setDraft] = useState<MoreFeaturesFormValues>(() =>
    pickMoreFeatures(getValues()),
  );

  const setDraftField = (
    key: MoreFeatureFormKey,
    value: string | boolean,
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openSelect = (key: MoreFeatureSelectKey, title: string) => {
    setSheet({ key, title });
  };

  const getDraftString = (key: MoreFeatureFormKey) => {
    const value = draft[key];
    return typeof value === "string" ? value : "";
  };

  const commit = () => {
    moreFeatureKeys.forEach((key) => {
      setValue(key as never, draft[key] as never, { shouldDirty: true });
    });

    onConfirm();
  };

  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-6"
        dir="rtl"
      >
        {fields.length ? (
          <div className="space-y-5">
            {fields.map((field) => {
              if (field.control === "toggle") {
                return (
                  <CompactToggle
                    checked={Boolean(draft[field.key])}
                    key={field.key}
                    label={field.label}
                    onChange={(checked) => setDraftField(field.key, checked)}
                  />
                );
              }

              if (field.control === "number") {
                return (
                  <InputBox
                    key={field.key}
                    leftText={field.leftText}
                    numeric
                    onChange={(value) => setDraftField(field.key, value)}
                    placeholder={field.label}
                    value={getDraftString(field.key)}
                  />
                );
              }

              return (
                <SelectBox
                  key={field.key}
                  onClick={() => openSelect(field.key as MoreFeatureSelectKey, field.label)}
                  placeholder={field.label}
                  value={getDraftString(field.key)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-[12px] bg-[#f5f5f5] px-4 py-5 text-center text-sm leading-6 text-[#4d4d4d]">
            برای این دسته‌بندی مشخصات بیشتری تعریف نشده است.
          </div>
        )}
      </main>

      <MoreFeaturesFooter onCancel={onCancel} onConfirm={commit} />

      <BottomSheet
        ariaLabel={sheet?.title ?? "انتخاب"}
        className="rounded-t-[14px]"
        contentClassName="pt-0 pb-6"
        handleClassName="h-1 w-[42px] rounded-full bg-[#e0e0e0]"
        heightClassName="h-auto max-h-[calc(100dvh-102px)]"
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        panelPaddingClassName="pt-3"
        showBackButton={false}
        showHandle
        showHeader
        showHeaderDivider
        title={sheet?.title ?? "انتخاب"}
        titleAlign="center"
      >
        <BottomSheetActionList
          align="center"
          isOpen={Boolean(sheet)}
          items={(sheet ? moreFeatureOptions[sheet.key] : []).map((option) => ({
            id: option,
            title: option,
          }))}
          itemClassName="h-12 text-sm font-normal leading-5"
          onSelect={(item) => {
            if (!sheet) return;

            setDraftField(sheet.key, item.title);
            setSheet(null);
          }}
          selectedId={sheet ? getDraftString(sheet.key) : undefined}
          showDividers={false}
        />
      </BottomSheet>
    </>
  );
}

const allowedPhotoTypes = ["image/jpeg", "image/png"];
const allowedPhotoExtensions = ["jpg", "jpeg", "png"];
const allowedPhotoAccept = ".jpg,.jpeg,.png,image/jpeg,image/png";

const allowedVideoTypes = ["video/mp4"];
const allowedVideoExtensions = ["mp4"];
const allowedVideoAccept = ".mp4,video/mp4";

function createMediaId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function isAllowedFile(
  file: File,
  allowedTypes: string[],
  allowedExtensions: string[],
) {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}

function createUploadedMediaFile(file: File): UploadedMediaFile {
  return {
    id: createMediaId(),
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl: URL.createObjectURL(file),
    file,
  };
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function PhotoUploader() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createdPreviewUrls = useRef<string[]>([]);

  const photos = watch("photos") ?? [];

  useEffect(() => {
    return () => {
      createdPreviewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addPhotos = (fileList: FileList | null) => {
    const selectedFiles = Array.from(fileList ?? []);

    const validFiles = selectedFiles.filter((file) =>
      isAllowedFile(file, allowedPhotoTypes, allowedPhotoExtensions),
    );

    if (!validFiles.length) return;

    const newPhotos = validFiles.map((file) => {
      const mediaFile = createUploadedMediaFile(file);
      createdPreviewUrls.current.push(mediaFile.previewUrl);
      return mediaFile;
    });

    setValue("photos", [...photos, ...newPhotos], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removePhoto = (photoId: string) => {
    const targetPhoto = photos.find((photo) => photo.id === photoId);

    if (targetPhoto) {
      URL.revokeObjectURL(targetPhoto.previewUrl);
    }

    setValue(
      "photos",
      photos.filter((photo) => photo.id !== photoId),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="mb-3 text-right text-base font-medium leading-6 text-[#1a1a1a]">
        انتخاب عکس <span className="text-[#ff3b30]">*</span>
      </div>

      <input
        ref={inputRef}
        accept={allowedPhotoAccept}
        className="hidden"
        multiple
        onChange={(event) => {
          addPhotos(event.target.files);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      <div className="flex gap-3 overflow-x-auto pb-2" dir="rtl">
        <button
          className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#0048c4] bg-white text-[#0048c4]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span className="text-4xl font-light leading-none">+</span>
          <span className="text-sm font-medium leading-5">افزودن عکس</span>
        </button>

        {photos.map((photo, index) => (
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[12px]"
            key={photo.id}
          >
            <img
              alt={`عکس آگهی ${index + 1}`}
              className="h-full w-full object-cover"
              src={photo.previewUrl}
            />

            <button
              aria-label="حذف عکس"
              className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-sm leading-none text-[#ff3b30] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              onClick={() => removePhoto(photo.id)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoUploader() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const video = watch("video");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectVideo = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file) return;

    const isValidVideo = isAllowedFile(
      file,
      allowedVideoTypes,
      allowedVideoExtensions,
    );

    if (!isValidVideo) return;

    if (video) {
      URL.revokeObjectURL(video.previewUrl);
    }

    const mediaFile = createUploadedMediaFile(file);

    setValue("video", mediaFile, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setIsUploading(true);
    setProgress(18);

    window.setTimeout(() => setProgress(55), 180);
    window.setTimeout(() => setProgress(88), 360);
    window.setTimeout(() => {
      setProgress(100);
      setIsUploading(false);
    }, 560);
  };

  const removeVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.previewUrl);
    }

    setValue("video", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="pt-3" dir="rtl">
      <input
        ref={inputRef}
        accept={allowedVideoAccept}
        className="hidden"
        onChange={(event) => {
          selectVideo(event.target.files);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      {!video ? (
        <button
          className="flex h-12 mb-4 w-full items-center justify-between rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <div className="flex gap-2">
          <img src="/icons/video.svg" alt="" />
          <span>انتخاب فیلم</span>
          </div>

          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      ) : (
        <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-3 py-2">
          <div className="flex items-center justify-between gap-3 [direction:ltr]">
            <button
              aria-label="حذف فیلم"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#ff3b30]"
              onClick={removeVideo}
              type="button"
            >
              ×
            </button>

            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <div className="truncate text-xs font-medium leading-5 text-[#1a1a1a]">
                {isUploading ? "در حال آپلود..." : video.name}
              </div>

              <div className="text-[10px] leading-4 text-[#808080]">
                {formatFileSize(video.size)}
              </div>

              {isUploading ? (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e6e6e6]">
                  <div
                    className="h-full rounded-full bg-[#0048c4] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </div>

            {!isUploading ? (
              <button
                aria-label="نمایش فیلم"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0048c414] text-[#0048c4]"
                onClick={() => window.open(video.previewUrl, "_blank")}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function RadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border transition-all duration-200 ease-out ${checked
        ? "border-[#0048c4] bg-[#0048c4]"
        : "border-[#808080] bg-white"
        }`}
    >
      {checked ? (
        <span className="h-2 w-2 rounded-full bg-white" />
      ) : null}
    </span>
  );
}

function RadioCard({
  checked,
  label,
  badge,
  description,
  onClick,
}: {
  checked: boolean;
  label: string;
  badge?: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`w-full rounded-[12px] border px-4 py-4 text-right transition-all duration-200 ease-out [direction:ltr] ${checked ? "border-[#0048c4] bg-[#0048C414]" : "border-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center justify-between">
        <RadioIndicator checked={checked} />

        <span className="flex items-center gap-2  font-medium leading-7 text-[#1a1a1a] [direction:rtl]">
          <span className={`${checked && 'text-[#0048c4]'}`}>{label}</span>

          {badge ? (
            <span className="rounded-[4px] border border-[#11a366] px-2 py-0.5 text-sm font-medium leading-5 text-[#11a366]">
              {badge}
            </span>
          ) : null}
        </span>
      </div>

      <div
        className={`grid transition-all duration-200 ease-out ${checked && description
          ? "mt-3 grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="m-0 rounded-[10px] text-right text-sm font-normal leading-6 text-[#4B5070] [direction:rtl]">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function CheckRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button className="flex h-12 w-full items-center justify-start gap-3 text-right text-base font-medium leading-6 text-[#1a1a1a]" onClick={() => onChange(!checked)} type="button">
      <span className={`grid h-6 w-6 place-items-center rounded-lg border ${checked ? "border-[#0048C4] bg-[#0048C4] text-white" : "border-[#808080] bg-white"}`}>{checked ? <img src="/icons/checkTick.svg" alt="" /> : null}</span>
      <span>{label}</span>
    </button>
  );
}

function SocialInput({ value, placeholder, icon, onChange }: { value: string; placeholder: string; icon: "telegram" | "whatsapp"; onChange: (value: string) => void }) {
  return (
    <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4]" dir="rtl">
      <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
      <img src={`${icon === "telegram" ? '/icons/socials/telegram.svg' : '/icons/socials/whatsApp.svg'}`} alt="" />
    </label>
  );
}

function MediaStep({ label, onBack, onSubmit }: { label: string; onBack: () => void; onSubmit: () => void }) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const setField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => setValue(key as never, value as never, { shouldDirty: true });

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
        <Section icon="image.svg" title="عکس آگهی" warning>
          <PhotoUploader />
          <div className="mt-5">
            <Toggle
              checked={values.hasVideo}
              label="فیلم"
              onChange={(checked) => {
                setField("hasVideo", checked);

                if (!checked && values.video) {
                  URL.revokeObjectURL(values.video.previewUrl);
                  setField("video", null);
                }
              }}
            />

            {values.hasVideo ? <VideoUploader /> : null}

            <Toggle
              checked={values.hasVirtualTour}
              label="تور مجازی"
              onChange={(checked) => setField("hasVirtualTour", checked)}
            />
          </div>
        </Section>

        <Section icon="info.svg" title="اطلاعات آگهی" warning>
          <div className="space-y-4">
            <div>
              <div className="mb-3 text-right leading-7 text-[#1a1a1a]">ثبت کننده آگهی <span className="text-[#ff3b30]">*</span></div>
              <div className="space-y-3">
                <RadioCard
                  checked={values.registrantType === "personal"}
                  label="شخصی"
                  description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به صورت شخصی ثبت نمایید.
بعد از ثبت اطلاعات به صفحه وضعیت آگهی می‌شوید.`}
                  onClick={() => setField("registrantType", "personal")}
                />

                <RadioCard
                  badge="رایگان"
                  checked={values.registrantType === "agency"}
                  label="آژانس"
                  description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به آژانس املاکی مورد نظر خود بسپارید.
بعد از ثبت اطلاعات به صفحه انتخاب آژانس املاک هدایت می‌شوید.`}
                  onClick={() => setField("registrantType", "agency")}
                />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-2 flex items-center justify-start gap-1 font-semibold leading-7 text-[#1a1a1a]"><span>روش‌های ارتباطی <span className="text-[#ff3b30]">*</span></span><img src="/icons/add_advertisement/warning.svg" alt="" /></div>
              <CheckRow checked={values.chatEnabled} label="چت با کاربران" onChange={(checked) => setField("chatEnabled", checked)} />
              <CheckRow checked={values.phoneEnabled} label="شماره تماس" onChange={(checked) => setField("phoneEnabled", checked)} />
            </div>

            <div>
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">شبکه‌های اجتماعی</div>
              <div className="space-y-3">
                <SocialInput icon="telegram" onChange={(value) => setField("telegram", value)} placeholder="آیدی تلگرام خود را وارد کنید" value={values.telegram} />
                <SocialInput icon="whatsapp" onChange={(value) => setField("whatsapp", value)} placeholder="شماره واتساپ خود را بدون صفر وارد کنید" value={values.whatsapp} />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">عنوان آگهی <span className="text-[#ff3b30]">*</span></div>
              <InputBox onChange={(value) => setField("title", value)} placeholder={`مثال: ${label} ۱۲۰ متری، ۲ خوابه، طبقه اول`} value={values.title} />
            </div>

            <div>
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">توضیحات آگهی <span className="text-[#ff3b30]">*</span></div>
              <label className="block min-h-32 w-full rounded-[12px] border border-[#cccccc] bg-white px-4 py-3 text-right text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4]">
                <textarea className="min-h-24 w-full resize-none border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => setField("description", event.target.value)} placeholder="اطلاعات بیشتر را وارد کنید..." value={values.description} />
              </label>
            </div>
          </div>
        </Section>
      </main>
      <Footer onBack={onBack} onPrimary={onSubmit} primary="ثبت اطلاعات" />
    </>
  );
}
export function NewAdFlowPage() {
  const { label } = getParams();
  const [step, setStep] = useState<FlowStep>("details");
  const methods = useForm<NewAdFormValues>({ defaultValues: getDefaultValues(), mode: "onChange" });

  useRequireAuth();

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const safeDraft = {
        ...values,
        photos: [],
        video: null,
      };

      window.localStorage.setItem(draftKey, JSON.stringify(safeDraft));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  const submit = methods.handleSubmit((values) => {
    const payload = buildPayload(values);
    const formData = buildNewAdFormData(values);

    console.log("new-ad payload", payload);

    console.log(
      "new-ad formData",
      Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [
            key,
            {
              name: value.name,
              size: value.size,
              type: value.type,
            },
          ];
        }

        return [key, value];
      }),
    );

    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(locationKey);
    navigateTo("/account/ad-management/published");
  });

  const goToDetails = () => setStep("details");
  const headerTitle = step === "moreFeatures" ? "ویژگی‌های بیشتر" : "ثبت آگهی";

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <FormProvider {...methods}>
        <Header
          title={headerTitle}
          onBack={step === "moreFeatures" ? goToDetails : undefined}
        />

        {step === "details" ? (
          <DetailsStep
            label={label}
            onMoreFeatures={() => setStep("moreFeatures")}
            onNext={() => setStep("media")}
          />
        ) : step === "moreFeatures" ? (
          <MoreFeaturesStep
            onCancel={goToDetails}
            onConfirm={goToDetails}
          />
        ) : (
          <MediaStep
            label={label}
            onBack={goToDetails}
            onSubmit={submit}
          />
        )}
      </FormProvider>
    </PageFrame>
  );
}

export function NewAdLocationPage() {
  const label = new URLSearchParams(window.location.search).get("label") ?? "آگهی ملک";
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(window.localStorage.getItem(locationKey) ?? "");
  const locations = ["مشهد، صیاد شیرازی", "احمدآباد، خیابان عارف", "هاشمیه، بلوار هنرستان"].filter((item) => item.includes(query.trim()));

  useRequireAuth();

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <Header title="موقعیت ملک" />
      <main className="relative min-h-0 flex-1 bg-[#e9eef2]">
        <img alt="نقشه" className="absolute inset-0 h-full w-full object-cover" src="/figma/search/map-light.png" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-x-4 top-4 rounded-[14px] bg-white p-3 shadow-[0_8px_24px_rgba(26,26,26,0.12)]">
          <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#cccccc] px-3 text-right" dir="rtl">
            <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-[#808080]" fill="none" viewBox="0 0 24 24"><path d="M11 19a8 8 0 1 1 5.657-2.343L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
            <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" value={query} />
          </label>
          <div className="mt-3 space-y-2">
            {locations.map((item) => (
              <button className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-right text-sm font-medium leading-5 ${selectedLocation === item ? "bg-[#0048c414] text-[#0048c4]" : "bg-white text-[#1a1a1a]"}`} key={item} onClick={() => setSelectedLocation(item)} type="button">
                <span>{item}</span><span className="text-[#808080]">⌖</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0048c4] text-white shadow-[0_8px_18px_rgba(0,72,196,0.35)]">⌖</div>
      </main>
      <footer className="shrink-0 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)]">
        <button
          className="h-12 w-full rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white disabled:bg-[#e0e0e0] disabled:text-[#a6a6a6]"
          disabled={!selectedLocation}
          onClick={() => {
            window.localStorage.setItem(locationKey, selectedLocation);
            navigateTo(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`);
          }}
          type="button"
        >
          تایید موقعیت
        </button>
      </footer>
    </PageFrame>
  );
}
