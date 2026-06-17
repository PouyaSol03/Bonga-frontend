import { useEffect, useState, type ReactNode } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { PageFrame } from "../../app/PageFrame";
import { BottomSheet } from "../../components/BottomSheet";
import { FeaturesIcons } from "../../components/FeaturesIcons";
import { getStoredAuthSession, storeLoginRedirectPath } from "../../auth/auth-storage";

type FlowStep = "details" | "media";
type RegistrantType = "" | "personal" | "agency";
type SelectKey = "floor" | "rooms" | "age";

type ChipItem = { id: string; label: string; icon?: string };

type NewAdFormValues = {
  location: string;
  meterage: string;
  floor: string;
  rooms: string;
  age: string;
  selectedSpecs: string[];
  heatingCooling: string[];
  facilities: string[];
  price: string;
  loanEnabled: boolean;
  loanAmount: string;
  loanInstallment: string;
  exchangeEnabled: boolean;
  exchangeTargets: string[];
  photos: string[];
  hasVideo: boolean;
  hasVirtualTour: boolean;
  registrantType: RegistrantType;
  chatEnabled: boolean;
  phoneEnabled: boolean;
  telegram: string;
  whatsapp: string;
  title: string;
  description: string;
};

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
  hasVirtualTour: false,
  registrantType: "",
  chatEnabled: false,
  phoneEnabled: false,
  telegram: "",
  whatsapp: "",
  title: "",
  description: "",
};

const propertySpecs: ChipItem[] = [
  { id: "total-floors", label: "تعداد کل طبقات" },
  { id: "furnished", label: "با لوازم و مبله شده" },
  { id: "facade", label: "جنس نما" },
  { id: "floor-material", label: "جنس کف" },
];

const heatingItems: ChipItem[] = [
  { id: "gas-cooler", label: "کولر گازی", icon: "▤" },
  { id: "water-cooler", label: "کولر آبی", icon: "▥" },
  { id: "package", label: "پکیج", icon: "▣" },
  { id: "radiator", label: "رادیاتور", icon: "▦" },
  { id: "heater", label: "بخاری", icon: "▧" },
  { id: "water-heater", label: "آبگرمکن", icon: "▨" },
  { id: "floor-heating", label: "گرمایش از کف", icon: "▩" },
  { id: "fan-coil", label: "فن کوئل", icon: "▤" },
  { id: "chiller", label: "چیلر", icon: "▥" },
  { id: "split", label: "اسپلیت", icon: "▣" },
  { id: "fireplace", label: "شوفاژ", icon: "▦" },
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

const photoUrls = ["/figma/search/apartment-kitchen.png", "/figma/view-ad-gallery.png", "/figma/view-ad-album.png"];
const exchangeTargets = ["خودرو", "زمین", "واحد مسکونی"];

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
  return { ...blankValues, ...getDraft(), location: window.localStorage.getItem(locationKey) ?? "" };
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
      photos: values.photos,
      has_video: values.hasVideo,
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

function useRequireAuth() {
  useEffect(() => {
    if (getStoredAuthSession()) return;
    storeLoginRedirectPath(`${window.location.pathname}${window.location.search}`);
    navigateTo("/login/phone");
  }, []);
}

function Header({ title }: { title: string }) {
  return (
    <header className="shrink-0 bg-[#f0f0f0] pt-2" dir="rtl">
      <div className="flex h-20 items-center gap-2 px-4">
        <h1 className="m-0 min-w-0 flex-1 truncate text-right text-xl font-semibold leading-7 text-[#1a1a1a]">{title}</h1>
        <button
          aria-label="بازگشت"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#4d4d4d] active:bg-[#1a1a1a0a]"
          onClick={() => (window.history.length > 1 ? window.history.back() : navigateTo("/new-ad/category"))}
          type="button"
        >
          <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
            <path d="M9 7l-5 5 5 5M4 12h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function Section({ title, icon, warning, children }: { title: string; icon: ReactNode; warning?: boolean; children: ReactNode }) {
  return (
    <section className="border-b-[10px] border-[#f0f0f0] bg-white px-4 py-7 last:border-b-0" dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-[#808080] text-base font-semibold leading-none text-[#808080]">{icon}</span>
          <h2 className="m-0 text-right text-xl font-semibold leading-7 text-[#1a1a1a]">{title}</h2>
        </div>
        {warning ? <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#a6a6a6] text-base font-semibold leading-none text-[#808080]">!</span> : <span className="h-7 w-7" />}
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

function SelectBox({ value, placeholder, onClick }: { value: string; placeholder: string; onClick: () => void }) {
  return (
    <button className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:ltr]" onClick={onClick} type="button">
      <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
      <span className={`min-w-0 flex-1 truncate text-right [direction:rtl] ${value ? "text-[#1a1a1a]" : "text-[#808080]"}`}>{value || placeholder}</span>
    </button>
  );
}

function LocationBox({ value, label }: { value: string; label: string }) {
  return (
    <button className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] [direction:ltr]" onClick={() => {
        const search = window.location.search || `?label=${encodeURIComponent(label)}`;
        navigateTo(`/new-ad/location${search}`);
      }} type="button">
      <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-[#4d4d4d]" fill="none" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
      <span className={`min-w-0 flex-1 truncate text-right [direction:rtl] ${value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"}`}>{value || "تعیین مکان"}</span>
    </button>
  );
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <button className="flex h-9 items-center gap-2 rounded-[7px] border border-[#0048c4] bg-[#0048c41f] px-3 text-sm font-medium leading-5 text-[#0048c4]" onClick={onRemove} type="button"><span>{label}</span><span className="text-base leading-none">×</span></button>;
}

function Chip({ item, selected, mapped, onClick }: { item: ChipItem; selected: boolean; mapped?: boolean; onClick: () => void }) {
  return (
    <button aria-pressed={selected} className={`flex h-9 items-center justify-center gap-1.5 rounded-[8px] border px-3 text-sm font-medium leading-5 transition-colors ${selected ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]" : "border-[#cccccc] bg-white text-[#4d4d4d]"}`} onClick={onClick} type="button">
      <span>{item.label}</span>
      {mapped ? <FeaturesIcons feature={item.label} className="h-5 w-5 shrink-0 object-contain" /> : item.icon ? <span className="text-base leading-none text-[#808080]">{item.icon}</span> : null}
    </button>
  );
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex h-16 items-center justify-between border-t border-[#cccccc] first:border-t-0 [direction:ltr]">
      <button aria-checked={checked} className={`relative h-8 w-14 rounded-full transition-colors ${checked ? "bg-[#0048c4]" : "bg-[#e0e0e0]"}`} onClick={() => onChange(!checked)} role="switch" type="button">
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${checked ? "right-7" : "right-1 bg-[#808080]"}`} />
      </button>
      <span className="text-right text-lg font-semibold leading-7 text-[#1a1a1a] [direction:rtl]">{label}</span>
    </div>
  );
}

function Footer({ primary, onPrimary, onBack }: { primary: string; onPrimary: () => void; onBack: () => void }) {
  return (
    <footer className="grid shrink-0 grid-cols-2 gap-3 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)]" dir="rtl">
      <button className="flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white" onClick={onPrimary} type="button"><span>{primary}</span><span>←</span></button>
      <button className="flex h-12 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white text-base font-medium leading-6 text-[#0048c4]" onClick={onBack} type="button"><span>→</span><span>مرحله قبل</span></button>
    </footer>
  );
}

function toggleArray(current: string[], id: string) {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
}
function DetailsStep({ label, onNext }: { label: string; onNext: () => void }) {
  const { getValues, setValue, watch } = useFormContext<NewAdFormValues>();
  const [sheet, setSheet] = useState<{ key: SelectKey; title: string; options: string[] } | null>(null);
  const [showAllHeating, setShowAllHeating] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const values = watch();
  const visibleHeating = showAllHeating ? heatingItems : heatingItems.slice(0, 6);
  const visibleFacilities = showAllFacilities ? facilityItems : facilityItems.slice(0, 6);

  const setField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => {
    setValue(key as never, value as never, { shouldDirty: true });
  };

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
        <Section icon="⌖" title="موقعیت ملک">
          <LocationBox label={label} value={values.location} />
        </Section>

        <Section icon="i" title="مشخصات ملک">
          <div className="space-y-4">
            <InputBox numeric leftText="متر مربع" onChange={(value) => setField("meterage", value)} placeholder="متراژ *" value={values.meterage} />
            <SelectBox onClick={() => setSheet({ key: "floor", title: "طبقه", options: ["همکف", "۱", "۲", "۳", "۴", "۵", "۶", "۷"] })} placeholder="طبقه *" value={values.floor} />
            <SelectBox onClick={() => setSheet({ key: "rooms", title: "تعداد اتاق", options: ["بدون اتاق", "۱", "۲", "۳", "۴", "۵+"] })} placeholder="تعداد اتاق *" value={values.rooms} />
            <SelectBox onClick={() => setSheet({ key: "age", title: "سن ساخت", options: ["نوساز", "۱ سال", "۲ سال", "۵ سال", "۱۰ سال", "۱۵ سال+"] })} placeholder="سن ساخت *" value={values.age} />

            {values.selectedSpecs.length ? (
              <div className="flex flex-wrap justify-start gap-2 pt-2" dir="rtl">
                {propertySpecs.filter((item) => values.selectedSpecs.includes(item.id)).map((item) => (
                  <Tag key={item.id} label={item.label} onRemove={() => setField("selectedSpecs", values.selectedSpecs.filter((id) => id !== item.id))} />
                ))}
              </div>
            ) : null}

            <button className="mx-auto flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]" onClick={() => setField("selectedSpecs", propertySpecs.map((item) => item.id))} type="button">
              <span>ویرایش مشخصات</span><span>‹</span>
            </button>
          </div>
        </Section>

        <Section icon="♨" title="سرمایش و گرمایش">
          <div className="flex flex-wrap justify-start gap-2" dir="rtl">
            {visibleHeating.map((item) => (
              <Chip key={item.id} item={item} selected={values.heatingCooling.includes(item.id)} onClick={() => setField("heatingCooling", toggleArray(values.heatingCooling, item.id))} />
            ))}
          </div>
          {!showAllHeating ? <MoreButton count={heatingItems.length - visibleHeating.length} onClick={() => setShowAllHeating(true)} /> : null}
        </Section>

        <Section icon="⚙" title="امکانات">
          <div className="flex flex-wrap justify-start gap-2" dir="rtl">
            {visibleFacilities.map((item) => (
              <Chip key={item.id} item={item} mapped selected={values.facilities.includes(item.id)} onClick={() => setField("facilities", toggleArray(values.facilities, item.id))} />
            ))}
          </div>
          {!showAllFacilities ? <MoreButton count={facilityItems.length - visibleFacilities.length} onClick={() => setShowAllFacilities(true)} /> : null}
        </Section>

        <Section icon="▣" title="اطلاعات قیمت">
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
                <div className="mb-4 flex items-center justify-between text-base font-medium leading-6 [direction:ltr]">
                  <button
                    className="flex items-center gap-1 text-[#0048c4]"
                    onClick={() => {
                      const current = getValues("exchangeTargets");
                      const next = exchangeTargets.find((item) => !current.includes(item));
                      if (next) setField("exchangeTargets", [...current, next]);
                    }}
                    type="button"
                  >
                    <span>‹</span><span>انتخاب</span>
                  </button>
                  <span className="[direction:rtl]">معاوضه با</span>
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

      <BottomSheet ariaLabel={sheet?.title ?? "انتخاب"} heightClassName="h-auto max-h-[75dvh]" isOpen={Boolean(sheet)} onClose={() => setSheet(null)} title={sheet?.title ?? "انتخاب"}>
        <div className="max-h-[56dvh] overflow-y-auto px-4 pb-4 pt-2" dir="rtl">
          {(sheet?.options ?? []).map((option) => (
            <button
              className="flex h-12 w-full items-center justify-start border-b border-[#e0e0e0] text-right text-base font-medium leading-6 text-[#1a1a1a] last:border-b-0"
              key={option}
              onClick={() => {
                if (!sheet) return;
                setField(sheet.key, option);
                setSheet(null);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}

function MoreButton({ count, onClick }: { count: number; onClick: () => void }) {
  return <button className="mx-auto mt-6 flex h-9 items-center justify-center gap-2 text-base font-medium leading-6 text-[#0048c4]" onClick={onClick} type="button"><span>نمایش {count} مورد دیگر</span><span>⌄</span></button>;
}

function PhotoUploader() {
  const { getValues, setValue, watch } = useFormContext<NewAdFormValues>();
  const photos = watch("photos");

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="mb-3 text-right text-base font-medium leading-6 text-[#1a1a1a]">انتخاب عکس <span className="text-[#ff3b30]">*</span></div>
      <div className="flex gap-3 overflow-x-auto pb-2" dir="rtl">
        <button
          className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#0048c4] bg-white text-[#0048c4]"
          onClick={() => {
            const current = getValues("photos");
            setValue("photos", [...current, photoUrls[current.length % photoUrls.length]], { shouldDirty: true });
          }}
          type="button"
        >
          <span className="text-4xl font-light leading-none">+</span><span className="text-sm font-medium leading-5">افزودن عکس</span>
        </button>
        {photos.map((photo, index) => <img alt={`عکس آگهی ${index + 1}`} className="h-28 w-28 shrink-0 rounded-[12px] object-cover" key={`${photo}-${index}`} src={photo} />)}
      </div>
    </div>
  );
}

function RadioCard({ checked, label, badge, onClick }: { checked: boolean; label: string; badge?: string; onClick: () => void }) {
  return (
    <button aria-pressed={checked} className="flex h-16 w-full items-center justify-between rounded-[12px] border border-[#cccccc] bg-white px-4 text-right text-lg font-medium leading-7 text-[#1a1a1a] [direction:ltr]" onClick={onClick} type="button">
      <span className={`grid h-7 w-7 place-items-center rounded-full border ${checked ? "border-[#0048c4]" : "border-[#808080]"}`}>{checked ? <span className="h-3.5 w-3.5 rounded-full bg-[#0048c4]" /> : null}</span>
      <span className="flex items-center gap-2 [direction:rtl]"><span>{label}</span>{badge ? <span className="rounded-[4px] border border-[#11a366] px-2 py-0.5 text-sm font-medium leading-5 text-[#11a366]">{badge}</span> : null}</span>
    </button>
  );
}

function CheckRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return (
    <button className="flex h-12 w-full items-center justify-start gap-3 text-right text-base font-medium leading-6 text-[#1a1a1a]" onClick={() => onChange(!checked)} type="button">
      <span className={`grid h-6 w-6 place-items-center rounded-[5px] border ${checked ? "border-[#0048c4] bg-[#0048c4] text-white" : "border-[#808080] bg-white"}`}>{checked ? "✓" : null}</span>
      <span>{label}</span>
    </button>
  );
}

function SocialInput({ value, placeholder, icon, onChange }: { value: string; placeholder: string; icon: "telegram" | "whatsapp"; onChange: (value: string) => void }) {
  const color = icon === "telegram" ? "bg-[#2aabee]" : "bg-[#25d366]";
  const text = icon === "telegram" ? "↗" : "☏";
  return (
    <label className="flex h-14 w-full items-center gap-3 rounded-[12px] border border-[#cccccc] bg-white px-4 text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4]" dir="rtl">
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm text-white ${color}`}>{text}</span>
      <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} />
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
        <Section icon="▧" title="عکس آگهی" warning>
          <PhotoUploader />
          <div className="mt-5">
            <Toggle checked={values.hasVideo} label="فیلم" onChange={(checked) => setField("hasVideo", checked)} />
            <Toggle checked={values.hasVirtualTour} label="تور مجازی" onChange={(checked) => setField("hasVirtualTour", checked)} />
          </div>
        </Section>

        <Section icon="i" title="اطلاعات آگهی" warning>
          <div className="space-y-4">
            <div>
              <div className="mb-3 text-right text-lg font-semibold leading-7 text-[#1a1a1a]">ثبت کننده آگهی <span className="text-[#ff3b30]">*</span></div>
              <div className="space-y-3">
                <RadioCard checked={values.registrantType === "personal"} label="شخصی" onClick={() => setField("registrantType", "personal")} />
                <RadioCard badge="رایگان" checked={values.registrantType === "agency"} label="آژانس" onClick={() => setField("registrantType", "agency")} />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-2 flex items-center justify-start gap-2 text-lg font-semibold leading-7 text-[#1a1a1a]"><span className="grid h-7 w-7 place-items-center rounded-full border border-[#a6a6a6] text-[#808080]">!</span><span>روش‌های ارتباطی</span><span className="text-[#ff3b30]">*</span></div>
              <CheckRow checked={values.chatEnabled} label="چت با کاربران" onChange={(checked) => setField("chatEnabled", checked)} />
              <CheckRow checked={values.phoneEnabled} label="شماره تماس" onChange={(checked) => setField("phoneEnabled", checked)} />
            </div>

            <div>
              <div className="mb-3 text-right text-lg font-semibold leading-7 text-[#1a1a1a]">شبکه‌های اجتماعی</div>
              <div className="space-y-3">
                <SocialInput icon="telegram" onChange={(value) => setField("telegram", value)} placeholder="آیدی تلگرام خود را وارد کنید" value={values.telegram} />
                <SocialInput icon="whatsapp" onChange={(value) => setField("whatsapp", value)} placeholder="شماره واتساپ خود را بدون صفر وارد کنید" value={values.whatsapp} />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-3 text-right text-lg font-semibold leading-7 text-[#1a1a1a]">عنوان آگهی <span className="text-[#ff3b30]">*</span></div>
              <InputBox onChange={(value) => setField("title", value)} placeholder={`مثال: ${label} ۱۲۰ متری، ۲ خوابه، طبقه اول`} value={values.title} />
            </div>

            <div>
              <div className="mb-3 text-right text-lg font-semibold leading-7 text-[#1a1a1a]">توضیحات آگهی <span className="text-[#ff3b30]">*</span></div>
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
      window.localStorage.setItem(draftKey, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const submit = methods.handleSubmit((values) => {
    const payload = buildPayload(values);
    console.log("new-ad payload", payload);
    window.localStorage.removeItem(draftKey);
    window.localStorage.removeItem(locationKey);
    navigateTo("/account/ad-management/published");
  });

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <FormProvider {...methods}>
        <Header title="ثبت آگهی" />
        {step === "details" ? <DetailsStep label={label} onNext={() => setStep("media")} /> : <MediaStep label={label} onBack={() => setStep("details")} onSubmit={submit} />}
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
