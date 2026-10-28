import { getApiErrorMessage } from "../../../shared/api/api";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import {
  useApproveAgencyStopRequestMutation,
  useRejectAgencyStopRequestMutation,
} from "../../advertisements/api/agency-advertise-assignment.hooks";
import { formatStopPublishReason } from "../../advertisements/api/agency-advertise-assignment.service";
import "../../advertisements/components/AdCard.css";
import { AlertIcon } from "../ad-state/StateIcons";

export function ManagerStopRequestNotice({ ad }: { ad?: Record<string, unknown> }) {
  const approveStopMutation = useApproveAgencyStopRequestMutation();
  const rejectStopMutation = useRejectAgencyStopRequestMutation();
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          درخواست توقف انتشار توسط آگهی‌دهنده
        </Typography>
      </div>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        کاربر درخواست توقف انتشار این آگهی را ثبت کرده است.
      </Typography>
      {ad?.delete_reason &&
      typeof ad.delete_reason === "object" &&
      (ad.delete_reason as Record<string, unknown>).reason ? (
        <div className="bg-surface text-on-surface border-outline-var mt-2 rounded-lg border p-2.5 text-xs font-medium">
          علت درخواست:{" "}
          {formatStopPublishReason((ad.delete_reason as Record<string, unknown>).reason)}
        </div>
      ) : null}
      {(() => {
        const pendingStopRequestId =
          (ad?.stop_request as Record<string, unknown> | undefined)?.id ??
          (ad?.pending_stop_request as Record<string, unknown> | undefined)?.id ??
          (ad?.delete_reason as Record<string, unknown> | undefined)?.stop_request_id ??
          (ad?.delete_reason as Record<string, unknown> | undefined)?.stopRequestId;

        return (
          <div className="mt-3 flex gap-2">
            <Button
              unstyled
              className="bg-primary text-on-primary inline-flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-medium active:opacity-90 disabled:opacity-50"
              disabled={approveStopMutation.isPending || !pendingStopRequestId}
              onClick={async () => {
                if (!pendingStopRequestId) return;
                try {
                  await approveStopMutation.mutateAsync({
                    requestId: String(pendingStopRequestId),
                  });
                  window.location.reload();
                } catch (err) {
                  alert(getApiErrorMessage(err, "تأیید درخواست توقف انتشار با خطا مواجه شد."));
                }
              }}
              type="button"
            >
              {approveStopMutation.isPending ? "در حال ثبت..." : "موافقت با توقف انتشار"}
            </Button>
            <Button
              unstyled
              className="border-error bg-surface text-error active:bg-error-container inline-flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
              disabled={rejectStopMutation.isPending || !pendingStopRequestId}
              onClick={async () => {
                if (!pendingStopRequestId) return;
                try {
                  await rejectStopMutation.mutateAsync({
                    requestId: String(pendingStopRequestId),
                  });
                  window.location.reload();
                } catch (err) {
                  alert(getApiErrorMessage(err, "رد درخواست توقف انتشار با خطا مواجه شد."));
                }
              }}
              type="button"
            >
              {rejectStopMutation.isPending ? "در حال ثبت..." : "رد درخواست توقف"}
            </Button>
          </div>
        );
      })()}
    </div>
  );
}
