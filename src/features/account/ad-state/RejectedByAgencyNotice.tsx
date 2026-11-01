import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { AlertIcon } from "./StateIcons";

export function RejectedByAgencyNotice({
  ad,
  onRepost,
}: {
  ad?: Record<string, unknown>;
  onRepost: () => void;
}) {
  const reason =
    (ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).reason
      : undefined) ??
    ad?.reject_reason ??
    ad?.rejection_reason ??
    "عدم توافق در شرایط انتشار";

  return (
    <div className="border-error bg-error-container/30 mt-4 rounded-2xl border p-4 text-right">
      <div className="text-error flex items-center gap-2">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          رد درخواست توسط آژانس
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        آژانس انتخابی درخواست واگذاری این آگهی را با دلیل زیر رد کرده است:
      </Typography>

      <div className="bg-surface text-on-surface border-outline-var mt-2 rounded-lg border p-2.5 text-xs font-medium">
        علت رد: {String(reason)}
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        می‌توانید آگهی را به آژانس دیگری واگذار نمایید یا مستقیماً به عنوان آگهی شخصی منتشر کنید.
      </Typography>

      <Button
        unstyled
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium active:opacity-90"
        onClick={onRepost}
        type="button"
      >
        انتخاب مجدد روش انتشار
      </Button>
    </div>
  );
}
