import { useQuery } from "@tanstack/react-query";
import { getRecentViews } from "../api/recent-views.service";
import { useMemo } from "react";
import {
  type AdvertisementItem,
  mapAdvertisementToAdCard,
} from "../../advertisements/api/advertisement.service";
import { Link } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { AdCard } from "../../advertisements/components/AdCard";
import {
  AccountAdCardsSkeleton,
  AccountPageShell,
  AccountRetryState,
  EmptyAccountState,
} from "../accountPageViews";

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
        <Link className="text-on-surface grid h-12 w-12 place-items-center" to="/search"></Link>
      }
      title="بازدیدهای اخیر"
    >
      <main
        className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto ${!recentViewsQuery.isLoading && !recentViewsQuery.isError && recentAdvertises.length === 0 ? "bg-surface-container-lowest" : "bg-surface-container"}`}
      >
        {recentViewsQuery.isLoading ? <AccountAdCardsSkeleton /> : null}
        {recentViewsQuery.isError ? (
          <AccountRetryState
            error={recentViewsQuery.error}
            message={getApiErrorMessage(
              recentViewsQuery.error,
              "دریافت بازدیدهای اخیر با خطا مواجه شد.",
            )}
            onRetry={() => void recentViewsQuery.refetch()}
          />
        ) : null}
        {!recentViewsQuery.isLoading && !recentViewsQuery.isError ? (
          <div
            className={`min-h-0 flex-1 ${recentAdvertises.length === 0 ? "bg-surface-container-lowest flex flex-col" : "bg-surface-container space-y-2"}`}
          >
            {recentAdvertises.map((advertise, index) => {
              const ad = mapAdvertisementToAdCard(advertise, index);

              return <AdCard ad={ad} key={ad.id || index} />;
            })}
            {recentAdvertises.length === 0 ? (
              <EmptyAccountState
                description="پس از اولین بازدید، آگهی‌های مشاهده‌شده در این بخش نمایش داده خواهند شد."
                iconSrc="/vectors/NoViews.svg"
                title="هیچ بازدید اخیری برای نمایش وجود ندارد!"
              />
            ) : null}
          </div>
        ) : null}
      </main>
    </AccountPageShell>
  );
}
