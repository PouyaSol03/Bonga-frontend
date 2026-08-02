import { useEffect, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import { BottomSheet } from "../../shared/components/BottomSheet";
import { ColorableSvgIcon } from "../../shared/components/ColorableSvgIcon";
import { AdLocationMap } from "../../shared/components/AdLocationMap";
import { Snackbar, type SnackbarVariant } from "../../shared/components/Snackbar";
import { RouteLink } from "../../app/router/RouteLink";
import { PageFrame } from "../../app/layout/PageFrame";
import { getApiErrorMessage, isUnauthorizedApiError } from "../../core/api/api";
import {
  useAdvertisementDetailQuery,
  useAdvertisementPreviewQuery,
  useAdvertiseReportReasonsQuery,
  useSubmitAdvertiseFeedbackMutation,
  useSubmitAdvertiseReportMutation,
} from "../../core/hooks/advertisement.hooks";
import { useSaveAdvertiseNoteMutation, useToggleAdvertiseBadgeMutation } from "../../core/hooks/account.hooks";
import { useCreateAdvertiseChatMutation } from "../../core/hooks/chat.hooks";
import type {
  AdvertiseFeedbackPayload,
  AdvertisementItem,
} from "../../core/services/advertisement.service";
import {
  DetailSection,
  MoreLink,
  PropertyGrid,
  ViewAdTopBar,
} from "./viewAdComponents";
import { ViewAdIcon } from "./ViewAdIcon";
import type { IconName, ViewAdDetails } from "./viewAdTypes";
import { AdCardTomanIcon } from "../../shared/components/AdCardIcons";
import { getStoredAuthSession } from "../../core/auth/auth-storage";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { pushRoute } from "../../app/router/navigation";
import type { ChatThread } from "../../core/services/chat.service";
import {
  buildGalleryMediaItems,
  getAdvertiserPreview,
  getCurrentViewAdBasePath,
  getMapPosition,
  goBackFromAd,
  hasTour3d,
  isOwnAdvertisement,
  mapAdToDetails,
  parseViewAdIdFromPath,
  toBooleanLike,
  type AdvertiserPreview,
  type AlbumMediaItem,
} from "./viewAdDetails";
import { LoadingState, NotFoundState, ViewAdErrorState } from "./ViewAdRouteStates";
import { ViewAdAlbumPage } from "./pages/ViewAdAlbumPage";
import { ViewAdFeedbackPage } from "./pages/ViewAdFeedbackPage";
import { ViewAdNotePage } from "./pages/ViewAdNotePage";
import {
  ViewAdViolationReportPage,
  type ViolationReportSubmitPayload,
} from "./pages/ViewAdViolationReportPage";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import {
  clearConsultantsSelectedNeighborhood,
  saveConsultantsSelectedNeighborhood,
} from "../consultants/consultantsNeighborhoodSelection";

type ActionToast = {
  message: string;
  title: string;
  variant: SnackbarVariant;
};

type GalleryMediaKind = "album" | "video" | "tour3d";

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
    <div className="flex items-center justify-between rounded-lg bg-[#f5f5f5] p-4 [direction:ltr]">
      <div className="flex items-center gap-1">
        <AdCardTomanIcon className="h-6 w-6 text-[#4D4D4D]" />
        <Typography as="p" variant="label" size="large" weight="semibold" className="text-[#1A1A1A] [direction:rtl]">
          {value}
        </Typography>
      </div>
      <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4D4D4D]">
        {label}
      </Typography>
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
  const imageCount = galleryItems.filter((item) => item.type === "image").length;

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
              <Button unstyled
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
              </Button>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute right-2 top-2 z-2 inline-flex items-center gap-1 rounded-lg bg-[#1a1a1a99] px-1 text-sm font-medium leading-5 text-[#fafafa]">
          <GalleryMediaButton
            iconSrc="/icons/iconAlbum.svg"
            isSelected={galleryItems[activeIndex]?.type === "image"}
            label="album"
            onClick={() => selectGalleryKind("album")}
          />
          <Typography as="span" variant="body" size="medium" weight="regular">{new Intl.NumberFormat("fa-IR").format(imageCount)}</Typography>
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
              <Button unstyled
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
  label,
  onClick,
}: {
  iconSrc: string;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      aria-label={label}
      className={`grid h-7 w-7 place-items-center rounded-md`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <ColorableSvgIcon className="h-5 w-5" src={iconSrc} />
    </Button>
  );
}

function MapPreview({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  return (
    <AdLocationMap
      className="mt-6"
      latitude={latitude}
      longitude={longitude}
      title="موقعیت آگهی روی نقشه"
    />
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
    <Button unstyled
      className="mx-auto mt-3 flex w-fit items-center justify-center gap-1 p-0 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium leading-4 text-[#0048c4]">
        {children}
      </Typography>

      <ViewAdIcon className="h-3 w-3 shrink-0 text-[#0048c4]" name="arrowDown" />
    </Button>
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
    <Typography as="span" variant="label" size="small" weight="semibold"
      aria-hidden="true"
      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${styles[type]}`}
    >
      {label[type]}
    </Typography>
  );
}

type SingleAdContactInfo = {
  chat: boolean;
  instagram: string;
  phone: string;
  telegram: string;
  whatsapp: string;
};

function readRawContactText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

function readNestedContactValue(source: unknown, key: string) {
  if (!source || typeof source !== "object") return "";

  return readRawContactText((source as Record<string, unknown>)[key]);
}

function readContactInfo(ad: AdvertisementItem): SingleAdContactInfo {
  const contacts = (ad as { contacts?: unknown }).contacts;
  const contactSocial = (ad as { contact_social?: unknown }).contact_social;
  const social = (ad as { social?: unknown }).social;
  const contactType = Array.isArray((ad as { contact_type?: unknown }).contact_type)
    ? ((ad as { contact_type?: unknown[] }).contact_type ?? [])
      .map((item) => readRawContactText(item).toLowerCase())
    : [];
  const contactsChat = toBooleanLike(
    contacts && typeof contacts === "object"
      ? (contacts as Record<string, unknown>).chat
      : undefined,
  );

  return {
    chat: contactsChat ?? contactType.includes("chat"),
    instagram:
      readNestedContactValue(contacts, "instagram") ||
      readNestedContactValue(contactSocial, "instagram") ||
      readNestedContactValue(social, "instagram"),
    phone:
      readNestedContactValue(contacts, "phone") ||
      readRawContactText((ad as { owner_phone?: unknown }).owner_phone),
    telegram:
      readNestedContactValue(contacts, "telegram") ||
      readNestedContactValue(contactSocial, "telegram") ||
      readNestedContactValue(social, "telegram"),
    whatsapp:
      readNestedContactValue(contacts, "whatsapp") ||
      readNestedContactValue(contactSocial, "whatsapp") ||
      readNestedContactValue(social, "whatsapp"),
  };
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
  const internationalNumber = digits.startsWith("0") ? `98${digits.slice(1)}` : digits;

  return `https://wa.me/${internationalNumber}`;
}

function ContactInfoBottomSheet({
  contactInfo,
  isOpen,
  onClose,
}: {
  contactInfo: SingleAdContactInfo;
  isOpen: boolean;
  onClose: () => void;
}) {
  const phoneHref = toEnglishDigits(contactInfo.phone).replace(/[^\d+]/g, "");
  const phoneDisplay = contactInfo.phone ? toPersianDigits(contactInfo.phone) : "";
  const socialLinks = [
    {
      ariaLabel: "واتساپ",
      type: "whatsapp" as const,
      url: normalizeSocialUrl("whatsapp", contactInfo.whatsapp),
    },
    {
      ariaLabel: "تلگرام",
      type: "telegram" as const,
      url: normalizeSocialUrl("telegram", contactInfo.telegram),
    },
    {
      ariaLabel: "اینستاگرام",
      type: "instagram" as const,
      url: normalizeSocialUrl("instagram", contactInfo.instagram),
    },
  ].filter((item) => Boolean(item.url));
  const hasAnyVisibleContact = Boolean(phoneHref) || socialLinks.length > 0;

  return (
    <BottomSheet
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-5 pb-5"
      heightClassName="h-auto max-h-[calc(100dvh-88px)]"
      isOpen={isOpen}
      onClose={onClose}
      title="اطلاعات تماس"
    >
      {phoneHref ? (
        <>
          <div className="flex h-14 items-center justify-between [direction:ltr]">
            <Typography as="span" variant="label" size="large" weight="medium" className="text-left text-base font-medium leading-6 text-[#1a1a1a]">
              {phoneDisplay}
            </Typography>
            <a
              className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
              href={`tel:${phoneHref}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <PhoneIcon className="h-6 w-6" />
              <Typography as="span" variant="body" size="medium" weight="regular">تماس با</Typography>
            </a>
          </div>
          <div className="h-px bg-[#cccccc]" />
          <div className="flex h-14 items-center justify-between [direction:ltr]">
            <Typography as="span" variant="label" size="large" weight="medium" className="text-left text-base font-medium leading-6 text-[#1a1a1a]">
              {phoneDisplay}
            </Typography>
            <a
              className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
              href={`sms:${phoneHref}`}
              tabIndex={isOpen ? 0 : -1}
            >
              <MessageIcon className="h-6 w-6" />
              <Typography as="span" variant="body" size="medium" weight="regular">ارسال پیامک</Typography>
            </a>
          </div>
          {socialLinks.length ? <div className="h-px bg-[#cccccc]" /> : null}
        </>
      ) : null}

      {socialLinks.length ? (
        <div className="flex h-16 items-center justify-between [direction:ltr]">
          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <a
                aria-label={item.ariaLabel}
                className="grid h-14 w-14 place-items-center rounded-full"
                href={item.url}
                key={item.type}
                tabIndex={isOpen ? 0 : -1}
                target="_blank"
                rel="noreferrer"
              >
                <SocialIcon type={item.type} />
              </a>
            ))}
          </div>
          <Typography as="span" variant="label" size="medium" weight="medium" className="text-right text-sm font-medium leading-5 text-[#4d4d4d]">
            شبکه‌های اجتماعی
          </Typography>
        </div>
      ) : null}

      {!hasAnyVisibleContact ? (
        <div className="rounded-xl bg-[#f5f5f5] px-4 py-5 text-center text-sm font-medium leading-6 text-[#4d4d4d]">
          شماره تماس یا شبکه اجتماعی برای این آگهی ثبت نشده است.
        </div>
      ) : null}
    </BottomSheet>
  );
}


type AdvertisementNeighborhoodSelection = {
  cityId?: string;
  id: string;
  name: string;
};

function toNonEmptyText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(toNonEmptyText).find(Boolean) ?? "";
  }

  if (typeof value !== "string" && typeof value !== "number") return "";

  return String(value).trim();
}

function extractNeighborhoodName(value: unknown, allowPlainText = false) {
  const text = toNonEmptyText(value);

  if (!text) return "";

  const neighborhoodMatch = text.match(/(?:محله|منطقه)\s+(.+)$/);

  return neighborhoodMatch?.[1]?.trim() ?? (allowPlainText ? text : "");
}

function getAdvertisementNeighborhood(
  ad: AdvertisementItem,
  details: ViewAdDetails,
): AdvertisementNeighborhoodSelection | null {
  const neighborhood =
    ad.neighborhood && typeof ad.neighborhood === "object"
      ? ad.neighborhood
      : undefined;
  const city =
    ad.city && typeof ad.city === "object"
      ? (ad.city as { id?: unknown; _id?: unknown })
      : undefined;
  const neighborhoodFeature = ad.features?.find(
    (feature) => feature.label === "neighborhood_id",
  )?.value;
  const idCandidates = [
    neighborhood?.id,
    (neighborhood as { _id?: unknown } | undefined)?._id,
    (ad as { neighborhood_id?: unknown }).neighborhood_id,
    neighborhoodFeature,
  ];
  const nameCandidates = [
    neighborhood?.name,
    ad.neighborhood_name,
    ad.form_neighborhood_title,
  ];
  const id = idCandidates.map(toNonEmptyText).find(Boolean) ?? "";
  const directName = nameCandidates.map(toNonEmptyText).find(Boolean) ?? "";
  const name =
    extractNeighborhoodName(directName, true) ||
    extractNeighborhoodName(details.locationTitle) ||
    extractNeighborhoodName(details.title);

  if (!id || !name) return null;

  const selectedCity = readStoredSelectedCity();
  const cityIdCandidates = [
    city?.id,
    city?._id,
    (ad as { city_id?: unknown }).city_id,
    selectedCity?.id,
  ];
  const cityId = cityIdCandidates.map(toNonEmptyText).find(Boolean);

  return { cityId, id, name };
}

function ViewAdContent({
  adId,
  ad,
  details,
  hasTour3d,
  hideRestrictedActions,
  mediaItems,
  mapPosition,
  onOpenAlbum,
  onRowAction,
}: {
  adId: string;
  ad: AdvertisementItem;
  details: ViewAdDetails;
  hasTour3d: boolean;
  hideRestrictedActions: boolean;
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
  const propertyInfoItems = details.propertyInfoPreview;
  const visibleFacilityCount = areFacilitiesExpanded
    ? details.features.length
    : 6;
  const facilityItems = details.features.slice(0, visibleFacilityCount);
  const hasMorePropertyInfo = details.propertyInfoRows.length > propertyInfoItems.length;
  const hasMoreFacilities = details.features.length > 6;
  const advertiserPreview = getAdvertiserPreview(ad, details);
  const shouldShowDescriptionMore = isDescriptionOverflowing;
  const selectedNeighborhood = getAdvertisementNeighborhood(ad, details);
  const actionRows = details.rows.map((row) =>
    row.icon === "apartment" && selectedNeighborhood
      ? { ...row, label: `آژانس‌های محله ${selectedNeighborhood.name}` }
      : row,
  );
  const visibleRows = hideRestrictedActions
    ? actionRows.filter(
      (row) => !row.label.includes("بازخورد") && !row.label.includes("تخلف"),
    )
    : actionRows;

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
              <Typography as="span" variant="label" size="small" weight="medium" dir="rtl">{details.age}</Typography>
              <ClockIcon className="h-4 w-4 shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-sm leading-5 [direction:rtl]">
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4d4d4d]">کد آگهی:</Typography>
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#1a1a1a]">
                {details.adCode}
              </Typography>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-right">
            <Typography as="p" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">
              {details.locationTitle}
            </Typography>
            <Typography as="p" variant="title" size="medium" weight="semibold" className="mt-2 text-[#1a1a1a]">
              {details.headline}
            </Typography>
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
          <MoreLink to={`${getCurrentViewAdBasePath(adId)}/property-info`}>اطلاعات بیشتر</MoreLink>
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
          <Typography as="p" variant="body" size="medium" weight="regular" ref={descriptionRef} className="m-0 whitespace-pre-line">
            {details.description}
          </Typography>
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

      {advertiserPreview ? <AdvertiserCard preview={advertiserPreview} /> : null}

      <section className="border-t-8 border-[#f0f0f0] bg-white">
        {visibleRows.map((row) => (
          <Button unstyled
            className="flex w-full items-center justify-between border-b-8 border-[#f0f0f0] p-4 text-right last:border-b-[16px] last:border-white focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
            key={row.label}
            onClick={() => onRowAction(row.label)}
            type="button"
          >
            <div className="flex min-w-0 items-center gap-2">
              <ViewAdIcon className="text-[#808080]" name={row.icon} />
              <Typography as="span" variant="label" size="large" weight="medium" className="text-[#1a1a1a]">
                {row.label}
              </Typography>
            </div>
            <ViewAdIcon className="text-[#4d4d4d]" name="arrowLeft" />
          </Button>
        ))}
      </section>
    </>
  );
}

function AdvertiserCard({ preview }: { preview: AdvertiserPreview }) {
  const initial = preview.kind === "agency" ? "ب" : preview.name.trim().charAt(0) || "م";

  return (
    <section className="border-t-8 border-[#f0f0f0] bg-white px-4 py-6 text-center">
      <RouteLink
        className="block rounded-2xl px-2 py-2 text-inherit no-underline transition active:bg-[#f7f7f7] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        to={preview.href}
      >
        <div
          className={`mx-auto grid h-16 w-16 place-items-center rounded-lg border border-[#cccccc] ${
            preview.kind === "agency" ? "bg-white" : "bg-gradient-to-br from-[#f6d8bc] to-[#c78a5c]"
          }`}
        >
          <Typography as="span" variant="headline" size="small"
            className={`text-2xl font-bold leading-none ${
              preview.kind === "agency" ? "text-[#b6823a]" : "text-white"
            }`}
          >
            {initial}
          </Typography>
        </div>
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="mt-4 text-base font-semibold leading-6 text-[#4d4d4d]">
          {preview.name}
        </Typography>
        <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-1 text-xs font-medium leading-4 text-[#808080]">
          {preview.subtitle}
        </Typography>
        {preview.location ? (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs font-medium leading-4 text-[#0048c4]">
            <ViewAdIcon className="h-4 w-4" name="location" />
            <Typography as="span" variant="body" size="medium" weight="regular">{preview.location}</Typography>
          </div>
        ) : null}
        <div className="mx-auto mt-4 flex max-w-[220px] items-center justify-between text-xs font-medium leading-4 text-[#4d4d4d] [direction:ltr]">
          <div className="flex items-center gap-1">
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#0faf73]">۸۵</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular">امتیاز</Typography>
            <img
              alt=""
              aria-hidden="true"
              className="h-4 w-4 shrink-0 object-contain"
              src="/icons/star.svg"
            />
          </div>
          <div className="h-4 w-px bg-[#e0e0e0]" />
          <div className="flex items-center gap-1">
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#0faf73]">۱۲</Typography>
            <Typography as="span" variant="body" size="medium" weight="regular">رتبه</Typography>
            <img
              alt=""
              aria-hidden="true"
              className="h-4 w-4 shrink-0 object-contain"
              src="/icons/ranking.svg"
            />
          </div>
        </div>
      </RouteLink>
    </section>
  );
}

function getChatThreadId(thread: ChatThread) {
  const value = thread.id ?? thread._id;

  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();

  return "";
}

function navigateToLoginRequiredPage(actionLabel: string) {
  const redirectPath = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({
    action: actionLabel,
    returnTo: redirectPath,
  });

  window.history.pushState({}, "", `/login-required?${params.toString()}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function isLoggedIn() {
  return Boolean(getStoredAuthSession());
}

function readAdvertisementBookmarkState(advertisement: AdvertisementItem | undefined) {
  if (!advertisement) return undefined;

  for (const key of ["is_bookmarked", "bookmarked", "is_badged", "has_badge"] as const) {
    const value = advertisement[key];

    if (typeof value === "boolean") return value;
    if (value === 1 || value === "1" || value === "true") return true;
    if (value === 0 || value === "0" || value === "false") return false;
  }

  return undefined;
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
  const isPreview = window.location.pathname.startsWith("/preview-ad/");
  const toggleBadge = useToggleAdvertiseBadgeMutation();
  const saveNote = useSaveAdvertiseNoteMutation();
  const createAdvertiseChat = useCreateAdvertiseChatMutation();
  const submitFeedback = useSubmitAdvertiseFeedbackMutation();
  const submitReport = useSubmitAdvertiseReportMutation();
  const reportReasonsQuery = useAdvertiseReportReasonsQuery(isViolationReportOpen);
  const detailQuery = useAdvertisementDetailQuery(isPreview ? null : adId);
  const previewQuery = useAdvertisementPreviewQuery(isPreview ? adId : null);
  const { data: ad, error, isError, isLoading, refetch } = isPreview
    ? previewQuery
    : detailQuery;

  useEffect(() => {
    const bookmarkState = readAdvertisementBookmarkState(ad);

    if (bookmarkState !== undefined) {
      setIsBookmarked(bookmarkState);
    }
  }, [ad]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!isViolationReportOpen || !reportReasonsQuery.isError) return;
    if (!isUnauthorizedApiError(reportReasonsQuery.error)) return;

    setIsViolationReportOpen(false);
    navigateToLoginRequiredPage("ارسال گزارش تخلف");
  }, [isViolationReportOpen, reportReasonsQuery.error, reportReasonsQuery.isError]);

  if (adId == null) {
    return <NotFoundState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ViewAdErrorState
        error={error}
        message={getApiErrorMessage(error, "دریافت آگهی با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  const resolvedAd = ad;

  if (!resolvedAd) {
    return <NotFoundState />;
  }

  const details = mapAdToDetails(resolvedAd);
  const isOwnAd = isOwnAdvertisement(resolvedAd);
  const usesPublicAdPresentation = isPreview || !isOwnAd;
  const contactInfo = readContactInfo(resolvedAd);
  const hasContactSheetData = Boolean(
    contactInfo.phone || contactInfo.instagram || contactInfo.telegram || contactInfo.whatsapp,
  );
  const hasChatContact = usesPublicAdPresentation && contactInfo.chat;
  const contactActionCount = Number(hasContactSheetData) + Number(hasChatContact);
  const contactActionsGridClassName = contactActionCount === 1 ? "grid-cols-1" : "grid-cols-2";
  const mediaItems = buildGalleryMediaItems(resolvedAd);
  const resolvedHasTour3d = hasTour3d(resolvedAd);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: SnackbarVariant = "success",
  ) => {
    setToast({ message, title, variant });
  };

  const requireAuthorization = (actionLabel: string) => {
    if (isLoggedIn()) return true;

    navigateToLoginRequiredPage(actionLabel);

    return false;
  };

  const openAdvertiseChat = () => {
    if (!requireAuthorization("شروع گفتگو با مشاور")) return;
    if (createAdvertiseChat.isPending) return;

    createAdvertiseChat.mutate(String(adId), {
      onError: (error) => {
        if (isUnauthorizedApiError(error)) {
          navigateToLoginRequiredPage("شروع گفتگو با مشاور");
          return;
        }

        showToast(
          getApiErrorMessage(error, "شروع گفتگو با خطا مواجه شد. دوباره تلاش کنید."),
          "خطا",
          "error",
        );
      },
      onSuccess: (thread) => {
        const threadId = getChatThreadId(thread);

        if (!threadId) {
          showToast("شناسه گفتگو از سرور دریافت نشد.", "خطا", "error");
          return;
        }

        pushRoute(`/chat/${encodeURIComponent(threadId)}`, {
          thread,
          threadId,
        });
      },
    });
  };

  const handleRowAction = (label: string) => {
    if (label.includes("آژانس") && label.includes("محله")) {
      const neighborhood = getAdvertisementNeighborhood(resolvedAd, details);

      if (neighborhood) {
        saveConsultantsSelectedNeighborhood(
          {
            city_id: neighborhood.cityId,
            id: neighborhood.id,
            name: neighborhood.name,
          },
          neighborhood.cityId,
        );
      } else {
        clearConsultantsSelectedNeighborhood();
      }

      pushRoute("/consultants");
      return;
    }

    if (label.includes("بازخورد")) {
      if (!requireAuthorization("ثبت بازخورد")) return;

      setIsFeedbackOpen(true);
      return;
    }

    if (label.includes("یادداشت")) {
      if (!requireAuthorization("ثبت یادداشت")) return;

      setIsNoteOpen(true);
      return;
    }

    if (label.includes("گزارش") || label.includes("تخلف")) {
      if (!requireAuthorization("ارسال گزارش تخلف")) return;

      setIsViolationReportOpen(true);
      return;
    }

    showToast(`${label} هنوز به سرویس مربوطه متصل نشده است.`, "اطلاع", "info");
  };

  const handleTopBarAction = async (icon: IconName) => {
    if (icon === "note") {
      if (!requireAuthorization("ثبت یادداشت")) return;

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
      if (!requireAuthorization("نشان کردن آگهی")) return;

      if (!adId || toggleBadge.isPending) {
        return;
      }

      const previousBookmarkedState = isBookmarked;
      const nextBookmarkedState = !previousBookmarkedState;

      setIsBookmarked(nextBookmarkedState);
      toggleBadge.mutate(adId, {
        onError: (badgeError) => {
          setIsBookmarked(previousBookmarkedState);

          if (isUnauthorizedApiError(badgeError)) {
            navigateToLoginRequiredPage("نشان کردن آگهی");
            return;
          }

          showToast(
            getApiErrorMessage(badgeError, "ثبت نشان با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          showToast(
            nextBookmarkedState
              ? "آگهی به نشان‌ها اضافه شد"
              : "آگهی از نشان‌ها حذف شد",
          );
        },
      });
    }
  };

  const handleSaveNote = () => {
    const cleanNote = noteText.trim();

    if (!adId || !cleanNote || saveNote.isPending) {
      return;
    }

    if (!requireAuthorization("ثبت یادداشت")) return;

    saveNote.mutate(
      { advertiseId: adId, note: cleanNote },
      {
        onError: (noteError) => {
          if (isUnauthorizedApiError(noteError)) {
            requireAuthorization("ثبت یادداشت");
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

    if (!requireAuthorization("ثبت بازخورد")) return;

    submitFeedback.mutate(
      { advertiseId: adId, feedback },
      {
        onError: (feedbackError) => {
          if (isUnauthorizedApiError(feedbackError)) {
            requireAuthorization("ثبت بازخورد");
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

    if (!requireAuthorization("ارسال گزارش تخلف")) return;

    submitReport.mutate(
      {
        advertiseId: adId,
        description,
        reportReasonId,
      },
      {
        onError: (reportError) => {
          if (isUnauthorizedApiError(reportError)) {
            requireAuthorization("ارسال گزارش تخلف");
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
        actionIcons={usesPublicAdPresentation ? undefined : ["share"]}
        backTo="/home"
        bookmarked={isBookmarked}
        onBack={() => goBackFromAd("/home")}
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
          hideRestrictedActions={!usesPublicAdPresentation}
          mediaItems={mediaItems}
          mapPosition={getMapPosition(resolvedAd)}
          onOpenAlbum={(initialIndex = 0) => {
            setAlbumInitialIndex(initialIndex);
            setIsAlbumOpen(true);
          }}
          onRowAction={handleRowAction}
        />
      </main>

      <div className="shrink-0 bg-white px-4 py-3 shadow-[0_-4px_8px_rgba(26,26,26,0.08)]">
        {contactActionCount > 0 ? (
          <div className={`grid ${contactActionsGridClassName} gap-4 [direction:ltr]`}>
            {hasContactSheetData ? (
              <Button unstyled
                className=" rounded-[10px] bg-[#0048c4] py-2.5 flex-1 text-sm! font-medium! text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                onClick={() => setIsContactSheetOpen(true)}
                type="button"
              >
                {contactInfo.phone ? "تماس با مشاور" : "راه‌های تماس"}
              </Button>
            ) : null}
            {hasChatContact ? (
              <Button unstyled
                className="flex items-center justify-center py-2 flex-1 gap-2 rounded-xl border border-[#0048c4] bg-white text-sm font-medium text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] disabled:cursor-wait disabled:opacity-60"
                disabled={createAdvertiseChat.isPending}
                onClick={openAdvertiseChat}
                type="button"
              >
                <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium!">{createAdvertiseChat.isPending ? "در حال باز کردن چت..." : "چت با مشاور"}</Typography>
                <ViewAdIcon className="h-5! w-5!" name="chat" />
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[10px] bg-[#f5f5f5] px-4 py-3 text-center text-sm font-medium leading-5 text-[#808080]">
            {usesPublicAdPresentation
              ? "راه ارتباطی برای این آگهی ثبت نشده است."
              : "این آگهی برای شماست"}
          </div>
        )}
      </div>

      <ContactInfoBottomSheet
        contactInfo={contactInfo}
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
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
              ? isUnauthorizedApiError(reportReasonsQuery.error)
                ? "برای ارسال گزارش تخلف، ابتدا وارد حساب کاربری شوید."
                : getApiErrorMessage(
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
        <ViewAdAlbumPage
          initialIndex={albumInitialIndex}
          mediaItems={mediaItems}
          onClose={() => setIsAlbumOpen(false)}
        />
      ) : null}
    </PageFrame>
  );
}
