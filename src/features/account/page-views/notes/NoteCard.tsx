import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { NoteItem } from "../../api/account.service";
import { mapAdvertisementToAdCard } from "../../../advertisements/api/advertisement.service";
import { truncateAdCardText } from "../../../advertisements/components/AdCard";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearDelete from "../../../../shared/icons/LinearDelete";
import LinearEdit from "../../../../shared/icons/LinearEdit";
import {
  getNoteAdvertiseId,
  getNoteAdvertiseSource,
  getNoteId,
  readNoteDate,
  readNoteText,
} from "./noteHelpers";

export function NoteCard({
  disabled,
  note,
  onDelete,
  onEdit,
}: {
  disabled: boolean;
  note: NoteItem;
  onDelete: (noteId: string) => void;
  onEdit: (note: NoteItem) => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartOffset = useRef(0);
  const navigate = useNavigate();
  const didDrag = useRef(false);
  const noteId = getNoteId(note);
  const advertiseId = getNoteAdvertiseId(note);
  const mappedAd = mapAdvertisementToAdCard(getNoteAdvertiseSource(note), 0);
  const noteText = truncateAdCardText(readNoteText(note) || "یادداشت");
  const adTitle = truncateAdCardText(mappedAd.title);
  const dateText = truncateAdCardText(mappedAd.timeAndLocation || readNoteDate(note, ""));
  const maxDragOffset = 59;

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStartX.current === null || disabled || !noteId) return;

    const deltaX = event.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 6) didDrag.current = true;
    setDragOffset(Math.min(maxDragOffset, Math.max(0, dragStartOffset.current + deltaX)));
  };

  const handlePointerEnd = () => {
    const shouldDelete = dragOffset >= maxDragOffset / 2;

    setDragOffset(0);
    dragStartX.current = null;
    dragStartOffset.current = 0;

    if (shouldDelete && noteId && !disabled) {
      onDelete(noteId);
    }
  };

  return (
    <article className="border-outline-var bg-surface-container-lowest relative h-[137px] overflow-hidden border-b text-right [direction:rtl]">
      <Button
        unstyled
        data-note-action
        aria-label="حذف یادداشت"
        className="bg-error-container text-error absolute top-0 left-0 flex h-[136px] w-[59px] flex-col items-center justify-center gap-2 disabled:opacity-50"
        disabled={disabled || !noteId}
        onClick={() => noteId && onDelete(noteId)}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography as="span" variant="label" size="medium" weight="medium" className="text-error">
          حذف
        </Typography>
      </Button>

      <div
        className="bg-surface-container-lowest relative z-10 h-[136px] touch-pan-y px-4 py-4 transition-transform duration-150 ease-out"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button, a, [data-note-action]")) return;

          if (didDrag.current) {
            didDrag.current = false;
            return;
          }

          if (!advertiseId) return;

          navigate(`/ads/${encodeURIComponent(advertiseId)}`);
        }}
        onKeyDown={(event) => {
          if (!advertiseId || event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;

          event.preventDefault();
          navigate(`/ads/${encodeURIComponent(advertiseId)}`);
        }}
        onPointerCancel={handlePointerEnd}
        onPointerDown={(event) => {
          didDrag.current = false;
          dragStartX.current = event.clientX;
          dragStartOffset.current = dragOffset;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        role={advertiseId ? "link" : undefined}
        style={{ transform: `translateX(${dragOffset}px)` }}
        tabIndex={advertiseId ? 0 : undefined}
      >
        <div className="flex items-center justify-end gap-4 py-2 [direction:ltr]">
          <Button
            unstyled
            data-note-action
            aria-label="ویرایش یادداشت"
            className="text-on-surface-var grid h-6 w-6 shrink-0 place-items-center disabled:opacity-50"
            disabled={!noteId || disabled}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(note);
            }}
            type="button"
          >
            <LinearEdit className="h-5 w-5" />
          </Button>
          <Typography
            as="h2"
            variant="body"
            size="large"
            weight="regular"
            className="text-on-surface m-0 min-w-0 text-right [direction:rtl]"
          >
            {noteText}
          </Typography>
        </div>

        <div className="mt-2 flex min-w-0 items-center gap-x-2 py-2 [direction:rtl]">
          <Link
            aria-label={`مشاهده آگهی ${mappedAd.title}`}
            className={`bg-surface-container relative h-10 w-[60px] shrink-0 overflow-hidden rounded-lg bg-cover bg-center ${mappedAd.imageClassName}`}
            style={mappedAd.imageUrl ? { backgroundImage: `url(${mappedAd.imageUrl})` } : undefined}
            to={advertiseId ? `/ads/${advertiseId}` : "/search"}
          />

          <div className="min-w-0 flex-1 text-right">
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="medium"
              className="text-on-surface m-0"
            >
              {adTitle}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline m-0 mt-2"
            >
              {dateText}
            </Typography>
          </div>
        </div>
      </div>
    </article>
  );
}
