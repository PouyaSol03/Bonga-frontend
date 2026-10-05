import { useState } from "react";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { RouteLink } from "../../../../shared/navigation/RouteLink";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { useCancelAgencyConsultantRequestMutation } from "../../../agencies/api/agency.hooks";
import { ConsultantAvatar } from "./ConsultantCardWidgets";
import { consultantTeamPaths, type TeamConsultant } from "./teamTypes";
import { formatPhoneNumber } from "./teamUtils";

export function ConsultantCard({ consultant }: { consultant: TeamConsultant }) {
  const isPending = consultant.status === "pending";
  const cancelRequestMutation = useCancelAgencyConsultantRequestMutation();
  const [cancelError, setCancelError] = useState("");

  const cancelRequest = () => {
    const agentId = consultant.agentId;
    if (!agentId || cancelRequestMutation.isPending) return;

    setCancelError("");
    cancelRequestMutation.mutate(agentId, {
      onError: (error) => {
        setCancelError(
          getApiErrorMessage(error, "لغو درخواست همکاری با خطا مواجه شد."),
        );
      },
    });
  };

  const actionTargetId = consultant.agentId ?? consultant.id;

  return (
    <article className="w-full bg-surface-container-lowest p-4 [direction:rtl]">
      {isPending && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="rounded-lg bg-warning-container/30 px-4 py-2 text-warning"
            >
              در انتظار تایید انتشار
            </Typography>
            <Button
              unstyled
              className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-1 !text-sm font-medium text-on-error-container disabled:opacity-50"
              disabled={!consultant.agentId || cancelRequestMutation.isPending}
              onClick={cancelRequest}
              type="button"
            >
              <LinearCancel className="h-5 w-5" />
              {cancelRequestMutation.isPending ? "در حال لغو..." : "لغو"}
            </Button>
          </div>
          {cancelError ? (
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="m-0 mt-2 text-xs text-on-error-container"
            >
              {cancelError}
            </Typography>
          ) : null}
        </div>
      )}

      <div className="flex items-center gap-4">
        <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <Typography
            as="h2"
            variant="label"
            size="large"
            weight="semibold"
            className="m-0 truncate text-on-surface"
          >
            {consultant.name}
          </Typography>
          <div className="flex items-center gap-2 text-on-surface-var">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline"
            >
              {consultant.roleLabel || "مشاور"}
            </Typography>
            {consultant.phone ? (
              <>
                <span className="h-5 w-px bg-outline-var" />
                <Typography
                  as="span"
                  dir="ltr"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-outline [direction:ltr]"
                >
                  {formatPhoneNumber(consultant.phone)}
                </Typography>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {!isPending && (
        <div className="mt-6 flex h-10 items-center overflow-hidden rounded-[10px] bg-surface-container">
          <RouteLink
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.info}/${actionTargetId}`}
          >
            <LinearInfoCircle className="h-5 w-5 text-on-surface-var" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              اطلاعات
            </Typography>
          </RouteLink>
          <span className="h-6 w-px bg-outline-var" />
          <RouteLink
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.edit}/${actionTargetId}`}
          >
            <LinearEdit2 className="h-5 w-5 text-on-surface-var" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              ویرایش
            </Typography>
          </RouteLink>
          <span className="h-6 w-px bg-outline-var" />
          <RouteLink
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.remove}/${actionTargetId}`}
          >
            <LinearDelete className="h-5 w-5 text-on-surface-var" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              حذف
            </Typography>
          </RouteLink>
        </div>
      )}
    </article>
  );
}
