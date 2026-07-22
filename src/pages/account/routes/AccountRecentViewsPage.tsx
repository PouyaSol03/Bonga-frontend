import { useQuery } from "@tanstack/react-query";
import { getRecentViews } from "../../../services/recent-views.service";
import { useMemo } from "react";
import { type AdvertisementItem, mapAdvertisementToAdCard } from "../../../services/advertisement.service";
import { RouteLink } from "../../../routes/RouteLink";
import { getApiErrorMessage } from "../../../api/api";
import { AdCard } from "../../../components/AdCard";
import { AccountAdCardsSkeleton, AccountPageShell, AccountRetryState, EmptyAccountState } from "../accountPageViews";

export function AccountRecentViewsPage() {
  const recentViewsQuery = useQuery({
    queryFn: () => getRecentViews({ includeMissing: false, page: 1, perPage: 100 }),
    queryKey: ["account", "recent-views"],
  });
  const recentAdvertises = useMemo(() => {
    if (!recentViewsQuery.data) return [];
    if (recentViewsQuery.data.advertises.length > 0) {
      return recentViewsQuery.data.advertises as AdvertisementItem[];
    }

    return recentViewsQuery.data.data.flatMap((view) =>
      view.advertise ? [view.advertise as AdvertisementItem] : [],
    );
  }, [recentViewsQuery.data]);

  return (
    <AccountPageShell
      action={
        <RouteLink className="grid h-12 w-12 place-items-center text-[#1a1a1a]" to="/search">
        </RouteLink>
      }
      title="بازدیدهای اخیر"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {recentViewsQuery.isLoading ? <AccountAdCardsSkeleton /> : null}
        {recentViewsQuery.isError ? (
          <AccountRetryState
            error={recentViewsQuery.error}
            message={getApiErrorMessage(recentViewsQuery.error, "دریافت بازدیدهای اخیر با خطا مواجه شد.")}
            onRetry={() => void recentViewsQuery.refetch()}
          />
        ) : null}
        {!recentViewsQuery.isLoading && !recentViewsQuery.isError ? (
          <div className="space-y-2 bg-[#f0f0f0] pt-2">
            {recentAdvertises.map((advertise, index) => {
              const ad = mapAdvertisementToAdCard(advertise, index);

              return <AdCard ad={ad} key={ad.id || index} />;
            })}
            {recentAdvertises.length === 0 ? (
              <EmptyAccountState
                description="آگهی‌هایی که مشاهده می‌کنید در این بخش نمایش داده می‌شوند."
                iconSrc="/vectors/NoSearch.svg"
                title="هنوز آگهی‌ای مشاهده نکرده‌اید!"
              />
            ) : null}
          </div>
        ) : null}
      </main>
    </AccountPageShell>
  );
}
