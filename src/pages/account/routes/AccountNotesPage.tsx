import { useState, useEffect } from "react";
import type { NoteItem } from "../../../core/services/account.service";
import { useMyNotesQuery, useDeleteAdvertiseNoteMutation, useSaveAdvertiseNoteMutation } from "../../../core/hooks/account.hooks";
import { getApiErrorMessage } from "../../../core/api/api";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import { AccountNotesSkeleton, AccountPageShell, AccountRetryState, EmptyAccountState, NoteCard, getNoteAdvertiseId, getNoteId, readNoteText } from "../accountPageViews";
import type { AccountToast } from "../accountPageViews";
import { Typography } from "../../../shared/ui/Typography";

export function AccountNotesPage() {
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [toast, setToast] = useState<AccountToast | null>(null);
  const { data: notes = [], error, isError, isLoading, refetch } = useMyNotesQuery();
  const deleteNote = useDeleteAdvertiseNoteMutation();
  const saveNote = useSaveAdvertiseNoteMutation();

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "انجام شد",
    variant: "error" | "success" | "info" | "warning" = "success",
  ) => setToast({ message, title, variant });

  const openEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setNoteDraft(readNoteText(note));
  };

  const deleteSingleNote = (noteId: string) => {
    if (!noteId || deleteNote.isPending) return;

    deleteNote.mutate(noteId, {
      onError: (deleteError) => {
        showToast(getApiErrorMessage(deleteError, "حذف یادداشت با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        showToast("یادداشت حذف شد");
      },
    });
  };

  const deleteAllNotes = () => {
    deleteNote.mutate("all", {
      onError: (deleteError) => {
        showToast(getApiErrorMessage(deleteError, "حذف یادداشت‌ها با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        setIsConfirmDeleteAllOpen(false);
        showToast("همه یادداشت‌ها حذف شدند");
      },
    });
  };

  const updateEditingNote = () => {
    const advertiseId = editingNote ? getNoteAdvertiseId(editingNote) : "";
    const cleanNote = noteDraft.trim();

    if (!advertiseId || !cleanNote || saveNote.isPending) return;

    saveNote.mutate(
      { advertiseId, note: cleanNote },
      {
        onError: (saveError) => {
          showToast(getApiErrorMessage(saveError, "ذخیره یادداشت با خطا مواجه شد."), "خطا", "error");
        },
        onSuccess: () => {
          setEditingNote(null);
          setNoteDraft("");
          showToast("یادداشت شما ثبت شد");
        },
      },
    );
  };

  return (
    <AccountPageShell
      action={
        <Button unstyled
          aria-label="حذف همه یادداشت‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={notes.length === 0 || deleteNote.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </Button>
      }
      title="یادداشت ها"
    >

      <main className={`flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden ${!isLoading && !isError && notes.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && notes.length === 0 ? "flex min-h-0 flex-1 flex-col bg-white" : "space-y-0 bg-white"}`}>
          {isLoading ? <AccountNotesSkeleton count={6} /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت یادداشت‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && notes.map((note, index) => (
            <NoteCard
              disabled={deleteNote.isPending}
              key={getNoteId(note) || index}
              note={note}
              onDelete={deleteSingleNote}
              onEdit={openEditNote}
            />
          ))}
          {!isLoading && !isError && notes.length === 0 ? (
            <EmptyAccountState
              description="با ثبت یادداشت برای آگهی‌ها، آن‌ها در این بخش نمایش داده خواهند شد."
              iconSrc="/vectors/NoNotes.svg"
              title="هیچ یادداشتی برای نمایش وجود ندارد!"
            />
          ) : null}
        </div>
      </main>

      <BottomSheet
        ariaLabel="حذف همه یادداشت‌ها"
        contentClassName="px-4 pt-4 pb-9"
        heightClassName=""
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
        variant="confirm"
      >
        <Typography as="p" variant="label" size="large" weight="medium" className="m-0 text-center text-[#1a1a1a]">
          آیا از حذف همه یادداشت‌ها مطمئن هستید؟
        </Typography>
        <div className="mt-9 grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            className="h-10"
            disabled={deleteNote.isPending}
            onClick={deleteAllNotes}
            size="sm"
            variant="secondary"
          >
            <Typography variant="label" size="medium" weight="medium">
              بله
            </Typography>
          </Button>
          <Button
            className="h-10"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            size="sm"
            variant="secondary"
          >
            <Typography variant="label" size="medium" weight="medium">
              خیر
            </Typography>
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet
        ariaLabel="ویرایش یادداشت"
        contentClassName="px-4 pt-4"
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title="ویرایش یادداشت"
        variant="form"
      >
        <textarea
          aria-label="متن یادداشت"
          className="h-40 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-4 py-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:border-[#0048c4] focus:shadow-[0_0_0_3px_rgba(0,72,196,0.12)]"
          onChange={(event) => setNoteDraft(event.target.value)}
          placeholder="یادداشت شما"
          value={noteDraft}
        />
        <div className="mt-5 grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            className="h-10"
            disabled={!noteDraft.trim() || !editingNote || !getNoteAdvertiseId(editingNote) || saveNote.isPending}
            loading={saveNote.isPending}
            onClick={updateEditingNote}
            size="sm"
          >
            ذخیره
          </Button>
          <Button
            className="h-10"
            onClick={() => setEditingNote(null)}
            size="sm"
            variant="secondary"
          >
            انصراف
          </Button>
        </div>
      </BottomSheet>
    </AccountPageShell>
  );
}
