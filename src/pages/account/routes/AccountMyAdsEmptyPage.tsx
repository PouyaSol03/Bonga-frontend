import { RouteLink } from "../../../routes/RouteLink";
import { AccountMyAdsContent, AccountPageShell } from "../accountPageViews";

export function AccountMyAdsEmptyPage() {
  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
        </RouteLink>
      }
      title="آگهی‌های من"
    >
      <AccountMyAdsContent emptyMode="full" />
    </AccountPageShell>
  );
}
