import LinearClock from "../../../../shared/icons/LinearClock";
import LinearImage from "../../../../shared/icons/LinearImage";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { PriceBox } from "./DetailPrimitives";

export function AdvertiseGallerySection({
  coverImage,
  createdAt,
  images,
  locationTitle,
  pricePresentation,
  title,
  trackCode,
}: {
  coverImage?: string;
  createdAt: string;
  images: string[];
  locationTitle: string;
  pricePresentation: {
    primaryLabel: string;
    primaryValue: string;
    secondaryLabel: string;
    secondaryValue: string;
  };
  title: string;
  trackCode: string;
}) {
  return (
    <section className="rounded-xl bg-white p-6">
      <div className="grid h-[420px] grid-cols-[minmax(0,1fr)_140px] gap-2 overflow-hidden rounded-2xl bg-[#eef2f7]">
        <Button unstyled className="relative min-w-0 overflow-hidden bg-[#e7ebf0]" type="button">
          {coverImage ? (
            <img
              alt={title}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
              src={coverImage}
            />
          ) : (
            <div className="grid h-full place-items-center text-[#8ea7cf]">
              <div className="text-center">
                <LinearImage className="mx-auto h-12 w-12" />
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="medium"
                  className="mt-2 block text-sm font-medium"
                >
                  تصویری ثبت نشده است
                </Typography>
              </div>
            </div>
          )}
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="absolute bottom-4 left-4 inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-black/65 px-3 text-sm font-medium text-white backdrop-blur-sm"
          >
            <LinearImage className="h-4 w-4" />
            {new Intl.NumberFormat("fa-IR").format(images.length)} تصویر
          </Typography>
        </Button>
        <div className="grid grid-rows-3 gap-2">
          {(images.length > 1 ? images.slice(1, 4) : ["", "", ""]).map((image, index) => (
            <div className="relative overflow-hidden bg-[#dfe5ec]" key={`${image}-${index}`}>
              {image ? (
                <img alt="" className="h-full w-full object-cover" src={image} />
              ) : (
                <LinearImage className="absolute inset-0 m-auto h-7 w-7 text-[#9aabc2]" />
              )}
              {index === 2 && images.length > 4 ? (
                <Typography
                  as="span"
                  variant="title"
                  size="large"
                  weight="semibold"
                  className="absolute inset-0 grid place-items-center bg-black/50 text-lg font-bold text-white"
                >
                  +{new Intl.NumberFormat("fa-IR").format(images.length - 4)}
                </Typography>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex items-center justify-between gap-4 text-sm text-[#4d4d4d]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="inline-flex items-center gap-1.5"
          >
            <LinearClock className="h-4 w-4" />
            {createdAt}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="regular">
            کد آگهی: <strong className="text-[#1a1a1a]">{trackCode}</strong>
          </Typography>
        </div>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-5 flex items-center gap-1.5 text-sm text-[#4d4d4d]"
        >
          <LinearLocation className="h-5 w-5 text-[#0048c4]" />
          {locationTitle || "موقعیت ثبت نشده"}
        </Typography>
        <Typography
          as="h1"
          variant="headline"
          size="small"
          className="m-0 mt-2 text-2xl leading-10 font-bold text-[#1a1a1a]"
        >
          {title}
        </Typography>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <PriceBox
            label={pricePresentation.primaryLabel}
            value={pricePresentation.primaryValue}
          />
          <PriceBox
            label={pricePresentation.secondaryLabel}
            value={pricePresentation.secondaryValue}
          />
        </div>
      </div>
    </section>
  );
}
