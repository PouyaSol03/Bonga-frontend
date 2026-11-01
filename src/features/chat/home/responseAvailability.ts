import { type ChatAvailability, type ChatDayOfWeek } from "../api/chat.service";

export type ResponseTimeSheet = "days" | "start" | "end" | null;

export type ResponseWeekDay = {
  label: string;
  value: ChatDayOfWeek;
};

export const responseWeekDays: ResponseWeekDay[] = [
  { label: "شنبه", value: "saturday" },
  { label: "یکشنبه", value: "sunday" },
  { label: "دوشنبه", value: "monday" },
  { label: "سه‌شنبه", value: "tuesday" },
  { label: "چهارشنبه", value: "wednesday" },
  { label: "پنجشنبه", value: "thursday" },
  { label: "جمعه", value: "friday" },
];

export const responseHourOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

export const persianNumber = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

export const persianTwoDigitNumber = new Intl.NumberFormat("fa-IR", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

export function formatResponseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  return `${persianTwoDigitNumber.format(hours)}:${persianTwoDigitNumber.format(minutes)}`;
}

export function getResponseDayLabel(day: ChatDayOfWeek) {
  return responseWeekDays.find((item) => item.value === day)?.label ?? day;
}

export function sortResponseDays(days: ChatDayOfWeek[]) {
  const selectedDays = new Set(days);

  return responseWeekDays.map((item) => item.value).filter((day) => selectedDays.has(day));
}

export function areResponseDaysEqual(first: ChatDayOfWeek[], second: ChatDayOfWeek[]) {
  const normalizedFirst = sortResponseDays(first);
  const normalizedSecond = sortResponseDays(second);

  return (
    normalizedFirst.length === normalizedSecond.length &&
    normalizedFirst.every((day, index) => day === normalizedSecond[index])
  );
}

export function formatParticipantAvailabilityDays(availability: ChatAvailability) {
  const availableDays = sortResponseDays(availability.days.map((day) => day.day_of_week));

  if (availableDays.length === 0) return "";
  if (availableDays.length === responseWeekDays.length) return "همه‌روزه";

  const dayIndexes = availableDays.map((day) =>
    responseWeekDays.findIndex((item) => item.value === day),
  );
  const isContinuousRange = dayIndexes.every(
    (dayIndex, index) => index === 0 || dayIndex === dayIndexes[index - 1] + 1,
  );

  if (isContinuousRange && availableDays.length > 1) {
    const firstDay = availableDays[0];
    const lastDay = availableDays.at(-1) ?? firstDay;

    return `${getResponseDayLabel(firstDay)} تا ${getResponseDayLabel(lastDay)}`;
  }

  const labels = availableDays.map(getResponseDayLabel);

  if (labels.length === 1) return labels[0];

  return `${labels.slice(0, -1).join("، ")} و ${labels.at(-1)}`;
}

export function formatParticipantAvailabilityTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return formatResponseTime(value);
  }

  const twelveHourValue = hours % 12 || 12;
  const minuteText = minutes ? `:${persianTwoDigitNumber.format(minutes)}` : "";
  const dayPeriod =
    hours < 6 ? "بامداد" : hours < 12 ? "صبح" : hours === 12 ? "ظهر" : hours < 20 ? "عصر" : "شب";

  return `${persianNumber.format(twelveHourValue)}${minuteText} ${dayPeriod}`;
}
