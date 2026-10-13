import { Link } from "react-router";
import { AccountMyAdsContent, AccountPageShell } from "../accountPageViews";

export function AccountMyAdsEmptyPage() {
  return (
    <AccountPageShell
      action={
        <Link className="grid h-12 w-12 place-items-center text-on-surface" to="/search">
        </Link>
      }
      title="آگهی‌های من"
    >
      <AccountMyAdsContent emptyMode="full" />
    </AccountPageShell>
  );
}
