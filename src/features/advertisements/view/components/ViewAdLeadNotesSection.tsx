import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import LinearNoteAdd from "../../../../shared/icons/LinearNoteAdd";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

interface ViewAdLeadNotesSectionProps {
  note: string;
  onChange: (note: string) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export function ViewAdLeadNotesSection({
  note,
  onChange,
  onSubmit,
  isSubmitting = false,
}: ViewAdLeadNotesSectionProps) {
  const canSubmit = note.trim().length > 0 && !isSubmitting;

  return (
    <section className="bg-surface-container-lowest flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinearNoteAdd className="text-on-surface-var h-6 w-6" />
          <Typography
            as="h3"
            variant="label"
            size="large"
            weight="medium"
            className="text-on-surface"
          >
            یادداشت
          </Typography>
        </div>
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline text-xs"
        >
          {toPersianNumber(note.length)} / ۳۰۰۰
        </Typography>
      </div>

      <textarea
        value={note}
        maxLength={2000}
        onChange={(e) => onChange(e.target.value.slice(0, 2000))}
        placeholder="یادداشت خود درباره این سرنخ را وارد کنید..."
        rows={3}
        className="border-surface-container bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary min-h-[90px] w-full resize-none rounded-xl border p-3 text-sm focus:outline-none"
      />

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          size="medium"
          radius="medium"
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت یادداشت"}
        </Button>
      </div>
    </section>
  );
}
