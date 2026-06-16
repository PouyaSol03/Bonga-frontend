import { useState } from "react";

import { BottomSheet } from "../components/BottomSheet";
import { DemoNotice } from "../components/DemoNotice";
import { useDemoNotice } from "../hooks/useDemoNotice";
import { RouteLink } from "../routes/RouteLink";
import { TopBar } from "../components/TopBar";
import { FeaturesIcons } from "../components/FeaturesIcons";
import { PageFrame } from "../app/PageFrame";
import { getApiAssetUrl, getApiErrorMessage } from "../api/api";
import { NotFoundErrorState, ServerErrorState } from "../components/ErrorState";
import {
  useAdvertisementDetailQuery,
} from "../hooks/advertisement.hooks";
import { useToggleAdvertiseBadgeMutation } from "../hooks/account.hooks";
import type { AdvertisementItem } from "../services/advertisement.service";
import {
  DetailSection,
  MoreButton,
  MoreLink,
  PropertyGrid,
  ViewAdTopBar,
} from "./viewAd/viewAdComponents";
import { viewAdDemo, parseAdIdFromPath } from "./viewAd/viewAdData";
import { ViewAdIcon } from "./viewAd/ViewAdIcon";
import type { IconName, ViewAdDetails } from "./viewAd/viewAdTypes";
import { AdCardTomanIcon } from "../components/AdCardIcons";

type AlbumMediaItem = {
  src: string;
  type: "image" | "video";
};

const albumMediaItems: AlbumMediaItem[] = [
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "video" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
  { src: "/figma/view-ad-album.png", type: "image" },
];

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-14 items-center justify-between rounded-lg bg-[#F5F5F5] px-4 [direction:ltr]">
      <div className="flex items-center gap-1">
        <AdCardTomanIcon className="h-5 w-5" />
        <strong className="text-base font-semibold text-[#1A1A1A] leading-6">{value}</strong>
      </div>
      <span className="text-right text-sm font-medium leading-5 text-[#1a1a1a]">
        {label}
      </span>
    </div>
  );
}

function GalleryHero({
  imageSrc = "/figma/view-ad-gallery.png",
  onOpenAlbum,
}: {
  imageSrc?: string;
  onOpenAlbum: () => void;
}) {
  return (
    <div className="px-4 pt-4">
      <button
        aria-label="باز کردن آلبوم تصاویر"
        className="block w-full overflow-hidden rounded-2xl bg-[#ebebeb] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        onClick={onOpenAlbum}
        type="button"
      >
        <img
          alt=""
          className="aspect-[328/219] w-full object-cover"
          src={imageSrc}
        />
      </button>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="relative mt-6 h-[198px] overflow-hidden rounded-2xl bg-[#fafafa]">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[1.18] object-cover opacity-90"
        src="/figma/search/map-light.png"
      />
      <span className="absolute left-1/2 top-1/2 h-10 w-8 -translate-x-1/2 -translate-y-1/2 rounded-t-full rounded-bl-full border border-white bg-[#11a366] shadow-[0_2px_0_rgba(26,26,26,0.18)] [transform:translate(-50%,-50%)_rotate(45deg)]">
        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </span>
    </div>
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

function SocialIcon({ type }: { type: "instagram" | "telegram" | "whatsapp" }) {
  const styles = {
    instagram: "bg-[linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)] text-white",
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
          {phoneNumber}
        </span>
        <a
          className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
          href={`tel:${phoneNumber}`}
          tabIndex={isOpen ? 0 : -1}
        >
          <PhoneIcon className="h-6 w-6" />
          <span>تماس با</span>
        </a>
      </div>
      <div className="h-px bg-[#cccccc]" />
      <div className="flex h-14 items-center justify-between [direction:ltr]">
        <span className="text-left text-base font-medium leading-6 text-[#1a1a1a]">
          {phoneNumber}
        </span>
        <a
          className="flex items-center gap-2 text-base font-medium leading-6 text-[#4d4d4d] no-underline [direction:rtl]"
          href={`sms:${phoneNumber}`}
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
            href={`https://wa.me/98${phoneNumber.slice(1)}`}
            tabIndex={isOpen ? 0 : -1}
            target="_blank"
            rel="noreferrer"
          >
            <SocialIcon type="whatsapp" />
          </a>
          <a
            aria-label="تلگرام"
            className="grid h-14 w-14 place-items-center rounded-full"
            href={`https://t.me/share/url?url=tel:${phoneNumber}`}
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

function ViewAdNotePage({
  noteText,
  onChangeNote,
  onClose,
}: {
  noteText: string;
  onChangeNote: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <TopBar onBack={onClose} title="یادداشت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4 pt-8">
        <p className="m-0 text-right text-sm font-normal leading-5 text-[#1a1a1a]">
          یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.
        </p>
        <textarea
          aria-label="یادداشت شما"
          autoFocus
          className="mt-6 h-60 w-full resize-none rounded-xl border-2 border-[#0048c4] bg-white px-3 py-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/50"
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="یادداشت شما"
          value={noteText}
        />
      </main>

      <div className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_4px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={onClose}
            type="button"
          >
            ذخیره
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
  mediaItems,
  onClose,
}: {
  mediaItems: AlbumMediaItem[];
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = mediaItems[activeIndex] ?? mediaItems[0];
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
        <div className="pt-[202px]">
          <img
            alt=""
            className="aspect-[3/2] w-full object-cover"
            src={activeMedia.src}
          />
        </div>

        <div className="absolute bottom-13 left-0 right-0 flex justify-center">
          <div
            aria-label={`رسانه ${activeIndex + 1} از ${mediaItems.length}`}
            className="flex h-6 items-center justify-center rounded-lg bg-[#ffffff14]"
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
                  onClick={() => setActiveIndex(index)}
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
  details,
  imageSrc,
  showMap,
  onOpenContact,
  onOpenAlbum,
  onRowAction,
}: {
  adId: string;
  details: ViewAdDetails;
  imageSrc?: string;
  showMap: boolean;
  onOpenContact: () => void;
  onOpenAlbum: () => void;
  onRowAction: (label: string) => void;
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const propertyInfoItems = details.propertyInfoPreview.slice(0, 4);
  const facilityItems = details.features.slice(0, 6);
  const hasMorePropertyInfo = details.propertyInfoPreview.length > 4;
  const hasMoreFacilities = details.features.length > 6;

  return (
    <>
      <section className="bg-white pb-4">
        <GalleryHero imageSrc={imageSrc} onOpenAlbum={onOpenAlbum} />

        <div className="px-4 pt-4">
          <div className="flex h-7 items-center justify-between [direction:ltr]">
            <div className="flex items-center gap-1 text-xs font-medium leading-4 text-[#4d4d4d]">
              <ViewAdIcon className="h-4 w-4" name="calendar" />
              <span>{details.age}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium leading-5 [direction:rtl]">
              <span className="text-[#4d4d4d]">کد آگهی:</span>
              <strong className="rounded-lg bg-[#f5f5f5] px-2.5 py-1 text-[#1a1a1a]">
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

      <DetailSection icon="building" title="اطلاعات ملک">
        <PropertyGrid items={propertyInfoItems} />
        {hasMorePropertyInfo ? (
          <MoreLink to={`/ads/${adId}/property-info`}>اطلاعات بیشتر</MoreLink>
        ) : null}
      </DetailSection>

      <DetailSection icon="apartment" mutedTitle title="تجهیزات و امکانات">
        <PropertyGrid items={facilityItems} withLabels={false} />
        {hasMoreFacilities ? (
          <MoreLink to={`/ads/${adId}/equipment-facilities`}>موارد بیشتر</MoreLink>
        ) : null}
      </DetailSection>

      <DetailSection icon="info" mutedTitle title="توضیحات">
        <div className={`relative mt-6 overflow-hidden text-right text-base font-normal leading-8 text-[#1a1a1a] ${isDescriptionExpanded ? "" : "h-[350px]"}`}>
          <p className="m-0 whitespace-pre-line">{details.description}</p>
          {isDescriptionExpanded ? null : <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-white/0 to-white" />}
        </div>
        <MoreButton
          icon="arrowLeft"
          onClick={() => setIsDescriptionExpanded((current) => !current)}
        >
          {isDescriptionExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </MoreButton>
        {showMap ? <MapPreview /> : null}
      </DetailSection>

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
      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-10 text-center text-sm font-medium text-[#808080]">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#0048c433] border-t-[#0048c4]" />
        در حال دریافت آگهی...
      </main>
    </PageFrame>
  );
}

function ViewAdErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar actionIcons={[]} backTo="/home" />
      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
        <ServerErrorState className="h-full" onRetry={onRetry} />
        <p className="sr-only">{message}</p>
      </main>
    </PageFrame>
  );
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("fa-IR").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "دارد" : "ندارد";
  }

  if (Array.isArray(value)) {
    const text = value
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
  const images = Array.isArray(ad.images) ? ad.images : [];
  const imagePaths = images
    .map((image) => {
      if (typeof image === "string") {
        return image;
      }

      return image.url ?? image.path ?? "";
    })
    .filter(Boolean);
  const primaryImage = typeof ad.image === "string" ? ad.image : "";

  return [primaryImage, ...imagePaths]
    .filter(Boolean)
    .map((image) => getApiAssetUrl(image));
}

const propertyInfoLabelMap: Record<string, string> = {
  land_area: "متراژ زمین",
  building_area: "متراژ بنا",
  building_age: "سن بنا",
  rooms: "تعداد اتاق",
  furnished: "مبله",
  document_type: "نوع سند",
  villa_type: "نوع ویلا",
  heating_cooling: "سرمایش و گرمایش",
  exchange_with: "قابل معاوضه با",
  advertiser_type: "نوع آگهی‌دهنده",
};

const propertyInfoOrder = [
  "land_area",
  "building_area",
  "rooms",
  "building_age",
  "furnished",
  "document_type",
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

function buildPropertyInfoItems(features: NonNullable<AdvertisementItem["features"]>) {
  const orderedItems = propertyInfoOrder
    .map((label) => {
      const feature = features.find((item) => item.label === label);

      if (!feature) {
        return null;
      }

      return {
        icon: iconForFeature(propertyInfoLabelMap[label] ?? label),
        label: propertyInfoLabelMap[label] ?? label,
        value: toText(feature.value, "-"),
      };
    })
    .filter((item): item is { icon: IconName; label: string; value: string } => item !== null);

  const extraItems = features
    .filter((feature) => {
      const label = feature.label ?? "";

      return (
        label &&
        !propertyInfoOrder.includes(label) &&
        !ignoredFeatureLabels.has(label)
      );
    })
    .map((feature) => ({
      icon: iconForFeature(feature.label ?? ""),
      label: propertyInfoLabelMap[feature.label ?? ""] ?? feature.label ?? "",
      value: toText(feature.value, "-"),
    }));

  return [...orderedItems, ...extraItems];
}

function buildFacilityItems(features: NonNullable<AdvertisementItem["features"]>) {
  const facilities = getFeatureValue(features, "facilities");

  if (!Array.isArray(facilities)) {
    return [];
  }

  return facilities
    .map((facility) => toText(facility))
    .filter(Boolean)
    .map((facility) => ({
      icon: "apartment" as IconName,
      label: facility,
      value: facility,
      featureIconLabel: facility,
    }));
}

function formatPricePerMeter(totalPrice: unknown, area: unknown) {
  const numericPrice = toNumber(totalPrice);
  const numericArea = toNumber(area);

  if (numericPrice === undefined || numericArea === undefined || numericArea <= 0) {
    return viewAdDemo.pricePerMeter;
  }

  return formatPrice(numericPrice / numericArea);
}

function hasValidMapCoordinates(ad: AdvertisementItem) {
  const position = ad as {
    lat?: unknown;
    latitude?: unknown;
    lng?: unknown;
    long?: unknown;
    longitude?: unknown;
  };
  const lat = toNumber(position.lat ?? position.latitude);
  const lng = toNumber(position.lng ?? position.long ?? position.longitude);

  return lat !== undefined && lng !== undefined;
}

function readOwnerPhone(ad: AdvertisementItem) {
  return toText((ad as { owner_phone?: unknown }).owner_phone);
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
    features.length > 0 ? buildPropertyInfoItems(features) : viewAdDemo.propertyInfoPreview;
  const facilities =
    features.length > 0 ? buildFacilityItems(features) : viewAdDemo.features;
  const publishedHoursAgo = toNumber(ad.published_hours_ago);
  const age =
    publishedHoursAgo !== undefined
      ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش`
      : toText(getFeatureValue(features, "published_at"), viewAdDemo.age);
  const totalPrice = ad.price ?? getFeatureValue(features, "price");
  const meterArea =
    getFeatureValue(features, "land_area") ?? getFeatureValue(features, "building_area");
  const description =
    (ad as { description?: unknown }).description ??
    (ad as { short_description?: unknown }).short_description;

  return {
    ...viewAdDemo,
    adCode: String((ad as { track_code?: unknown }).track_code ?? ad.id ?? ad._id ?? viewAdDemo.adCode),
    age,
    agency: toText(getFeatureValue(features, "advertiser_type"), viewAdDemo.agency),
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

type DetailInfoValue = string | string[];

type DetailInfoItem = {
  icon: IconName;
  label: string;
  value: DetailInfoValue;
  badge?: boolean;
  featureIconLabel?: string;
};

type DetailInfoSection = {
  title: string;
  items: DetailInfoItem[];
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

function getDetailPageTitle(features: NonNullable<AdvertisementItem["features"]>) {
  const formCode = toText(getFeatureValue(features, "form_code"));

  if (formCode.includes("garden-villa")) return "اطلاعات ملک";
  if (formCode.includes("villa")) return "اطلاعات ویلا";
  if (formCode.includes("land")) return "اطلاعات زمین";

  return "اطلاعات ملک";
}

function normalizeDetailValue(label: string, value: unknown): DetailInfoValue {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item)).filter(Boolean);
  }

  if (typeof value === "boolean") {
    return value ? "دارد" : "ندارد";
  }

  if (label === "land_area" || label === "building_area") {
    const text = toText(value);
    return text ? `${text} متر` : "-";
  }

  if (label === "price") {
    return `${formatPrice(value)} تومان`;
  }

  return toText(value, "-");
}

function getDetailIconByLabel(label: string): IconName {
  if (label.includes("area")) return "area";
  if (label.includes("rooms")) return "bed";
  if (label.includes("age")) return "building";
  if (label.includes("document")) return "building";
  return "apartment";
}

function buildDetailInfoItem(
  features: NonNullable<AdvertisementItem["features"]>,
  label: string,
  customLabel?: string,
): DetailInfoItem | null {
  const rawValue = getFeatureValue(features, label);

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return null;
  }

  const value = normalizeDetailValue(label, rawValue);
  const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);

  if (!hasValue) {
    return null;
  }

  return {
    badge: typeof rawValue === "boolean",
    icon: getDetailIconByLabel(label),
    label: customLabel ?? propertyInfoLabelMap[label] ?? label,
    value,
  };
}

function buildPropertyDetailSections(ad: AdvertisementItem): DetailInfoSection[] {
  const features = Array.isArray(ad.features) ? ad.features : [];

  const mainItems = [
    buildDetailInfoItem(features, "land_area", "متراژ زمین"),
    buildDetailInfoItem(features, "building_area", "متراژ بنا"),
    buildDetailInfoItem(features, "rooms", "تعداد اتاق"),
    buildDetailInfoItem(features, "building_age", "سن بنا"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const buildingItems = [
    buildDetailInfoItem(features, "villa_type", "نوع ویلا"),
    buildDetailInfoItem(features, "document_type", "نوع سند"),
    buildDetailInfoItem(features, "furnished", "مبله"),
    buildDetailInfoItem(features, "advertiser_type", "نوع آگهی‌دهنده"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const utilityItems = [
    buildDetailInfoItem(features, "heating_cooling", "سرمایش و گرمایش"),
  ].filter((item): item is DetailInfoItem => item !== null);

  const exchangeItems = [
    buildDetailInfoItem(features, "exchange_with", "معاوضه با"),
  ].filter((item): item is DetailInfoItem => item !== null);

  return [
    { title: "مشخصات اصلی", items: mainItems },
    { title: "موقعیت و ساختمان", items: buildingItems },
    { title: "سیستم‌ها و تأسیسات", items: utilityItems },
    { title: "وام و معاوضه", items: exchangeItems },
  ].filter((section) => section.items.length > 0);
}

function buildFacilitiesDetailSections(ad: AdvertisementItem): DetailInfoSection[] {
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
      label: facility,
      value: "دارد",
      badge: true,
      featureIconLabel: facility,
    }));

  return [{ title: "امکانات و تجهیزات", items }];
}

function DetailInfoValueView({ item }: { item: DetailInfoItem }) {
  if (Array.isArray(item.value)) {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        {item.value.map((value) => (
          <span
            className="rounded-md bg-[#f0f0f0] px-2 py-1 text-xs font-medium leading-4 text-[#4d4d4d]"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    );
  }

  if (item.badge) {
    return (
      <span className="inline-flex h-7 items-center rounded-md border border-[#0faf73] px-2 text-xs font-medium leading-4 text-[#0faf73]">
        {item.value}
      </span>
    );
  }

  return <span>{item.value}</span>;
}

function DetailInfoItemCard({ item }: { item: DetailInfoItem }) {
  return (
    <div className="flex min-h-[72px] items-start justify-end gap-2 px-2 py-3 text-right">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold leading-5 text-[#1a1a1a]">
          <DetailInfoValueView item={item} />
        </div>
        <div className="mt-1 text-xs font-normal leading-4 text-[#808080]">
          {item.label}
        </div>
      </div>
      {item.featureIconLabel ? (
        <FeaturesIcons
          feature={item.featureIconLabel}
          className="mt-0.5 h-5 w-5 shrink-0 object-contain"
        />
      ) : (
        <ViewAdIcon
          className="mt-0.5 h-5 w-5 shrink-0 text-[#808080]"
          name={item.icon}
        />
      )}
    </div>
  );
}

function DetailInfoSectionBlock({ section }: { section: DetailInfoSection }) {
  return (
    <section className="border-b-8 border-[#f0f0f0] bg-white last:border-b-0">
      <div className="border-b border-[#ebebeb] px-4 py-3 text-right text-xs font-normal leading-4 text-[#808080]">
        {section.title}
      </div>
      <div className="grid grid-cols-2 divide-x divide-x-reverse divide-[#f0f0f0] px-2 py-2 [direction:rtl]">
        {section.items.map((item) => (
          <DetailInfoItemCard item={item} key={`${section.title}-${item.label}`} />
        ))}
      </div>
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

export function ViewAdPage() {
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { message, showNotice } = useDemoNotice();
  const adId = parseViewAdIdFromPath(window.location.pathname);
  const toggleBadge = useToggleAdvertiseBadgeMutation();
  const {
    data: ad,
    error,
    isError,
    isLoading,
    refetch,
  } = useAdvertisementDetailQuery(adId);

  if (adId == null) {
    return <NotFoundState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ViewAdErrorState
        message={getApiErrorMessage(error, "دریافت آگهی با خطا مواجه شد.")}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!ad) {
    return <NotFoundState />;
  }

  const details = mapAdToDetails(ad);
  const subPage = getViewAdSubPage(window.location.pathname);

  if (subPage === "property-info") {
    const features = Array.isArray(ad.features) ? ad.features : [];

    return (
      <DetailInfoFullPage
        adId={adId}
        sections={buildPropertyDetailSections(ad)}
        title={getDetailPageTitle(features)}
      />
    );
  }

  if (subPage === "equipment-facilities") {
    return (
      <DetailInfoFullPage
        adId={adId}
        sections={buildFacilitiesDetailSections(ad)}
        title="تجهیزات و امکانات"
      />
    );
  }

  const images = readImages(ad);
  const mediaItems =
    images.length > 0
      ? images.map((src): AlbumMediaItem => ({ src, type: "image" }))
      : albumMediaItems;

  const handleTopBarAction = (icon: IconName) => {
    if (icon === "note") {
      setIsNoteOpen(true);
      return;
    }

    if (icon === "share") {
      setIsContactSheetOpen(true);
      return;
    }

    if (icon === "bookmark") {
      if (!adId || toggleBadge.isPending) {
        return;
      }

      toggleBadge.mutate(adId, {
        onError: (badgeError) => {
          showNotice(getApiErrorMessage(badgeError, "ثبت نشان با خطا مواجه شد."));
        },
        onSuccess: () => {
          setIsBookmarked((current) => !current);
          showNotice(isBookmarked ? "آگهی از نشان‌ها حذف شد" : "آگهی به نشان‌ها اضافه شد");
        },
      });
    }
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ViewAdTopBar backTo="/home" onAction={handleTopBarAction} />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        <ViewAdContent
          adId={adId}
          details={details}
          imageSrc={images[0]}
          showMap={hasValidMapCoordinates(ad)}
          onOpenContact={() => setIsContactSheetOpen(true)}
          onOpenAlbum={() => setIsAlbumOpen(true)}
          onRowAction={(label) => showNotice(`${label} برای نسخه نمایشی انتخاب شد`)}
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
        phoneNumber={readOwnerPhone(ad)}
      />

      {isNoteOpen ? (
        <ViewAdNotePage
          noteText={noteText}
          onChangeNote={setNoteText}
          onClose={() => setIsNoteOpen(false)}
        />
      ) : null}

      {isAlbumOpen ? (
        <AlbumPage
          mediaItems={mediaItems}
          onClose={() => setIsAlbumOpen(false)}
        />
      ) : null}
      <DemoNotice message={message} />
    </PageFrame>
  );
}
