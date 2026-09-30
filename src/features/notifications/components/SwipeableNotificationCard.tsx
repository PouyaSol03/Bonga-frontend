import { useRef, useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearDelete from "../../../shared/icons/LinearDelete";
import type { NotificationItem } from "../api/notification.service";
import {
  agencyConsultantRequestType,
  notificationDeleteActionWidth,
  notificationDeleteThreshold,
  type AgencyConsultantRequestDecision,
  type AgencyConsultantRequestDisplayState,
} from "../types";
import { AgencyConsultantRequestCardContent } from "./AgencyConsultantRequestCardContent";
import { NotificationCardStandardContent } from "./NotificationCardStandardContent";

export function SwipeableNotificationCard({
  agencyRequestDecision,
  isDeleting,
  isRespondingToAgencyRequest,
  item,
  onAgencyRequestDecision,
  onDelete,
  onOpen,
  pendingAgencyRequestDecision,
}: {
  agencyRequestDecision?: AgencyConsultantRequestDisplayState;
  isDeleting: boolean;
  isRespondingToAgencyRequest: boolean;
  item: NotificationItem;
  onAgencyRequestDecision: (decision: AgencyConsultantRequestDecision) => void;
  onDelete: () => void;
  onOpen: () => void;
  pendingAgencyRequestDecision?: AgencyConsultantRequestDecision;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isSwipeRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const isUnread = item.is_read === false;
  const isAgencyConsultantRequest = item.type === agencyConsultantRequestType;
  const isInteractionLocked = isDeleting || isRespondingToAgencyRequest;

  const updateDragOffset = (nextOffset: number) => {
    const clampedOffset = Math.max(
      0,
      Math.min(nextOffset, notificationDeleteActionWidth),
    );
    dragOffsetRef.current = clampedOffset;
    setDragOffset(clampedOffset);
  };

  const resetSwipe = () => {
    updateDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
    startYRef.current = null;
    isSwipeRef.current = false;
    pointerIdRef.current = null;
  };

  const handlePointerUp = (dx: number, dy: number) => {
    setIsDragging(false);
    const finalOffset = dragOffsetRef.current;

    if (
      !isInteractionLocked &&
      isSwipeRef.current &&
      finalOffset >= notificationDeleteThreshold &&
      Math.abs(dx) > Math.abs(dy)
    ) {
      updateDragOffset(notificationDeleteActionWidth);
      window.setTimeout(onDelete, 120);
      return;
    }

    updateDragOffset(0);
  };

  return (
    <div
      className={`relative w-full max-w-full overflow-hidden border-b border-outline-var bg-error-container/30 [contain:paint] ${
        isDeleting ? "opacity-60" : ""
      }`}
      style={{ touchAction: "pan-y" }}
    >
      <Button
        unstyled
        aria-label={`حذف اعلان ${item.title || ""}`.trim()}
        className="absolute inset-y-0 left-0 z-0 flex w-[84px] flex-col items-center justify-center gap-2 bg-error-container/30 text-error disabled:cursor-not-allowed"
        disabled={isInteractionLocked}
        onClick={onDelete}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="text-xs font-semibold leading-4"
        >
          حذف
        </Typography>
      </Button>

      <article
        className={`relative z-10 flex w-full max-w-full touch-pan-y select-none flex-col overflow-hidden px-4 py-4 text-right will-change-transform ${
          isAgencyConsultantRequest
            ? "h-[120px] gap-y-2 bg-surface-container-lowest"
            : `h-full gap-y-4 ${
                isUnread ? "bg-surface-container-low" : "bg-surface-container-lowest"
              }`
        } ${isDragging ? "" : "transition-transform duration-200 ease-out"}`}
        style={{ transform: `translateX(${dragOffset}px)` }}
        onPointerDown={(event) => {
          if (isInteractionLocked) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;

          startXRef.current = event.clientX;
          startYRef.current = event.clientY;
          pointerIdRef.current = event.pointerId;
          isSwipeRef.current = false;
        }}
        onPointerMove={(event) => {
          if (isInteractionLocked) return;
          const startX = startXRef.current;
          const startY = startYRef.current;
          if (startX === null || startY === null) return;

          const dx = event.clientX - startX;
          const dy = event.clientY - startY;

          if (!isSwipeRef.current) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dy) > Math.abs(dx) || dx <= 0) {
              resetSwipe();
              return;
            }
            isSwipeRef.current = true;
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }

          event.preventDefault();
          updateDragOffset(dx);
        }}
        onPointerUp={(event) => {
          const startX = startXRef.current;
          const startY = startYRef.current;
          startXRef.current = null;
          startYRef.current = null;
          pointerIdRef.current = null;

          if (startX === null || startY === null) {
            setIsDragging(false);
            return;
          }

          handlePointerUp(event.clientX - startX, event.clientY - startY);
          isSwipeRef.current = false;
        }}
        onPointerCancel={(event) => {
          if (
            pointerIdRef.current !== null &&
            event.currentTarget.hasPointerCapture(pointerIdRef.current)
          ) {
            event.currentTarget.releasePointerCapture(pointerIdRef.current);
          }
          resetSwipe();
        }}
      >
        {isAgencyConsultantRequest ? (
          <AgencyConsultantRequestCardContent
            decision={agencyRequestDecision}
            isResponding={isRespondingToAgencyRequest}
            item={item}
            onDecision={onAgencyRequestDecision}
            pendingDecision={pendingAgencyRequestDecision}
          />
        ) : (
          <NotificationCardStandardContent item={item} onOpen={onOpen} />
        )}
      </article>
    </div>
  );
}
