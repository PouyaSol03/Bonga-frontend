import { useState } from "react";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import { useToast } from "../../../../shared/hooks/useToast";
import { getApiErrorMessage } from "../../../../shared/api/api";
import type { ViewAdLeadItem } from "./ViewAdLeadCard";
import { ViewAdLeadProfileCard } from "./ViewAdLeadProfileCard";
import { ViewAdLeadStatusSection } from "./ViewAdLeadStatusSection";
import { ViewAdLeadNotesSection } from "./ViewAdLeadNotesSection";
import { ViewAdLeadActivitySection, type ActivityLogItem } from "./ViewAdLeadActivitySection";
import {
  useSingleLeadDetailsQuery,
  useLeadActivitiesQuery,
  useUpdateLeadStageMutation,
  useCreateLeadNoteMutation,
} from "../api/singleLeadApi";

interface ViewAdLeadDetailsPageProps {
  lead?: ViewAdLeadItem;
  adId?: string;
  backTo?: string;
}

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
  const { showToast } = useToast();
  const routeState = readRouteState() as Record<string, unknown> | null;
  const leadIdQuery = readLeadIdFromUrl();
  const currentAdId = props?.adId ?? (routeState?.adId as string) ?? readAdIdFromPathname();

  const passedLead = props?.lead ?? (routeState?.lead as ViewAdLeadItem | undefined);
  const activeLeadId = leadIdQuery ?? passedLead?.id;

  const {
    data: leadDetails,
    isLoading: isLeadLoading,
    isError: isLeadError,
    error: leadError,
  } = useSingleLeadDetailsQuery(currentAdId, activeLeadId);

  const {
    data: liveActivities,
    isLoading: isActivitiesLoading,
  } = useLeadActivitiesQuery(currentAdId, activeLeadId);

  const updateStageMutation = useUpdateLeadStageMutation(currentAdId, activeLeadId);
  const createNoteMutation = useCreateLeadNoteMutation(currentAdId, activeLeadId);

  const [note, setNote] = useState("");

  const defaultBackPath = currentAdId
    ? `/account/manage-ads/${encodeURIComponent(currentAdId)}/state-ad`
    : "/account/manage-ads";
  const backTo = props?.backTo ?? (routeState?.returnTo as string) ?? defaultBackPath;

  if (!activeLeadId) {
    return (
      <PageFrame
        className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
        variant="flush"
      >
        <TopBar backTo={backTo} className="[&_a]:text-on-surface" title="جزئیات سرنخ" />
        <main className="bg-surface-container grid min-h-0 flex-1 place-items-center p-6 text-center">
          <Typography as="p" variant="body" size="medium" weight="medium" className="text-outline">
            شناسه سرنخ یافت نشد. لطفا از لیست سرنخ‌ها مجدداً وارد شوید.
          </Typography>
        </main>
      </PageFrame>
    );
  }

  if (isLeadLoading && !leadDetails && !passedLead) {
    return (
      <PageFrame
        className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
        variant="flush"
      >
        <TopBar backTo={backTo} className="[&_a]:text-on-surface" title="جزئیات سرنخ" />
        <main className="bg-surface-container grid min-h-0 flex-1 place-items-center p-6 text-center">
          <Typography as="p" variant="body" size="medium" weight="medium" className="text-outline">
            در حال دریافت اطلاعات سرنخ...
          </Typography>
        </main>
      </PageFrame>
    );
  }

  if (isLeadError && !passedLead) {
    return (
      <PageFrame
        className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
        variant="flush"
      >
        <TopBar backTo={backTo} className="[&_a]:text-on-surface" title="جزئیات سرنخ" />
        <main className="bg-surface-container grid min-h-0 flex-1 place-items-center p-6 text-center">
          <Typography as="p" variant="body" size="medium" weight="medium" className="text-error">
            {getApiErrorMessage(leadError, "دریافت اطلاعات سرنخ با خطا مواجه شد.")}
          </Typography>
        </main>
      </PageFrame>
    );
  }

  const resolvedLead: ViewAdLeadItem = {
    id: String(activeLeadId),
    name: leadDetails?.client?.name ?? leadDetails?.name ?? passedLead?.name ?? "کاربر",
    phone: leadDetails?.client?.phone ?? leadDetails?.phone ?? passedLead?.phone ?? "",
    status:
      leadDetails?.stage?.title ??
      (typeof leadDetails?.status === "string" ? leadDetails.status : passedLead?.status ?? "بازدید"),
    date: leadDetails?.appointment?.date_jalali ?? passedLead?.date ?? "",
    time: leadDetails?.appointment?.time ?? passedLead?.time ?? "",
    chatCount: passedLead?.chatCount ?? 0,
    callCount: passedLead?.callCount ?? 0,
    avatarUrl: leadDetails?.client?.avatar_url ?? leadDetails?.avatar_url ?? passedLead?.avatarUrl,
  };

  const displayActivities: ActivityLogItem[] = (liveActivities ?? []).map((act) => ({
    id: String(act.id),
    time: act.occurred_at || "",
    description: act.title + (act.description ? `: ${act.description}` : ""),
  }));

  const handleStageChange = async (newStageKey: string) => {
    try {
      await updateStageMutation.mutateAsync(newStageKey);
      showToast("وضعیت سرنخ با موفقیت تغییر کرد.", undefined, "success");
    } catch (err) {
      showToast(
        getApiErrorMessage(err, "تغییر وضعیت سرنخ با خطا مواجه شد."),
        undefined,
        "error",
      );
    }
  };

  const handleVisitConfirmed = async () => {
    try {
      const idempotencyKey = `visit-${activeLeadId}-${Date.now()}`;
      await updateStageMutation.mutateAsync({ stageKey: "visited", idempotencyKey });
      showToast("بازدید با موفقیت ثبت شد.", undefined, "success");
    } catch (err) {
      showToast(
        getApiErrorMessage(err, "ثبت بازدید با خطا مواجه شد."),
        undefined,
        "error",
      );
    }
  };

  const handleNoteSubmit = async () => {
    if (!note.trim()) return;
    try {
      await createNoteMutation.mutateAsync(note);
      setNote("");
      showToast("یادداشت با موفقیت ذخیره شد.", undefined, "success");
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number } };
      if (errorObj?.response?.status === 503) {
        showToast(
          "امکان ثبت یادداشت در حال حاضر در دسترس نیست.",
          undefined,
          "warning",
        );
      } else {
        showToast(
          getApiErrorMessage(err, "ثبت یادداشت با خطا مواجه شد."),
          undefined,
          "error",
        );
      }
    }
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
          currentStage={resolvedLead.status}
          isMutating={updateStageMutation.isPending}
          onStageChange={handleStageChange}
          onVisitConfirmed={handleVisitConfirmed}
          serverDate={resolvedLead.date}
          serverTime={resolvedLead.time}
        />
        <div className="bg-surface-container h-4" />
        <ViewAdLeadNotesSection
          note={note}
          onChange={setNote}
          onSubmit={handleNoteSubmit}
          isSubmitting={createNoteMutation.isPending}
        />
        <div className="bg-surface-container h-4" />
        <ViewAdLeadActivitySection
          activities={displayActivities}
          isLoading={isActivitiesLoading}
        />
      </main>
    </PageFrame>
  );
}

export default ViewAdLeadDetailsPage;
