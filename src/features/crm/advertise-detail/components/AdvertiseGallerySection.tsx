import { useState } from "react";
import LinearClock from "../../../../shared/icons/LinearClock";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import LinearHouseDimensions from "../../../../shared/icons/LinearHouseDimensions";
import LinearHome2 from "../../../../shared/icons/LinearHome2";
import LinearApartment from "../../../../shared/icons/LinearApartment";
import LinearGps from "../../../../shared/icons/LinearGps";
import { Typography } from "../../../../shared/ui/Typography";
import { formatArea } from "../formatters";

export function AdvertiseGallerySection({
  age,
  area,
  coverImage,
  createdAt,
  floor,
  images,
  locationTitle,
  pricePresentation,
  rooms,
  title,
  trackCode,
  virtualTourLink,
}: {
  age?: unknown;
  area?: unknown;
  coverImage?: string;
  createdAt: string;
  floor?: unknown;
  images: string[];
  locationTitle: string;
  pricePresentation: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
  rooms?: unknown;
  title: string;
  trackCode: string;
  virtualTourLink?: string;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const displayImages = images.length > 0 ? images : coverImage ? [coverImage] : [];
  const activeImage = displayImages[selectedImageIndex] || coverImage;

  return (
    <section className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-xs sm:p-6">
      {/* Gallery Box */}
      {displayImages.length > 0 ? (
        <div className="space-y-3">
          <div className="group relative aspect-[16/10] max-h-[460px] w-full overflow-hidden rounded-2xl bg-[#f0f4f8]">
            <img
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
              src={activeImage}
            />

            {/* Image Count Pill */}
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="absolute bottom-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-black/65 px-3.5 text-xs font-semibold text-white backdrop-blur-md"
            >
              <LinearImage className="h-4 w-4" />
              تصویر {new Intl.NumberFormat("fa-IR").format(selectedImageIndex + 1)} از{" "}
              {new Intl.NumberFormat("fa-IR").format(displayImages.length)}
            </Typography>

            {/* Virtual Tour Pill */}
            {virtualTourLink ? (
              <a
                href={virtualTourLink}
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#0048c4] px-3.5 text-xs font-semibold text-white shadow-md transition hover:bg-[#003ca4]"
              >
                <LinearGps className="h-4 w-4" />
                مشاهده تور مجازی ۳D
              </a>
            ) : null}
          </div>

          {/* Thumbnails row if more than 1 image */}
          {displayImages.length > 1 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5">
              {displayImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-18 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                    selectedImageIndex === idx
                      ? "border-[#0048c4] ring-2 ring-[#0048c4]/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img alt="" className="h-full w-full object-cover" src={img} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9e2f2] bg-[#f8fafc] text-[#8ea7cf]">
          <LinearImage className="h-12 w-12" />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="mt-2 block text-sm font-medium text-[#64748b]"
          >
            این آگهی بدون تصویر است
          </Typography>
        </div>
      )}

      {/* Header Info */}
      <div className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="inline-flex items-center gap-1.5"
            >
              <LinearClock className="h-4 w-4 text-[#808080]" />
              {createdAt}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#f0f4f8] px-2.5 py-1 font-mono text-xs font-semibold text-[#334155]">
              کد پیگیری: {trackCode}
            </span>
          </div>
        </div>

        {/* Location Row */}
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-3.5 flex items-center gap-1.5 text-sm font-medium text-[#0048c4]"
        >
          <LinearLocation className="h-4.5 w-4.5 shrink-0" />
          {locationTitle || "موقعیت ثبت نشده"}
        </Typography>

        {/* Title */}
        <Typography
          as="h1"
          variant="headline"
          size="small"
          className="m-0 mt-2 text-xl font-bold leading-9 text-[#1a1a1a] sm:text-2xl"
        >
          {title}
        </Typography>

        {/* Key Highlights Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Price Card */}
          <div className="rounded-xl border border-[#0048c4]/15 bg-[#eef4ff]/60 p-3.5 sm:col-span-2">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="block text-xs font-medium text-[#0048c4]"
            >
              {pricePresentation.primaryLabel}
            </Typography>
            <strong className="mt-1 block text-lg font-bold text-[#1a1a1a]">
              {pricePresentation.primaryValue}
            </strong>
            {pricePresentation.secondaryValue && pricePresentation.secondaryValue !== "-" ? (
              <span className="mt-1 block text-xs text-[#666666]">
                {pricePresentation.secondaryLabel}: {pricePresentation.secondaryValue}
              </span>
            ) : null}
          </div>

          {/* Area Card */}
          <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#808080]">
              <LinearHouseDimensions className="h-4 w-4 text-[#0048c4]" />
              <span>متراژ</span>
            </div>
            <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
              {formatArea(area)}
            </strong>
          </div>

          {/* Rooms Card */}
          <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-[#808080]">
              <LinearHome2 className="h-4 w-4 text-[#0048c4]" />
              <span>تعداد اتاق</span>
            </div>
            <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
              {rooms ? `${rooms} اتاق` : "ثبت نشده"}
            </strong>
          </div>

          {/* Floor / Age Card */}
          {floor !== undefined && floor !== null && floor !== "" ? (
            <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                <LinearApartment className="h-4 w-4 text-[#0048c4]" />
                <span>طبقه</span>
              </div>
              <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
                {String(floor)}
              </strong>
            </div>
          ) : null}

          {age !== undefined && age !== null && age !== "" ? (
            <div className="rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-[#808080]">
                <LinearClock className="h-4 w-4 text-[#0048c4]" />
                <span>سن بنا</span>
              </div>
              <strong className="mt-1 block text-base font-bold text-[#1a1a1a]">
                {String(age)}
              </strong>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
