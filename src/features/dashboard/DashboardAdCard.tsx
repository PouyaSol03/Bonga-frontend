import { AdCard, type AdCardData } from "../advertisements/components/AdCard";
import { getAdStatePath } from "../account/adManagement/adManagementData";

export function DashboardAdCard({
  ad,
  returnTo = "/account/dashboard/ads",
  to,
}: {
  ad: AdCardData;
  returnTo?: string;
  to?: string;
}) {
  return (
    <AdCard
      ad={ad}
      ariaLabel={`مدیریت آگهی ${ad.title}`}
      state={{ card: ad, ad, returnTo, tab: "active" }}
      to={to ?? getAdStatePath(ad.id)}
      variant="dashboard"
    />
  );
}
