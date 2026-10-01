import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import {
  DashboardExpiringAdCard,
  type ExpiringAdItem,
} from "./components/DashboardExpiringAdCard";

export type { ExpiringAdItem };

export interface DashboardExpiringAdsPageProps {
  ads?: ExpiringAdItem[];
}

export function DashboardExpiringAdsPage({ ads }: DashboardExpiringAdsPageProps) {
  const adList = ads ?? [];

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-low text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/urgent-actions"
        backIconDirection="right"
        className="bg-surface-container-low border-b border-outline-variant"
        contentClassName="px-3"
        title="آگهی در آستانه انقضا"
      />

      {/* Main List */}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {adList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="text-on-surface-var text-sm"
            >
              آگهی در آستانه انقضایی وجود ندارد
            </Typography>
          </div>
        ) : (
          adList.map((ad) => (
            <DashboardExpiringAdCard key={ad.id} ad={ad} />
          ))
        )}
      </main>
    </PageFrame>
  );
}

export default DashboardExpiringAdsPage;
