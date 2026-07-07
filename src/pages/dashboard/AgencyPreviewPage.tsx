import { useEffect, useId, useState, type ReactNode } from "react";
import { AdCard } from "../../components/AdCard";
import type { AdCardData } from "../../components/AdCard";
import { BottomSheet } from "../../components/BottomSheet";
import { QRCodeSVG } from "qrcode.react";

import LinearAdd from "../../components/(icons)/LinearAdd";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearCalendar from "../../components/(icons)/LinearCalendar";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearFilterHorizontal from "../../components/(icons)/LinearFilterHorizontal";
import LinearInstagram from "../../components/(icons)/LinearInstagram";
import LinearLocation from "../../components/(icons)/LinearLocation";
import LinearMapsLocation from "../../components/(icons)/LinearMapsLocation";
import LinearPhone2 from "../../components/(icons)/LinearPhone2";
import LinearQrCode from "../../components/(icons)/LinearQrCode";
import LinearRanking from "../../components/(icons)/LinearRanking";
import LinearSearch from "../../components/(icons)/LinearSearch";
import LinearShare from "../../components/(icons)/LinearShare";
import LinearStar from "../../components/(icons)/LinearStar";
import LinearTag from "../../components/(icons)/LinearTag";
import LinearTelegram from "../../components/(icons)/LinearTelegram";
import LinearWhatsapp from "../../components/(icons)/LinearWhatsapp";
import { TopBar } from "../../components/TopBar";
import { Snackbar, type SnackbarVariant } from "../../components/Snackbar";
import LinearUserSolid from "../../components/(icons)/LinearUserSolid";

const agencyEditPath = "/account/dashboard/agency";
const agencyPreviewPath = "/account/dashboard/agency/preview";
const agencyQrCodePath = `${agencyPreviewPath}/qr-code`;
const agencyShareTitle = "املاک جلیلیان";
const agencyShareText = "صفحه آژانس املاک جلیلیان";
const agencyQrLabel = "Agency58945";
const agencyLogoSrc = "/figma/agency-preview/agency-logo.png";
const listingImageSrc = "/figma/agency-preview/listing-kitchen.png";

const agencyContactInfo = {
  phone: "۰۹۱۵۶۱۴۵۶۹۶",
  secondPhone: "۰۹۳۶۷۰۰۸۷۴۷",
  landline: "۰۹۱۵۶۱۴۵۶۹۶",
  whatsapp: "09156145696",
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

type BadgeInfo = {
  alt: string;
  countLabel: string;
  description: string;
  id: string;
  pillLabel: string;
  src: string;
  title: string;
};

const agencyStats = [
  { icon: <LinearStar className="h-5 w-5" />, label: "امتیاز", value: "۸۵" },
  { icon: <LinearRanking className="h-5 w-5" />, label: "رتبه", value: "۱۲" },
  { icon: <LinearTag className="h-5 w-5" />, label: "آگهی فعال", value: "۲۷۳" },
];

const badgeCards: BadgeInfo[] = [
  {
    alt: "نشان تیم طلایی",
    countLabel: "میانگین امتیاز مشاوران ۷۶",
    description:
      "این نشان برای مشاورین و همکارانی اعطا می‌شود که میانگین امتیاز بالایی از کاربران گرفته‌اند و کیفیت پاسخگویی، پیگیری و رضایت مشتریان در آژانس را بالا نگه داشته‌اند.",
    id: "golden-team",
    pillLabel: "تیم طلایی",
    src: "/figma/agency-preview/badge-cup.png",
    title: "نشان تیم طلایی",
  },
  {
    alt: "نشان تیم پرسرعت",
    countLabel: "پاسخگویی کمتر از ۱ ساعت ۳۷۱",
    description:
      "این نشان به آژانس‌هایی داده می‌شود که میانگین زمان پاسخگویی آن‌ها کمتر از ۱ ساعت باشد. املاک بنگاه بر اساس سرعت و دقت پاسخگویی مشاوران خود این نشان را دریافت می‌کند.",
    id: "fast-team",
    pillLabel: "تیم پرسرعت",
    src: "/figma/agency-preview/badge-chat.png",
    title: "نشان تیم پرسرعت",
  },
  {
    alt: "نشان رکورد دار",
    countLabel: "معامله موفق ۱۷۶",
    description:
      "این نشان بر اساس تعداد قراردادها و معاملات ثبت شده برای آژانس صادر می‌شود. هر چه تعداد معاملات موفق، پیگیری‌های حرفه‌ای و ثبت بازخوردهای مثبت بیشتر باشد، این نشان ارزش بیشتری دارد.",
    id: "record-holder",
    pillLabel: "رکورد دار",
    src: "/figma/agency-preview/badge-first.png",
    title: "نشان رکورد دار",
  },
  {
    alt: "نشان محبوب ترین",
    countLabel: "رضایت کاربران بالای ۴ امتیاز ۸۹۲",
    description:
      "این نشان براساس امتیازها و بازخوردهای کاربران از آگهی‌های منتشر شده توسط آژانس محاسبه می‌شود. هرچه میانگین رضایت کاربران بیشتر باشد، اعتبار این نشان برای آژانس بالاتر می‌رود.",
    id: "popular",
    pillLabel: "محبوبترین",
    src: "/figma/agency-preview/badge-bookmark.png",
    title: "نشان محبوب ترین",
  },
];

type AgencyConsultant = {
  avatarClassName: string;
  id: number;
  name: string;
  rank: string;
  role: string;
  score: string;
  src?: string;
};

const agencyConsultants: AgencyConsultant[] = [
  { id: 1, name: "ناصر اشرفی", role: "مشاور املاک", score: "۸۵", rank: "۱۳", avatarClassName: "from-[#f7c59f] to-[#e6a078]" },
  { id: 2, name: "محمد اسماعیلی", role: "مشاور املاک", score: "۸۵", rank: "۱۳", avatarClassName: "from-[#b6dcc0] to-[#68a987]" },
  { id: 3, name: "علیرضا خراسانی", role: "مشاور املاک", score: "۸۵", rank: "۱۳", avatarClassName: "from-[#d7c1ab] to-[#a87556]" },
  { id: 4, name: "حامد عرفان مقدم", role: "مشاور املاک", score: "۸۵", rank: "۱۳", avatarClassName: "from-[#f0d0a7] to-[#b98457]" },
];

const agencyTabs: { id: AgencyPreviewTab; label: string }[] = [
  { id: "consultants", label: "مشاوران" },
  { id: "ads", label: "آگهی‌ها" },
  { id: "info", label: "اطلاعات" },
];

function getInitialAgencyTab(): AgencyPreviewTab {
  if (typeof window === "undefined") return "info";

  const tab = new URLSearchParams(window.location.search).get("tab");

  return tab === "ads" || tab === "consultants" || tab === "info" ? tab : "info";
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function getAbsoluteAgencyPreviewUrl() {
  if (typeof window === "undefined") return agencyPreviewPath;

  return new URL(agencyPreviewPath, window.location.origin).toString();
}

function getCurrentPageUrl() {
  if (typeof window === "undefined") return agencyPreviewPath;

  return window.location.href;
}

async function shareOrCopyAgencyUrl(url: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({
      text: agencyShareText,
      title: agencyShareTitle,
      url,
    });

    return "shared" as const;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);

    return "copied" as const;
  }

  throw new Error("Sharing is not supported in this browser.");
}

type AgencyToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};


export function AgencyPreviewPage() {
  const [activeTab, setActiveTab] = useState<AgencyPreviewTab>(getInitialAgencyTab);
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [toast, setToast] = useState<AgencyToast | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(getCurrentPageUrl());

      if (result === "copied") {
        showToast("لینک صفحه آژانس کپی شد.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  function changeTab(tab: AgencyPreviewTab) {
    setActiveTab(tab);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.replaceState(window.history.state ?? {}, "", `${agencyPreviewPath}?${params.toString()}`);
  }

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <TopBar
        actions={[
          {
            id: "share",
            label: "اشتراک‌گذاری",
            icon: <LinearShare className="h-6 w-6" />,
            onClick: () => void handleShareClick(),
          },
          {
            id: "qr-code",
            label: "کد QR",
            icon: <LinearQrCode className="h-6 w-6" />,
            to: agencyQrCodePath,
          },
        ]}
        backTo={agencyEditPath}
        contentClassName="px-1"
        title="صفحه آژانس"
      />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[84px]">
        <AgencyHero />
        <AgencySegmentedTabs activeTab={activeTab} onChange={changeTab} />
        {activeTab === "ads" ? <AgencyAdsTab /> : activeTab === "consultants" ? <AgencyConsultantsTab /> : <AgencyInfoTab />}
      </main>
      <AgencyPreviewFooter onContactClick={() => setIsContactSheetOpen(true)} />
      <AgencyContactBottomSheet
        contactInfo={agencyContactInfo}
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
      />
      {toast ? (
        <Snackbar
          className="top-16"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </div>
  );
}

export function AgencyQrCodePage() {
  const [toast, setToast] = useState<AgencyToast | null>(null);
  const agencyUrl = getAbsoluteAgencyPreviewUrl();

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(agencyUrl);

      if (result === "copied") {
        showToast("لینک صفحه آژانس کپی شد.");
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }

      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <TopBar
        backTo={agencyPreviewPath}
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="کیوآرکد آژانس"
      />

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-28 pt-8">
        <AgencyQrCard agencyUrl={agencyUrl} />
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4] transition active:bg-[#0048c414]"
          onClick={() => void handleShareClick()}
          type="button"
        >
          <LinearShare className="h-5 w-5" />
          اشتراک‌گذاری
        </button>
      </footer>
      {toast ? (
        <Snackbar
          className="top-16"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </div>
  );
}

function AgencyQrCard({ agencyUrl }: { agencyUrl: string }) {
  const gradientId = `agency-qr-${useId().replace(/:/g, "")}`;

  return (
    <section className="w-full max-w-[328px] rounded-3xl bg-white px-6 pb-6 pt-7 text-center shadow-[0_8px_24px_rgba(26,26,26,0.06)]">
      <img alt="لوگوی املاک جلیلیان" className="mx-auto h-16 w-16 object-contain" src={agencyLogoSrc} />
      <h1 className="m-0 mt-2 text-lg font-bold leading-7 text-[#4d4d4d]">املاک جلیلیان</h1>
      <p className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">اسکن کنید و صفحه آژانس را ببینید</p>

      <div className="mx-auto mt-6 w-full max-w-[252px] bg-white text-center">
        <QRCodeSVG
          bgColor="#ffffff"
          className="mx-auto block h-auto w-full"
          fgColor={`url(#${gradientId})`}
          level="H"
          marginSize={1}
          title="کد QR صفحه آژانس"
          value={agencyUrl}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#002099" />
              <stop offset="100%" stopColor="#4B5070" />
            </linearGradient>
          </defs>
        </QRCodeSVG>
      </div>

      <p className="m-0 mt-2 text-center text-2xl font-bold leading-8 text-[#4b5070] [direction:ltr]">
        {agencyQrLabel}
      </p>
    </section>
  );
}

function AgencyHero() {
  return (
    <section className="bg-white px-4 pb-4 pt-3 text-center">
      <img alt="لوگوی املاک جلیلیان" className="mx-auto h-19 w-19 object-contain" src={agencyLogoSrc} />
      <h2 className="m-0 mt-1 text-2xl font-bold leading-9 text-[#4d4d4d]">املاک جلیلیان</h2>
      <div className="mx-auto mt-1 inline-flex h-7 items-center gap-1 rounded-full bg-[#e7e8ed] px-2.5 text-xs font-medium text-[#4B5070]">
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
    <div className="bg-white px-4 pb-4 shadow-lg">
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
  const [selectedBadge, setSelectedBadge] = useState<BadgeInfo | null>(null);

  return (
    <div className="space-y-2 bg-[#f0f0f0]">
      <section className="bg-white px-4 py-4">
        <h3 className="m-0 text-right font-semibold leading-6">نشان‌ها</h3>
        <div className="mt-4 flex gap-3 overflow-x-auto px-4 pb-1 [direction:rtl]">
          {badgeCards.map((badge) => (
            <BadgeCard badge={badge} key={badge.id} onClick={() => setSelectedBadge(badge)} />
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
        <img alt="" src="/vectors/Bonga.svg" />
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
          <LinearArrowDown1 className={`h-4 w-4 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`} />
          {isAboutExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </button>
      </section>

      <AgencyBadgeBottomSheet badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
}

function BadgeCard({ badge, onClick }: { badge: BadgeInfo; onClick: () => void }) {
  return (
    <button
      aria-label={badge.title}
      className="grid h-[62px] w-[70px] shrink-0 place-items-center rounded-lg border border-[#EBEBEB] bg-white shadow-[0_1px_0_rgba(26,26,26,0.03)] focus-visible:outline-3 focus-visible:outline-[#0048c440]"
      onClick={onClick}
      type="button"
    >
      <span className="relative grid h-full w-full justify-items-center overflow-hidden rounded-lg">
        <img alt={badge.alt} className="mt-1 h-8 w-8 object-contain" src={badge.src} />
        <span className="absolute bottom-1.5 right-2 left-2 flex justify-center gap-0.5 text-[10px] text-[#d9d9d9] [direction:ltr]">
          <LinearStar innerColor="#FFB100" className="h-2.5 w-2.5 text-[#FFB100]" />
          <LinearStar innerColor="#FFB100" className="h-2.5 w-2.5 text-[#FFB100]" />
          <LinearStar innerColor="#FFB100" className="h-2.5 w-2.5 text-[#FFB100]" />
        </span>
      </span>
    </button>
  );
}

function AgencyBadgeBottomSheet({ badge, onClose }: { badge: BadgeInfo | null; onClose: () => void }) {
  return (
    <BottomSheet
      ariaLabel={badge?.title ?? "جزئیات نشان"}
      contentClassName="px-4 pb-5 pt-1"
      heightClassName="h-auto max-h-[calc(100dvh-70px)]"
      isOpen={Boolean(badge)}
      onClose={onClose}
      title={badge?.title ?? "جزئیات نشان"}
    >
      {badge ? (
        <div className="text-center">
          <div className="mx-auto mt-1 grid place-items-center rounded-2xl text-5xl">
            <img alt={badge.alt} className="h-18 w-18 object-contain" src={badge.src} />
          </div>
          <span className="px-2 py-0.5 mt-2 items-center rounded-lg bg-[#0048c41c] text-sm font-semibold text-[#0048c4]">
            {badge.pillLabel}
          </span>
          <div className="mt-1 flex justify-center gap-0.5 text-[#FFB100] [direction:ltr]" aria-label="سه ستاره">
            <LinearStar innerColor="#FFB100" className="h-3 w-3" />
            <LinearStar innerColor="#FFB100" className="h-3 w-3" />
            <LinearStar innerColor="#FFB100" className="h-3 w-3" />
          </div>
          <p className="m-0 mt-6 text-center text-sm font-medium text-[#1a1a1a]">{badge.countLabel}</p>
          <div className="mt-6 rounded-xl border border-[#11A366] bg-[#EAF8F1] px-4 py-3 text-right text-sm font-normal leading-7 text-[#0c7d4f]">
            {badge.description}
          </div>
        </div>
      ) : null}
    </BottomSheet>
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
  const filterReturnTo = encodeURIComponent(`${agencyPreviewPath}?tab=ads`);

  return (
    <div className="space-y-2 bg-[#f0f0f0] px-0 pb-3 pt-5">
      <div className="flex items-center gap-2 px-4 [direction:ltr]">
        <button
          aria-label="فیلتر آگهی‌ها"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#0062ff] bg-[#eaf2ff] text-[#0062ff]"
          onClick={() => navigateTo(`${agencyPreviewPath}/filter?returnTo=${filterReturnTo}`)}
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
    <section className="flex flex-col gap-y-2">
      {agencyConsultants.map((consultant, index) => (
        <article
          className={`flex items-center justify-center gap-4 bg-white px-4 py-4 text-center ${index < agencyConsultants.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
          key={consultant.id}
        >
          <div className="flex flex-col items-center">
            <ConsultantAvatar className={consultant.avatarClassName} name={consultant.name} src={consultant.src} />
            <h3 className="m-0 mt-2 font-medium leading-5 text-[#4D4D4D]">{consultant.name}</h3>
            <p className="m-0 mt-0.5 text-xs px-2 py-0.5 rounded-lg bg-[#80808014] text-[#808080]">{consultant.role}</p>
            <div className="mt-2 flex items-center justify-center gap-5 text-xs font-medium leading-4 text-[#4d4d4d]">
              <span className="inline-flex items-center gap-1">
                <LinearStar className="h-4 w-4" />
                <p className="text-xs font-medium text-[#1A1A1A]">امتیاز</p>
                <span className="mr-3 font-semibold text-sm text-[#11A366]">{consultant.score}</span>
              </span>
              <div className="h-4.75 w-px bg-[#CCCCCC]"></div>
              <span className="inline-flex items-center gap-1">
                <LinearRanking className="h-4 w-4" />
                <p className="text-xs font-medium text-[#1A1A1A]">رتبه</p>
                <span className="mr-3 font-semibold text-sm text-[#11A366]">{consultant.rank}</span>
              </span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function ConsultantAvatar({
  className = "",
  name,
  src,
}: {
  className?: string;
  name: string;
  src?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasImageError;

  return (
    <div
      className={`grid h-18 w-18 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${className || "from-[#f3f4f6] to-[#e5e7eb]"
        }`}
    >
      {shouldShowImage ? (
        <img
          alt={name}
          className="h-full w-full rounded-full object-cover"
          onError={() => setHasImageError(true)}
          src={src}
        />
      ) : (
        <LinearUserSolid className="h-9 w-9 text-[#808080]" />
      )}
    </div>
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
  const secondPhoneHref = toEnglishDigits(contactInfo.secondPhone).replace(/[^\d+]/g, "");
  const landlineHref = toEnglishDigits(contactInfo.landline).replace(/[^\d+]/g, "");
  const socialLinks = [
    { label: "واتساپ", href: normalizeSocialUrl("whatsapp", contactInfo.whatsapp), icon: <LinearWhatsapp className="h-5 w-5" />, className: "text-[#11A366]" },
    { label: "تلگرام", href: normalizeSocialUrl("telegram", contactInfo.telegram), icon: <LinearTelegram className="h-5 w-5" />, className: "text-[#1D9BF0]" },
    { label: "اینستاگرام", href: normalizeSocialUrl("instagram", contactInfo.instagram), icon: <LinearInstagram className="h-5 w-5" />, className: "text-[#E1306C]" },
  ].filter((item) => item.href);

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-1 pb-5"
      heightClassName="h-auto max-h-[calc(100dvh-88px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="اطلاعات تماس"
    >
      <ContactRow href={`tel:${phoneHref}`} label="شماره اصلی" value={contactInfo.phone} />
      <ContactRow href={`tel:${secondPhoneHref}`} label="شماره دوم" value={contactInfo.secondPhone} />
      <ContactRow href={`tel:${landlineHref}`} label="ثابت" value={contactInfo.landline} />

      <div className="mt-3 overflow-hidden rounded-2xl border border-[#eeeeee] bg-[#f6f2eb]">
        <AgencyMiniMap />
      </div>

      {socialLinks.length ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-[#4d4d4d]">شبکه‌های اجتماعی</span>
          <div className="flex items-center gap-4 [direction:ltr]">
            {socialLinks.map((item) => (
              <a
                aria-label={item.label}
                className={`grid h-8 w-8 place-items-center rounded-full bg-[#f7f7f7] no-underline ${item.className}`}
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </BottomSheet>
  );
}

function ContactRow({ href, label, value }: { href: string; label: string; value: string }) {
  return (
    <a className="flex h-12 items-center justify-between gap-3 border-b border-[#eeeeee] text-[#1a1a1a] no-underline [direction:ltr]" href={href}>
      <span className="text-left text-sm font-medium">{value}</span>
      <span className="inline-flex items-center gap-2 text-right text-sm font-normal text-[#808080] [direction:rtl]">
        {label}
        <LinearPhone2 className="h-5 w-5 text-[#4d4d4d]" />
      </span>
    </a>
  );
}

function AgencyMiniMap() {
  return (
    <div className="relative h-[178px] w-full overflow-hidden bg-[#f4efe8]">
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(90deg,rgba(204,194,180,.65)_1px,transparent_1px),linear-gradient(0deg,rgba(204,194,180,.65)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="absolute -left-8 top-9 h-10 w-[120%] rotate-[-18deg] bg-white/70" />
      <div className="absolute -right-8 bottom-10 h-9 w-[120%] rotate-[17deg] bg-white/70" />
      <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#11A366] text-white shadow-[0_4px_12px_rgba(17,163,102,.35)]">
        <LinearMapsLocation className="h-7 w-7" />
      </div>
      <span className="absolute right-5 top-4 text-xs text-[#808080]">عسکریه</span>
      <span className="absolute bottom-5 left-6 text-xs text-[#808080]">سجاد</span>
      <span className="absolute bottom-16 right-6 text-xs text-[#808080]">احمدآباد</span>
    </div>
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
