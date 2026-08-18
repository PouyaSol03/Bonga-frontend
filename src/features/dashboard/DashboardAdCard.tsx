import { AdCard, type AdCardData } from "../advertisements/components/AdCard";
import { getAdStatePath } from "../account/adManagement/adManagementData";

export function DashboardAdCard({ ad }: { ad: AdCardData }) {
  return (
    <AdCard
      ad={ad}
      ariaLabel={`مدیریت آگهی ${ad.title}`}
      state={{ card: ad, ad, returnTo: "/account/dashboard/ads", tab: "active" }}
      to={getAdStatePath(ad.id)}
      variant="dashboard"
    />
  );
}
