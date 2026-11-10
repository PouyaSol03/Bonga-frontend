import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useTransientNotice } from "../../../shared/hooks/useTransientNotice";
import { useChatAvailabilityQuery, useUpdateChatAvailabilityMutation } from "../api/chat.hooks";
import { type ChatDayOfWeek } from "../api/chat.service";
import { areResponseDaysEqual, sortResponseDays } from "./responseAvailability";

export function useResponseAvailability() {
  const availabilityQuery = useChatAvailabilityQuery();
  const updateAvailabilityMutation = useUpdateChatAvailabilityMutation();
  const [selectedDays, setSelectedDays] = useState<ChatDayOfWeek[]>([]);
  const [startHour, setStartHour] = useState<string | undefined>();
  const [endHour, setEndHour] = useState<string | undefined>();
  const { showNotice } = useTransientNotice();

  useEffect(() => {
    if (!availabilityQuery.data) return;

    const availableDays = sortResponseDays(
      availabilityQuery.data.days.map((day) => day.day_of_week),
    );

    setSelectedDays(availableDays);
    setStartHour(
      availableDays.length ? (availabilityQuery.data.start_time ?? undefined) : undefined,
    );
    setEndHour(availableDays.length ? (availabilityQuery.data.end_time ?? undefined) : undefined);
  }, [availabilityQuery.data]);

  const toggleDay = (day: ChatDayOfWeek) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : sortResponseDays([...current, day]),
    );
  };

  const saveAvailability = async () => {
    const currentAvailability = availabilityQuery.data ?? {
      days: [],
      end_time: null,
      start_time: null,
    };
    const currentDays = currentAvailability.days.map((day) => day.day_of_week);

    if (selectedDays.length > 0 && (!startHour || !endHour)) {
      showNotice("ساعت شروع و پایان را انتخاب کنید");
      return;
    }

    if (selectedDays.length > 0 && startHour && endHour && startHour >= endHour) {
      showNotice("ساعت پایان باید بعد از ساعت شروع باشد");
      return;
    }

    const payload: {
      days?: ChatDayOfWeek[];
      end_time?: string;
      start_time?: string;
    } = {};

    if (selectedDays.length === 0) {
      payload.days = [];
    } else {
      if (!areResponseDaysEqual(selectedDays, currentDays)) {
        payload.days = sortResponseDays(selectedDays);
      }
      if (startHour !== currentAvailability.start_time) {
        payload.start_time = startHour;
      }
      if (endHour !== currentAvailability.end_time) {
        payload.end_time = endHour;
      }
    }

    if (Object.keys(payload).length === 0) {
      showNotice("تغییری برای ثبت وجود ندارد");
      return;
    }

    try {
      await updateAvailabilityMutation.mutateAsync(payload);
      showNotice(selectedDays.length === 0 ? "ساعت پاسخگویی پاک شد" : "ساعت پاسخگویی ثبت شد");
    } catch (error) {
      showNotice(getApiErrorMessage(error, "ثبت ساعت پاسخگویی با خطا مواجه شد"));
    }
  };

  const isBusy = availabilityQuery.isLoading || updateAvailabilityMutation.isPending;

  return {
    availabilityQuery,
    updateAvailabilityMutation,
    selectedDays,
    startHour,
    endHour,
    setStartHour,
    setEndHour,
    toggleDay,
    saveAvailability,
    isBusy,
  };
}
