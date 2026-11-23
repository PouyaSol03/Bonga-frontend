import { Link, useNavigate } from "react-router";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearCheckmark from "../../../../shared/icons/LinearCheckmark";
import LinearCancel from "../../../../shared/icons/LinearCancel";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getCrmAdvertiseEditPath, getCrmAdvertiseEditState } from "../../crmAdvertiseNavigation";
import { advertiseStatusLabel, statusTone } from "../statusHelpers";

export function AdvertiseHeader({
  advertiseId,
  isUpdatingStatus = false,
  onAccept,
  onDelete,
  onReject,
  status,
}: {
  advertiseId: string;
  isUpdatingStatus?: boolean;
  onAccept?: () => void;
  onDelete?: () => void;
  onReject?: () => void;
  status: unknown;
}) {
  const navigate = useNavigate();
  const normalizedStatus = String(status ?? "").toLowerCase();
  const isAccepted = normalizedStatus === "accepted" || normalizedStatus === "3";

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3.5 rounded-2xl border border-[#f0f0f0] bg-white px-5 py-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          unstyled
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm font-semibold text-[#1a1a1a] transition hover:border-[#0048c4] hover:text-[#0048c4]"
          onClick={() =>
            window.history.state?.idx > 0
              ? navigate(-1)
              : navigate("/crm/advertises", { replace: true })
          }
          type="button"
        >
          <LinearArrowRight1 className="h-4 w-4" />
          بازگشت به فهرست
        </Button>

        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="semibold"
          className={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-bold ${statusTone(status)}`}
        >
          {advertiseStatusLabel(status)}
        </Typography>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onAccept && !isAccepted ? (
          <Button
            unstyled
            disabled={isUpdatingStatus}
            onClick={onAccept}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            type="button"
          >
            <LinearCheckmark className="h-4 w-4" />
            تأیید و انتشار
          </Button>
        ) : null}

        {onReject && normalizedStatus !== "rejected" ? (
          <Button
            unstyled
            disabled={isUpdatingStatus}
            onClick={onReject}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
            type="button"
          >
            <LinearCancel className="h-4 w-4" />
            رد آگهی
          </Button>
        ) : null}

        {onDelete && normalizedStatus !== "deleted" ? (
          <Button
            unstyled
            disabled={isUpdatingStatus}
            onClick={onDelete}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
            type="button"
          >
            <LinearDelete className="h-4 w-4" />
            حذف
          </Button>
        ) : null}

        <Link
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0048c4] px-4 text-xs font-bold text-white no-underline transition hover:bg-[#003ca4]"
          state={getCrmAdvertiseEditState(advertiseId)}
          to={getCrmAdvertiseEditPath(advertiseId)}
        >
          <LinearEdit2 className="h-4 w-4" />
          ویرایش آگهی
        </Link>
      </div>
    </div>
  );
}
