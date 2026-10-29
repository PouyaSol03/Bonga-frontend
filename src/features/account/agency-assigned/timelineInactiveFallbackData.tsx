import type { AgencyAssignedDeletedVariant } from "./types";
import type { FallbackTimelineEntry } from "./timelineActiveFallbackData";

export function getInactiveTimelineFallbackEntries({
  agencyName,
  effectiveDeletedVariant,
  isArchived,
  isDeleted,
  isWaitForDeal,
  isWaitForStop,
}: {
  agencyName: string;
  effectiveDeletedVariant: AgencyAssignedDeletedVariant;
  isArchived: boolean;
  isDeleted: boolean;
  isWaitForDeal: boolean;
  isWaitForStop: boolean;
}): FallbackTimelineEntry[] {
  if (isArchived) {
    return [
      { time: "دیروز ۱۲:۲۰", description: "مهلت بازیابی تا ۳۰ روز فعال شد." },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            آگهی به <span className="text-on-surface-var font-medium">بایگانی شده</span> منتقل شد.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            کاربر واگذاری آگهی به آژانس را به <span className="text-error font-medium">لغو شده</span> تغییر داد.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت به <span className="text-warning font-medium">در انتظار تایید آژانس</span> تغییر یافت.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            درخواست به <span className="text-primary font-medium">{agencyName}</span> ارسال شد.
          </>
        ),
      },
    ];
  }

  if ((isDeleted || isWaitForDeal) && effectiveDeletedVariant === "deal_confirmation") {
    return [
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت توسط {agencyName} به <span className="text-error font-medium">حذف شده</span> تغییر یافت.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت توسط {agencyName} به <span className="text-tertiary font-medium">منتشر شده</span> تغییر یافت.
          </>
        ),
      },
    ];
  }

  if ((isDeleted || isWaitForStop) && effectiveDeletedVariant === "user_stopped") {
    return [
      {
        time: "دیروز ۱۲:۲۰",
        title: "انتشار آگهی متوقف شد",
        description: (
          <>
            این آگهی بنا به درخواست شما توسط <span className="text-primary font-medium">{agencyName}</span> از انتشار خارج شده است.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description:
          "درخواست توقف انتشار در حال بررسی است. در صورت ثبت اشتباه، تا قبل از بررسی آژانس می‌توانید درخواست خود را لغو کنید.",
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت توسط {agencyName} به <span className="text-tertiary font-medium">منتشر شده</span> تغییر یافت.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت به <span className="text-warning font-medium">در انتظار تایید آژانس</span> تغییر یافت.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            درخواست به <span className="text-primary font-medium">{agencyName}</span> ارسال شد.
          </>
        ),
      },
    ];
  }

  if (isDeleted && effectiveDeletedVariant === "recovery_expired") {
    return [
      { time: "دیروز ۱۲:۲۰", description: "مهلت بازیابی این آگهی به پایان رسیده است." },
      { time: "دیروز ۱۲:۲۰", description: "مهلت بازیابی تا ۳۰ روز فعال شد." },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            آگهی به <span className="text-on-surface-var font-medium">بایگانی شده</span> منتقل شد.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            کاربر واگذاری آگهی به آژانس را به <span className="text-error font-medium">لغو شده</span> تغییر داد.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت به <span className="text-warning font-medium">در انتظار تایید آژانس</span> تغییر یافت.
          </>
        ),
      },
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            درخواست به <span className="text-primary font-medium">{agencyName}</span> ارسال شد.
          </>
        ),
      },
    ];
  }

  return [];
}
