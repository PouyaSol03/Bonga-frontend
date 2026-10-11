import { useMemo } from "react";
import { BottomSheet } from "../../../shared/components/BottomSheet";
import LinearStar from "../../../shared/icons/LinearStar";
import { Typography } from "../../../shared/ui/Typography";
import { toPersianNumber as toPersianDigits } from "../../../shared/lib/numberUtils";
import { BADGE_IMAGES } from "../ranking/AgencyBadgesPanel";

export type BadgeDetailItem = {
  current_value?: number;
  earned?: boolean;
  level?: number;
  next_target?: number;
  progress?: number;
  slug?: string;
  thresholds?: number[];
  title?: string;
};

type BadgeMeta = {
  metricLabel: string;
  metricValueText: (val?: number) => string;
  description: string;
};

const BADGE_METAS: Record<string, BadgeMeta> = {
  golden_team: {
    metricLabel: "میانگین امتیاز مشاوران",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان بر اساس میانگین امتیاز عملکرد مشاوران و پویایی تیم محاسبه می‌شود. هر چه درصد مشاوران فعال و به‌روزرسانی فایل‌ها بیشتر باشد، امتیاز بالاتری ثبت می‌گردد.",
  },
  "golden-team": {
    metricLabel: "میانگین امتیاز مشاوران",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان بر اساس میانگین امتیاز عملکرد مشاوران و پویایی تیم محاسبه می‌شود. هر چه درصد مشاوران فعال و به‌روزرسانی فایل‌ها بیشتر باشد، امتیاز بالاتری ثبت می‌گردد.",
  },
  market_magnet: {
    metricLabel: "میانگین امتیاز مشاوران",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان بیانگر پویایی و همکاری اعضای آژانس است. درصد مشاوران فعال بیشتر و نرخ به‌روزرسانی فایل‌ها، امتیاز فعالیت تیمی را بالا می‌برد.",
  },
  record_holder: {
    metricLabel: "معامله موفق",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان به مجموع معاملات موفق ثبت‌شده توسط مشاوران تعلق می‌گیرد. هر قرارداد موفق، امتیاز و جایگاه آژانس را در رتبه‌بندی ارتقا می‌دهد.",
  },
  "record-holder": {
    metricLabel: "معامله موفق",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان به مجموع معاملات موفق ثبت‌شده توسط مشاوران تعلق می‌گیرد. هر قرارداد موفق، امتیاز و جایگاه آژانس را در رتبه‌بندی ارتقا می‌دهد.",
  },
  file_maker: {
    metricLabel: "معامله موفق",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان به مجموع معاملات موفق ثبت‌شده توسط مشاوران تعلق می‌گیرد. هر قرارداد موفق، امتیاز و جایگاه آژانس را در رتبه‌بندی ارتقا می‌دهد.",
  },
  popular: {
    metricLabel: "رضایت کاربران بالای ۴ امتیاز",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان بر اساس امتیازها و بازخوردهای کاربران از آگهی‌های ثبت‌شده توسط آژانس محاسبه می‌شود. هرچه میزان رضایت کاربران بیشتر باشد، امتیاز محبوبیت آژانس هم بالاتر خواهد بود.",
  },
  fast_team: {
    metricLabel: "پاسخ در کمتر از ۱ ساعت",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان میزان پویایی، سرعت پاسخگویی و فعالیت مستمر مشاوران در سامانه را نمایش می‌دهد.",
  },
  "fast-team": {
    metricLabel: "پاسخ در کمتر از ۱ ساعت",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان میزان پویایی، سرعت پاسخگویی و فعالیت مستمر مشاوران در سامانه را نمایش می‌دهد.",
  },
  always_active: {
    metricLabel: "پاسخ در کمتر از ۱ ساعت",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description:
      "این نشان میزان پویایی، سرعت پاسخگویی و فعالیت مستمر مشاوران در سامانه را نمایش می‌دهد.",
  },
};

export function BadgeDetailBottomSheet({
  badge,
  isOpen,
  onClose,
}: {
  badge: BadgeDetailItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const slug = (badge?.slug ?? "").trim().toLowerCase();
  const title = badge?.title || "نشان";
  const level = Number(badge?.level ?? (badge?.earned ? 1 : 0));
  const currentValue = badge?.current_value ?? 0;

  const imageSrc = useMemo(() => {
    if (!slug) return BADGE_IMAGES.market_magnet;
    return BADGE_IMAGES[slug] || BADGE_IMAGES[slug.replace(/_/g, "-")] || "/vectors/badges/badge-cup.webp";
  }, [slug]);

  const meta = BADGE_METAS[slug] || BADGE_METAS[slug.replace(/_/g, "-")] || {
    metricLabel: "امتیاز کسب‌شده",
    metricValueText: (val) => toPersianDigits(val ?? 0),
    description: "این نشان براساس میزان فعالیت، رضایت کاربران و کیفیت ثبت آگهی‌ها در سامانه محاسبه می‌شود.",
  };

  return (
    <BottomSheet
      ariaLabel={`جزئیات نشان ${title}`}
      isOpen={isOpen}
      onClose={onClose}
      showBackButton
      title={`نشان ${title}`}
      variant="confirm"
    >
      <div className="flex flex-col items-center px-4 pb-6 pt-2 text-center [direction:rtl]">
        {/* Graphic illustration */}
        <div className="relative mb-3 flex h-24 w-24 items-center justify-center">
          <img
            alt={title}
            className={`h-full w-full object-contain ${!badge?.earned && level === 0 ? "grayscale opacity-80" : ""}`}
            src={imageSrc}
          />
        </div>

        {/* Pill Tag */}
        <div className="rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
          {title}
        </div>

        {/* Level Stars */}
        <div className="mt-2.5 flex h-4 items-center justify-center gap-1.5 [direction:ltr]">
          {[0, 1, 2].map((starIndex) => (
            <LinearStar
              className={`h-4 w-4 ${level > starIndex ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
              innerColor="currentColor"
              key={starIndex}
            />
          ))}
        </div>

        {/* Metric row */}
        <div className="mt-4 flex items-baseline justify-center gap-2">
          <Typography as="span" variant="title" size="large" weight="semibold" className="text-xl font-bold text-on-surface">
            {meta.metricValueText(currentValue)}
          </Typography>
          <Typography as="span" variant="body" size="medium" weight="medium" className="text-sm text-on-surface-variant">
            {meta.metricLabel}
          </Typography>
        </div>

        {/* Info card (Pale mint background with dark green border) */}
        <div className="mt-5 w-full rounded-2xl border border-emerald-500/60 bg-emerald-50/70 p-4 text-right">
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs font-normal leading-6 text-emerald-950">
            {meta.description}
          </Typography>
        </div>
      </div>
    </BottomSheet>
  );
}
