import { PageFrame } from "../../app/PageFrame";
import { TopBar } from "../../components/TopBar";
import LinearStar from "../../components/(icons)/LinearStar";

type BadgeGuide = {
  id: string;
  image: string;
  title: string;
  levelsIntro: string;
  levels: string[];
  indicatorTitle: string;
  indicatorDescription: string;
  factorsTitle: string;
  factors: string[];
  summary: string;
};

const badgeGuides: BadgeGuide[] = [
  {
    id: "golden-team",
    image: "/vectors/badges/badge-cup.png",
    title: "نشان تیم طلایی",
    levelsIntro: "بر اساس میانگین امتیاز مشاوران:",
    levels: [
      "میانگین مشاوران بالای ۷۵ امتیاز",
      "میانگین مشاوران بالای ۸۵ امتیاز",
      "میانگین مشاوران بالای ۹۵ امتیاز",
    ],
    indicatorTitle: "شاخص میانگین عملکرد مشاوران",
    indicatorDescription:
      "این نشان بر اساس میانگین امتیاز عملکرد تمام مشاوران زیرمجموعه آژانس محاسبه می‌شود. در واقع، اعتبار هر آژانس مستقیماً به کیفیت عملکرد تیم آن وابسته است.",
    factorsTitle: "چه عواملی تأثیرگذار است؟",
    factors: [
      "امتیاز کلی هر مشاور",
      "کیفیت فعالیت فردی مشاوران",
      "ثبات عملکرد تیم در طول زمان",
    ],
    summary:
      "هرچه میانگین امتیاز مشاوران شما بالاتر باشد، آژانس شما شانس بیشتری برای دریافت این نشان و ارتقای رتبه کلی خواهد داشت.",
  },
  {
    id: "record-holder",
    image: "/vectors/badges/badge-bookmark.png",
    title: "نشان رکورددار",
    levelsIntro: "بر اساس تعداد معامله موفق:",
    levels: ["۱۰۰ معامله موفق", "۳۰۰ معامله موفق", "۶۰۰ معامله موفق"],
    indicatorTitle: "معاملات موفق آژانس",
    indicatorDescription:
      "این نشان به آژانس‌هایی تعلق می‌گیرد که بیشترین تعداد معاملات موفق را ثبت کرده‌اند.",
    factorsTitle: "نحوه محاسبه:",
    factors: [
      "هر قرارداد یا معامله‌ای که توسط مشاوران ثبت شود",
      "معاملات به‌صورت همزمان برای مشاور و آژانس لحاظ می‌گردد.",
      "اطلاعات بر اساس قراردادها و گزارش‌های ثبت‌شده در سیستم بررسی می‌شود",
    ],
    summary:
      "آژانس‌هایی با حجم معاملات موفق بالاتر، امتیاز بیشتری دریافت کرده و جایگاه بالاتری در رتبه‌بندی خواهند داشت.",
  },
  {
    id: "fast-team",
    image: "/vectors/badges/badge-chat.png",
    title: "نشان تیم پرسرعت",
    levelsIntro: "بر اساس تعداد پاسخگویی در زمان مشخص:",
    levels: [
      "۲۰۰ پاسخ در کمتر از ۱ ساعت",
      "۳۰۰ پاسخ در کمتر از ۱ ساعت",
      "۴۰۰ پاسخ در کمتر از ۱ ساعت",
    ],
    indicatorTitle: "فعالیت تیمی آژانس",
    indicatorDescription:
      "این نشان میزان پویایی و فعالیت جمعی آژانس را نشان می‌دهد.",
    factorsTitle: "شاخص‌های ارزیابی:",
    factors: [
      "درصد مشاوران فعال نسبت به کل تیم",
      "میزان و نظم بروزرسانی فایل‌ها",
      "حضور مستمر مشاوران در سیستم",
    ],
    summary:
      "آژانس‌هایی که اکثر اعضای تیم آن‌ها فعال، به‌روز و درگیر باشند، نسبت به آژانس‌هایی با فعالیت پراکنده یا غیرفعال، امتیاز و رتبه بهتری کسب می‌کنند.",
  },
  {
    id: "popular",
    image: "/vectors/badges/badge-first.png",
    title: "نشان محبوب‌ترین",
    levelsIntro: "بر اساس امتیاز کاربران:",
    levels: [
      "۵۰۰ رضایت کاربران بالای ۴",
      "۱۵۰۰ رضایت کاربران بالای ۴",
      "۳۰۰۰ رضایت کاربران بالای ۴",
    ],
    indicatorTitle: "ارزیابی و بازخورد کاربران",
    indicatorDescription:
      "این نشان کاملاً بر اساس رأی و تجربه کاربران سامانه محاسبه می‌شود و نشان‌دهنده میزان رضایت واقعی مشتریان است.",
    factorsTitle: "معیارهای رأی‌دهی کاربران شامل:",
    factors: [
      "سرعت پاسخگویی",
      "میزان آشنایی با منطقه",
      "صداقت در معرفی ملک",
      "پیگیری مؤثر درخواست‌ها",
      "به‌روز بودن آگهی‌ها و فایل‌ها",
    ],
    summary:
      "آژانس‌هایی که ارتباط حرفه‌ای‌تر و شفاف‌تری با کاربران دارند، امتیاز بالاتری در این بخش کسب می‌کنند.",
  },
];

export function DashboardBadgesGuidePage() {
  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/dashboard/ranking" title="راهنمای نشان‌ها" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {badgeGuides.map((badge, index) => (
          <BadgeGuideSection badge={badge} key={badge.id} sectionIndex={index} />
        ))}
      </main>
    </PageFrame>
  );
}

function BadgeGuideSection({ badge, sectionIndex }: { badge: BadgeGuide; sectionIndex: number }) {
  return (
    <section className="bg-white px-4 py-4 text-right">
      {sectionIndex > 0 ? <div className="-mx-4 mb-4 h-5 bg-[#f0f0f0]" aria-hidden="true" /> : null}

      <div className="flex h-[88px] items-center justify-center gap-4 rounded-2xl border border-[#f5f5f5] bg-linear-to-b from-blue-50 to-white px-5">
        <img alt="" className="h-14 w-14 shrink-0 object-contain" src={badge.image} />
        <h1 className="m-0 text-[22px] font-semibold leading-7 text-[#0048c4]">
          {badge.title}
        </h1>
      </div>

      <div className="mt-6">
        <h2 className="m-0 font-semibold text-[#1a1a1a]">
          سطوح نشان
        </h2>
        <p className="m-0 mt-3 font-normal leading-6 text-[#1a1a1a]">
          {badge.levelsIntro}
        </p>

        <div className="mt-2 space-y-1 text-sm font-normal leading-6 text-[#1A1A1A]">
          {badge.levels.map((level, index) => (
            <p className="m-0 text-sm flex items-center gap-2" key={level}>
              <StarRating count={index + 1} />
              <span>{`سطح ${index + 1}:`}</span>
              <span>{level}</span>
            </p>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="m-0 flex items-center gap-2 font-semibold leading-6 text-[#0048c4]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0048c4]" />
            <span>{badge.indicatorTitle}</span>
          </h2>
          <p className="mt-2 text-[#1a1a1a]">
            {badge.indicatorDescription}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="m-0 font-semibold leading-6 text-[#1a1a1a]">
            {badge.factorsTitle}
          </h3>
          <ul className="m-0 mt-2 space-y-2 pr-4 text-sm font-normal leading-6 text-[#1A1A1A]">
            {badge.factors.map((factor) => (
              <li className="flex items-start gap-3" key={factor}>
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#11a366]" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-4 font-normal text-[#1a1a1a]">
            {badge.summary}
          </p>
        </div>
      </div>
    </section>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 [direction:ltr]" aria-hidden="true">
      {[0, 1, 2].map((star) => {
        const isActive = star < count;

        return (
          <LinearStar
            className={`h-3 w-3 ${isActive ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
            innerColor="currentColor"
            key={star}
          />
        );
      })}
    </span>
  );
}
