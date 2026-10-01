import type { NotificationItem } from "./api/notification.service";

export function getNotificationActionLabel(
  notification: NotificationItem,
): string | null {
  if (notification.payload?.action_label) {
    return String(notification.payload.action_label);
  }

  const title = (notification.title ?? "").trim();
  const type = String(notification.type ?? "").toLowerCase();

  // Cards without action button in Figma
  if (
    notification.payload?.action === "none" ||
    title === "آگهی در انتظار بررسی است" ||
    title === "تصویر پروفایل بروزرسانی شد" ||
    title === "پروفایل شما تکمیل شد" ||
    title === "اختلال موقت در سامانه" ||
    type === "advertise_pending_review" ||
    type === "profile_image_updated" ||
    type === "profile_completed" ||
    type === "system_incident"
  ) {
    return null;
  }

  // Specific buttons by title or type from Figma SVG files
  if (
    title === "اطلاعات آگهی بروزرسانی شد" ||
    title === "اطلاعات اگهی بروزرسانی شد" ||
    title === "آگهی شما ویژه شد" ||
    title === "اگهی شما ویژه شد" ||
    title === "اطلاعات آگهی ناقص است" ||
    title === "آگهی تمدید شد" ||
    title === "اگهی تمدید شد"
  ) {
    return "ویرایش آگهی";
  }
  if (
    title === "اعتبار آگهی در حال اتمام است" ||
    title === "اعتبار آگهی درحال اتمام است"
  ) {
    return "تمدید آگهی";
  }
  if (
    title === "آگهی شما به آژانس واگذار شد" ||
    title === "اگهی شما به آژانس واگذار شد" ||
    title === "توقف انتشار تأیید نشد" ||
    title === "توقف انتشار تایید نشد" ||
    title === "معامله نهایی شد" ||
    title === "معامله ناموفق اعلام شد"
  ) {
    return "مشاهده جزئیات";
  }
  if (
    title === "آگهی شما منتشر شد" ||
    title === "اگهی شما منتشر شد" ||
    title === "انتشار آگهی متوقف شد" ||
    title === "آژانس همکاری را پذیرفت" ||
    title === "اژانس همکاری را پذیرفت" ||
    title === "آگهی جدید برای درخواست شما"
  ) {
    return "مشاهده آگهی";
  }
  if (title === "آگهی شما تأیید نشد" || title === "اگهی شما تایید نشد") {
    return "مشاهده دلیل رد";
  }
  if (title === "آگهی بایگانی شد" || title === "اگهی بایگانی شد") {
    return "بازیابی آگهی";
  }
  if (
    title === "آگهی حذف شد" ||
    title === "اگهی حذف شد" ||
    title === "آژانس همکاری را نپذیرفت" ||
    title === "اژانس همکاری را نپذیرفت"
  ) {
    return "مشاهده دلیل";
  }
  if (title === "نتیجه معامله ثبت شد") {
    return "مشاهده معامله";
  }
  if (title === "نتیجه درخواست آماده مشاهده است") {
    return "مشاهده نتایج";
  }
  if (
    title === "درخواست شما ثبت شد" ||
    (title === "پاسخ جدید دریافت شد" && notification.category === "requests") ||
    title === "وضعیت درخواست پشتیبانی تغییر کرد" ||
    title === "درخواست پشتیبانی بسته شد"
  ) {
    return "مشاهده درخواست";
  }
  if (
    title === "پیام جدید دریافت کردید" ||
    title === "پیام شما مشاهده شد" ||
    title === "گفتگو پایان یافت" ||
    (title === "پاسخ جدید دریافت کردید" && notification.category === "support")
  ) {
    return "مشاهده گفتگو";
  }
  if (title === "پروفایل شما ناقص است") {
    return "تکمیل پروفایل";
  }
  if (title === "کد تخفیف دریافت کردید") {
    const code = notification.payload?.discount_code || "۲۵۴۸۶۲۴";
    return `کد تخفیف: ${code}`;
  }
  if (
    title === "دریافت اعلان‌ها فعال شد" ||
    title === "دریافت اعلان‌ها غیرفعال شد" ||
    title === "دریافت اعلان ها فعال شد" ||
    title === "دریافت اعلان ها غیر فعال شد"
  ) {
    return "مدیریت اعلان‌ها";
  }
  if (title === "قوانین و شرایط استفاده بروزرسانی شد") {
    return "مشاهده قوانین";
  }
  if (title === "سامانه بروزرسانی شد") {
    return "بروزرسانی";
  }
  if (title === "قابلیت جدید اضافه شد") {
    return "مشاهده تغییرات";
  }

  const target = notification.payload?.target;
  const action = notification.payload?.action;

  if (action === "renew") return "تمدید آگهی";
  if (action === "register_commission") return "ثبت کمیسیون";
  if (action === "use_discount") return "استفاده از تخفیف";

  if (target === "advertise") return "مشاهده آگهی";
  if (target === "chat") return "مشاهده پیام";
  if (target === "payment") return "مشاهده پرداخت";
  if (target === "agency") return "مشاهده آژانس";
  if (target === "profile") return "مشاهده پروفایل";
  if (target === "request") return "مشاهده درخواست";
  if (target === "support") return "مشاهده پشتیبانی";
  if (target === "trade") return "مشاهده معامله";

  return notification.is_read ? "مشاهده" : "خواندن اعلان";
}
