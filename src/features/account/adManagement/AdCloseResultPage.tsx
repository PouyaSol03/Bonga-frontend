import { useState } from "react";
import { useNavigate } from "react-router";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { TopBar } from "../../../shared/components/TopBar";
import { adManagementPaths, getAdManagementRouteState } from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import LinearDanger from "../../../shared/icons/LinearDanger";

import { useSubmitAdvertiseDealResultMutation } from "../../advertisements/api/agency-advertise-assignment.hooks";

type CloseResultReason = "successful" | "failed" | "unresponsive";

const closeResultReasons: { label: string; value: CloseResultReason }[] = [
  { label: "معامله انجام شد", value: "successful" },
  { label: "معامله انجام نشد", value: "failed" },
  { label: "مشتری پاسخگو نبود", value: "unresponsive" },
];

export type AdCloseResultPageProps = {
  adId?: string;
  initialReason?: CloseResultReason;
};

export function AdCloseResultPage(props?: AdCloseResultPageProps) {
  const navigate = useNavigate();
  const routeState = getAdManagementRouteState();
  const adId =
    props?.adId ??
    readAdIdFromCloseResultPath() ??
    readEntityId(routeState.card) ??
    readEntityId(routeState.ad);
  const returnTo =
    normalizeLocalPath(routeState.returnTo) ??
    (adId ? `/account/manage-ads/${encodeURIComponent(adId)}/state-ad` : adManagementPaths.root);
  const [selectedReason, setSelectedReason] = useState<CloseResultReason | null>(
    props?.initialReason ?? null,
  );
  const submitMutation = useSubmitAdvertiseDealResultMutation();

  function goBack() {
    navigate(returnTo, { state: { ...routeState, tab: routeState.tab ?? "active" } });
  }

  function handleSubmit() {
    if (!selectedReason || !adId) return;

    submitMutation.mutate(
      {
        advertiseId: adId,
        result: selectedReason,
      },
      {
        onSuccess: () => {
          navigate(returnTo, {
            state: {
              ...routeState,
              closeResultReason: selectedReason,
              closeResultSubmitted: true,
              tab: routeState.tab ?? "active",
            },
          });
        },
      },
    );
  }

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo}
        backState={{ ...routeState, tab: routeState.tab ?? "active" }}
        className="bg-surface-container"
        title="ثبت نتیجه آگهی"
        titleClassName="text-sm font-semibold leading-5"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-4 pb-28">
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="medium"
          className="text-on-surface m-0"
        >
          این آگهی از لیست آگهی‌های تخصیصی آژانس خارج خواهد شد.
        </Typography>

        <section
          className="border-warning bg-warning-container/30 mt-3 rounded-xl border px-4 py-3 text-right"
          aria-label="هشدار"
        >
          <div className="text-warning flex items-center justify-start gap-2">
            <LinearDanger className="h-5 w-5 shrink-0" />
            <Typography
              as="h2"
              variant="title"
              size="small"
              weight="semibold"
              className="m-0 text-sm leading-5 font-semibold"
            >
              توجه!
            </Typography>
          </div>
          <ul className="text-on-surface-var marker:text-outline m-0 mt-2 list-disc space-y-1 pr-5 text-sm font-normal">
            <li>
              فقط در صورت انتخاب گزینه «معامله انجام شد»، از کاربر درباره نتیجه نهایی معامله استعلام
              گرفته می‌شود. نتیجه ثبت‌شده توسط کاربر در بخش «وضعیت آگهی» قابل مشاهده خواهد بود.
            </li>
            <li className="mt-4">
              در غیر این صورت درخواست حذف شده و به عنوان معامله ناموفق یا آگهی بدون پاسخ ثبت می‌شود.
            </li>
          </ul>
        </section>

        <section className="mt-5" aria-label="دلیل بستن آگهی">
          <Typography
            as="h2"
            variant="body"
            size="large"
            weight="medium"
            className="text-on-surface m-0"
          >
            دلیل بستن آگهی
          </Typography>
          <div className="mt-4 grid gap-4" role="radiogroup" aria-label="دلیل بستن آگهی">
            {closeResultReasons.map((reason) => {
              const selected = selectedReason === reason.value;

              return (
                <Button
                  unstyled
                  aria-checked={selected}
                  className="bg-surface-container-lowest active:bg-surface-container flex h-9 w-full items-center justify-between rounded-lg p-0 text-right [direction:ltr]"
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  role="radio"
                  type="button"
                >
                  <RadioIndicator checked={selected} />
                  <Typography
                    as="span"
                    variant="body"
                    size="large"
                    weight="regular"
                    className="text-on-surface min-w-0 flex-1 pr-3 text-right [direction:rtl]"
                  >
                    {reason.label}
                  </Typography>
                </Button>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 grid grid-cols-2 gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] [direction:ltr]">
        <Button
          unstyled
          className={`inline-flex h-10 items-center justify-center rounded-lg text-sm leading-5 font-medium transition-colors ${
            selectedReason && !submitMutation.isPending
              ? "bg-primary text-on-primary active:opacity-80"
              : "bg-surface-container-high text-outline"
          }`}
          disabled={!selectedReason || submitMutation.isPending}
          onClick={handleSubmit}
          type="button"
        >
          {submitMutation.isPending ? "در حال ثبت..." : "ثبت نتیجه"}
        </Button>
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary active:bg-primary-container inline-flex h-10 items-center justify-center rounded-lg border text-sm leading-5 font-medium"
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
  const match = window.location.pathname.match(
    /^\/account\/(?:my-ads|manage-ads)\/([^/]+)\/close-result\/?$/,
  );

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
