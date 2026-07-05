import { useState, type ReactNode } from "react";
import { AdCard } from "../../components/AdCard";
import type { AdCardData } from "../../components/AdCard";
import { BottomSheet } from "../../components/BottomSheet";

import LinearAdd from "../../components/(icons)/LinearAdd";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearCalendar from "../../components/(icons)/LinearCalendar";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearFilterHorizontal from "../../components/(icons)/LinearFilterHorizontal";
import LinearLocation from "../../components/(icons)/LinearLocation";
import LinearQrCode from "../../components/(icons)/LinearQrCode";
import LinearRanking from "../../components/(icons)/LinearRanking";
import LinearSearch from "../../components/(icons)/LinearSearch";
import LinearShare from "../../components/(icons)/LinearShare";
import LinearStar from "../../components/(icons)/LinearStar";
import LinearTag from "../../components/(icons)/LinearTag";
import { TopBar } from "../../components/TopBar";

const agencyEditPath = "/account/dashboard/agency";
const agencyLogoSrc = "/figma/agency-preview/agency-logo.png";
const listingImageSrc = "/figma/agency-preview/listing-kitchen.png";

const agencyContactInfo = {
  phone: "۰۹۱۵۱۲۳۴۵۶۷",
  whatsapp: "09151234567",
  telegram: "agency_jalilian",
  instagram: "agency_jalilian",
};

const agencyAds: AdCardData[] = [
  {
    id: 1,
    agency: "دفتر املاک شریعت زاده",
    status: "",
    imageCount: "۵",
    priceLabelPrimary: "",
    pricePrimary: "۳/۸۵۰ میلیارد",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار رحیمی",
    timeAndLocation: "۱ ساعت پیش در الهیه",
    imageClassName: "",
    imageUrl: listingImageSrc,
    badges: ["فوری"],
  },
  {
    id: 2,
    agency: "دفتر املاک شریعت زاده",
    status: "",
    imageCount: "۵",
    priceLabelPrimary: "",
    pricePrimary: "۳/۸۵۰ میلیارد",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار رحیمی",
    timeAndLocation: "۱ ساعت پیش در الهیه",
    imageClassName: "",
    imageUrl: listingImageSrc,
    badges: ["فوری"],
  },
  {
    id: 3,
    agency: "دفتر املاک شریعت زاده",
    status: "",
    imageCount: "۵",
    priceLabelPrimary: "",
    pricePrimary: "۳/۸۵۰ میلیارد",
    priceLabelSecondary: "",
    priceSecondary: "",
    area: "۱۱۰ متر",
    rooms: "۲ اتاق",
    year: "۱۴۰۰",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار رحیمی",
    timeAndLocation: "۱ ساعت پیش در الهیه",
    imageClassName: "",
    imageUrl: listingImageSrc,
    badges: ["فوری"],
  },
];

type AgencyPreviewTab = "info" | "ads" | "consultants";

const agencyStats = [
  { icon: <LinearStar className="h-5 w-5" />, label: "امتیاز", value: "۸۵" },
  { icon: <LinearRanking className="h-5 w-5" />, label: "رتبه", value: "۱۲" },
  { icon: <LinearTag className="h-5 w-5" />, label: "آگهی فعال", value: "۲۷۳" },
];

const badgeCards = [
  { src: "/figma/agency-preview/badge-cup.png", alt: "نشان جام" },
  { src: "/figma/agency-preview/badge-first.png", alt: "نشان رتبه یک" },
  { src: "/figma/agency-preview/badge-bookmark.png", alt: "نشان نشانک" },
  { src: "/figma/agency-preview/badge-chat.png", alt: "نشان گفتگو" },
];

const agencyTabs: { id: AgencyPreviewTab; label: string }[] = [
  { id: "consultants", label: "مشاوران" },
  { id: "ads", label: "آگهی‌ها" },
  { id: "info", label: "اطلاعات" },
];

export function AgencyPreviewPage() {
  const [activeTab, setActiveTab] = useState<AgencyPreviewTab>("info");
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <TopBar
        actions={[
          {
            id: "share",
            label: "اشتراک‌گذاری",
            icon: <LinearShare className="h-6 w-6" />,
          },
          {
            id: "qr-code",
            label: "کد QR",
            icon: <LinearQrCode className="h-6 w-6" />,
          },
        ]}
        backTo={agencyEditPath}
        contentClassName="px-1"
        title="صفحه آژانس"
      />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[84px]">
        <AgencyHero />
        <AgencySegmentedTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "ads" ? <AgencyAdsTab /> : activeTab === "consultants" ? <AgencyConsultantsTab /> : <AgencyInfoTab />}
      </main>
      <AgencyPreviewFooter onContactClick={() => setIsContactSheetOpen(true)} />
      <AgencyContactBottomSheet
        contactInfo={agencyContactInfo}
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
      />
    </div>
  );
}

function AgencyHero() {
  return (
    <section className="bg-white px-4 pb-4 pt-3 text-center">
      <img alt="لوگوی املاک جلیلیان" className="mx-auto h-19 w-19 object-contain" src={agencyLogoSrc} />
      <h2 className="m-0 mt-1 text-2xl font-bold leading-9 text-[#4d4d4d]">املاک جلیلیان</h2>
      <div className="mx-auto mt-1 inline-flex h-7 items-center gap-1 rounded-full bg-[#e7e8ed] font-medium px-2.5 text-xs text-[#4B5070]">
        <LinearLocation className="h-4 w-4 text-[#4B5070]" />
        صیاد شیرازی
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-x-reverse divide-[#dddddd] text-[#4d4d4d]">
        {agencyStats.map((item) => (
          <div className="grid gap-1 text-center" key={item.label}>
            <span className="mx-auto inline-flex items-center gap-1 text-xs">
              {item.icon}
              {item.label}
            </span>
            <strong className="text-sm font-bold leading-5 text-[#1a1a1a]">{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgencySegmentedTabs({
  activeTab,
  onChange,
}: {
  activeTab: AgencyPreviewTab;
  onChange: (tab: AgencyPreviewTab) => void;
}) {
  return (
    <div className="bg-white shadow-lg px-4 pb-4">
      <div className="grid h-10 grid-cols-3 overflow-hidden rounded-xl border border-[#808080] bg-white text-sm font-semibold leading-5 text-[#4d4d4d]">
        {agencyTabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              aria-pressed={isActive}
              className={`h-full transition-colors ${isActive ? "bg-[#dfe8fa] text-[#0048c4]" : "bg-white text-[#4d4d4d]"}`}
              key={tab.id}
              onClick={() => onChange(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgencyInfoTab() {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <div className="space-y-2 bg-[#f0f0f0]">
      <section className="bg-white px-4 py-4">
        <h3 className="m-0 text-right font-semibold leading-6">نشان‌ها</h3>
        <div className="mt-4 flex gap-3 overflow-x-auto px-4 pb-1 [direction:rtl]">
          {badgeCards.map((badge) => (
            <BadgeCard alt={badge.alt} key={badge.alt} src={badge.src} />
          ))}
        </div>
      </section>

      <section className="bg-white p-4">
        <h3 className="m-0 text-base font-semibold leading-6">محدوده فعالیت</h3>
        <p className="m-0 mt-4 text-sm font-normal leading-7 text-[#4d4d4d]">
          صیاد شیرازی، شهید قانع، هفت تیر، سید رضی، بلوار معلم،
          <br />
          بلوار دانشجو، وکیل آباد، فارغ التحصیلان
        </p>
      </section>

      <AgencyActionRow icon={<LinearAdd className="h-6 w-6" />} title="ثبت آگهی رایگان" />
      <AgencyActionRow icon={<LinearCalendar className="h-6 w-6" />} title="ثبت بازخورد" />

      <section className="bg-white px-4 pb-7 pt-7 text-center">
        <h3 className="m-0 text-right text-base font-semibold leading-6">درباره املاک جلیلیان</h3>
        <img src="/vectors/Bonga.svg" alt="" />
        <p className="m-0 mt-5 text-right font-normal leading-8 text-[#4d4d4d]">
          کارگزاری املاک جلیلیان از سال ۱۳۷۰ تحت نام املاک آشتیانه در مشهد مقدس با مدیریت مرحوم محمد جلیلیان فعالیت خود در زمینه فروش و اجاره املاک و مستغلات را آغاز نمود. سال های بعد با گسترش فعالیت ها و به منظور ارتقاء خدمات کیفی و کمی در سال ۱۳۸۸ به املاک عاقبتی تغییر نام داد، در حال حاضر نیز برند املاک جلیلیان تحت مدیریت جواد جلیلیان به عنوان نام و علامت ثبت شده در رشته املاک در مشهد و سراسر ایران فعالیت می‌نماید.
        </p>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isAboutExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
        >
          <div className="overflow-hidden">
            <p className="m-0 mt-2 text-center text-sm font-normal leading-6 text-[#d0d0d0]">
              این مجموعه عضو رسمی درجه یک اتحادیه صنف مشاورین املاک است.
            </p>
          </div>
        </div>

        <button
          aria-expanded={isAboutExpanded}
          className="mx-auto mt-2 inline-flex items-center gap-1 text-xs font-semibold leading-4 text-[#0048c4]"
          onClick={() => setIsAboutExpanded((prev) => !prev)}
          type="button"
        >
          <LinearArrowDown1
            className={`h-4 w-4 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""
              }`}
          />
          {isAboutExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </button>
      </section>
    </div>
  );
}

function BadgeCard({ alt, src }: { alt: string; src: string }) {
  return (
    <article className="grid h-[62px] w-[70px] shrink-0 place-items-center rounded-lg border border-[#EBEBEB] bg-white shadow-[0_1px_0_rgba(26,26,26,0.03)]">
      <div className="relative grid h-full w-full justify-items-center overflow-hidden rounded-lg">
        <img alt={alt} className="mt-1 h-8 w-8 object-contain" src={src} />
        <div className="w-full bottom-1.5 right-2 flex justify-center gap-0.5 text-[10px] text-[#d9d9d9] [direction:ltr]">
          <LinearStar innerColor="#FFB100" className="w-2.5 h-2.5 text-[#FFB100]" />
          <LinearStar innerColor="#FFB100" className="w-2.5 h-2.5 text-[#FFB100]" />
          <LinearStar innerColor="#FFB100" className="w-2.5 h-2.5 text-[#FFB100]" />
        </div>
      </div>
    </article>
  );
}

function AgencyActionRow({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <button className="flex w-full items-center gap-3 bg-white p-4 text-right" type="button">
      <span className="grid h-7 w-7 place-items-center text-[#4d4d4d]">{icon}</span>
      <span className="min-w-0 flex-1 text-base font-semibold leading-6 text-[#1a1a1a]">{title}</span>
      <LinearArrowLeft1 className="h-6 w-6 text-[#4d4d4d]" />
    </button>
  );
}

function AgencyAdsTab() {
  return (
    <div className="space-y-2 bg-[#f0f0f0] px-0 pb-3 pt-5">
      <div className="flex items-center gap-2 px-4 [direction:ltr]">
        <button
          aria-label="فیلتر آگهی‌ها"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#0062ff] bg-[#eaf2ff] text-[#0062ff]"
          type="button"
        >
          <LinearFilterHorizontal className="h-6 w-6" />
        </button>
        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#a6a6a6] bg-white px-3 [direction:rtl]">
          <LinearSearch className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
            placeholder="جستجو در آگهی‌ها"
            type="search"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        {agencyAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} to={`/ads/${ad.id}`} />
        ))}
      </div>
    </div>
  );
}


function AgencyConsultantsTab() {
  return (
    <section className="bg-white px-4 py-8 text-center">
      <h3 className="m-0 text-right text-base font-semibold leading-6">مشاوران املاک جلیلیان</h3>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { name: "ناصر اشرفی", role: "مشاور مستقل", img: "/figma/consultants/consultant-naser.png" },
          { name: "محمد جلیلیان", role: "مشاور فروش", img: "/figma/consultants/consultant-mohammad.png" },
        ].map((consultant) => (
          <article className="rounded-2xl border border-[#eeeeee] bg-white p-3 text-center shadow-[0_2px_8px_rgba(26,26,26,0.04)]" key={consultant.name}>
            <img alt={consultant.name} className="mx-auto h-16 w-16 rounded-full object-cover" src={consultant.img} />
            <h4 className="m-0 mt-3 text-sm font-bold leading-5">{consultant.name}</h4>
            <p className="m-0 mt-1 text-xs font-normal leading-5 text-[#808080]">{consultant.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AgencyContactBottomSheet({
  contactInfo,
  isOpen,
  onClose,
}: {
  contactInfo: typeof agencyContactInfo;
  isOpen: boolean;
  onClose: () => void;
}) {
  const phoneHref = toEnglishDigits(contactInfo.phone).replace(/[^\d+]/g, "");
  const socialLinks = [
    { label: "واتساپ", href: normalizeSocialUrl("whatsapp", contactInfo.whatsapp) },
    { label: "تلگرام", href: normalizeSocialUrl("telegram", contactInfo.telegram) },
    { label: "اینستاگرام", href: normalizeSocialUrl("instagram", contactInfo.instagram) },
  ].filter((item) => item.href);

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-5 pb-5"
      heightClassName="h-auto max-h-[calc(100dvh-88px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="اطلاعات تماس"
    >
      <div className="flex h-14 items-center justify-between [direction:ltr]">
        <span className="text-left text-base font-medium text-[#1a1a1a]">{contactInfo.phone}</span>
        <a className="text-base font-medium text-[#4d4d4d] no-underline" href={`tel:${phoneHref}`}>
          تماس با آژانس
        </a>
      </div>

      <div className="h-px bg-[#cccccc]" />

      <div className="flex h-14 items-center justify-between [direction:ltr]">
        <span className="text-left text-base font-medium text-[#1a1a1a]">{contactInfo.phone}</span>
        <a className="text-base font-medium text-[#4d4d4d] no-underline" href={`sms:${phoneHref}`}>
          ارسال پیامک
        </a>
      </div>

      {socialLinks.length ? (
        <>
          <div className="h-px bg-[#cccccc]" />
          <div className="flex min-h-16 items-center justify-between gap-3 py-3 [direction:ltr]">
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  className="rounded-full bg-[#f0f4ff] px-4 py-2 text-sm font-semibold text-[#0048c4] no-underline"
                  href={item.href}
                  key={item.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <span className="text-sm font-medium text-[#4d4d4d]">شبکه‌های اجتماعی</span>
          </div>
        </>
      ) : null}
    </BottomSheet>
  );
}

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeSocialUrl(type: "instagram" | "telegram" | "whatsapp", value: string) {
  const cleanValue = value.trim();

  if (!cleanValue) return "";
  if (/^https?:\/\//i.test(cleanValue)) return cleanValue;

  if (type === "instagram") {
    const username = cleanValue.replace(/^@/, "").replace(/^instagram\.com\//i, "");
    return username ? `https://www.instagram.com/${username}` : "";
  }

  if (type === "telegram") {
    const username = cleanValue.replace(/^@/, "").replace(/^t\.me\//i, "");
    return username ? `https://t.me/${username}` : "";
  }

  const digits = toEnglishDigits(cleanValue).replace(/[^\d]/g, "");
  if (!digits) return "";

  return `https://wa.me/${digits.startsWith("0") ? `98${digits.slice(1)}` : digits}`;
}

function AgencyPreviewFooter({ onContactClick }: { onContactClick: () => void }) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-4 [direction:ltr]">
        <button
          className="cursor-pointer rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white"
          onClick={onContactClick}
          type="button"
        >
          تماس با آژانس
        </button>
        <button className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4]" type="button">
          چت با آژانس
          <LinearChat className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
}