import type { ReactNode } from "react";

import {
  AdCardAlbumIcon,
  AdCardAreaIcon,
  AdCardOwnerIcon,
  AdCardRoomsIcon,
  AdCardTomanIcon,
  AdCardYearIcon,
} from "../../components/AdCardIcons";
import { RouteLink } from "../../routes/RouteLink";
import { getAdStatePath } from "../account/adManagement/adManagementData";

export type DashboardAd = {
  id: number;
  area: string;
  badges: string[];
  imageCount: string;
  imageUrl: string;
  isMine: boolean;
  owner: string;
  price: string;
  rooms: string;
  timeAndLocation: string;
  title: string;
  year: string;
};

export function DashboardAdCard({ ad }: { ad: DashboardAd }) {
  const card = {
    id: ad.id,
    agency: ad.owner,
    area: ad.area,
    badges: ad.badges,
    imageClassName: "",
    imageCount: ad.imageCount,
    imageUrl: ad.imageUrl,
    priceLabelPrimary: "",
    priceLabelSecondary: "",
    pricePrimary: ad.price,
    priceSecondary: "",
    rooms: ad.rooms,
    status: ad.badges.length ? "منتشر شده" : "در انتظار انتشار",
    timeAndLocation: ad.timeAndLocation,
    title: ad.title,
    year: ad.year,
  };

  return (
    <RouteLink
      aria-label={`مدیریت آگهی ${ad.title}`}
      className="block min-w-0 text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      state={{ card, ad: card, returnTo: "/account/dashboard/ads", tab: "active" }}
      to={getAdStatePath(ad.id)}
    >
      <article className="flex min-w-0 flex-col gap-4 text-right">
        <div className="relative h-[224px] w-auto overflow-hidden rounded-2xl bg-[#dbe5ff]">
          <img
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
            src={ad.imageUrl}
          />

          <div className="absolute right-2 top-2 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]">
            <span>{ad.imageCount}</span>
            <AdCardAlbumIcon className="h-5 w-5 shrink-0" />
          </div>

          <div className="absolute bottom-2 right-2 inline-flex h-7 max-w-[calc(100%-16px)] items-center gap-2 rounded-lg bg-[#1a1a1a99] px-2 text-sm font-medium leading-5 text-[#fafafa]">
            <span className="truncate">{ad.owner}</span>
            <AdCardOwnerIcon className="h-5 w-5 shrink-0" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex h-6 items-center gap-1">
            <strong className="whitespace-nowrap text-base font-semibold leading-6 text-[#0048c4]">
              {ad.price}
            </strong>
            <AdCardTomanIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
          </div>

          <div className="flex h-5 items-center gap-[22px] text-sm font-medium leading-5 text-[#1a1a1a]">
            <PropertyItem icon={<AdCardAreaIcon className="h-5 w-5" />} value={ad.area} />
            <PropertyItem icon={<AdCardRoomsIcon className="h-5 w-5" />} value={ad.rooms} />
            <PropertyItem icon={<AdCardYearIcon className="h-5 w-5" />} value={ad.year} />
          </div>

          <h3 className="m-0 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
            {ad.title}
          </h3>

          <div className="flex h-6 items-center justify-start gap-2">
            {ad.badges.map((badge) => (
              <span
                className="h-6 whitespace-nowrap rounded-lg border border-[#ff6d00] px-2 py-[3px] text-xs leading-4 text-[#ff6d00]"
                key={badge}
              >
                {badge}
              </span>
            ))}
            {ad.badges.length > 0 ? <span className="h-6 w-px bg-[#cccccc]" aria-hidden="true" /> : null}
            <span className="min-w-0 truncate text-sm font-normal leading-5 text-[#808080]">
              {ad.timeAndLocation}
            </span>
          </div>
        </div>
      </article>
    </RouteLink>
  );
}

function PropertyItem({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#4d4d4d]">
      {icon}
      <span className="text-[#1a1a1a]">{value}</span>
    </span>
  );
}
