import { useState } from "react";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { TopBar } from "../../../shared/components/TopBar";
import { adManagementPaths, getAdManagementRouteState } from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearDanger from "../../../shared/icons/LinearDanger";

type CloseResultReason = "done" | "not-done" | "expired";

const closeResultReasons: { label: string; value: CloseResultReason }[] = [
  { label: "معامله انجام شد", value: "done" },
  { label: "معامله انجام نشد", value: "not-done" },
  { label: "مدت‌زمان پیشفرض بود", value: "expired" },
];

export function AdCloseResultPage() {
  const routeState = getAdManagementRouteState();
  const adId = readAdIdFromCloseResultPath() ?? readEntityId(routeState.card) ?? readEntityId(routeState.ad);
  const returnTo =
    normalizeLocalPath(routeState.returnTo) ??
    (adId
      ? `/account/my-ads/${encodeURIComponent(adId)}/state-ad`
      : adManagementPaths.root);
  const [selectedReason, setSelectedReason] = useState<CloseResultReason | null>(null);

  function goBack() {
    window.history.pushState({ ...routeState, tab: routeState.tab ?? "active" }, "", returnTo);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function handleSubmit() {
    if (!selectedReason) return;

    window.history.pushState(
      {
        ...routeState,
        closeResultReason: selectedReason,
        closeResultSubmitted: true,
        tab: routeState.tab ?? "active",
      },
      "",
      returnTo,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo}
        backState={{ ...routeState, tab: routeState.tab ?? "active" }}
        className="bg-[#f0f0f0]"
        title="ثبت نتیجه آگهی"
        titleClassName="text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-28 pt-4">
        <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-[#1a1a1a]">
          این آگهی از لیست آگهی‌های تخصیصی آژانس خارج خواهد شد.
        </Typography>

        <section className="mt-3 rounded-xl border border-[#ff6d00] bg-[#fff7ed] px-4 py-3 text-right" aria-label="هشدار">
          <div className="flex items-center justify-start gap-2 text-[#ff6d00]">
            <LinearDanger className="h-5 w-5 shrink-0" />
            <Typography as="h2" variant="title" size="small" weight="semibold" className="m-0 text-sm font-semibold leading-5">توجه!</Typography>
          </div>
          <ul className="m-0 mt-2 list-disc space-y-1 pr-5 text-sm font-normal text-[#4d4d4d] marker:text-[#808080]">
            <li>
              فقط در صورت انتخاب گزینه «معامله انجام شد»، از کاربر درباره نتیجه نهایی معامله استعلام گرفته می‌شود. نتیجه ثبت‌شده توسط کاربر در بخش «وضعیت آگهی» قابل مشاهده خواهد بود.
            </li>
            <li className="mt-4">
              در غیر این صورت درخواست حذف شده و به عنوان معامله ناموفق یا آگهی بدون پاسخ ثبت می‌شود.
            </li>
          </ul>
        </section>

        <section className="mt-5" aria-label="دلیل بستن آگهی">
          <Typography as="h2" variant="body" size="large" weight="medium" className="m-0 text-[#1a1a1a]">دلیل بستن آگهی</Typography>
          <div className="mt-4 grid gap-4" role="radiogroup" aria-label="دلیل بستن آگهی">
            {closeResultReasons.map((reason) => {
              const selected = selectedReason === reason.value;

              return (
                <Button unstyled
                  aria-checked={selected}
                  className="flex h-9 w-full items-center justify-between rounded-lg bg-white p-0 text-right [direction:ltr] active:bg-[#f7f7f7]"
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography as="span" variant="body" size="large" weight="regular" className="min-w-0 flex-1 pr-3 text-right text-[#1a1a1a] [direction:rtl]">
                    {reason.label}
                  </Typography>
                </Button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] [direction:ltr]">
        <Button unstyled
          className={`inline-flex h-10 items-center justify-center rounded-lg text-sm font-medium leading-5 transition-colors ${selectedReason
            ? "bg-[#0048c4] text-white active:bg-[#003aa0]"
            : "bg-[#e5e5e5] text-[#b8b8b8]"
            }`}
          disabled={!selectedReason}
          onClick={handleSubmit}
          type="button"
        >
          ثبت نتیجه
        </Button>
        <Button unstyled
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[#0048c4] bg-white text-sm font-medium leading-5 text-[#0048c4] active:bg-[#e6efff]"
          onClick={goBack}
          type="button"
        >
          انصراف
        </Button>
      </footer>
    </PageFrame>
  );
}

function readAdIdFromCloseResultPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/close-result\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function readEntityId(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const candidate = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;

  if (candidate === null || candidate === undefined) return undefined;
  const text = String(candidate).trim();
  return text || undefined;
}

function normalizeLocalPath(path?: string) {
  if (!path || !path.startsWith("/")) return undefined;
  if (path.startsWith("//")) return undefined;

  return path;
}
