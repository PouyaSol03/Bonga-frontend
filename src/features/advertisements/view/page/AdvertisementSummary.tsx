import type { ViewAdDetails } from ".././viewAdTypes";
import { type AlbumMediaItem } from ".././viewAdDetails";
import { Typography } from "../../../../shared/ui/Typography";
import { ClockIcon } from "./contactIcons";
import { AdvertisementPriceBlock } from "./AdvertisementPriceBlock";
import { GalleryHero } from "./GalleryHero";

export function AdvertisementSummary({details,hasTour3d,mediaItems,onOpenAlbum,tour3dUrl}: {details:ViewAdDetails;hasTour3d:boolean;mediaItems:AlbumMediaItem[];onOpenAlbum:(index?:number)=>void;tour3dUrl:string}) { return (
      <section className="bg-surface-container-lowest pb-4">
        <GalleryHero
          hasTour3d={hasTour3d}
          imagesNotBelongToAd={details.imagesNotBelongToAd}
          mediaItems={mediaItems}
          onOpenAlbum={onOpenAlbum}
          tour3dUrl={tour3dUrl}
        />

        <div className="px-4 pt-4">
          <div className="flex h-7 items-center justify-between [direction:ltr]">
            <div className="text-on-surface-var flex items-center gap-1 text-xs leading-4 font-medium [direction:ltr]">
              <Typography as="span" variant="label" size="small" weight="medium" dir="rtl">
                {details.age}
              </Typography>
              <ClockIcon className="h-4 w-4 shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-sm leading-5 [direction:rtl]">
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-on-surface-var"
              >
                کد آگهی:
              </Typography>
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-on-surface"
              >
                {details.adCode}
              </Typography>
            </div>
          </div>

          {details.isSpecial || details.isLadder ? (
            <div className="mt-3 flex items-center justify-start gap-2 [direction:rtl]">
              {details.isSpecial ? (
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="border-on-warning-container bg-warning-container text-on-warning-container rounded-lg border px-2 py-1 whitespace-nowrap"
                >
                  ویژه
                </Typography>
              ) : null}
              {details.isLadder ? (
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="border-tertiary bg-tertiary-container text-tertiary rounded-lg border px-2 py-1 whitespace-nowrap"
                >
                  بروزرسانی
                </Typography>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 space-y-2 text-right">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-on-surface-var"
            >
              {details.categoryNeighborhood}
            </Typography>
            <Typography
              as="p"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface mt-2"
            >
              {details.headline}
            </Typography>
          </div>

          {details.formCode === "partnership" ? null : (
            <AdvertisementPriceBlock details={details} />
          )}
        </div>
      </section>
); }
