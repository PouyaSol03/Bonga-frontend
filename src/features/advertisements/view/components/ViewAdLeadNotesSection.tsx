import { Typography } from "../../../../shared/ui/Typography";
import LinearNoteAdd from "../../../../shared/icons/LinearNoteAdd";

export interface ViewAdLeadNotesSectionProps {
  note: string;
  onChange: (note: string) => void;
}

export function ViewAdLeadNotesSection({
  note,
  onChange,
}: ViewAdLeadNotesSectionProps) {
  return (
    <section className="bg-surface-container-lowest p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <LinearNoteAdd className="h-6 w-6 text-on-surface-var" />
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

      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اطلاعات بیشتر را وارد کنید..."
        rows={3}
        className="w-full rounded-xl border border-surface-container px-3 py-4.5 bg-surface-container-lowest text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none min-h-[90px] resize-none"
      />
    </section>
  );
}
