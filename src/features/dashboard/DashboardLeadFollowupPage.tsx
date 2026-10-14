import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import {
  DashboardLeadFollowupCard,
  type LeadFollowupItem,
} from "./components/DashboardLeadFollowupCard";

export type { LeadFollowupItem };

export interface DashboardLeadFollowupPageProps {
  items?: LeadFollowupItem[];
}

export function DashboardLeadFollowupPage({ items }: DashboardLeadFollowupPageProps) {
  const itemList = items ?? [];

  return (
    <PageFrame
      className="bg-surface-container-low text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/urgent-actions"
        backIconDirection="right"
        className="bg-surface-container-low border-outline-variant border-b"
        contentClassName="px-3"
        title="پیگیری سرنخ"
      />

      {/* Main Content List */}
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        {itemList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="text-on-surface-var text-sm"
            >
              موردی برای پیگیری سرنخ وجود ندارد
            </Typography>
          </div>
        ) : (
          itemList.map((item) => <DashboardLeadFollowupCard key={item.id} item={item} />)
        )}
      </main>
    </PageFrame>
  );
}

export default DashboardLeadFollowupPage;
