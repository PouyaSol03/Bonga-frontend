import { useState } from "react";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearLike from "../../../shared/icons/LinearLike";
import LinearDislike from "../../../shared/icons/LinearDislike";
import { useConfirmUserDealResultMutation } from "../../advertisements/api/agency-advertise-assignment.hooks";
import { getApiErrorMessage } from "../../../shared/api/api";
import { pushRoute } from "../../../shared/navigation/navigation";

export type AgencyDealResultPageProps = {
  adId?: string | number;
  returnTo?: string;
  onSuccess?: () => void;
};

export function AgencyDealResultPage(props?: AgencyDealResultPageProps) {
  const adId = props?.adId ?? readAdIdFromPath();
  const returnTo = props?.returnTo ?? (adId ? `/account/my-ads/${encodeURIComponent(adId)}/state-ad` : "/account/my-ads");
  const [selectedResult, setSelectedResult] = useState<"success" | "unsuccessful">("success");

  const confirmDealResultMutation = useConfirmUserDealResultMutation();

  const handleGoBack = () => {
    pushRoute(returnTo);
  };

  const handleSubmit = async () => {
    if (!adId) return;
    try {
      await confirmDealResultMutation.mutateAsync({
        advertiseId: adId,
        confirmed: selectedResult === "success",
      });
      if (props?.onSuccess) {
        props.onSuccess();
      } else {
        pushRoute(returnTo);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, "ثبت نتیجه درخواست با خطا مواجه شد."));
    }
  };

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnTo}
        className="[&_a]:text-on-surface"
        title="نتیجه درخواست"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6 pb-28 [direction:rtl]">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-base text-on-surface">
          نتیجه درخواست را ثبت کنید
        </Typography>

        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs leading-5 text-on-surface-var">
          آژانس اعلام کرده است که پیگیری این درخواست به پایان رسیده است. لطفاً نتیجه نهایی را مشخص کنید.
        </Typography>

        {/* Radio Choices with Thumbs icons */}
        <div className="mt-8 space-y-4">
          <label
            onClick={() => setSelectedResult("success")}
            className="flex cursor-pointer items-center justify-between rounded-xl py-3 px-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LinearLike className="h-5 w-5 text-on-surface" />
              <span className="text-sm font-medium text-on-surface">معامله موفق بود</span>
            </div>
            <RadioIndicator checked={selectedResult === "success"} />
          </label>

          <label
            onClick={() => setSelectedResult("unsuccessful")}
            className="flex cursor-pointer items-center justify-between rounded-xl py-3 px-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LinearDislike className="h-5 w-5 text-on-surface" />
              <span className="text-sm font-medium text-on-surface">معامله ناموفق بود</span>
            </div>
            <RadioIndicator checked={selectedResult === "unsuccessful"} />
          </label>
        </div>
      </main>

      {/* Fixed footer: Primary button on left, outline on right */}
      <footer className="absolute inset-x-0 bottom-0 mx-auto grid w-full max-w-[500px] grid-cols-2 gap-3 border-t border-outline-var/20 bg-surface-container-lowest px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] [direction:ltr]">
        <Button
          fullWidth
          variant="primary"
          size="x-medium"
          disabled={confirmDealResultMutation.isPending}
          onClick={handleSubmit}
        >
          {confirmDealResultMutation.isPending ? "در حال ثبت..." : "ثبت"}
        </Button>

        <Button
          fullWidth
          variant="secondary"
          size="x-medium"
          disabled={confirmDealResultMutation.isPending}
          onClick={handleGoBack}
        >
          انصراف
        </Button>
      </footer>
    </PageFrame>
  );
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/(?:deal-result|close-result)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
