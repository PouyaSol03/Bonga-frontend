import { useState } from "react";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import {
  type ViewAdLeadItem,
  MOCK_VIEW_AD_LEADS,
} from "./ViewAdLeadCard";
import { ViewAdLeadProfileCard } from "./ViewAdLeadProfileCard";
import { ViewAdLeadStatusSection } from "./ViewAdLeadStatusSection";
import { ViewAdLeadNotesSection } from "./ViewAdLeadNotesSection";
import {
  ViewAdLeadActivitySection,
  type ActivityLogItem,
} from "./ViewAdLeadActivitySection";

export interface ViewAdLeadDetailsPageProps {
  lead?: ViewAdLeadItem;
  adId?: string;
  backTo?: string;
}

const DEFAULT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: "act-1",
    time: "دیروز ۱۲:۲۰",
    description: "بازدید در ۱۲ اسفند ۱۴۰۴ و در ساعت ۱۸:۰۰ انجام شد.",
  },
  {
    id: "act-2",
    time: "دیروز ۱۲:۲۰",
    description: "ساعت بازدید در ۱۲ اسفند ۱۴۰۴ و در ساعت ۱۸:۰۰ تنظیم شد.",
  },
];

function readLeadIdFromUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get("leadId") ?? undefined;
}

function readRouteState(): Record<string, unknown> {
  if (typeof window === "undefined") return {};
  const state = window.history.state;
  return state && typeof state === "object" ? (state as Record<string, unknown>) : {};
}

function readAdIdFromPathname(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const match = window.location.pathname.match(/\/account\/my-ads\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function ViewAdLeadDetailsPage(props?: ViewAdLeadDetailsPageProps) {
  const routeState = readRouteState() as Record<string, unknown> | null;
  const leadIdQuery = readLeadIdFromUrl();
  const currentAdId = props?.adId ?? (routeState?.adId as string) ?? readAdIdFromPathname();

  const resolvedLead: ViewAdLeadItem =
    props?.lead ??
    (routeState?.lead as ViewAdLeadItem) ??
    (leadIdQuery
      ? MOCK_VIEW_AD_LEADS.find((l) => l.id === leadIdQuery) ?? MOCK_VIEW_AD_LEADS[0]
      : MOCK_VIEW_AD_LEADS[0]);

  const defaultBackPath = currentAdId
    ? `/account/my-ads/${encodeURIComponent(currentAdId)}/state-ad`
    : "/account/my-ads";
  const backTo = props?.backTo ?? (routeState?.returnTo as string) ?? defaultBackPath;

  const [note, setNote] = useState("");
  const [activities, setActivities] = useState<ActivityLogItem[]>(DEFAULT_ACTIVITIES);

  const handleVisitConfirmed = (date: string, time: string) => {
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      time: "هم‌اکنون",
      description: `بازدید در ${date} و در ساعت ${time} به عنوان انجام‌شده ثبت شد.`,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="جزئیات سرنخ"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container">
        <ViewAdLeadProfileCard lead={resolvedLead} />
        <div className="h-4 bg-surface-container" />
        <ViewAdLeadStatusSection
          initialStatus={resolvedLead.status || "بازدید"}
          onVisitConfirmed={handleVisitConfirmed}
        />
        <div className="h-4 bg-surface-container" />
        <ViewAdLeadNotesSection note={note} onChange={setNote} />
        <div className="h-4 bg-surface-container" />
        <ViewAdLeadActivitySection activities={activities} />
      </main>
    </PageFrame>
  );
}

export default ViewAdLeadDetailsPage;