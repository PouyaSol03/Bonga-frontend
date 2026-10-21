import { useState } from "react";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import { type ViewAdLeadItem, MOCK_VIEW_AD_LEADS } from "./ViewAdLeadCard";
import { ViewAdLeadProfileCard } from "./ViewAdLeadProfileCard";
import { ViewAdLeadStatusSection } from "./ViewAdLeadStatusSection";
import { ViewAdLeadNotesSection } from "./ViewAdLeadNotesSection";
import { ViewAdLeadActivitySection, type ActivityLogItem } from "./ViewAdLeadActivitySection";
import {
  useSingleLeadDetailsQuery,
  useLeadActivitiesQuery,
  useUpdateLeadStageMutation,
} from "../api/singleLeadApi";

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
  const match = window.location.pathname.match(/\/account\/(?:my-ads|manage-ads)\/([^/]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function ViewAdLeadDetailsPage(props?: ViewAdLeadDetailsPageProps) {
  const routeState = readRouteState() as Record<string, unknown> | null;
  const leadIdQuery = readLeadIdFromUrl();
  const currentAdId = props?.adId ?? (routeState?.adId as string) ?? readAdIdFromPathname();

  const fallbackLead: ViewAdLeadItem =
    props?.lead ??
    (routeState?.lead as ViewAdLeadItem) ??
    (leadIdQuery
      ? (MOCK_VIEW_AD_LEADS.find((l) => l.id === leadIdQuery) ?? MOCK_VIEW_AD_LEADS[0])
      : MOCK_VIEW_AD_LEADS[0]);

  const activeLeadId = leadIdQuery ?? fallbackLead.id;
  const { data: leadDetails } = useSingleLeadDetailsQuery(currentAdId, activeLeadId);
  const { data: liveActivities } = useLeadActivitiesQuery(currentAdId, activeLeadId);
  const updateStageMutation = useUpdateLeadStageMutation(currentAdId, activeLeadId);

  const resolvedLead: ViewAdLeadItem = {
    ...fallbackLead,
    ...(leadDetails
      ? {
          id: String(leadDetails.id),
          name: leadDetails.client?.name ?? fallbackLead.name,
          phone: leadDetails.client?.phone ?? fallbackLead.phone,
          status: leadDetails.stage?.title ? String(leadDetails.stage.title) : fallbackLead.status,
          date: leadDetails.appointment?.date_jalali ?? fallbackLead.date,
          time: leadDetails.appointment?.time ?? fallbackLead.time,
        }
      : {}),
  };

  const defaultBackPath = currentAdId
    ? `/account/manage-ads/${encodeURIComponent(currentAdId)}/state-ad`
    : "/account/manage-ads";
  const backTo = props?.backTo ?? (routeState?.returnTo as string) ?? defaultBackPath;

  const [note, setNote] = useState(leadDetails?.notes ?? "");
  const [activities, setActivities] = useState<ActivityLogItem[]>(DEFAULT_ACTIVITIES);

  const displayActivities: ActivityLogItem[] =
    liveActivities && liveActivities.length > 0
      ? liveActivities.map((act) => ({
          id: act.id,
          time: act.occurred_at,
          description: act.title + (act.description ? `: ${act.description}` : ""),
        }))
      : activities;

  const handleVisitConfirmed = (date: string, time: string) => {
    updateStageMutation.mutate("visited");
    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      time: "هم‌اکنون",
      description: `بازدید در ${date} و در ساعت ${time} به عنوان انجام‌شده ثبت شد.`,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} className="[&_a]:text-on-surface" title="جزئیات سرنخ" />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <ViewAdLeadProfileCard lead={resolvedLead} />
        <div className="bg-surface-container h-4" />
        <ViewAdLeadStatusSection
          initialStatus={resolvedLead.status || "بازدید"}
          onVisitConfirmed={handleVisitConfirmed}
        />
        <div className="bg-surface-container h-4" />
        <ViewAdLeadNotesSection note={note} onChange={setNote} />
        <div className="bg-surface-container h-4" />
        <ViewAdLeadActivitySection activities={displayActivities} />
      </main>
    </PageFrame>
  );
}

export default ViewAdLeadDetailsPage;
