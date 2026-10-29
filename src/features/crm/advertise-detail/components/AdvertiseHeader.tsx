import { Link, useNavigate } from "react-router";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getCrmAdvertiseEditPath, getCrmAdvertiseEditState } from "../../crmAdvertiseNavigation";
import { advertiseStatusLabel, statusTone } from "../statusHelpers";

export function AdvertiseHeader({
  advertiseId,
  status,
}: {
  advertiseId: string;
  status: unknown;
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4">
      <Button
        unstyled
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cccccc] bg-white px-4 text-sm font-semibold text-[#1a1a1a] no-underline transition hover:border-[#0048c4] hover:text-[#0048c4]"
        onClick={() =>
          window.history.state?.idx > 0
            ? navigate(-1)
            : navigate("/crm/advertises", { replace: true })
        }
        type="button"
      >
        <LinearArrowRight1 className="h-5 w-5" />
        بازگشت به مدیریت آگهی‌ها
      </Button>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white no-underline transition hover:bg-[#003ca4]"
          state={getCrmAdvertiseEditState(advertiseId)}
          to={getCrmAdvertiseEditPath(advertiseId)}
        >
          <LinearEdit2 className="h-5 w-5" />
          ویرایش آگهی
        </Link>
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="semibold"
          className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-bold ${statusTone(status)}`}
        >
          {advertiseStatusLabel(status)}
        </Typography>
      </div>
    </div>
  );
}
