export function advertiseStatusLabel(status: unknown): string {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  return (
    {
      wait_for_payment: "در انتظار پرداخت",
      wait_for_admin: "در انتظار بررسی",
      wait_for_agency: "در انتظار آژانس",
      accepted: "منتشرشده",
      needs_edit: "نیازمند ویرایش",
      rejected: "ردشده",
      deleted: "حذف‌شده",
      expired: "منقضی‌شده",
      wait_for_repost: "در انتظار بازنشر",
      archived: "بایگانی‌شده",
      wait_for_stop: "در انتظار تایید توقف",
      wait_for_deal_confirmation: "در انتظار تایید معامله",
      rejected_by_agency: "رد توسط آژانس",
      "-11": "رد توسط آژانس",
      "-10": "در انتظار تایید معامله",
      "-9": "در انتظار تایید توقف",
      "-8": "بایگانی‌شده",
      "-7": "در انتظار بازنشر",
      "-4": "نیازمند ویرایش",
      "-3": "منقضی‌شده",
      "-2": "حذف‌شده",
      "-1": "ردشده",
      "0": "در انتظار پرداخت",
      "1": "در انتظار بررسی",
      "2": "در انتظار آژانس",
      "3": "منتشرشده",
    }[value] ?? "نامشخص"
  );
}

export function statusTone(status: unknown): string {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();
  if (value === "accepted" || value === "3") return "bg-[#eaf8f1] text-[#087d4b]";
  if (value === "wait_for_payment" || value === "0") return "bg-[#fff3e8] text-[#ff6d00]";
  if (
    [
      "needs_edit",
      "rejected",
      "deleted",
      "expired",
      "rejected_by_agency",
      "-4",
      "-1",
      "-2",
      "-3",
      "-11",
    ].includes(value)
  ) {
    return "bg-[#fff0f1] text-[#c63242]";
  }
  if (["archived", "-8"].includes(value)) {
    return "bg-[#f1f5f9] text-[#64748b]";
  }
  return "bg-[#fff7df] text-[#9b6800]";
}

export function getActorTypeLabel(actorType: unknown): string {
  const type = String(actorType ?? "")
    .trim()
    .toLowerCase();
  switch (type) {
    case "user":
      return "کاربر";
    case "agency":
      return "آژانس";
    case "consultant":
      return "مشاور";
    case "admin":
      return "مدیر سیستم";
    case "system":
      return "سیستم خودکار";
    default:
      return type || "سیستم";
  }
}

export function getActorTypeBadgeClass(actorType: unknown): string {
  const type = String(actorType ?? "")
    .trim()
    .toLowerCase();
  switch (type) {
    case "user":
      return "bg-[#eef4ff] text-[#0048c4] border-[#d0e1fd]";
    case "agency":
      return "bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]";
    case "consultant":
      return "bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]";
    case "admin":
      return "bg-[#fef3c7] text-[#b45309] border-[#fde68a]";
    case "system":
      return "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]";
    default:
      return "bg-[#f5f5f5] text-[#666666] border-[#e5e5e5]";
  }
}
