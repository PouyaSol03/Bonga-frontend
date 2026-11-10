import type { ReactNode } from "react";

export type FallbackTimelineEntry = {
  description: ReactNode;
  time: string;
  title?: string;
};

export function getActiveTimelineFallbackEntries({
  agencyName,
  isPublished,
  isWaitForAdmin,
  isWaitForAgency,
  isWaitForRepost,
}: {
  agencyName: string;
  isPublished: boolean;
  isWaitForAdmin: boolean;
  isWaitForAgency: boolean;
  isWaitForRepost: boolean;
}): FallbackTimelineEntry[] | null {
  if (isPublished) {
    return [
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

  if (isWaitForAdmin) {
    return [
      {
        time: "دیروز ۱۲:۲۰",
        description: (
          <>
            وضعیت به <span className="text-warning font-medium">در انتظار تایید انتشار</span> تغییر یافت.
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

  if (isWaitForAgency) {
    return [
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

  if (isWaitForRepost) {
    return [
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
    ];
  }

  return null;
}
