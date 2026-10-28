import type { IconName } from "../viewAdTypes";

export function getDetailIconByLabel(label: string): IconName {
  const l = label.toLowerCase();
  if (
    l.includes("متراژ") ||
    l.includes("area") ||
    l.includes("زیربنا") ||
    l.includes("بنا") ||
    l.includes("زمین")
  )
    return "area";
  if (l.includes("اتاق") || l.includes("خواب") || l.includes("rooms") || l.includes("تخت"))
    return "bed";
  if (
    l.includes("سن") ||
    l.includes("سال ساخت") ||
    l.includes("طبقه") ||
    l.includes("ساختمان") ||
    l.includes("واحد") ||
    l.includes("پروژه") ||
    l.includes("سازنده")
  )
    return "building";
  if (
    l.includes("سند") ||
    l.includes("قرارداد") ||
    l.includes("مجوز") ||
    l.includes("شرایط") ||
    l.includes("مالکیت")
  )
    return "document";
  if (
    l.includes("موقعیت") ||
    l.includes("جهت") ||
    l.includes("دسترسی") ||
    l.includes("تجاری") ||
    l.includes("اداری")
  )
    return "location";
  if (
    l.includes("تاریخ") ||
    l.includes("تحویل") ||
    l.includes("ساعت") ||
    l.includes("روز") ||
    l.includes("دوره") ||
    l.includes("اقساط")
  )
    return "calendar";
  if (l.includes("نفر") || l.includes("ظرفیت") || l.includes("مدیریت")) return "profile";
  if (l.includes("عرض") || l.includes("ارتفاع") || l.includes("گذر") || l.includes("سقف"))
    return "ruler";
  if (
    l.includes("قیمت") ||
    l.includes("مبلغ") ||
    l.includes("تومان") ||
    l.includes("رهن") ||
    l.includes("اجاره") ||
    l.includes("ودیعه") ||
    l.includes("تضمین")
  )
    return "tooman";
  if (l.includes("کابینت") || l.includes("آشپزخانه")) return "cabinet";
  if (l.includes("کف") || l.includes("سرامیک")) return "ceramic";
  return "apartment";
}
