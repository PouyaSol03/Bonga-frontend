import { useEffect, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import { BottomSheet } from "../components/BottomSheet";
import { Snackbar, type SnackbarVariant } from "../components/Snackbar";
import { RouteLink } from "../routes/RouteLink";
import { TopBar } from "../components/TopBar";
import { FeaturesIcons } from "../components/FeaturesIcons";
import { PageFrame } from "../app/PageFrame";
import { getBuildingInfo } from "../lib/handleBuildingInfo";
import { getFeatureIconSrc } from "../lib/handleFeaturesIcons";
import {
  getApiAssetUrl,
  getApiErrorMessage,
  isUnauthorizedApiError,
} from "../api/api";
import { getRequestErrorState, NotFoundErrorState } from "../components/ErrorState";
import {
  useAdvertisementDetailQuery,
  useAdvertiseReportReasonsQuery,
  useSubmitAdvertiseFeedbackMutation,
  useSubmitAdvertiseReportMutation,
} from "../hooks/advertisement.hooks";
import { useSaveAdvertiseNoteMutation, useToggleAdvertiseBadgeMutation } from "../hooks/account.hooks";
import type {
  AdvertiseFeedbackPayload,
  AdvertiseReportReason,
  AdvertisementItem,
} from "../services/advertisement.service";
import {
  DetailSection,
  MoreLink,
  PropertyGrid,
  ViewAdTopBar,
} from "./viewAd/viewAdComponents";
import { viewAdDemo, parseAdIdFromPath } from "./viewAd/viewAdData";
import { ViewAdIcon } from "./viewAd/ViewAdIcon";
import type { IconName, ViewAdDetails } from "./viewAd/viewAdTypes";
import { AdCardTomanIcon } from "../components/AdCardIcons";
import { getStoredAuthSession, storeLoginRedirectPath } from "../auth/auth-storage";

type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};

type ActionToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

type AdvertisementImageItem = {
  path?: string;
  url?: string;
  src?: string;
  is_main?: boolean;
};

type GalleryMediaKind = "album" | "video" | "tour3d";

const singleAdMockData: AdvertisementItem = {
  id: "000000000000000000000601",
  title: "فروش کامل واحد اداری در مشهد",
  price: 11800000000,
  image: "/public/demo/real-estate-placeholder.jpg",
  images: ["/public/demo/real-estate-placeholder.jpg"],
  features: [
    { label: "form_code", value: "sale-office" },
    { label: "neighborhood_id", value: "000000000000000000000301" },
    { label: "area", value: 110 },
    { label: "price", value: 11800000000 },
    { label: "building_age", value: "نوساز" },
    { label: "rooms", value: "2" },
    { label: "floor", value: "1" },
    { label: "has_document", value: true },
    { label: "renovated", value: true },
    { label: "furnished", value: true },
    { label: "has_loan", value: true },
    { label: "suitable_for", value: ["وکلا", "شرکت ها", "مطب"] },
    { label: "document_type", value: "ملکی" },
    { label: "heating_cooling", value: ["کولر گازی", "پکیج"] },
    { label: "unit_direction", value: "شمالی" },
    { label: "land_position", value: "۳ نبش" },
    { label: "total_floors", value: 4 },
    { label: "floor_material", value: "سرامیک" },
    { label: "facade_material", value: "سنگ" },
    { label: "cabinet_material", value: "ام دی اف" },
    { label: "loan_amount", value: 1500000000 },
    { label: "loan_installment", value: 500000000 },
    { label: "has_loan", value: false },
    { label: "exchange_with", value: [] },
    {
      label: "facilities",
      value: [
        "آسانسور",
        "رستوران",
        "کافی‌شاپ",
        "لابی",
        "استخر",
        "سالن ماساژ",
        "سونا",
        "جکوزی",
        "فروشگاه",
        "سالن ورزشی",
        "دوربین مدار بسته",
        "امتیاز برق",
        "امتیاز گاز",
        "امتیاز آب",
        "نگهبانی",
        "دور دیوار",
        "چاه آب",
      ],
    },
    {
      label: "exchange_with",
      value: ["ویلا", "خودرو", "آپارتمان", "خانه ویلایی", "زمین"],
    },
    { label: "advertiser_type", value: "مشاور املاک" },
    { label: "published_at", value: "امروز" },
    { label: "is_special", value: false },
    { label: "has_image", value: true },
    { label: "has_video", value: false },
  ],
  short_description:
    "فروش کامل واحد اداری در مشهد با تمام فیلدهای فرم برای تست کامل فرانت‌اند.",
  label: "فروش کامل واحد اداری در مشهد",
  published_hours_ago: 23,
  created_at: "2026-06-15T08:16:11.508Z",
  lat: 36.2972,
  lng: 59.6067,
  _id: "000000000000000000000601",
  category_id: "000000000000000000000235",
  neighborhood_id: "000000000000000000000301",
  user_id: null,
  status: 3,
  description:
    "فروش کامل واحد اداری در مشهد با تمام فیلدهای فرم برای تست کامل فرانت‌اند.",
  track_code: 930001,
  contact_type: ["phone"],
  owner_phone: "09152000001",
  owner_type: "owner",
  virtual_tour_link: null,
  payments: [],
  confirm_date: "2026-06-15T08:16:11.508Z",
  sort_date: "2026-06-15T07:16:11.508Z",
  updated_at: "2026-06-15T12:28:40.092Z",
};

const mockAdIds = new Set(["000000000000000000000601", "601", "930001"]);

const albumMediaItems: AlbumMediaItem[] = [
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "video" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
];


const persianDigitMap: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
  "٠": "۰",
  "١": "۱",
  "٢": "۲",
  "٣": "۳",
  "٤": "۴",
  "٥": "۵",
  "٦": "۶",
  "٧": "۷",
  "٨": "۸",
  "٩": "۹",
};

const englishDigitMap: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

function toPersianDigits(value: unknown) {
  return String(value).replace(/[0-9٠-٩]/g, (digit) => persianDigitMap[digit] ?? digit);
}

function toEnglishDigits(value: unknown) {
  return String(value).replace(/[۰-۹٠-٩]/g, (digit) => englishDigitMap[digit] ?? digit);
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-14 items-center justify-between rounded-lg bg-[#f5f5f5] px-4 [direction:ltr]">
      <div className="flex items-center gap-1">
        <AdCardTomanIcon className="h-5 w-5" />
        <strong className="text-base font-semibold leading-6 text-[#1A1A1A] [direction:rtl] [unicode-bidi:isolate]">
          {value}
        </strong>
      </div>
      <span className="text-right text-sm font-medium leading-5 text-[#1a1a1a]">
        {label}
      </span>
    </div>
  );
}

function GalleryHero({
  hasTour3d = false,
  mediaItems = [{ src: "/figma/view-ad-gallery.png", type: "image" }],
  onOpenAlbum,
}: {
  hasTour3d?: boolean;
  mediaItems?: AlbumMediaItem[];
  onOpenAlbum: (initialIndex?: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const galleryItems =
    mediaItems.length > 0
      ? mediaItems
      : [{ src: "/figma/view-ad-gallery.png", type: "image" }];
  const videoIndex = galleryItems.findIndex((item) => item.type === "video");
  const hasVideo = videoIndex >= 0;

  const selectGalleryKind = (kind: GalleryMediaKind) => {
    if (kind === "album") {
      swiperRef.current?.slideTo(0);
      setActiveIndex(0);
      return;
    }

    if (kind === "video") {
      if (!hasVideo) return;

      swiperRef.current?.slideTo(videoIndex);
      setActiveIndex(videoIndex);
      return;
    }

    onOpenAlbum(activeIndex);
  };

  return (
    <div className="px-4 pt-4">
      <div className="relative block w-full overflow-hidden rounded-2xl bg-[#ebebeb] focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[#0048c440]">
        <Swiper
          className="w-full"
          dir="rtl"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
        >
          {galleryItems.map((item, index) => (
            <SwiperSlide key={`${item.src}-${item.type}-${index}`}>
              <button
                aria-label="باز کردن آلبوم تصاویر"
                className="block w-full"
                onClick={() => onOpenAlbum(index)}
                type="button"
              >
                <img
                  alt=""
                  className="aspect-[328/219] w-full object-cover"
                  src={item.src}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute right-3 top-3 z-10 flex h-9 items-center gap-1.5 rounded-lg bg-[#1a1a1ab3] px-2 text-white [direction:rtl]">
          <GalleryMediaButton
            iconSrc="/icons/iconAlbum.svg"
            isSelected={galleryItems[activeIndex]?.type === "image"}
            label="album"
            onClick={() => selectGalleryKind("album")}
          />
          {hasVideo ? (
            <GalleryMediaButton
              iconSrc="/icons/iconVideo.svg"
              isSelected={galleryItems[activeIndex]?.type === "video"}
              label="video"
              onClick={() => selectGalleryKind("video")}
            />
          ) : null}
          {hasTour3d ? (
            <GalleryMediaButton
              iconSrc="/icons/icon3d.svg"
              isSelected={false}
              label="3d"
              onClick={() => selectGalleryKind("tour3d")}
            />
          ) : null}
        </div>

        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center">
          <div className="flex h-2 items-center gap-1.5">
            {galleryItems.slice(0, 4).map((item, index) => (
              <button
                aria-label={`نمایش تصویر ${index + 1}`}
                className={
                  index === activeIndex
                    ? "h-1.5 w-5 rounded-full bg-white"
                    : "h-1.5 w-1.5 rounded-full bg-white/70"
                }
                key={`${item.src}-dot-${index}`}
                onClick={() => swiperRef.current?.slideTo(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryMediaButton({
  iconSrc,
  isSelected,
  label,
  onClick,
}: {
  iconSrc: string;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={isSelected}
      className={`grid h-7 w-7 place-items-center rounded-md ${isSelected ? "bg-white/25" : "bg-transparent active:bg-white/15"
        }`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <img alt="" aria-hidden="true" className="h-5 w-5 object-contain" src={iconSrc} />
    </button>
  );
}

function MapPreview({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const mapSrc = `https://neshan.org/maps/iframe/places/78bff763c73354cd9b7a48dd01792bf9#c${latitude}-${longitude}-15z-0p/${latitude}/${longitude}`;

  return (
    <div className="relative mt-6 h-[198px] overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#fafafa]">
      <iframe
        allowFullScreen
        className="pointer-events-none h-full w-full border-0"
        height="300"
        loading="lazy"
        src={mapSrc}
        tabIndex={-1}
        title="map-iframe"
        width="450"
      />
    </div>
  );
}

const DESCRIPTION_COLLAPSED_HEIGHT = 350;

function InlineMoreButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="mx-auto mt-3 flex w-fit items-center justify-center gap-1 p-0 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      onClick={onClick}
      type="button"
    >
      <span className="text-xs font-medium leading-4 text-[#0048c4]">
        {children}
      </span>

      <ViewAdIcon className="h-3 w-3 shrink-0 text-[#0048c4]" name="arrowDown" />
    </button>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6.6 4.8 9 4.2l2.1 4.8-1.5 1.1a11.2 11.2 0 0 0 4.3 4.3L15 12.9l4.8 2.1-.6 2.4c-.3 1.2-1.4 2-2.6 1.8C10.2 18.2 5.8 13.8 4.8 7.4 4.6 6.2 5.4 5.1 6.6 4.8Z" />
    </svg>
  );
}

function MessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M5 18.5V20l3.1-1.6A8 8 0 1 0 4 11.5c0 2.6 1.2 4.9 3.1 6.4" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function SocialIcon({ type }: { type: "instagram" | "telegram" | "whatsapp" }) {
  const styles = {
    instagram:
      "bg-[linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)] text-white",
    telegram: "bg-[#34aadf] text-white",
    whatsapp: "bg-[#20c363] text-white",
  };

  const label = {
    instagram: "I",
    telegram: "T",
    whatsapp: "W",
  };

  return (
    <span
      aria-hidden="true"
      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${styles[type]}`}
    >
      {label[type]}
    </span>
  );
}

function ContactInfoBottomSheet({
  isOpen,
  onClose,
  phoneNumber,
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}) {
  const phoneHref = toEnglishDigits(phoneNumber);
  const phoneDisplay = toPersianDigits(phoneNumber);

  return (
    <BottomSheet
      ariaLabel="تماس با مشاور"
      contentClassName="mx-4 mt-5"
      heightClassName="h-[306px]"
      isOpen={isOpen}
      onClose={onClose}
      title="تماس با مشاور"
    >
      <div className="flex h-14 items-center justify-between [direction:ltr]">
        <span className="text-left text-base font-medium leading-6 text-[#1a1a1a]">
          {phoneDisplay}
        </span>
        <a
          className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
          href={`tel:${phoneHref}`}
          tabIndex={isOpen ? 0 : -1}
        >
          <PhoneIcon className="h-6 w-6" />
          <span>تماس با</span>
        </a>
      </div>
      <div className="h-px bg-[#cccccc]" />
      <div className="flex h-14 items-center justify-between [direction:ltr]">
        <span className="text-left text-base font-medium leading-6 text-[#1a1a1a]">
          {phoneDisplay}
        </span>
        <a
          className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
          href={`sms:${phoneHref}`}
          tabIndex={isOpen ? 0 : -1}
        >
          <MessageIcon className="h-6 w-6" />
          <span>ارسال پیامک</span>
        </a>
      </div>
      <div className="h-px bg-[#cccccc]" />
      <div className="flex h-16 items-center justify-between [direction:ltr]">
        <div className="flex gap-4">
          <a
            aria-label="واتساپ"
            className="grid h-14 w-14 place-items-center rounded-full"
            href={`https://wa.me/98${phoneHref.slice(1)}`}
            tabIndex={isOpen ? 0 : -1}
            target="_blank"
            rel="noreferrer"
          >
            <SocialIcon type="whatsapp" />
          </a>
          <a
            aria-label="تلگرام"
            className="grid h-14 w-14 place-items-center rounded-full"
            href={`https://t.me/share/url?url=tel:${phoneHref}`}
            tabIndex={isOpen ? 0 : -1}
            target="_blank"
            rel="noreferrer"
          >
            <SocialIcon type="telegram" />
          </a>
          <a
            aria-label="اینستاگرام"
            className="grid h-14 w-14 place-items-center rounded-full"
            href="https://www.instagram.com/"
            tabIndex={isOpen ? 0 : -1}
            target="_blank"
            rel="noreferrer"
          >
            <SocialIcon type="instagram" />
          </a>
        </div>
        <span className="text-right text-sm font-medium leading-5 text-[#4d4d4d]">
          شبکه‌های اجتماعی
        </span>
      </div>
    </BottomSheet>
  );
}


function ActionPageTopBar({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header className="relative flex h-[44px] shrink-0 items-center justify-center bg-[#f2f2f2] px-4 text-[#1a1a1a] [direction:rtl]">
      <button
        aria-label="بازگشت"
        className="absolute right-2 top-0 grid h-[44px] w-11 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onBack}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      <h1 className="m-0 text-center text-base font-semibold leading-6 text-[#1a1a1a]">
        {title}
      </h1>
    </header>
  );
}

function ViewAdNotePage({
  isSaving,
  noteText,
  onChangeNote,
  onClose,
  onSave,
}: {
  isSaving: boolean;
  noteText: string;
  onChangeNote: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ActionPageTopBar onBack={onClose} title="یادداشت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4 pt-8">
        <p className="m-0 text-right text-sm font-normal leading-5 text-[#1a1a1a]">
          یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.
        </p>
        <textarea
          aria-label="یادداشت شما"
          autoFocus
          className="mt-6 h-60 w-full resize-none rounded-xl border border-[#d9d9d9] bg-white px-3 py-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4]"
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="یادداشت شما"
          value={noteText}
        />
      </main>

      <div className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_4px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            disabled={isSaving || noteText.trim().length === 0}
            onClick={onSave}
            type="button"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره"}
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}


type FeedbackValue = "positive" | "negative";

type FeedbackOption = {
  key: keyof AdvertiseFeedbackPayload;
  label: string;
};

type FeedbackState = Record<keyof AdvertiseFeedbackPayload, FeedbackValue | null>;

const feedbackOptions: FeedbackOption[] = [
  { key: "response_speed", label: "سرعت پاسخگویی" },
  { key: "area_knowledge", label: "میزان آشنایی به منطقه" },
  { key: "honesty", label: "صداقت در معرفی ملک" },
  { key: "effective_followup", label: "پیگیری موثر" },
  { key: "ads_are_updated", label: "به روز بودن آگهی‌ها" },
];

function FeedbackThumbIcon({
  className = "",
  direction,
}: {
  className?: string;
  direction: FeedbackValue;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <g transform={direction === "negative" ? "rotate(180 12 12)" : undefined}>
        <path d="M7.5 10.5v9" />
        <path d="M4.5 11.5v6.5c0 .8.7 1.5 1.5 1.5h1.5v-9H6c-.8 0-1.5.7-1.5 1.5Z" />
        <path d="M7.5 11.5 11.8 4c.4-.7 1.4-.7 1.8 0 .4.7.5 1.5.2 2.2l-1 2.6h4.6c1.4 0 2.4 1.3 2.1 2.7l-1.1 5.4c-.3 1.5-1.7 2.6-3.2 2.6H7.5" />
      </g>
    </svg>
  );
}

function FeedbackIconButton({
  active,
  type,
  onClick,
}: {
  active: boolean;
  type: FeedbackValue;
  onClick: () => void;
}) {
  const activeClassName =
    type === "positive"
      ? "bg-[#0FAF731A] text-[#0FAF73]"
      : "bg-[#FF4D4F1A] text-[#FF4D4F]";

  return (
    <button
      aria-label={type === "positive" ? "بازخورد مثبت" : "بازخورد منفی"}
      className={`grid h-9 w-9 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${active ? activeClassName : "bg-transparent text-[#cccccc]"
        }`}
      onClick={onClick}
      type="button"
    >
      <FeedbackThumbIcon className="h-5 w-5" direction={type} />
    </button>
  );
}

function PageActionBar({
  primaryLabel,
  primaryLoadingLabel,
  secondaryLabel = "انصراف",
  isPrimaryDisabled = false,
  isPrimaryLoading = false,
  onPrimary,
  onSecondary,
}: {
  primaryLabel: string;
  primaryLoadingLabel?: string;
  secondaryLabel?: string;
  isPrimaryDisabled?: boolean;
  isPrimaryLoading?: boolean;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <div className="shrink-0 rounded-b-2xl bg-white px-4 py-3.5 shadow-[0_-4px_16px_rgba(26,26,26,0.08)]">
      <div className="grid grid-cols-2 gap-4 [direction:ltr]">
        <button
          className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          disabled={isPrimaryDisabled || isPrimaryLoading}
          onClick={onPrimary}
          type="button"
        >
          {isPrimaryLoading ? primaryLoadingLabel ?? "در حال ارسال..." : primaryLabel}
        </button>
        <button
          className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onSecondary}
          type="button"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

function ViewAdFeedbackPage({
  isSubmitting,
  onClose,
  onSubmit,
}: {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: AdvertiseFeedbackPayload) => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>(() =>
    feedbackOptions.reduce<FeedbackState>((result, option) => {
      result[option.key] = null;
      return result;
    }, {} as FeedbackState),
  );

  const setOptionFeedback = (key: keyof AdvertiseFeedbackPayload, value: FeedbackValue) => {
    setFeedback((current) => ({
      ...current,
      [key]: current[key] === value ? null : value,
    }));
  };

  const handleSubmit = () => {
    const payload = feedbackOptions.reduce<AdvertiseFeedbackPayload>(
      (result, option) => ({
        ...result,
        [option.key]: feedback[option.key] === "positive",
      }),
      {
        ads_are_updated: false,
        area_knowledge: false,
        effective_followup: false,
        honesty: false,
        response_speed: false,
      },
    );

    onSubmit(payload);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ActionPageTopBar onBack={onClose} title="ثبت بازخورد" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pt-2">
        <div className="divide-y divide-[#e0e0e0]">
          {feedbackOptions.map((option) => (
            <div
              className="flex min-h-[73px] items-center justify-between gap-4 text-right [direction:rtl]"
              key={option.key}
            >
              <span className="text-base font-normal leading-6 text-[#1a1a1a]">
                {option.label}
              </span>

              <div className="flex shrink-0 items-center gap-4 [direction:ltr]">
                <FeedbackIconButton
                  active={feedback[option.key] === "negative"}
                  onClick={() => setOptionFeedback(option.key, "negative")}
                  type="negative"
                />
                <FeedbackIconButton
                  active={feedback[option.key] === "positive"}
                  onClick={() => setOptionFeedback(option.key, "positive")}
                  type="positive"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <PageActionBar
        isPrimaryLoading={isSubmitting}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="ثبت"
        primaryLoadingLabel="در حال ثبت..."
      />
    </div>
  );
}

function ReportRadio({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex h-11 cursor-pointer items-center justify-between gap-4 text-right [direction:rtl]">
      <span className={`text-base font-normal leading-6 ${checked ? "text-[#0048c4]" : "text-[#1a1a1a]"}`}>
        {label}
      </span>
      <input
        checked={checked}
        className="sr-only"
        onChange={onChange}
        type="radio"
        value={label}
      />
      <span
        aria-hidden="true"
        className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border ${
          checked ? "border-[#0048c4] bg-[#0048c4]" : "border-[#808080] bg-white"
        }`}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
    </label>
  );
}

type ViolationReportSubmitPayload = {
  description: string;
  reportReasonId: string;
};

function ViewAdViolationReportPage({
  errorMessage,
  isLoading,
  isSubmitting,
  onClose,
  onRetry,
  onSubmit,
  reasons,
}: {
  errorMessage?: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSubmit: (payload: ViolationReportSubmitPayload) => void;
  reasons: AdvertiseReportReason[];
}) {
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (selectedReasonId || reasons.length === 0) return;

    setSelectedReasonId(reasons[0].id);
  }, [reasons, selectedReasonId]);

  const selectedReason =
    reasons.find((reason) => reason.id === selectedReasonId) ?? null;
  const shouldShowDescription = selectedReason?.name === "سایر";

  const handleSubmit = () => {
    if (!selectedReason) {
      setValidationMessage("لطفا یک دلیل برای گزارش انتخاب کنید.");
      return;
    }

    const cleanDescription = description.trim();

    if (shouldShowDescription && cleanDescription.length === 0) {
      setValidationMessage("لطفا توضیح گزارش را وارد کنید.");
      return;
    }

    setValidationMessage("");
    onSubmit({
      description: cleanDescription,
      reportReasonId: selectedReason.id,
    });
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ActionPageTopBar onBack={onClose} title="گزارش تخلف آگهی" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-5 pb-4 pt-5 overscroll-contain">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock className="h-8 w-full" key={index} />
            ))}
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
            <p className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">
              {errorMessage}
            </p>
            <button
              className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-5 text-sm font-medium leading-5 text-[#0048c4]"
              onClick={onRetry}
              type="button"
            >
              تلاش دوباره
            </button>
          </div>
        ) : reasons.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center text-center">
            <p className="m-0 text-sm font-medium leading-6 text-[#4d4d4d]">
              دلیلی برای گزارش تخلف دریافت نشد.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <ReportRadio
                  checked={selectedReasonId === reason.id}
                  key={reason.id}
                  label={reason.name}
                  onChange={() => {
                    setSelectedReasonId(reason.id);
                    setValidationMessage("");
                  }}
                />
              ))}
            </div>

            {shouldShowDescription ? (
              <textarea
                aria-label="توضیح گزارش"
                className="mt-4 h-[104px] w-full resize-none rounded-lg border border-[#d9d9d9] bg-white px-3 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4]"
                onChange={(event) => {
                  setDescription(event.target.value);
                  setValidationMessage("");
                }}
                placeholder="لطفا دلیل گزارش را توضیح دهید... *"
                value={description}
              />
            ) : null}

            {validationMessage ? (
              <p className="m-0 mt-3 text-right text-xs font-medium leading-5 text-[#ff4d4f]">
                {validationMessage}
              </p>
            ) : null}
          </>
        )}
      </main>

      <PageActionBar
        isPrimaryDisabled={Boolean(errorMessage) || isLoading || reasons.length === 0}
        isPrimaryLoading={isSubmitting}
        onPrimary={handleSubmit}
        onSecondary={onClose}
        primaryLabel="ارسال گزارش"
        primaryLoadingLabel="در حال ارسال..."
      />
    </div>
  );
}

function AlbumCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function getAlbumDotSize(index: number, activeIndex: number, total: number) {
  if (index === activeIndex) return 24;
  if (total >= 7 && index === total - 1) return 4;
  if (total >= 6 && index === total - 2) return 6;
  return 8;
}

function AlbumPage({
  initialIndex = 0,
  mediaItems,
  onClose,
}: {
  initialIndex?: number;
  mediaItems: AlbumMediaItem[];
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const dotSizes = mediaItems.map((_, index) =>
    getAlbumDotSize(index, activeIndex, mediaItems.length),
  );
  const indicatorContentWidth =
    dotSizes.reduce((sum, size) => sum + size, 0) +
    Math.max(mediaItems.length - 1, 0) * 8;
  const indicatorWidth = indicatorContentWidth + 24;

  return (
    <div className="absolute inset-0 z-[60] flex flex-col overflow-hidden bg-[#1a1a1a] text-[#fafafa]">
      <header className="flex h-14 shrink-0 items-center justify-between bg-[#1a1a1a] px-1 [direction:ltr]">
        <div className="h-12 w-40 shrink-0" />
        <div className="min-w-0 flex-1" />
        <button
          aria-label="بستن آلبوم"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#fafafa] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffffff66]"
          onClick={onClose}
          type="button"
        >
          <AlbumCloseIcon />
        </button>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden bg-[#1a1a1a]">
        <Swiper
          className="h-full w-full"
          dir="rtl"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.slideTo(initialIndex, 0);
          }}
          slidesPerView={1}
        >
          {mediaItems.map((item, index) => (
            <SwiperSlide key={`${item.src}-${item.type}-${index}`}>
              <div className="pt-[202px]">
                <img
                  alt=""
                  className="aspect-[3/2] w-full object-cover"
                  src={item.src}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute bottom-13 left-0 right-0 z-10 flex justify-center">
          <div
            aria-label={`رسانه ${activeIndex + 1} از ${mediaItems.length}`}
            className="flex h-6 items-center justify-center"
            role="img"
            style={{ width: indicatorWidth }}
          >
            <div className="flex h-2 items-center gap-2">
              {mediaItems.map((item, index) => (
                <button
                  aria-label={`نمایش رسانه ${index + 1}`}
                  className={`block h-2 rounded-full ${index === activeIndex ? "bg-[#fafafa]" : "bg-[#fafafa29]"
                    }`}
                  key={`${item.type}-${index}`}
                  onClick={() => swiperRef.current?.slideTo(index)}
                  style={{ width: dotSizes[index] }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ViewAdContent({
  adId,
  ad,
  details,
  hasTour3d,
  mediaItems,
  mapPosition,
  onOpenAlbum,
  onRowAction,
}: {
  adId: string;
  ad: AdvertisementItem;
  details: ViewAdDetails;
  hasTour3d: boolean;
  mediaItems: AlbumMediaItem[];
  mapPosition: { latitude: number; longitude: number } | null;
  onOpenAlbum: (initialIndex?: number) => void;
  onRowAction: (label: string) => void;
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
    useState(false);
  const [areFacilitiesExpanded, setAreFacilitiesExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const propertyInfoItems = details.propertyInfoPreview.slice(0, 4);
  const visibleFacilityCount = areFacilitiesExpanded
    ? details.features.length
    : 6;
  const facilityItems = details.features.slice(0, visibleFacilityCount);
  const hasMorePropertyInfo = details.propertyInfoPreview.length > 4;
  const hasMoreFacilities = details.features.length > 6;
  const showAgency = isAgencyAdvertiser(ad);
  const shouldShowDescriptionMore = isDescriptionOverflowing;

  useEffect(() => {
    const updateDescriptionOverflow = () => {
      const element = descriptionRef.current;

      if (!element) {
        setIsDescriptionOverflowing(false);
        return;
      }

      setIsDescriptionOverflowing(
        element.scrollHeight > DESCRIPTION_COLLAPSED_HEIGHT + 1,
      );
    };

    updateDescriptionOverflow();
    window.addEventListener("resize", updateDescriptionOverflow);

    return () => {
      window.removeEventListener("resize", updateDescriptionOverflow);
    };
  }, [details.description]);

  return (
    <>
      <section className="bg-white pb-4">
        <GalleryHero
          hasTour3d={hasTour3d}
          mediaItems={mediaItems}
          onOpenAlbum={onOpenAlbum}
        />

        <div className="px-4 pt-4">
          <div className="flex h-7 items-center justify-between [direction:ltr]">
            <div className="flex items-center gap-1 text-xs font-medium leading-4 text-[#4d4d4d] [direction:ltr]">
              <span>{details.age}</span>
              <ClockIcon className="h-4 w-4 shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium leading-5 [direction:rtl]">
              <span className="text-[#4d4d4d]">کد آگهی:</span>
              <strong className="text-sm font-semibold leading-5 text-[#1a1a1a]">
                {details.adCode}
              </strong>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-right">
            <p className="m-0 text-sm font-normal leading-5 text-[#4d4d4d]">
              {details.locationTitle}
            </p>
            <h1 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a]">
              {details.headline}
            </h1>
          </div>

          <div className="mt-4 space-y-2">
            <PriceRow label="قیمت کل" value={details.totalPrice} />
            <PriceRow label="قیمت هر متر" value={details.pricePerMeter} />
          </div>
        </div>
      </section>

      <DetailSection icon="apartment" title="اطلاعات ملک">
        <PropertyGrid items={propertyInfoItems} />
        {hasMorePropertyInfo ? (
          <MoreLink to={`/ads/${adId}/property-info`}>اطلاعات بیشتر</MoreLink>
        ) : null}
      </DetailSection>

      <DetailSection icon="apartment" title="تجهیزات و امکانات">
        <div className="overflow-hidden">
          <PropertyGrid items={facilityItems} withLabels={false} />
        </div>
        {hasMoreFacilities ? (
          <InlineMoreButton
            onClick={() => setAreFacilitiesExpanded((current) => !current)}
          >
            {areFacilitiesExpanded
              ? "نمایش موارد کمتر"
              : `نمایش ${details.features.length - 6} مورد دیگر`}
          </InlineMoreButton>
        ) : null}
      </DetailSection>

      <DetailSection icon="apartment" title="توضیحات">
        <div
          className="relative mt-6 overflow-hidden text-right text-base font-normal leading-8 text-[#1a1a1a]"
          style={{
            height:
              shouldShowDescriptionMore && !isDescriptionExpanded
                ? DESCRIPTION_COLLAPSED_HEIGHT
                : "auto",
          }}
        >
          <p ref={descriptionRef} className="m-0 whitespace-pre-line">
            {details.description}
          </p>
          {shouldShowDescriptionMore && !isDescriptionExpanded ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-white/0 to-white" />
          ) : null}
        </div>
        {shouldShowDescriptionMore ? (
          <InlineMoreButton
            onClick={() => setIsDescriptionExpanded((current) => !current)}
          >
            {isDescriptionExpanded
              ? "نمایش کمتر توضیحات"
              : "نمایش ادامه توضیحات"}
          </InlineMoreButton>
        ) : null}
        {mapPosition ? (
          <MapPreview
            latitude={mapPosition.latitude}
            longitude={mapPosition.longitude}
          />
        ) : null}
      </DetailSection>

      {showAgency ? <AgencyCard details={details} /> : null}

      <section className="border-t-8 border-[#f0f0f0] bg-white">
        {details.rows.map((row) => (
          <button
            className="flex h-[88px] w-full items-center justify-between border-b-8 border-[#f0f0f0] px-8 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
            key={row.label}
            onClick={() => onRowAction(row.label)}
            type="button"
          >
            <div className="flex min-w-0 items-center gap-3">
              <ViewAdIcon className="text-[#808080]" name={row.icon} />
              <span className="truncate text-base font-medium leading-6 text-[#1a1a1a]">
                {row.label}
              </span>
            </div>
            <ViewAdIcon className="text-[#4d4d4d]" name="arrowLeft" />
          </button>
        ))}
      </section>
    </>
  );
}

function AgencyCard({ details }: { details: ViewAdDetails }) {
  return (
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg border border-[#cccccc] bg-white">
        <span className="text-2xl font-bold leading-none text-[#b6823a]">
          ب
        </span>
      </div>
      <h2 className="mt-4 text-base font-semibold leading-6 text-[#4d4d4d]">
        املاک جلیلیان
      </h2>
      <div className="mt-2 flex items-center justify-center gap-1 text-xs font-medium leading-4 text-[#0048c4]">
        <ViewAdIcon className="h-4 w-4" name="location" />
        <span>{details.agencyLocation}</span>
      </div>
      <div className="mx-auto mt-4 flex max-w-[220px] items-center justify-between text-xs font-medium leading-4 text-[#4d4d4d] [direction:ltr]">
        <div className="flex items-center gap-1">
          <span className="text-[#0faf73]">۸۵</span>
          <span>امتیاز</span>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
            src="/icons/star.svg"
          />
        </div>
        <div className="h-4 w-px bg-[#e0e0e0]" />
        <div className="flex items-center gap-1">
          <span className="text-[#0faf73]">۱۲</span>
          <span>رتبه</span>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
            src="/icons/ranking.svg"
          />
        </div>
      </div>
    </section>
  );
}

function NotFoundState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" />
      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
        <NotFoundErrorState />
      </main>
    </PageFrame>
  );
}

function LoadingState() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" />
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <ViewAdPageSkeleton />
      </main>
    </PageFrame>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded-lg bg-[#e8e8e8] ${className}`} />;
}

function ViewAdPageSkeleton() {
  return (
    <>
      <section className="bg-white px-4 pb-4 pt-4">
        <SkeletonBlock className="aspect-[328/219] w-full rounded-2xl" />
        <div className="mt-4 flex items-center justify-between">
          <SkeletonBlock className="h-5 w-20" />
          <SkeletonBlock className="h-5 w-28" />
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="ml-auto h-5 w-44" />
          <SkeletonBlock className="ml-auto h-6 w-64 max-w-full" />
        </div>
        <div className="mt-4 space-y-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </section>
      <ViewAdSectionSkeleton rows={4} />
      <ViewAdSectionSkeleton rows={6} />
      <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
        <SkeletonBlock className="ml-auto h-5 w-24" />
        <div className="mt-6 space-y-3">
          <SkeletonBlock className="ml-auto h-4 w-full" />
          <SkeletonBlock className="ml-auto h-4 w-11/12" />
          <SkeletonBlock className="ml-auto h-4 w-9/12" />
        </div>
      </section>
    </>
  );
}

function ViewAdSectionSkeleton({ rows }: { rows: number }) {
  return (
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-4">
      <SkeletonBlock className="ml-auto h-5 w-28" />
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="flex items-start gap-3" key={index}>
            <SkeletonBlock className="h-6 w-6 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ViewAdErrorState({
  error,
  message,
  onRetry,
}: {
  error?: unknown;
  message: string;
  onRetry?: () => void;
}) {
  const ErrorState = getRequestErrorState(error);
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-white">
      <div className="h-full min-h-0 bg-white">
        <ErrorState className="h-full" onRetry={onRetry ?? reloadPage} />
        <p className="sr-only">{message}</p>
      </div>
    </div>
  );
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(toEnglishDigits(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) {
    return toPersianDigits(value);
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("fa-IR").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "دارد" : "ندارد";
  }

  if (Array.isArray(value)) {
    const text: string = value
      .map((item) => toText(item))
      .filter(Boolean)
      .join("، ");

    return text || fallback;
  }

  return fallback;
}

function formatPrice(value: unknown) {
  const numericValue = toNumber(value);

  if (numericValue === undefined) {
    return toText(value, "توافقی");
  }

  if (numericValue >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000_000)} میلیارد`;
  }

  if (numericValue >= 1_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000)} میلیون`;
  }

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}

function readImages(ad: AdvertisementItem) {
  const apiImages = Array.isArray(ad.images) ? ad.images : [];

  const normalizedImages = apiImages
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          src: image,
          isMain: false,
          index,
        };
      }

      const imageItem = image as AdvertisementImageItem;

      return {
        src: imageItem.url ?? imageItem.src ?? imageItem.path ?? "",
        isMain: imageItem.is_main === true,
        index,
      };
    })
    .filter((image) => Boolean(image.src))
    .sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.index - b.index;
    });

  const imageSources =
    normalizedImages.length > 0
      ? normalizedImages.map((image) => image.src)
      : typeof ad.image === "string" && ad.image
        ? [ad.image]
        : [];

  return Array.from(new Set(imageSources)).map((image) =>
    getApiAssetUrl(image),
  );
}

function readAssetField(ad: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = ad[key];

    if (typeof value === "string" && value.trim()) {
      return getApiAssetUrl(value);
    }

    if (value && typeof value === "object") {
      const asset = value as { path?: unknown; src?: unknown; url?: unknown };
      const src = asset.url ?? asset.path ?? asset.src;

      if (typeof src === "string" && src.trim()) {
        return getApiAssetUrl(src);
      }
    }
  }

  return "";
}

function readBooleanFeature(ad: AdvertisementItem, labels: string[]) {
  const features = Array.isArray(ad.features) ? ad.features : [];

  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (["1", "true", "yes"].includes(normalizedValue)) return true;
      if (["0", "false", "no"].includes(normalizedValue)) return false;
    }
  }

  return false;
}

function readVideoUrl(ad: AdvertisementItem) {
  return readAssetField(ad, [
    "video",
    "video_url",
    "videoUrl",
    "video_path",
    "videoPath",
  ]);
}

function hasTour3d(ad: AdvertisementItem) {
  return Boolean(
    readAssetField(ad, [
      "model_3d",
      "model3d",
      "model_3d_url",
      "model3d_url",
      "virtual_tour_link",
      "virtualTourLink",
      "virtual_tour",
      "tour_3d",
      "tour3d",
    ]) || readBooleanFeature(ad, ["has_virtual_tour", "has_3d_model", "has_model_3d"]),
  );
}

function buildGalleryMediaItems(ad: AdvertisementItem) {
  const images = readImages(ad);
  const videoUrl = readVideoUrl(ad);
  const imageItems =
    images.length > 0
      ? images.map((src): AlbumMediaItem => ({ src, type: "image" }))
      : albumMediaItems.filter((item) => item.type === "image");

  if (!videoUrl) {
    return imageItems;
  }

  return [
    ...imageItems,
    {
      src: images[0] ?? "/figma/view-ad-gallery.png",
      type: "video" as const,
    },
  ];
}

const propertyInfoLabelMap: Record<string, string> = {
  area: "متراژ آپارتمان",
  land_area: "متراژ زمین",
  building_area: "متراژ بنا",
  building_age: "سن بنا",
  rooms: "تعداد اتاق",
  floor: "طبقه آپارتمان",
  has_document: "سند",
  renovated: "بازسازی شده",
  furnished: "مبله با لوازم",
  has_loan: "وام",
  suitable_for: "مناسب برای",
  document_type: "نوع سند",
  land_position: "موقعیت زمین",
  commercial_license: "مجوز تجاری",
  construction_license: "مجوز ساخت",
  standard_capacity: "ظرفیت استاندارد",
  extra_people_capacity: "تعداد نفرات اضافه",
  min_price: "حداقل قیمت",
  max_price: "حداکثر قیمت",
  mortgage_price: "رهن",
  rent_price: "اجاره",
  participation_type: "نوع مشارکت",
  builder_share_percent: "سهم سازنده",
  villa_type: "نوع ویلا",
  heating_cooling: "سرمایش و گرمایش",
  exchange_with: "قابل معاوضه با",
  advertiser_type: "نوع آگهی‌دهنده",
};

const propertyInfoOrder = [
  "area",
  "land_area",
  "building_area",
  "rooms",
  "building_age",
  "floor",
  "land_position",
  "has_document",
  "renovated",
  "furnished",
  "has_loan",
  "suitable_for",
  "document_type",
  "commercial_license",
  "construction_license",
  "standard_capacity",
  "extra_people_capacity",
  "min_price",
  "max_price",
  "mortgage_price",
  "rent_price",
  "participation_type",
  "builder_share_percent",
  "villa_type",
  "heating_cooling",
  "exchange_with",
  "advertiser_type",
];

const ignoredFeatureLabels = new Set([
  "form_code",
  "neighborhood_id",
  "price",
  "published_at",
  "is_special",
  "has_image",
  "has_video",
  "facilities",
]);

function getFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  label: string,
) {
  return features.find((feature) => feature.label === label)?.value;
}

function getFirstFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function buildPropertyInfoItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const orderedItems = propertyInfoOrder
    .map((label) => {
      const feature = features.find((item) => item.label === label);

      if (!feature) {
        return null;
      }

      return buildPropertyInfoItem(label, feature.value);
    })
    .filter((item): item is PropertyInfoItem => item !== null);

  const extraItems = features
    .filter((feature) => {
      const label = feature.label ?? "";

      return (
        label &&
        !propertyInfoOrder.includes(label) &&
        !ignoredFeatureLabels.has(label)
      );
    })
    .map((feature) => buildPropertyInfoItem(feature.label ?? "", feature.value))
    .filter((item): item is PropertyInfoItem => item !== null);

  return [...orderedItems, ...extraItems];
}

type PropertyInfoItem = {
  icon: IconName;
  iconSrc: string | null;
  label: string;
  value: string;
};

function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  if (typeof value === "boolean") {
    if (label === "has_loan") {
      return value ? "دارای وام" : "بدون وام";
    }

    if (label === "exchange_with") {
      return value ? "دارای معاوضه" : "بدون معاوضه";
    }

    return value ? "دارد" : "ندارد";
  }

  if (label === "area" || label === "land_area" || label === "building_area") {
    const text = toText(value);
    return text ? `${text} متر` : "-";
  }

  if (label === "price") {
    return `${formatPrice(value)} تومان`;
  }

  return toText(value, "-");
}

function buildPropertyInfoItem(label: string, rawValue: unknown) {
  const displayLabel = propertyInfoLabelMap[label] ?? label;
  const normalizedValue = normalizeDetailValue(label, rawValue);
  const { formattedValue, iconSrc } = getBuildingInfo(
    displayLabel,
    Array.isArray(normalizedValue)
      ? normalizedValue.join("، ")
      : normalizedValue,
  );

  return {
    icon: iconForFeature(displayLabel),
    iconSrc,
    label: displayLabel,
    value: formattedValue,
  };
}

function buildFacilityItems(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const facilities = getFeatureValue(features, "facilities");

  if (!Array.isArray(facilities)) {
    return [];
  }

  return facilities
    .map((facility) => toText(facility))
    .filter(Boolean)
    .map((facility) => ({
      icon: "apartment" as IconName,
      iconSrc: getFeatureIconSrc(facility),
      label: facility,
      value: facility,
      featureIconLabel: facility,
      hideFallbackIcon: true,
    }));
}

function withFeatureIconAssets(items: ViewAdDetails["features"]) {
  return items.map((item) => ({
    ...item,
    featureIconLabel: item.featureIconLabel ?? item.value,
    hideFallbackIcon: true,
    iconSrc:
      item.iconSrc ?? getFeatureIconSrc(item.featureIconLabel ?? item.value),
  }));
}

function formatPricePerMeter(totalPrice: unknown, area: unknown) {
  const numericPrice = toNumber(totalPrice);
  const numericArea = toNumber(area);

  if (
    numericPrice === undefined ||
    numericArea === undefined ||
    numericArea <= 0
  ) {
    return viewAdDemo.pricePerMeter;
  }

  return formatPrice(numericPrice / numericArea);
}

function getMapPosition(ad: AdvertisementItem) {
  const position = ad as {
    lat?: unknown;
    latitude?: unknown;
    lng?: unknown;
    long?: unknown;
    longitude?: unknown;
  };
  const lat = toNumber(position.lat ?? position.latitude);
  const lng = toNumber(position.lng ?? position.long ?? position.longitude);

  if (lat === undefined || lng === undefined) {
    return null;
  }

  return { latitude: lat, longitude: lng };
}

function readOwnerPhone(ad: AdvertisementItem) {
  return toText((ad as { owner_phone?: unknown }).owner_phone);
}

function isAgencyAdvertiser(ad: AdvertisementItem) {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const advertiserType = toText(getFeatureValue(features, "advertiser_type"));
  const ownerType = toText((ad as { owner_type?: unknown }).owner_type);

  return (
    advertiserType.includes("آژانس") ||
    advertiserType.includes("املاک") ||
    advertiserType.includes("مشاور") ||
    ownerType.includes("agency")
  );
}

function iconForFeature(label: string): IconName {
  if (label.includes("متراژ")) return "area";
  if (label.includes("اتاق") || label.includes("خواب")) return "bed";
  if (label.includes("سال")) return "building";
  return "apartment";
}

function mapAdToDetails(ad: AdvertisementItem): ViewAdDetails {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const propertyInfoPreview =
    features.length > 0
      ? buildPropertyInfoItems(features)
      : viewAdDemo.propertyInfoPreview;
  const facilities =
    features.length > 0
      ? buildFacilityItems(features)
      : withFeatureIconAssets(viewAdDemo.features);
  const publishedHoursAgo = toNumber(ad.published_hours_ago);
  const age =
    publishedHoursAgo !== undefined
      ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش`
      : toText(getFeatureValue(features, "published_at"), viewAdDemo.age);
  const totalPrice = ad.price ?? getFeatureValue(features, "price");
  const meterArea =
    getFirstFeatureValue(features, ["area", "land_area", "building_area"]) ??
    (ad as { area?: unknown }).area;
  const description =
    (ad as { description?: unknown }).description ??
    (ad as { short_description?: unknown }).short_description;

  return {
    ...viewAdDemo,
    adCode: toPersianDigits(
      (ad as { track_code?: unknown }).track_code ??
      ad.id ??
      ad._id ??
      viewAdDemo.adCode,
    ),
    age,
    agency: toText(
      getFeatureValue(features, "advertiser_type"),
      viewAdDemo.agency,
    ),
    description: toText(description, viewAdDemo.description),
    features: facilities,
    headline: toText(ad.title ?? ad.label, viewAdDemo.headline),
    locationTitle: toText(ad.label ?? ad.title, viewAdDemo.locationTitle),
    pricePerMeter: formatPricePerMeter(totalPrice, meterArea),
    propertyInfoPreview,
    propertyInfoRows: propertyInfoPreview,
    title: toText(ad.title ?? ad.label, viewAdDemo.title),
    totalPrice: formatPrice(totalPrice),
  };
}

type ViewAdSubPage = "detail" | "property-info" | "equipment-facilities";

const PROPERTY_DETAIL_ICONS = {
  loan: "/icons/loan.svg",
  exchange: "/icons/exchange.svg",
  selected: "/icons/selected-icon.svg",
};

type DetailInfoValue = string | string[];

type DetailInfoTone = "neutral" | "success" | "warning";

type DetailInfoLayout = "grid" | "rows";

type DetailInfoItem = {
  icon: IconName;
  label: string;
  value: DetailInfoValue;
  badge?: boolean;
  tone?: DetailInfoTone;
  featureIconLabel?: string;
  hideFallbackIcon?: boolean;
  iconSrc?: string | null;
  extraRows?: Array<{
    label: string;
    value: string;
  }>;
};

type DetailInfoSection = {
  title: string;
  items: DetailInfoItem[];
  layout?: DetailInfoLayout;
  columns?: 2 | 3;
  badges?: DetailInfoItem[];
  showIcons?: boolean;
};

function parseViewAdIdFromPath(pathname: string) {
  const parsedId = parseAdIdFromPath(pathname);

  if (parsedId) {
    return parsedId;
  }

  const match = pathname.match(/\/ads\/([^/]+)/);
  return match?.[1] ?? null;
}

function getViewAdSubPage(pathname: string): ViewAdSubPage {
  if (pathname.endsWith("/property-info")) {
    return "property-info";
  }

  if (pathname.endsWith("/equipment-facilities")) {
    return "equipment-facilities";
  }

  return "detail";
}

function goBackToAd(adId: string) {
  const fallbackPath = `/ads/${adId}`;

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.assign(fallbackPath);
}

function getDetailPageTitle(
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const formCode = toText(getFeatureValue(features, "form_code"));

  if (formCode.includes("garden-villa")) return "اطلاعات ملک";
  if (formCode.includes("villa")) return "اطلاعات ویلا";
  if (formCode.includes("land")) return "اطلاعات زمین";

  return "اطلاعات ملک";
}

function isFilledValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item): boolean => isFilledValue(item));
  }

  return value !== undefined && value !== null && value !== "";
}

function getFirstExistingFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (isFilledValue(value)) {
      return value;
    }
  }

  return undefined;
}

function toValueArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  const text = toText(value);

  if (!text) {
    return [];
  }

  return text
    .split(/[،,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBooleanLike(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1 ? true : value === 0 ? false : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "دارد", "بله", "هست"].includes(normalized)) {
      return true;
    }

    if (
      ["false", "0", "no", "n", "ندارد", "خیر", "نیست"].includes(normalized)
    ) {
      return false;
    }
  }

  return undefined;
}

function appendSuffixIfNeeded(value: unknown, suffix: string) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes(suffix)) {
    return text;
  }

  return `${text} ${suffix}`;
}

function formatAreaDetailValue(value: unknown) {
  return appendSuffixIfNeeded(value, "متر");
}

function formatAgeDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("سال") || text.includes("نوساز")) {
    return text;
  }

  return `${text} سال`;
}

function formatRoomDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("اتاق") || text.includes("خواب")) {
    return text;
  }

  return `${text} اتاق`;
}

function formatFloorDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `طبقه ${text}`;
}

function formatTotalFloorsDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "-";
  }

  if (text.includes("طبقه")) {
    return text;
  }

  return `${text} طبقه`;
}

function formatTomanDetailValue(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "";
  }

  if (
    text.includes("تومان") ||
    text.includes("میلیون") ||
    text.includes("میلیارد")
  ) {
    return text;
  }

  return `${formatPrice(value)} تومان`;
}

function getDetailIconByLabel(label: string): IconName {
  if (label.includes("متراژ") || label.includes("area")) return "area";
  if (
    label.includes("اتاق") ||
    label.includes("خواب") ||
    label.includes("rooms")
  )
    return "bed";
  if (
    label.includes("سن") ||
    label.includes("طبقه") ||
    label.includes("ساختمان")
  )
    return "building";
  return "apartment";
}

function createGridItem({
  features,
  labels,
  label,
  formatter,
  icon,
}: {
  features: NonNullable<AdvertisementItem["features"]>;
  labels: string[];
  label: string;
  formatter?: (value: unknown) => string;
  icon?: IconName;
}): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);

  if (!isFilledValue(rawValue)) {
    return null;
  }

  const value = formatter ? formatter(rawValue) : toText(rawValue, "-");

  if (!value || value === "-") {
    return null;
  }

  const iconInfo = getBuildingInfo(label, value);

  return {
    icon: icon ?? getDetailIconByLabel(label),
    iconSrc: iconInfo.iconSrc,
    label,
    value,
  };
}

function createCheckBadge(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
  label: string,
): DetailInfoItem | null {
  const rawValue = getFirstExistingFeatureValue(features, labels);
  const isActive = toBooleanLike(rawValue);

  if (isActive !== true) {
    return null;
  }

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.selected,
    label,
    tone: "neutral",
    value: label,
  };
}

function createLoanRow(
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const loanStatusRaw = getFirstExistingFeatureValue(features, [
    "has_loan",
    "loan",
    "has_mortgage",
    "mortgage",
  ]);

  const loanAmountRaw = getFirstExistingFeatureValue(features, [
    "loan_amount",
    "mortgage_amount",
    "loan_price",
    "loan_value",
  ]);

  const installmentRaw = getFirstExistingFeatureValue(features, [
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
  ]);

  const statusFromBoolean = toBooleanLike(loanStatusRaw);
  const hasLoan = statusFromBoolean ?? isFilledValue(loanAmountRaw);

  const extraRows =
    hasLoan === true
      ? [
        loanAmountRaw
          ? {
            label: "مبلغ وام:",
            value: formatTomanDetailValue(loanAmountRaw),
          }
          : null,
        installmentRaw
          ? {
            label: "مبلغ قسط:",
            value: formatTomanDetailValue(installmentRaw),
          }
          : null,
      ].filter(
        (item): item is { label: string; value: string } =>
          item !== null && Boolean(item.value),
      )
      : [];

  return {
    badge: true,
    icon: "apartment",
    iconSrc: PROPERTY_DETAIL_ICONS.loan,
    label: "وام",
    tone: hasLoan ? "success" : "warning",
    value: hasLoan ? "دارای وام" : "بدون وام",
    extraRows,
  };
}

function createExchangeRow(
  features: NonNullable<AdvertisementItem["features"]>,
): DetailInfoItem {
  const exchangeStatusRaw = getFirstExistingFeatureValue(features, [
    "has_exchange",
    "exchange",
    "is_exchangeable",
  ]);

  const exchangeWithRaw = getFirstExistingFeatureValue(features, [
    "exchange_with",
    "exchange_items",
    "exchange_types",
  ]);

  const exchangeValues = toValueArray(exchangeWithRaw);
  const statusFromBoolean = toBooleanLike(exchangeStatusRaw);
  const hasExchange = statusFromBoolean ?? exchangeValues.length > 0;

  if (hasExchange && exchangeValues.length > 0) {
    return {
      icon: "arrowLeft",
      iconSrc: PROPERTY_DETAIL_ICONS.exchange,
      label: "معاوضه با:",
      tone: "neutral",
      value: exchangeValues,
    };
  }

  return {
    badge: true,
    icon: "arrowLeft",
    iconSrc: PROPERTY_DETAIL_ICONS.exchange,
    label: "معاوضه با:",
    tone: hasExchange ? "success" : "warning",
    value: hasExchange ? "دارای معاوضه" : "بدون معاوضه",
  };
}

function buildPropertyDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = Array.isArray(ad.features) ? ad.features : [];

  const mainItems = [
    createGridItem({
      features,
      labels: ["area", "apartment_area", "unit_area", "meterage"],
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
      labels: ["building_age", "age", "construction_age"],
      label: "سن ساخت",
      formatter: formatAgeDetailValue,
      icon: "building",
    }),
    createGridItem({
      features,
      labels: ["floor", "unit_floor", "apartment_floor"],
      label: "طبقه آپارتمان",
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
      labels: [
        "land_position",
        "ground_position",
        "plot_position",
        "land_location",
      ],
      label: "موقعیت زمین",
    }),
    createGridItem({
      features,
      labels: ["document_type", "document", "deed_type"],
      label: "سند",
    }) ??
    createGridItem({
      features,
      labels: ["has_document"],
      label: "سند",
    }),
    createGridItem({
      features,
      labels: ["total_floors", "floors", "building_floors", "apartment_floors"],
      label: "طبقات آپارتمان",
      formatter: formatTotalFloorsDetailValue,
      icon: "building",
    }),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingBadges = [
    createCheckBadge(features, ["renovated", "is_renovated"], "بازسازی شده"),
    createCheckBadge(features, ["furnished", "is_furnished"], "مبله با لوازم"),
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

  const loanExchangeItems = [
    createLoanRow(features),
    createExchangeRow(features),
  ];

  const sections: DetailInfoSection[] = [
    {
      title: "مشخصات اصلی",
      items: mainItems,
      layout: "grid",
      columns: 2,
      showIcons: true,
    },
    {
      title: "موقعیت و ساختمان",
      items: buildingItems,
      layout: "grid",
      columns: 3,
      badges: buildingBadges,
    },
    {
      title: "متریال و نازک‌کاری",
      items: finishItems,
      layout: "grid",
      columns: 3,
    },
    {
      title: "وام و معاوضه",
      items: loanExchangeItems,
      layout: "rows",
    },
  ];

  return sections.filter(
    (section) =>
      section.items.length > 0 ||
      Boolean(section.badges && section.badges.length > 0),
  );
}

function buildFacilitiesDetailSections(
  ad: AdvertisementItem,
): DetailInfoSection[] {
  const features = Array.isArray(ad.features) ? ad.features : [];
  const facilities = getFeatureValue(features, "facilities");

  if (!Array.isArray(facilities)) {
    return [];
  }

  const items = facilities
    .map((facility) => toText(facility))
    .filter(Boolean)
    .map((facility) => ({
      icon: "apartment" as IconName,
      iconSrc: getFeatureIconSrc(facility),
      label: facility,
      value: "دارد",
      badge: true,
      tone: "neutral" as DetailInfoTone,
      featureIconLabel: facility,
      hideFallbackIcon: true,
    }));

  return [
    {
      title: "امکانات و تجهیزات",
      items,
      layout: "grid",
      columns: 3,
    },
  ];
}

function DetailInfoIcon({
  item,
  className = "h-[18px] w-[18px] shrink-0 text-[#808080]",
}: {
  item: DetailInfoItem;
  className?: string;
}) {
  const iconAlt =
    item.label ||
    (Array.isArray(item.value) ? item.value.join("، ") : item.value);

  if (item.iconSrc) {
    return (
      <img
        alt={iconAlt}
        className={`${className} object-contain opacity-70`}
        src={item.iconSrc}
        title={iconAlt}
      />
    );
  }

  if (item.hideFallbackIcon) {
    return <span aria-hidden="true" className={className} />;
  }

  if (item.featureIconLabel) {
    return (
      <FeaturesIcons
        feature={item.featureIconLabel}
        className={`${className} object-contain opacity-70`}
      />
    );
  }

  return <ViewAdIcon className={className} name={item.icon} />;
}

function DetailInfoValueView({
  item,
  align = "start",
}: {
  item: DetailInfoItem;
  align?: "start" | "center" | "end";
}) {
  const alignClassName =
    align === "center"
      ? "justify-center"
      : align === "end"
        ? "justify-end"
        : "justify-start";

  if (Array.isArray(item.value)) {
    return (
      <div className={`flex flex-wrap gap-2 ${alignClassName}`}>
        {item.value.map((value) => (
          <span
            className="rounded-md bg-[#edeff3] px-2.5 py-1.5 text-base font-semibold leading-6 text-[#1A1A1A]"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    );
  }

  if (item.badge) {
    const badgeClassName =
      item.tone === "success"
        ? "bg-[#0FAF7314] text-[#0FAF73]"
        : item.tone === "warning"
          ? "bg-[#FF8D0014] text-[#FF8D00]"
          : "bg-[#edeff3] text-[#4d4d4d]";

    return (
      <span
        className={`inline-flex min-h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold leading-5 ${badgeClassName}`}
      >
        {item.value}
      </span>
    );
  }

  return <span>{item.value}</span>;
}

function DetailInfoItemCard({
  item,
  showIcon = false,
}: {
  item: DetailInfoItem;
  showIcon?: boolean;
}) {
  const labelPaddingClassName = showIcon ? "pr-[26px]" : "pr-0";

  return (
    <div className="flex min-h-[58px] w-full flex-col items-start justify-start gap-1 text-right [direction:rtl]">
      <div className="flex min-h-7 w-full items-center justify-start gap-2 text-right text-base font-semibold leading-6 text-[#1A1A1A] [direction:rtl]">
        {showIcon ? <DetailInfoIcon item={item} /> : null}

        <div className="text-base font-semibold leading-6 text-[#1A1A1A]">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      <div
        className={`w-full text-right text-sm font-medium leading-5 text-[#808080] ${labelPaddingClassName}`}
      >
        {item.label}
      </div>
    </div>
  );
}

function DetailInfoCheckBadges({ badges }: { badges: DetailInfoItem[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-[#e0e0e0] pt-4">
      <div className="flex flex-wrap justify-start gap-2 [direction:rtl]">
        {badges.map((badge) => (
          <span
            className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#edeff3] p-2 text-sm font-semibold leading-5 text-[#4d4d4d]"
            key={badge.label}
          >
            <img
              alt=""
              aria-hidden="true"
              className="h-5 w-5 shrink-0 object-contain"
              src={badge.iconSrc ?? PROPERTY_DETAIL_ICONS.selected}
            />
            <span>{badge.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DetailInfoRowCard({ item }: { item: DetailInfoItem }) {
  return (
    <div className="border-b border-[#e0e0e0] last:border-b-0">
      <div className="flex min-h-[60px] items-center justify-start gap-2 py-2 text-right [direction:rtl]">
        {item.iconSrc ? (
          <img
            alt=""
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0 object-contain"
            src={item.iconSrc}
          />
        ) : null}

        <span className="text-base font-medium leading-6 text-[#808080]">
          {item.label}
        </span>

        <div className="mr-0">
          <DetailInfoValueView align="start" item={item} />
        </div>
      </div>

      {item.extraRows && item.extraRows.length > 0 ? (
        <div className="space-y-3 pb-5 text-left [direction:ltr]">
          {item.extraRows.map((row) => (
            <div
              className="flex items-center justify-start gap-2 text-sm font-medium leading-5 [direction:rtl]"
              key={row.label}
            >
              <span className="text-sm font-medium leading-5 text-[#808080]">
                {row.label}
              </span>
              <strong className="text-sm font-semibold leading-5 text-[#1A1A1A]">
                {row.value}
              </strong>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DetailInfoSectionBlock({ section }: { section: DetailInfoSection }) {
  const columns = section.columns ?? 3;
  const gridClassName =
    columns === 2 ? "grid-cols-2 gap-x-12" : "grid-cols-3 gap-x-4";
  const isRowsLayout = section.layout === "rows";

  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white px-4 py-4 last:border-b-0">
      <div className="border-b border-[#e0e0e0] pb-4 text-right text-[15px] font-medium leading-5 text-[#808080]">
        {section.title}
      </div>

      {isRowsLayout ? (
        <div className="pt-3">
          {section.items.map((item) => (
            <DetailInfoRowCard
              item={item}
              key={`${section.title}-${item.label}`}
            />
          ))}
        </div>
      ) : (
        <>
          <div
            className={`grid ${gridClassName} justify-items-start gap-y-6 py-5 [direction:rtl]`}
          >
            {section.items.map((item) => (
              <DetailInfoItemCard
                item={item}
                key={`${section.title}-${item.label}`}
                showIcon={section.showIcons === true}
              />
            ))}
          </div>

          <DetailInfoCheckBadges badges={section.badges ?? []} />
        </>
      )}
    </section>
  );
}

function DetailInfoFullPage({
  title,
  sections,
  adId,
}: {
  title: string;
  sections: DetailInfoSection[];
  adId: string;
}) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar onBack={() => goBackToAd(adId)} title={title} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {sections.length > 0 ? (
          sections.map((section) => (
            <DetailInfoSectionBlock key={section.title} section={section} />
          ))
        ) : (
          <div className="bg-white px-4 py-10 text-center text-sm font-medium leading-5 text-[#808080]">
            اطلاعاتی برای نمایش وجود ندارد.
          </div>
        )}
      </main>
    </PageFrame>
  );
}

function redirectToLoginProcess() {
  const redirectPath = `${window.location.pathname}${window.location.search}`;

  storeLoginRedirectPath(redirectPath);
  window.history.pushState({}, "", "/login/phone");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function isLoggedIn() {
  return Boolean(getStoredAuthSession());
}

export function ViewAdPage() {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [albumInitialIndex, setAlbumInitialIndex] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isViolationReportOpen, setIsViolationReportOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [toast, setToast] = useState<ActionToast | null>(null);
  const adId = parseViewAdIdFromPath(window.location.pathname);
  const toggleBadge = useToggleAdvertiseBadgeMutation();
  const saveNote = useSaveAdvertiseNoteMutation();
  const submitFeedback = useSubmitAdvertiseFeedbackMutation();
  const submitReport = useSubmitAdvertiseReportMutation();
  const reportReasonsQuery = useAdvertiseReportReasonsQuery(isViolationReportOpen);
  const {
    data: ad,
    error,
    isError,
    isLoading,
    refetch,
  } = useAdvertisementDetailQuery(adId);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  if (adId == null) {
    return <NotFoundState />;
  }

  const isMockAdRequest = mockAdIds.has(adId);

  if (isLoading && !isMockAdRequest) {
    return <LoadingState />;
  }

  if (isError && !isMockAdRequest) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت آگهی با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = isMockAdRequest ? singleAdMockData : ad;

  if (!resolvedAd) {
    return <NotFoundState />;
  }

  const details = mapAdToDetails(resolvedAd);
  const subPage = getViewAdSubPage(window.location.pathname);

  if (subPage === "property-info") {
    const features = Array.isArray(resolvedAd.features)
      ? resolvedAd.features
      : [];

    return (
      <DetailInfoFullPage
        adId={adId}
        sections={buildPropertyDetailSections(resolvedAd)}
        title={getDetailPageTitle(features)}
      />
    );
  }

  if (subPage === "equipment-facilities") {
    return (
      <DetailInfoFullPage
        adId={adId}
        sections={buildFacilitiesDetailSections(resolvedAd)}
        title="تجهیزات و امکانات"
      />
    );
  }

  const mediaItems = buildGalleryMediaItems(resolvedAd);
  const resolvedHasTour3d = hasTour3d(resolvedAd);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const handleRowAction = (label: string) => {
    if (label.includes("بازخورد")) {
      if (!isLoggedIn()) {
        redirectToLoginProcess();
        return;
      }

      setIsFeedbackOpen(true);
      return;
    }

    if (label.includes("یادداشت")) {
      if (!isLoggedIn()) {
        redirectToLoginProcess();
        return;
      }

      setIsNoteOpen(true);
      return;
    }

    if (label.includes("گزارش") || label.includes("تخلف")) {
      if (!isLoggedIn()) {
        redirectToLoginProcess();
        return;
      }

      setIsViolationReportOpen(true);
      return;
    }

    showToast(`${label} برای نسخه نمایشی انتخاب شد`, "اطلاع", "info");
  };

  const handleTopBarAction = async (icon: IconName) => {
    if (icon === "note") {
      if (!isLoggedIn()) {
        redirectToLoginProcess();
        return;
      }

      setIsNoteOpen(true);
      return;
    }

    if (icon === "share") {
      const shareUrl = window.location.href;
      const shareTitle = details.title || document.title;

      try {
        if (navigator.share) {
          await navigator.share({
            text: details.locationTitle || details.description,
            title: shareTitle,
            url: shareUrl,
          });
          return;
        }

        await navigator.clipboard.writeText(shareUrl);
        showToast("لینک آگهی کپی شد");
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === "AbortError") {
          return;
        }

        showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
      }
      return;
    }

    if (icon === "bookmark") {
      if (!isLoggedIn()) {
        redirectToLoginProcess();
        return;
      }

      if (!adId || toggleBadge.isPending) {
        return;
      }

      toggleBadge.mutate(adId, {
        onError: (badgeError) => {
          if (isUnauthorizedApiError(badgeError)) {
            redirectToLoginProcess();
            return;
          }

          showToast(
            getApiErrorMessage(badgeError, "ثبت نشان با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsBookmarked((current) => {
            const next = !current;

            showToast(
              next
                ? "آگهی به نشان‌ها اضافه شد"
                : "آگهی از نشان‌ها حذف شد",
            );

            return next;
          });
        },
      });
    }
  };

  const handleSaveNote = () => {
    const cleanNote = noteText.trim();

    if (!adId || !cleanNote || saveNote.isPending) {
      return;
    }

    if (!isLoggedIn()) {
      redirectToLoginProcess();
      return;
    }

    saveNote.mutate(
      { advertiseId: adId, note: cleanNote },
      {
        onError: (noteError) => {
          if (isUnauthorizedApiError(noteError)) {
            redirectToLoginProcess();
            return;
          }

          showToast(
            getApiErrorMessage(noteError, "ثبت یادداشت با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsNoteOpen(false);
          showToast("یادداشت شما ثبت شد");
        },
      },
    );
  };

  const handleSubmitFeedback = (feedback: AdvertiseFeedbackPayload) => {
    if (!adId || submitFeedback.isPending) {
      return;
    }

    if (!isLoggedIn()) {
      redirectToLoginProcess();
      return;
    }

    submitFeedback.mutate(
      { advertiseId: adId, feedback },
      {
        onError: (feedbackError) => {
          if (isUnauthorizedApiError(feedbackError)) {
            redirectToLoginProcess();
            return;
          }

          showToast(
            getApiErrorMessage(feedbackError, "ثبت بازخورد با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsFeedbackOpen(false);
          showToast("بازخورد شما ثبت شد");
        },
      },
    );
  };

  const handleSubmitReport = ({
    description,
    reportReasonId,
  }: ViolationReportSubmitPayload) => {
    if (!adId || submitReport.isPending) {
      return;
    }

    if (!isLoggedIn()) {
      redirectToLoginProcess();
      return;
    }

    submitReport.mutate(
      {
        advertiseId: adId,
        description,
        reportReasonId,
      },
      {
        onError: (reportError) => {
          if (isUnauthorizedApiError(reportError)) {
            redirectToLoginProcess();
            return;
          }

          showToast(
            getApiErrorMessage(reportError, "ارسال گزارش تخلف با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsViolationReportOpen(false);
          showToast("گزارش تخلف ارسال شد");
        },
      },
    );
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar
        backTo="/home"
        bookmarked={isBookmarked}
        onAction={handleTopBarAction}
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

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-[#f0f0f0]">
        <ViewAdContent
          adId={adId}
          ad={resolvedAd}
          details={details}
          hasTour3d={resolvedHasTour3d}
          mediaItems={mediaItems}
          mapPosition={getMapPosition(resolvedAd)}
          onOpenAlbum={(initialIndex = 0) => {
            setAlbumInitialIndex(initialIndex);
            setIsAlbumOpen(true);
          }}
          onRowAction={handleRowAction}
        />
      </main>

      <div className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-8px_24px_rgba(26,26,26,0.12)]">
        <div className="grid grid-cols-2 gap-8 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={() => setIsContactSheetOpen(true)}
            type="button"
          >
            تماس با مشاور
          </button>
          <RouteLink
            className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            to="/chat/1"
          >
            <span>چت با مشاور</span>
            <ViewAdIcon className="h-5 w-5" name="chat" />
          </RouteLink>
        </div>
      </div>

      <ContactInfoBottomSheet
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
        phoneNumber={readOwnerPhone(resolvedAd)}
      />

      {isFeedbackOpen ? (
        <ViewAdFeedbackPage
          isSubmitting={submitFeedback.isPending}
          onClose={() => setIsFeedbackOpen(false)}
          onSubmit={handleSubmitFeedback}
        />
      ) : null}

      {isNoteOpen ? (
        <ViewAdNotePage
          isSaving={saveNote.isPending}
          noteText={noteText}
          onChangeNote={setNoteText}
          onClose={() => setIsNoteOpen(false)}
          onSave={handleSaveNote}
        />
      ) : null}

      {isViolationReportOpen ? (
        <ViewAdViolationReportPage
          errorMessage={
            reportReasonsQuery.isError
              ? getApiErrorMessage(
                  reportReasonsQuery.error,
                  "دریافت دلایل گزارش با خطا مواجه شد.",
                )
              : undefined
          }
          isLoading={reportReasonsQuery.isLoading}
          isSubmitting={submitReport.isPending}
          onClose={() => setIsViolationReportOpen(false)}
          onRetry={() => void reportReasonsQuery.refetch()}
          onSubmit={handleSubmitReport}
          reasons={reportReasonsQuery.data ?? []}
        />
      ) : null}

      {isAlbumOpen ? (
        <AlbumPage
          initialIndex={albumInitialIndex}
          mediaItems={mediaItems}
          onClose={() => setIsAlbumOpen(false)}
        />
      ) : null}
    </PageFrame>
  );
}
