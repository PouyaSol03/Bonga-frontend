import { useMemo, useState } from "react";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { TopBar } from "../../../shared/components/TopBar";
import { adManagementPaths } from "./adManagementData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

const deleteReasons = [
  { id: "sold-elsewhere", label: "از راه دیگر فروختم" },
  { id: "changed-mind", label: "از فروش منصرف شدم" },
  { id: "publishing-problem", label: "در انتشار آگهی به مشکل خوردم" },
  { id: "other", label: "دلایل دیگر" },
] as const;

type DeleteReasonId = (typeof deleteReasons)[number]["id"];

type DeleteAdRouteState = {
  ad?: Record<string, unknown>;
  card?: { id?: string | number; title?: string };
  deleteCompleteTo?: string;
  deleteReturnTo?: string;
  returnTo?: string;
  tab?: string;
};

export function AdDeleteReasonPage() {
  const routeState = useMemo(readRouteState, []);
  const [selectedReason, setSelectedReason] = useState<DeleteReasonId>(deleteReasons[0].id);
  const backTo = routeState.deleteReturnTo ?? adManagementPaths.published;
  const adId = readAdId(routeState);

  const handleConfirm = () => {
    const selectedReasonLabel = deleteReasons.find((reason) => reason.id === selectedReason)?.label ?? "";
    const completeTo = routeState.deleteCompleteTo ?? adManagementPaths.root;

    window.history.pushState(
      {
        ...routeState,
        deletedAdId: adId,
        deleteReason: selectedReason,
        deleteReasonLabel: selectedReasonLabel,
        tab: routeState.tab ?? "status",
      },
      "",
      completeTo,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ ad: routeState.ad, card: routeState.card, returnTo: routeState.returnTo, tab: routeState.tab }}
        backTo={backTo}
        className="[&_a]:text-[#1a1a1a]"
        title="حذف آگهی"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        <fieldset className="m-0 border-0 px-4 pb-6 pt-6">
          <legend className="sr-only">دلیل حذف آگهی</legend>

          <div className="space-y-8">
            {deleteReasons.map((reason) => (
              <label
                className="flex h-6 cursor-pointer items-center justify-between gap-4 [direction:ltr]"
                key={reason.id}
              >
                <RadioIndicator checked={selectedReason === reason.id} />
                <Typography as="span" variant="label" size="medium" weight="medium" className="text-right text-sm font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
                  {reason.label}
                </Typography>
                <input
                  checked={selectedReason === reason.id}
                  className="sr-only"
                  name="delete-ad-reason"
                  onChange={() => setSelectedReason(reason.id)}
                  type="radio"
                  value={reason.id}
                />
              </label>
            ))}
          </div>
        </fieldset>
      </main>

      <div className="absolute inset-x-0 bottom-0 bg-white px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button unstyled
          className="h-10 w-full rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white disabled:opacity-50"
          onClick={handleConfirm}
          type="button"
        >
          تایید
        </Button>
      </div>
    </PageFrame>
  );
}

function readRouteState(): DeleteAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  return state as DeleteAdRouteState;
}

function readAdId(routeState: DeleteAdRouteState) {
  const paramsAdId = new URLSearchParams(window.location.search).get("adId");

  return paramsAdId ?? String(routeState.card?.id ?? routeState.ad?.id ?? routeState.ad?._id ?? "");
}
