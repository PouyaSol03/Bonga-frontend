export function getStatusBadgeClassName(status: string) {
  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ");
  if (
    !normalizedStatus.includes("پرداخت") &&
    !normalizedStatus.includes("payment") &&
    (normalizedStatus.includes("رد") ||
      normalizedStatus.includes("حذف") ||
      normalizedStatus.includes("انقضا") ||
      normalizedStatus.includes("منقض") ||
      normalizedStatus.includes("غیر فعال") ||
      normalizedStatus.includes("غیرفعال") ||
      normalizedStatus.includes("reject") ||
      normalizedStatus.includes("delete") ||
      normalizedStatus.includes("expire") ||
      normalizedStatus === "-1" ||
      normalizedStatus === "-2" ||
      normalizedStatus === "-3")
  ) {
    return "bg-error-container text-error";
  }
  if (
    normalizedStatus.includes("پرداخت") ||
    normalizedStatus.includes("payment") ||
    normalizedStatus.includes("نیمه") ||
    normalizedStatus.includes("incomplete") ||
    normalizedStatus.includes("انتظار") ||
    normalizedStatus.includes("بررسی") ||
    normalizedStatus.includes("ویرایش") ||
    normalizedStatus.includes("اصلاح") ||
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("wait") ||
    normalizedStatus === "0" ||
    normalizedStatus === "1" ||
    normalizedStatus === "2"
  ) {
    return "bg-warning-container text-on-warning-container";
  }
  if (
    normalizedStatus.includes("منتشر") ||
    normalizedStatus.includes("فعال") ||
    normalizedStatus.includes("تایید") ||
    normalizedStatus.includes("publish") ||
    normalizedStatus.includes("approved") ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "3"
  ) {
    return "bg-tertiary-container text-tertiary";
  }

  return "bg-surface-container-high text-on-surface";
}
