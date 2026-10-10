import { useState } from "react";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { RadioIndicator } from "../../../shared/components/RadioIndicator";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import { useCreateStopPublishRequestMutation } from "../../advertisements/api/agency-advertise-assignment.hooks";
import { getApiErrorMessage } from "../../../shared/api/api";
import { pushRoute } from "../../../shared/navigation/navigation";

const STOP_PUBLISH_OPTIONS = [
  { id: "deal_done", label: "معامله انجام شده است" },
  { id: "no_longer_want_publish", label: "دیگر تمایلی به انتشار آگهی ندارم" },
  { id: "other", label: "دلیل دیگری دارم" },
] as const;

export type AgencyStopPublishPageProps = {
  adId?: string | number;
  returnTo?: string;
  onSuccess?: () => void;
};

export function AgencyStopPublishPage(props?: AgencyStopPublishPageProps) {
  const adId = props?.adId ?? readAdIdFromPath();
  const returnTo = props?.returnTo ?? (adId ? `/account/my-ads/${encodeURIComponent(adId)}/state-ad` : "/account/my-ads");
  const [selectedReason, setSelectedReason] = useState<string>(STOP_PUBLISH_OPTIONS[0].id);
  const [customDescription, setCustomDescription] = useState("");

  const createStopRequestMutation = useCreateStopPublishRequestMutation();

  const handleGoBack = () => {
    pushRoute(returnTo);
  };

  const handleSubmit = async () => {
    if (!adId) return;
    try {
      await createStopRequestMutation.mutateAsync({
        advertiseId: adId,
        reason: selectedReason,
        description: selectedReason === "other" && customDescription.trim() ? customDescription.trim() : undefined,
      });
      if (props?.onSuccess) {
        props.onSuccess();
      } else {
        pushRoute(returnTo);
      }
    } catch (err) {
      alert(getApiErrorMessage(err, "ثبت درخواست توقف با خطا مواجه شد."));
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
        title="درخواست توقف انتشار"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6 pb-28 [direction:rtl]">
        <Typography as="h2" variant="body" size="large" weight="medium" className="m-0 text-on-surface">
          آیا از ارسال درخواست توقف انتشار این آگهی مطمئن هستید؟
        </Typography>

        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-on-surface-var">
          درخواست شما برای آژانس ارسال می‌شود و پس از بررسی، نتیجه به شما اطلاع داده خواهد شد.
        </Typography>

        {/* Green notice pill using tertiary tokens */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-tertiary-container/30 py-1 px-2 text-tertiary">
          <LinearInfoCircle className="h-5 w-5 shrink-0 text-tertiary" />
          <Typography variant="body" size="medium" weight="medium">تا زمان تأیید آژانس، آگهی همچنان فعال خواهد بود.</Typography>
        </div>

        <div className="my-4 border-t border-dashed border-outline-var/30" />

        <Typography as="h3" variant="body" size="large" weight="medium" className="m-0 mb-2 text-on-surface">
          علت درخواست خود را مشخص کنید.
        </Typography>

        {/* Radio choices: label on right, radio indicator on left */}
        <div className="space-y-3">
          {STOP_PUBLISH_OPTIONS.map((option) => {
            const isSelected = selectedReason === option.id;
            return (
              <label
                key={option.id}
                onClick={() => setSelectedReason(option.id)}
                className="flex cursor-pointer items-center justify-between rounded-xl py-2 px-1 transition-colors"
              >
                <Typography variant="body" size="large" weight="regular" className="text-on-surface">
                  {option.label}
                </Typography>
                <RadioIndicator checked={isSelected} />
              </label>
            );
          })}
        </div>

        {selectedReason === "other" ? (
          <div className="mt-3">
            <textarea
              className="w-full rounded-xl border border-outline-var bg-surface p-3 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
              placeholder="لطفاً دلیل خود را بنویسید (اختیاری)..."
              rows={3}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
            />
          </div>
        ) : null}
      </main>

      {/* Fixed footer: Primary button on left, outline on right */}
      <footer className="absolute inset-x-0 bottom-0 mx-auto grid w-full max-w-[500px] grid-cols-2 gap-3 border-t border-outline-var/20 bg-surface-container-lowest px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] [direction:ltr]">
        <Button
          fullWidth
          variant="primary"
          size="x-medium"
          disabled={createStopRequestMutation.isPending}
          onClick={handleSubmit}
        >
          {createStopRequestMutation.isPending ? "در حال ارسال..." : "ارسال درخواست"}
        </Button>

        <Button
          fullWidth
          variant="secondary"
          size="x-medium"
          disabled={createStopRequestMutation.isPending}
          onClick={handleGoBack}
        >
          انصراف
        </Button>
      </footer>
    </PageFrame>
  );
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/stop-publish\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
