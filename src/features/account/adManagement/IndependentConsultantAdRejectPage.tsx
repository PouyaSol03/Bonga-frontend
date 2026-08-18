import { useMemo, useState } from "react";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { pushRoute } from "../../../shared/navigation/navigation";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  useAgencyAdvertiseAssignmentsInfiniteQuery,
  useRejectAgencyAdvertiseAssignmentMutation,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { TopBar } from "../../../shared/components/TopBar";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import {
  adManagementPaths,
  getAdManagementRouteState,
  getSelectedConsultantAd,
} from "./adManagementData";

const rejectReasons = [
  "عدم توافق با آگهی‌دهنده",
  "ثبت اطلاعات نادرست یا آگهی غیرواقعی",
  "عدم پاسخگویی آگهی‌دهنده",
] as const;

type RejectReason = (typeof rejectReasons)[number];

function getRejectAdvertiseId() {
  const match = window.location.pathname.match(
    /^\/account\/ad-management\/allocation-review\/([^/]+)\/reject\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export function IndependentConsultantAdRejectPage() {
  const routeState = getAdManagementRouteState();
  const advertiseId = getRejectAdvertiseId();
  const ad = getSelectedConsultantAd(advertiseId);
  const [selectedReason, setSelectedReason] = useState<RejectReason | null>(null);
  const [, setErrorMessage] = useState("");
  const rejectAssignmentMutation = useRejectAgencyAdvertiseAssignmentMutation();
  const shouldResolveAssignment = !routeState.assignmentId && !routeState.assignment?.id;
  const assignmentsQuery = useAgencyAdvertiseAssignmentsInfiniteQuery({
    advertiseId: advertiseId || undefined,
    enabled: shouldResolveAssignment && Boolean(advertiseId),
    perPage: 50,
    status: "pending",
    targetType: "agency",
  });
  const fallbackAssignment = useMemo(
    () =>
      assignmentsQuery.data?.pages
        .flatMap((page) => page.data)
        .find((item) => String(item.advertiseId) === String(advertiseId)),
    [advertiseId, assignmentsQuery.data],
  );
  const assignment = routeState.assignment ?? fallbackAssignment;
  const assignmentId = routeState.assignmentId ?? assignment?.id;
  const reviewPath = `${adManagementPaths.allocationReview}/${encodeURIComponent(
    String(advertiseId || ad.id),
  )}`;
  const reviewState = {
    ad,
    assignment,
    assignmentId,
    tab: "status" as const,
  };

  function navigateBackToReview() {
    pushRoute(reviewPath, reviewState, { rememberCurrent: false });
  }

  function handleConfirm() {
    if (rejectAssignmentMutation.isPending) return;

    if (!selectedReason) {
      setErrorMessage("لطفاً دلیل عدم تأیید آگهی را انتخاب کنید.");
      return;
    }

    if (assignmentId === undefined || assignmentId === null || assignmentId === "") {
      setErrorMessage("شناسه درخواست تخصیص برای رد آگهی موجود نیست.");
      return;
    }

    setErrorMessage("");
    rejectAssignmentMutation.mutate(
      {
        assignmentId,
        rejectReason: selectedReason,
      },
      {
        onError: (error) => {
          setErrorMessage(
            getApiErrorMessage(error, "رد درخواست ثبت آگهی با خطا مواجه شد."),
          );
        },
        onSuccess: () => {
          pushRoute(adManagementPaths.root, { tab: "status" }, { rememberCurrent: false });
        },
      },
    );
  }

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={reviewState}
        backTo={reviewPath}
        className="bg-[#f0f0f0]"
        contentClassName="px-2"
        heightClassName="h-14"
        title="رد ثبت آگهی"
        titleClassName="text-base font-semibold leading-6"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pt-4">
        <section aria-labelledby="reject-confirmation-title">
          <Typography
            as="h2"
            id="reject-confirmation-title"
            variant="body"
            size="large"
            weight="regular"
            className="m-0 text-right text-[#1a1a1a]"
          >
            آیا از عدم تأیید این آگهی مطمئن هستید؟
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-2 text-right text-[#808080]"
          >
            با انجام این کار، درخواست کاربر رد شده و به او اطلاع‌رسانی خواهد شد.
          </Typography>
        </section>

        <div
          aria-hidden="true"
          className="mt-4 h-px w-full border-t border-dashed border-[#cccccc]"
        />

        <section className="pt-4" aria-labelledby="reject-reason-title">
          <Typography
            as="h2"
            id="reject-reason-title"
            variant="label"
            size="large"
            weight="medium"
            className="m-0 text-right text-[#1a1a1a]"
          >
            دلیل عدم تأیید
          </Typography>

          <fieldset className="m-0 mt-1 border-0 p-0">
            <legend className="sr-only">انتخاب دلیل عدم تأیید آگهی</legend>
            <div className="flex flex-col" role="radiogroup" aria-label="دلیل عدم تأیید">
              {rejectReasons.map((reason) => (
                <label
                  className="flex h-16 cursor-pointer items-center justify-between pl-5 text-[#1a1a1a] [direction:ltr]"
                  key={reason}
                >
                  <RadioIndicator checked={selectedReason === reason} />
                  <Typography
                    as="span"
                    variant="body"
                    size="large"
                    weight="regular"
                    className="min-w-0 flex-1 text-right [direction:rtl]"
                  >
                    {reason}
                  </Typography>
                  <input
                    checked={selectedReason === reason}
                    className="sr-only"
                    name="agency-assignment-reject-reason"
                    onChange={() => {
                      setSelectedReason(reason);
                      setErrorMessage("");
                    }}
                    type="radio"
                    value={reason}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </section>
      </main>

      <footer className="flex h-[68px] shrink-0 items-center gap-4 bg-white px-4 py-[14px] shadow-[0_-4px_16px_rgba(26,26,26,0.08)] [direction:ltr]">
        <Button
          unstyled
          className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-[10px] border border-[#0048c4] bg-[#0048c4] px-4 text-[#ffffff] transition-colors active:bg-[#003aa0] disabled:cursor-not-allowed"
          disabled={rejectAssignmentMutation.isPending}
          onClick={handleConfirm}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">
            {rejectAssignmentMutation.isPending ? "در حال ثبت..." : "تایید"}
          </Typography>
        </Button>
        <Button
          unstyled
          className="inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-[10px] border border-[#0048c4] bg-white px-4 text-[#0048c4] transition-colors active:bg-[#0048c414]"
          onClick={navigateBackToReview}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular" className="[direction:rtl]">
            انصراف
          </Typography>
        </Button>
      </footer>

    </PageFrame>
  );
}
