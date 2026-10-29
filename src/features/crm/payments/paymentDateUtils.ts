import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";

export function optionalNumber(value: string): number | undefined {
  if (value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function jalaliDateToTimestamp(value: string): number {
  return new DateObject({ date: value, format: "YYYY/MM/DD", calendar: persian })
    .convert(gregorian)
    .toDate()
    .getTime();
}

export function jalaliDateToIso(value: string, endOfDay: boolean): string {
  const date = new DateObject({ date: value, format: "YYYY/MM/DD", calendar: persian })
    .convert(gregorian)
    .toDate();
  date.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  return date.toISOString();
}

export function formatPaymentDate(value: string): string {
  if (value === "-") return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
