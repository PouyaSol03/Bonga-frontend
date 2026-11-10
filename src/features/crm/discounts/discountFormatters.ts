export function formatPersianNumber(value: number | string): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return num.toLocaleString("fa-IR");
}

export function formatDatePersian(dateStr: string | null | undefined): string {
  if (!dateStr) return "بدون محدودیت";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}
