import { ViewAdActionPageTopBar } from "./ViewAdActionPageLayout";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function ViewAdNotePage({
  isSaving,
  noteText,
  onChangeNote,
  onClose,
  onSave,
}: {
  isSaving: boolean;
  noteText: string;
  onChangeNote: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-surface-container-lowest text-on-surface absolute inset-0 z-40 flex flex-col [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="یادداشت" />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pt-8 pb-4">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface m-0 text-right text-sm leading-5 font-normal"
        >
          یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.
        </Typography>
        <textarea
          aria-label="یادداشت شما"
          autoFocus
          className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary mt-6 h-60 w-full resize-none rounded-xl border px-3 py-4 text-right text-sm leading-5 font-normal outline-none"
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="یادداشت شما"
          value={noteText}
        />
      </main>

      <div className="bg-surface-container-lowest shrink-0 px-4 py-3.5 shadow-[0_-4px_4px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            unstyled
            className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 rounded-[10px] px-4 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 disabled:opacity-50"
            disabled={isSaving || noteText.trim().length === 0}
            onClick={onSave}
            type="button"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 h-10 rounded-[10px] border px-4 text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2"
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </div>
    </div>
  );
}
