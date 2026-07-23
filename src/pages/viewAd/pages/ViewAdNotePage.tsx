import { ViewAdActionPageTopBar } from "./ViewAdActionPageLayout";

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
    <div className="absolute inset-0 z-40 flex flex-col bg-white text-[#1a1a1a] [direction:rtl]">
      <ViewAdActionPageTopBar onBack={onClose} title="یادداشت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 pb-4 pt-8">
        <p className="m-0 text-right text-sm font-normal leading-5 text-[#1a1a1a]">
          یادداشت تنها برای شما قابل دیدن است و پس از حذف آگهی، پاک خواهد شد.
        </p>
        <textarea
          aria-label="یادداشت شما"
          autoFocus
          className="mt-6 h-60 w-full resize-none rounded-xl border border-[#d9d9d9] bg-white px-3 py-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4]"
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="یادداشت شما"
          value={noteText}
        />
      </main>

      <div className="shrink-0 bg-white px-4 py-3.5 shadow-[0_-4px_4px_rgba(26,26,26,0.08)]">
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            disabled={isSaving || noteText.trim().length === 0}
            onClick={onSave}
            type="button"
          >
            {isSaving ? "در حال ذخیره..." : "ذخیره"}
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            onClick={onClose}
            type="button"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
