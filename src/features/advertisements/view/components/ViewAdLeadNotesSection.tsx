import { Typography } from "../../../../shared/ui/Typography";
import LinearNoteAdd from "../../../../shared/icons/LinearNoteAdd";

interface ViewAdLeadNotesSectionProps {
  note: string;
  onChange: (note: string) => void;
}

export function ViewAdLeadNotesSection({ note, onChange }: ViewAdLeadNotesSectionProps) {
  return (
    <section className="bg-surface-container-lowest flex flex-col gap-3 p-4">
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

      <textarea
        value={note}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اطلاعات بیشتر را وارد کنید..."
        rows={3}
        className="border-surface-container bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary min-h-[90px] w-full resize-none rounded-xl border px-3 py-4.5 text-sm focus:outline-none"
      />
    </section>
  );
}
