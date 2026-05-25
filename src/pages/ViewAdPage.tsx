import { useState } from "react";

import { BottomSheet } from "../components/BottomSheet";
import { DemoNotice } from "../components/DemoNotice";
import { useDemoNotice } from "../hooks/useDemoNotice";
import { RouteLink } from "../routes/RouteLink";
import { TopBar } from "../components/TopBar";
import { PageFrame } from "../app/PageFrame";
import { getLatestMashhadAdById } from "./home/homeData";
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
    <div className="flex h-14 items-center justify-between rounded-lg bg-[#0048c414] px-4 [direction:ltr]">
      <div className="flex items-center gap-1 text-[#002099]">
        <ViewAdIcon className="h-5 w-5" name="tooman" />
        <strong className="text-base font-semibold leading-6">{value}</strong>
        <span className="w-7 text-[11px] font-semibold leading-[11px]">تومان</span>
      </div>
      <span className="text-right text-sm font-medium leading-5 text-[#1a1a1a]">
        {label}
      </span>
    </div>
  );
}

function GalleryHero({ onOpenAlbum }: { onOpenAlbum: () => void }) {
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
          src="/figma/view-ad-gallery.png"
        />
      </button>
    </div>
  );
}

function AgencyCard({ details, onClick }: { details: ViewAdDetails; onClick: () => void }) {
  return (
    <button
      className="mt-4 flex h-20 w-full items-center rounded-2xl border border-[#cccccc] bg-[#f5f5f5] px-4 text-right [direction:ltr] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
      onClick={onClick}
      type="button"
    >
      <ViewAdIcon className="ml-4 h-5 w-5 text-[#4d4d4d]" name="arrowLeft" />
      <div className="ml-4 grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-white text-[#a37945]">
        <span className="h-8 w-8 border-y-2 border-dashed border-[#c7924d] bg-[linear-gradient(90deg,transparent_0_45%,#c7924d_45%_55%,transparent_55%)]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-right text-base font-semibold leading-6 text-[#4d4d4d]">
          {details.agency}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-xs font-medium leading-4 text-[#0048c4] [direction:rtl]">
          <span>{details.agencyLocation}</span>
          <ViewAdIcon className="h-4 w-4 fill-[#0048c4] text-[#0048c4]" name="location" />
        </div>
      </div>
    </button>
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
      ariaLabel="اطلاعات تماس"
      contentClassName="mx-4 mt-5"
      heightClassName="h-[306px]"
      isOpen={isOpen}
      onClose={onClose}
      title="اطلاعات تماس"
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
                  className={`block h-2 rounded-full ${
                    index === activeIndex ? "bg-[#fafafa]" : "bg-[#fafafa29]"
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
  onOpenContact,
  onOpenAlbum,
  onRowAction,
}: {
  adId: number;
  details: ViewAdDetails;
  onOpenContact: () => void;
  onOpenAlbum: () => void;
  onRowAction: (label: string) => void;
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <>
      <section className="bg-white pb-4">
        <GalleryHero onOpenAlbum={onOpenAlbum} />

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

          <AgencyCard details={details} onClick={onOpenContact} />
        </div>
      </section>

      <DetailSection icon="building" title="اطلاعات ملک">
        <PropertyGrid items={details.propertyInfoPreview} />
        <MoreLink to={`/ads/${adId}/property-info`}>اطلاعات بیشتر</MoreLink>
      </DetailSection>

      <DetailSection icon="apartment" mutedTitle title="تجهیزات و امکانات">
        <PropertyGrid items={details.features} withLabels={false} />
        <MoreLink to={`/ads/${adId}/equipment-facilities`}>موارد بیشتر</MoreLink>
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
        <MapPreview />
      </DetailSection>

      <section className="border-t-8 border-[#f0f0f0] bg-white">
        {details.rows.map((row) => (
          <button
            className="flex h-[88px] w-full items-center justify-between border-b-8 border-[#f0f0f0] px-8 text-right last:border-b-0 focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
            key={row.label}
            onClick={() => onRowAction(row.label)}
            type="button"
          >
            <ViewAdIcon className="text-[#4d4d4d]" name="arrowLeft" />
            <div className="flex min-w-0 items-center gap-3">
              <span className="truncate text-base font-medium leading-6 text-[#1a1a1a]">
                {row.label}
              </span>
              <ViewAdIcon className="text-[#808080]" name={row.icon} />
            </div>
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
      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-6 text-right">
        <h1 className="m-0 text-base font-semibold leading-6">آگهی پیدا نشد</h1>
        <p className="mt-3 text-sm leading-6 text-[#4d4d4d]">
          این آگهی در حال حاضر موجود نیست یا لینک آن نادرست است.
        </p>
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
  const adId = parseAdIdFromPath(window.location.pathname);
  const ad = adId != null ? getLatestMashhadAdById(adId) : undefined;

  if (!ad || adId == null) {
    return <NotFoundState />;
  }

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
      setIsBookmarked((current) => !current);
      showNotice(isBookmarked ? "آگهی از نشان‌ها حذف شد" : "آگهی به نشان‌ها اضافه شد");
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
          details={viewAdDemo}
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
            اطلاعات تماس
          </button>
          <RouteLink
            className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            to="/chat/1"
          >
            <ViewAdIcon className="h-5 w-5" name="chat" />
            <span>چت</span>
          </RouteLink>
        </div>
      </div>

      <ContactInfoBottomSheet
        isOpen={isContactSheetOpen}
        onClose={() => setIsContactSheetOpen(false)}
        phoneNumber="09155214062"
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
          mediaItems={albumMediaItems}
          onClose={() => setIsAlbumOpen(false)}
        />
      ) : null}
      <DemoNotice message={message} />
    </PageFrame>
  );
}
