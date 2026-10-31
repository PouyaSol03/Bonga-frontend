import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import LinearCancelCircle from "../../../../../shared/icons/LinearCancelCircle";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { dailyHotelRoomTypes } from "../../data";
import type {
  DailyHotelRoomConfig,
  DailyHotelRoomTypeId,
  NewAdFormValues,
} from "../../types";
import { DailyHotelRoomEditor } from "./DailyHotelRoomEditor";
import {
  buildRoomSummary,
  getEmptyRoomConfig,
  hasConfiguredRoom,
  normalizeRoomConfig,
} from "./dailyHotelRoomsUtils";

function EditIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function DailyHotelRoomsSection() {
  const { setValue, control } = useFormContext<NewAdFormValues>();
  const watchedRooms = useWatch({ control, name: "dailyHotelRooms" }) ?? [];
  const [editingRoomId, setEditingRoomId] = useState<DailyHotelRoomTypeId | null>(null);
  const [draftRoom, setDraftRoom] = useState<DailyHotelRoomConfig | null>(null);

  const rooms = useMemo(
    () =>
      dailyHotelRoomTypes.map((roomType) => {
        const current = watchedRooms.find((item) => item.id === roomType.id);
        return current ? normalizeRoomConfig(current) : getEmptyRoomConfig(roomType.id);
      }),
    [watchedRooms],
  );

  const openEditor = (roomId: DailyHotelRoomTypeId) => {
    const current = rooms.find((item) => item.id === roomId) ?? getEmptyRoomConfig(roomId);
    setDraftRoom({ ...current });
    setEditingRoomId(roomId);
  };

  const closeEditor = () => {
    setEditingRoomId(null);
    setDraftRoom(null);
  };

  const saveRoom = () => {
    if (!draftRoom) return;

    const nextRooms = rooms.map((room) =>
      room.id === draftRoom.id ? normalizeRoomConfig(draftRoom) : room,
    );
    setValue("dailyHotelRooms", nextRooms, {
      shouldDirty: true,
      shouldValidate: true,
    });
    closeEditor();
  };

  const resetRoom = (roomId: DailyHotelRoomTypeId) => {
    const nextRooms = rooms.map((room) => (room.id === roomId ? getEmptyRoomConfig(roomId) : room));
    setValue("dailyHotelRooms", nextRooms, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <div className="space-y-1 pt-1">
        {rooms.map((room) => {
          const configured = hasConfiguredRoom(room);
          const summary = buildRoomSummary(room);

          return (
            <div className="border-outline-var border-b py-4 last:border-b-0 last:pb-0" key={room.id}>
              <div className="flex items-center justify-between gap-3">
                <Button
                  unstyled
                  className="text-on-surface min-w-0 flex-1 text-right text-base leading-7 font-semibold"
                  onClick={() => openEditor(room.id)}
                  type="button"
                >
                  {room.label}
                </Button>

                <Button
                  unstyled
                  aria-label={room.label}
                  className="text-on-surface-var active:bg-surface-container-high grid h-9 w-9 shrink-0 place-items-center rounded-full"
                  onClick={() => openEditor(room.id)}
                  type="button"
                >
                  {configured ? <EditIcon /> : <ChevronLeftIcon />}
                </Button>
              </div>

              {configured ? (
                <div className="mt-4 flex items-start gap-3">
                  <Button
                    unstyled
                    aria-label={`حذف اطلاعات ${room.label}`}
                    className="text-on-surface-var mt-1 grid h-6 w-6 shrink-0 place-items-center"
                    onClick={() => resetRoom(room.id)}
                    type="button"
                  >
                    <LinearCancelCircle aria-hidden="true" className="h-6 w-6" />
                  </Button>

                  <div className="flex flex-wrap justify-start gap-2" dir="rtl">
                    {summary.map((item) => (
                      <Typography
                        as="span"
                        variant="label"
                        size="medium"
                        weight="medium"
                        className="border-outline-var bg-surface-container-lowest text-on-surface-var flex min-h-9 items-center rounded-[7px] border px-3 py-1 text-sm leading-5 font-medium"
                        key={item}
                      >
                        {item}
                      </Typography>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {editingRoomId && draftRoom ? (
        <DailyHotelRoomEditor
          draftRoom={draftRoom}
          onClose={closeEditor}
          onSave={saveRoom}
          setDraftRoom={setDraftRoom}
        />
      ) : null}
    </>
  );
}
