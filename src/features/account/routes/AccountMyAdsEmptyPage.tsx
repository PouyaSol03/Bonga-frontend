import { Link } from "react-router";
import { AccountMyAdsContent, AccountPageShell } from "../accountPageViews";

export function AccountMyAdsEmptyPage() {
  return (
    <AccountPageShell
      action={
        <Link className="text-on-surface grid h-12 w-12 place-items-center" to="/search"></Link>
      }
      title="آگهی‌های من"
    >
      <AccountMyAdsContent emptyMode="full" />
    </AccountPageShell>
  );
}
