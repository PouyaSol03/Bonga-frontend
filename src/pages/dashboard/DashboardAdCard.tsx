import { AdCard, type AdCardData } from "../../components/AdCard";
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
  const card = dashboardAdToCardData(ad);

  return (
    <AdCard
      ad={card}
      ariaLabel={`مدیریت آگهی ${ad.title}`}
      state={{ card, ad: card, returnTo: "/account/dashboard/ads", tab: "active" }}
      to={getAdStatePath(ad.id)}
      variant="dashboard"
    />
  );
}

function dashboardAdToCardData(ad: DashboardAd): AdCardData {
  return {
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
}
