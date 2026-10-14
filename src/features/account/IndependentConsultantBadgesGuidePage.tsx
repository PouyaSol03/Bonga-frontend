import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";

type BadgeGuide = {
  image: string;
  indicatorDescription: string;
  indicatorTitle: string;
  intro: string;
  levels: string[];
  name: string;
  note: string;
  points: string[];
};

const badgeGuides: BadgeGuide[] = [
  {
    image: "/figma/account/ranking-badge-file.png",
    indicatorDescription: "این شاخص میزان پویایی شما در ثبت و مدیریت فایل‌ها را نشان می‌دهد.",
    indicatorTitle: "شاخص فعالیت",
    intro: "بر اساس تعداد فایل‌های ثبت‌شده:",
    levels: ["ثبت بیش از ۱۰۰ فایل", "ثبت بیش از ۳۰۰ فایل", "ثبت بیش از ۶۰۰ فایل"],
    name: "نشان فایل‌ساز",
    note: "هرچه فایل‌های بیشتری ثبت کنید و آن‌ها را به‌موقع به‌روز نگه دارید، سیستم شما را مشاوری فعال‌تر و حرفه‌ای‌تر ارزیابی می‌کند. مدیریت صحیح فایل‌های منقضی نیز نقش مهمی در این امتیاز دارد.",
    points: [
      "تعداد فایل‌های ثبت‌شده در بازه اخیر",
      "تعداد فایل‌های بروزرسانی‌شده",
      "نرخ حذف فایل‌های منقضی",
    ],
  },
  {
    image: "/figma/account/ranking-badge-magnet.png",
    indicatorDescription:
      "این شاخص نشان می‌دهد آگهی‌های شما تا چه حد با نیاز واقعی کاربران هم‌راستا بوده‌اند و منجر به تعامل شده‌اند.",
    indicatorTitle: "شاخص تطبیق مؤثر",
    intro: "بر اساس تعداد تعامل‌های مؤثر کاربران با آگهی‌های شما:",
    levels: ["۵۰ تعامل مؤثر", "۱۰۰ تعامل مؤثر", "۲۰۰ تعامل مؤثر"],
    name: "نشان مغناطیس بازار",
    note: "تعامل بیشتر یعنی آگهی‌های شما درست دیده شده‌اند، درست انتخاب شده‌اند و به نیاز بازار نزدیک‌تر بوده‌اند.",
    points: [
      "کلیک روی دکمه تماس",
      "شروع چت با مشاور",
      "ثبت درخواست مرتبط با آگهی",
      "ذخیره آگهی",
      "بازدید چندباره یک کاربر یکتا از یک آگهی",
    ],
  },
  {
    image: "/figma/account/ranking-badge-response.png",
    indicatorDescription:
      "این شاخص سرعت و نظم شما در پاسخ به پیام‌ها و درخواست‌های کاربران را بررسی می‌کند.",
    indicatorTitle: "شاخص سرعت پاسخگویی",
    intro: "بر اساس تعداد پاسخ‌های سریع‌تر از ۱۰ دقیقه:",
    levels: ["۱۰۰ پاسخ سریع", "۲۰۰ پاسخ سریع", "۳۰۰ پاسخ سریع"],
    name: "نشان صاعقه پاسخ",
    note: "کاربران پاسخ سریع را نشانه‌ی تعهد و حرفه‌ای‌بودن می‌دانند. پاسخ‌های سریع‌تر، امتیاز بالاتری برای شما ثبت می‌کنند.",
    points: ["میانگین زمان پاسخ به پیام‌ها و درخواست‌ها", "درصد پاسخ‌های سریع و به‌موقع"],
  },
  {
    image: "/figma/account/ranking-badge-time.png",
    indicatorDescription: "این شاخص ثبات حضور شما در سامانه را در طول زمان می‌سنجد.",
    indicatorTitle: "شاخص پایداری فعالیت",
    intro: "بر اساس میانگین فعالیت روزانه در بازه ۳ ماهه:",
    levels: [
      "میانگین ۴ ساعت فعالیت روزانه",
      "میانگین ۶ ساعت فعالیت روزانه",
      "میانگین ۸ ساعت فعالیت روزانه",
    ],
    name: "نشان همیشگی",
    note: "مشاورانی که حضور منظم دارند و فعالیت‌شان مقطعی نیست، اعتماد بیشتری ایجاد می‌کنند و امتیاز بالاتری می‌گیرند.",
    points: [
      "تعداد روزهای فعال در ماه",
      "نداشتن غیبت‌های طولانی",
      "استمرار فعالیت در بازه‌های زمانی مختلف",
    ],
  },
];

export function IndependentConsultantBadgesGuidePage() {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/ranking" title="راهنمای نشان‌ها" />

      <main className="bg-surface-container min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto">
        {badgeGuides.map((badge) => (
          <BadgeGuideSection badge={badge} key={badge.name} />
        ))}
      </main>
    </PageFrame>
  );
}

function BadgeGuideSection({ badge }: { badge: BadgeGuide }) {
  return (
    <section className="bg-surface-container-lowest p-4">
      <div className="border-outline-var from-on-surface/40 to-on-surface/0 flex h-22 items-center justify-center gap-4 rounded-2xl border bg-linear-to-b">
        <img alt="" className="h-14 w-14 object-contain" src={badge.image} />
        <Typography
          as="h2"
          variant="title"
          size="large"
          weight="semibold"
          className="text-primary m-0 text-[22px] leading-7 font-semibold"
        >
          {badge.name}
        </Typography>
      </div>

      <div className="mt-6">
        <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0">
          سطوح نشان
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className="mt-4 text-base leading-6 font-normal"
        >
          {badge.intro}
        </Typography>
        <div className="mt-2 space-y-2">
          {badge.levels.map((level, index) => (
            <div
              className="flex items-center justify-start gap-1 text-sm leading-5 font-normal"
              key={level}
            >
              <LevelStars count={index + 1} />
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
              >{`سطح ${index + 1}: ${level}`}</Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-primary flex items-center gap-1 text-base leading-6 font-semibold"
        >
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-primary ml-2 h-2 w-2 rounded-full"
          />
          {badge.indicatorTitle}
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="regular"
          className="mt-2 text-base leading-6 font-normal"
        >
          {badge.indicatorDescription}
        </Typography>

        <Typography
          as="p"
          variant="label"
          size="large"
          weight="semibold"
          className="mt-6 text-base leading-6 font-semibold"
        >
          موارد مؤثر در امتیاز:
        </Typography>
        <ul className="mt-2 mr-4 space-y-2 text-base leading-6 font-normal">
          {badge.points.map((point) => (
            <li className="flex items-start gap-3.5" key={point}>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="bg-tertiary mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
              />
              <Typography as="span" variant="body" size="large" weight="regular">
                {point}
              </Typography>
            </li>
          ))}
        </ul>
        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4">
          {badge.note}
        </Typography>
      </div>
    </section>
  );
}

function LevelStars({ count }: { count: number }) {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="flex shrink-0 gap-0.5 [direction:ltr]"
    >
      {[0, 1, 2].map((star) => (
        <svg
          aria-hidden="true"
          className={`h-3 w-3 ${star < count ? "text-warning" : "text-outline-var"}`}
          fill="currentColor"
          key={star}
          viewBox="0 0 12 12"
        >
          <path d="m6 1.3 1.45 2.93 3.23.47-2.34 2.28.55 3.22L6 8.68 3.11 10.2l.55-3.22L1.32 4.7l3.23-.47L6 1.3Z" />
        </svg>
      ))}
    </Typography>
  );
}
