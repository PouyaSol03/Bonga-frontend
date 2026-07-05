import { useState, type ReactNode } from "react";

import LinearAdd from "../../components/(icons)/LinearAdd";
import LinearAlbum from "../../components/(icons)/LinearAlbum";
import LinearApartment from "../../components/(icons)/LinearApartment";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearBed from "../../components/(icons)/LinearBed";
import LinearBuilding3 from "../../components/(icons)/LinearBuilding3";
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
import LinearTooman from "../../components/(icons)/LinearTooman";

const agencyEditPath = "/account/dashboard/agency";
const agencyLogoSrc = "/figma/agency-preview/agency-logo.png";
const listingImageSrc = "/figma/agency-preview/listing-kitchen.png";

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

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]">
      <AgencyPreviewHeader />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[84px]">
        <AgencyHero />
        <AgencySegmentedTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "ads" ? <AgencyAdsTab /> : activeTab === "consultants" ? <AgencyConsultantsTab /> : <AgencyInfoTab />}
      </main>
      <AgencyPreviewFooter />
    </div>
  );
}

function AgencyPreviewHeader() {
  return (
    <header className="shrink-0 bg-[#f0f0f0]">
      <div className="flex h-9 items-center justify-between px-4 text-xs font-semibold leading-4 text-[#4d4d4d] [direction:ltr]">
        <span>9:41</span>
        <span className="flex items-center gap-1.5">
          <StatusSignalIcon />
          <StatusWifiIcon />
          <span className="grid h-[10px] min-w-[18px] place-items-center rounded-[3px] border border-[#4d4d4d] px-[1px] text-[6px] leading-none text-[#11a366]">
            35%
          </span>
        </span>
      </div>

      <div className="flex h-14 items-center px-1 [direction:ltr]">
        <div className="flex h-12 min-w-[104px] items-center">
          <button
            aria-label="اشتراک‌گذاری"
            className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] active:bg-[#1a1a1a0a]"
            type="button"
          >
            <LinearShare className="h-6 w-6" />
          </button>
          <button
            aria-label="کد QR"
            className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] active:bg-[#1a1a1a0a]"
            type="button"
          >
            <LinearQrCode className="h-6 w-6" />
          </button>
        </div>

        <h1 className="m-0 min-w-0 flex-1 truncate text-right text-base font-semibold leading-6 text-[#1a1a1a] [direction:rtl]">
          صفحه آژانس
        </h1>

        <button
          aria-label="بازگشت"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#1a1a1a] active:bg-[#1a1a1a0a]"
          onClick={() => {
            window.history.pushState({}, "", agencyEditPath);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          type="button"
        >
          <LinearArrowLeft1 className="h-6 w-6 rotate-180" />
        </button>
      </div>
    </header>
  );
}

function StatusSignalIcon() {
  return (
    <span className="flex h-4 items-end gap-[2px]">
      <span className="h-1.5 w-[3px] rounded-sm bg-[#4d4d4d]" />
      <span className="h-2 w-[3px] rounded-sm bg-[#4d4d4d]" />
      <span className="h-2.5 w-[3px] rounded-sm bg-[#4d4d4d]" />
      <span className="h-3 w-[3px] rounded-sm bg-[#4d4d4d]" />
    </span>
  );
}

function StatusWifiIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-[#4d4d4d]" fill="none" viewBox="0 0 16 16">
      <path d="M2.5 6.2a8 8 0 0 1 11 0M4.9 8.6a4.6 4.6 0 0 1 6.2 0M7.1 11a1.5 1.5 0 0 1 1.8 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      <circle cx="8" cy="12.6" fill="currentColor" r="1" />
    </svg>
  );
}

function AgencyHero() {
  return (
    <section className="bg-[#f0f0f0] px-4 pb-4 pt-3 text-center">
      <img alt="لوگوی املاک جلیلیان" className="mx-auto h-19 w-19 object-contain" src={agencyLogoSrc} />
      <h2 className="m-0 mt-1 text-2xl font-bold leading-9 text-[#4d4d4d]">املاک جلیلیان</h2>
      <div className="mx-auto mt-1 inline-flex h-7 items-center gap-1 rounded-full bg-[#e7e8ed] px-2.5 text-xs font-semibold leading-4 text-[#808080]">
        <LinearLocation className="h-4 w-4 text-[#5e6b8f]" />
        صیاد شیرازی
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-x-reverse divide-[#dddddd] text-[#4d4d4d]">
        {agencyStats.map((item) => (
          <div className="grid gap-1 text-center" key={item.label}>
            <span className="mx-auto inline-flex items-center gap-1 text-xs font-medium leading-4">
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
    <div className="bg-[#f0f0f0] px-4 pb-4">
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
  return (
    <div className="space-y-2 bg-[#f0f0f0]">
      <section className="bg-white px-4 py-4">
        <h3 className="m-0 text-right text-base font-semibold leading-6">نشان‌ها</h3>
        <div className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 [direction:rtl]">
          {badgeCards.map((badge) => (
            <BadgeCard alt={badge.alt} key={badge.alt} src={badge.src} />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-6 text-center">
        <h3 className="m-0 text-right text-base font-semibold leading-6">محدوده فعالیت</h3>
        <p className="m-0 mt-5 text-sm font-normal leading-7 text-[#4d4d4d]">
          صیاد شیرازی، شهید قانع، هفت تیر، سید رضی، بلوار معلم،
          <br />
          بلوار دانشجو، وکیل آباد، فارغ التحصیلان
        </p>
      </section>

      <AgencyActionRow icon={<LinearAdd className="h-6 w-6" />} title="ثبت آگهی رایگان" />
      <AgencyActionRow icon={<LinearCalendar className="h-6 w-6" />} title="ثبت بازخورد" />

      <section className="bg-white px-4 pb-7 pt-7 text-center">
        <h3 className="m-0 text-right text-base font-semibold leading-6">درباره املاک جلیلیان</h3>
        <AgencyBuildingIllustration />
        <p className="m-0 mt-5 text-center text-[15px] font-normal leading-8 text-[#4d4d4d]">
          کارگزاری املاک جلیلیان از سال ۱۳۷۰ تحت نام املاک آشتیانه در مشهد مقدس با مدیریت مرحوم محمد جلیلیان فعالیت خود در زمینه فروش و اجاره املاک و مستغلات را آغاز نمود. سال های بعد با گسترش فعالیت ها و به منظور ارتقاء خدمات کیفی و کمی در سال ۱۳۸۸ به املاک عاقبتی تغییر نام داد، در حال حاضر نیز برند املاک جلیلیان تحت مدیریت جواد جلیلیان به عنوان نام و علامت ثبت شده در رشته املاک در مشهد و سراسر ایران فعالیت می‌نماید.
        </p>
        <p className="m-0 mt-2 line-clamp-1 text-center text-sm font-normal leading-6 text-[#d0d0d0]">
          این مجموعه عضو رسمی درجه یک اتحادیه صنف مشاورین املاک است.
        </p>
        <button className="mx-auto mt-2 inline-flex items-center gap-1 text-xs font-semibold leading-4 text-[#0048c4]" type="button">
          <LinearArrowDown1 className="h-4 w-4" />
          نمایش بیشتر
        </button>
      </section>
    </div>
  );
}

function BadgeCard({ alt, src }: { alt: string; src: string }) {
  return (
    <article className="grid h-[62px] w-[70px] shrink-0 place-items-center rounded-lg border border-[#eeeeee] bg-white shadow-[0_1px_0_rgba(26,26,26,0.03)]">
      <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-lg">
        <img alt={alt} className="mt-1 h-8 w-8 object-contain" src={src} />
        <div className="absolute bottom-1.5 right-2 flex gap-0.5 text-[10px] leading-none text-[#d9d9d9] [direction:ltr]">
          <span className="text-[#ffad00]">★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
    </article>
  );
}

function AgencyActionRow({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <button className="flex h-14 w-full items-center gap-3 bg-white px-4 text-right" type="button">
      <LinearArrowLeft1 className="h-6 w-6 text-[#4d4d4d]" />
      <span className="min-w-0 flex-1 text-base font-semibold leading-6 text-[#1a1a1a]">{title}</span>
      <span className="grid h-7 w-7 place-items-center text-[#4d4d4d]">{icon}</span>
    </button>
  );
}

function AgencyBuildingIllustration() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[300px]">
      <svg aria-hidden="true" className="h-auto w-full" fill="none" viewBox="0 0 300 205">
        <path d="M16 151h268v39H16z" fill="#f5f5f5" />
        <path d="M52 91h63v90H52z" fill="#1f66f0" />
        <path d="M116 106h76v75h-76z" fill="#225ee8" />
        <path d="M193 77h63v104h-63z" fill="#f7f7f7" />
        <path d="M74 67l36-33 51 42v19H74z" fill="#2559df" />
        <path d="M111 84h82l31-33v55H111z" fill="#6b8df8" />
        <path d="M137 106l34-31 35 31v75h-69z" fill="#dce6ff" />
        <path d="M151 44h57v32h-57z" fill="#f4f4f4" />
        <path d="M204 52h25v24h-25zM237 70h24v25h-24z" fill="#e6e6e6" />
        <path d="M66 104h9v10h-9zM84 104h9v10h-9zM102 104h9v10h-9zM66 124h9v10h-9zM84 124h9v10h-9zM102 124h9v10h-9zM66 144h9v10h-9zM84 144h9v10h-9zM102 144h9v10h-9z" fill="#073b9f" />
        <path d="M132 121h10v11h-10zM149 121h10v11h-10zM166 121h10v11h-10zM132 141h10v11h-10zM149 141h10v11h-10zM166 141h10v11h-10z" fill="#9cb6ff" />
        <path d="M211 111h10v12h-10zM232 111h10v12h-10zM211 136h10v12h-10zM232 136h10v12h-10z" fill="#879ff2" />
        <path d="M152 156c0-13 8-23 18-23s18 10 18 23v25h-36v-25Z" fill="#879ff2" />
        <circle cx="179" cy="72" r="20" fill="#f0a141" />
        <path d="M168 72l11-10 12 10v14h-23V72Z" fill="#fff" />
        <path d="M172 86V75h14v11" stroke="#fff" strokeLinecap="round" strokeWidth="4" />
        <path d="M49 182c-16-9-22-31-13-48 9-16 29-23 45-14 16 9 22 31 13 48-9 16-29 23-45 14Z" fill="#7fdcb7" />
        <path d="M59 188c-6-24 1-57 23-75 17 22 10 58-12 75H59Z" fill="#61c796" />
        <path d="M240 182c16-9 22-31 13-48-9-16-29-23-45-14-16 9-22 31-13 48 9 16 29 23 45 14Z" fill="#80deb7" />
        <path d="M229 188c6-24-1-57-23-75-17 22-10 58 12 75h11Z" fill="#60c995" />
        <rect fill="#fb923c" height="13" rx="3" width="57" x="27" y="44" />
        <path d="M36 51h38" stroke="#fff" strokeDasharray="1 4" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </div>
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

      <div className="pt-4">
        <AgencyListingCard />
        <AgencyListingCard className="mt-8" />
        <AgencyListingCard className="mt-8" />
      </div>
    </div>
  );
}

function AgencyListingCard({ className = "" }: { className?: string }) {
  return (
    <article className={`bg-white px-4 pb-4 text-right ${className}`}>
      <div className="relative h-[255px] overflow-hidden rounded-2xl bg-[#ddd]">
        <img alt="تصویر آگهی آپارتمان" className="h-full w-full object-cover" src={listingImageSrc} />
        <span className="absolute right-2 top-2 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-semibold leading-5 text-white">
          ۵
          <LinearAlbum className="h-5 w-5" />
        </span>
        <span className="absolute bottom-3 right-2 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-white">
          دفتر املاک شریعت زاده
          <LinearBuilding3 className="h-5 w-5" />
        </span>
      </div>

      <div className="pt-3">
        <div className="flex h-7 items-center justify-start gap-1 text-[#0048c4]">
          <strong className="text-xl font-bold leading-7">۳/۸۵۰ میلیارد</strong>
          <LinearTooman className="h-5 w-5" />
        </div>

        <div className="mt-3 flex h-5 items-center justify-start gap-5 text-sm font-medium leading-5 text-[#1a1a1a]">
          <PropertyDetail icon={<LinearApartment className="h-5 w-5" />} value="۱۱۰ متر" />
          <PropertyDetail icon={<LinearBed className="h-5 w-5" />} value="۲ اتاق" />
          <PropertyDetail icon={<LinearBuilding3 className="h-5 w-5" />} value="۱۴۰۰" />
        </div>

        <h3 className="m-0 mt-3 truncate text-right text-sm font-semibold leading-5 text-[#1a1a1a]">
          آپارتمان ۱۱۰متری شمال تک واحدی سنددار رحیمی
        </h3>

        <div className="mt-3 flex h-6 items-center justify-start gap-2">
          <span className="rounded-lg border border-[#ff6d00] bg-[#fff8e1] px-2 py-[3px] text-xs font-semibold leading-4 text-[#f24822]">
            فوری
          </span>
          <span className="h-5 w-px bg-[#cccccc]" />
          <span className="truncate text-sm font-normal leading-5 text-[#808080]">۱ ساعت پیش در الهیه</span>
        </div>
      </div>
    </article>
  );
}

function PropertyDetail({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[#4d4d4d]">
      {icon}
      <span className="text-[#1a1a1a]">{value}</span>
    </span>
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

function AgencyPreviewFooter() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid h-10 grid-cols-2 gap-4 [direction:ltr]">
        <button className="rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white" type="button">
          تماس با آژانس
        </button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0048c4] bg-white text-sm font-semibold leading-5 text-[#0048c4]" type="button">
          چت با آژانس
          <LinearChat className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
}
