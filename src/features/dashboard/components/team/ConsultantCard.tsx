import { useState } from "react";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { Link } from "react-router";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { useCancelAgencyConsultantRequestMutation } from "../../../agencies/api/agency.hooks";
import { useToast } from "../../../../shared/hooks/useToast";
import { ConsultantAvatar } from "./ConsultantCardWidgets";
import { consultantTeamPaths, type TeamConsultant } from "./teamTypes";
import { formatPhoneNumber } from "./teamUtils";

export function ConsultantCard({ consultant }: { consultant: TeamConsultant }) {
  const isPending = consultant.status === "pending";
  const cancelRequestMutation = useCancelAgencyConsultantRequestMutation();
  const { showToast } = useToast();
  const [cancelError, setCancelError] = useState("");

  const cancelRequest = () => {
    const agentId = consultant.agentId;
    if (!agentId || cancelRequestMutation.isPending) return;

    setCancelError("");
    cancelRequestMutation.mutate(agentId, {
      onSuccess: () => {
        showToast("درخواست همکاری با موفقیت لغو شد.");
      },
      onError: (error) => {
        const msg = getApiErrorMessage(error, "لغو درخواست همکاری با خطا مواجه شد.");
        setCancelError(msg);
        showToast(msg, "خطا", "error");
      },
    });
  };

  const actionTargetId = consultant.agentId ?? consultant.id;

  return (
    <article className="bg-surface-container-lowest w-full p-4 [direction:rtl]">
      {isPending && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="bg-warning-container/30 text-warning rounded-lg px-4 py-2"
            >
              در انتظار تایید انتشار
            </Typography>
            <Button
              unstyled
              className="bg-surface-container-lowest text-on-error-container inline-flex items-center gap-2 rounded-lg px-1 !text-sm font-medium disabled:opacity-50"
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
              className="text-on-error-container m-0 mt-2 text-xs"
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
            className="text-on-surface m-0 truncate"
          >
            {consultant.name}
          </Typography>
          <div className="text-on-surface-var flex items-center gap-2">
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
                <span className="bg-outline-var h-5 w-px" />
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
        <div className="bg-surface-container mt-6 flex h-10 items-center overflow-hidden rounded-[10px]">
          <Link
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.info}/${actionTargetId}`}
          >
            <LinearInfoCircle className="text-on-surface-var h-5 w-5" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              اطلاعات
            </Typography>
          </Link>
          <span className="bg-outline-var h-6 w-px" />
          <Link
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.edit}/${actionTargetId}`}
          >
            <LinearEdit2 className="text-on-surface-var h-5 w-5" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              ویرایش
            </Typography>
          </Link>
          <span className="bg-outline-var h-6 w-px" />
          <Link
            className="flex h-full flex-1 items-center justify-center gap-1.5"
            state={{ consultant }}
            to={`${consultantTeamPaths.remove}/${actionTargetId}`}
          >
            <LinearDelete className="text-on-surface-var h-5 w-5" />
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              حذف
            </Typography>
          </Link>
        </div>
      )}
    </article>
  );
}
