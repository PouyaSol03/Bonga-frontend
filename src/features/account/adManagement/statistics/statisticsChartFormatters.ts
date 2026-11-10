import type { ChartMetric } from "./types";

export function createYAxisTicks(labels: string[]) {
  if (labels.length <= 1) return [0, 100];
  return labels.map((_, index) => (index / (labels.length - 1)) * 100);
}

export function createYAxisTickFormatter(labels: string[]) {
  const ascendingLabels = [...labels].reverse();

  return (value: number | string) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || ascendingLabels.length <= 1) return String(value);

    const index = Math.round((numericValue / 100) * (ascendingLabels.length - 1));
    return ascendingLabels[index] ?? String(value);
  };
}

export function getChartInfo(metric: ChartMetric) {
  const infoByMetric: Record<ChartMetric, { description: string; title: string }> = {
    calls: {
      description:
        "تعداد دفعاتی که کاربران از داخل آگهی برای تماس با شما اقدام کرده‌اند. این عدد کمک می‌کند بفهمید آگهی چقدر به سرنخ واقعی نزدیک شده است.",
      title: "اقدام به تماس",
    },
    chats: {
      description:
        "تعداد گفتگوهایی که کاربران از طریق بخش چت برای این آگهی شروع کرده‌اند. افزایش این عدد معمولاً یعنی عنوان، عکس و توضیحات آگهی برای کاربر جذاب بوده است.",
      title: "گفتگوها (چت‌ها)",
    },
    searchDisplays: {
      description:
        "تعداد دفعاتی که آگهی شما در نتایج جستجو به کاربران نمایش داده شده است. با بروزرسانی یا ویژه کردن آگهی می‌توانید این عدد را بیشتر کنید.",
      title: "نمایش در صفحه جستجو",
    },
    views: {
      description:
        "تعداد دفعاتی که کاربران وارد صفحه آگهی شده‌اند و جزئیات آن را دیده‌اند. این آمار برای سنجش جذابیت آگهی و اثرگذاری افزایش بازدید استفاده می‌شود.",
      title: "بازدید از آگهی",
    },
  };

  return infoByMetric[metric];
}

export function toChartNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}
