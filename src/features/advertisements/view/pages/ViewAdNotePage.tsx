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
    <div className="absolute inset-0 z-40 flex flex-col bg-surface-container-lowest text-on-surface [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="یادداشت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest px-4 pb-4 pt-8">
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-right text-sm font-normal leading-5 text-on-surface">
          یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.
        </Typography>
        <textarea
          aria-label="یادداشت شما"
          autoFocus
          className="mt-6 h-60 w-full resize-none rounded-xl border border-outline-var bg-surface-container-lowest px-3 py-4 text-right text-sm font-normal leading-5 text-on-surface outline-none placeholder:text-outline focus:border-primary"
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="یادداشت شما"
          value={noteText}
        />
      </main>

      <div className="shrink-0 bg-surface-container-lowest px-4 py-3.5 shadow-[0_-4px_4px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Button unstyled
            className="h-10 rounded-[10px] bg-primary px-4 text-sm font-medium leading-5 text-on-primary disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
            disabled={isSaving || noteText.trim().length === 0}
            onClick={onSave}
            type="button"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره"}
          </Button>
          <Button unstyled
            className="h-10 rounded-[10px] border border-primary bg-surface-container-lowest px-4 text-sm font-medium leading-5 text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
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
