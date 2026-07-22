import type { ReactNode } from "react";

import { AccountPageShell } from "../accountPageViews";

type AboutSectionProps = {
  children?: ReactNode;
  description?: ReactNode;
  items?: string[];
  title: string;
};

const sectionItems = {
  users: [
    "آپلود تصاویر باکیفیت",
    "نمایش موقعیت روی نقشه",
    "دسته‌بندی دقیق بر اساس نوع ملک و منطقه",
    "جستجوی هوشمند برای دیده‌شدن بیشتر",
  ],
  crm: [
    "مدیریت کامل آگهی‌ها",
    "ثبت و پیگیری مشتریان بالقوه",
    "گزارش‌های دقیق برای تحلیل عملکرد",
    "دسترسی سریع و آنلاین از هر جا",
  ],
  consultants: [
    "اختصاص آگهی به مشاورین",
    "بررسی عملکرد فردی و گروهی",
    "گزارش‌های مدیریتی برای تصمیم‌گیری بهتر",
    "تعیین سطح دسترسی برای هر مشاور",
  ],
  whyUs: [
    "بیش از یک دهه تجربه‌ی موفق در بازار املاک",
    "همکاری با صدها آژانس و هزاران کاربر",
    "پشتیبانی مداوم و به‌روزرسانی‌های منظم",
    "استفاده از جدیدترین فناوری‌ها برای ساده کردن معاملات",
  ],
};

function AboutSection({ children, description, items, title }: AboutSectionProps) {
  return (
    <section className="mx-4 border-b border-dashed border-[#d2d2d2] px-1 pb-4 pt-6 last:border-b-0 last:pb-7">
      <h2 className="m-0 flex items-center justify-start gap-2 text-[16px] font-semibold leading-6 text-[#0052c8]">
        <span aria-hidden="true" className="h-[13px] w-[13px] shrink-0 rounded-full bg-[#11a366]" />
        <span>{title}</span>
      </h2>

      {description ? (
        <div className="mt-2 text-[14px] font-normal leading-[29px] text-[#4d4d4d]">
          {description}
        </div>
      ) : null}

      {items?.length ? (
        <ul className="m-0 mt-1 list-disc space-y-0 pr-5 text-[14px] font-normal leading-[28px] text-[#4d4d4d] marker:text-[#666666]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {children ? (
        <div className="mt-1 text-[14px] font-normal leading-[29px] text-[#4d4d4d]">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function AboutIntroCard() {
  return (
    <section className="relative mx-4 mt-4 px-4 py-2 min-h-[316px] overflow-hidden rounded-2xl bg-[#ebf0fa]">
      <div className="relative mx-2">
        <img
          alt="تصویری از خدمات بونگا در بازار املاک"
          className="block h-auto w-full"
          height={142}
          loading="eager"
          src="/images/about-hero.svg"
          width={296}
        />
      </div>

      <p className="m-0 text-justify text-[14px] font-normal leading-[29px] text-[#4d4d4d]">
        ما بیش از ۱۰ سال است که در دنیای املاک همراه خریداران، فروشندگان و آژانس‌های املاک هستیم. در این سال‌ها هدف ما همیشه یک چیز بوده؛ ساده‌تر کردن مسیر معامله ملک و ایجاد بستری مطمئن برای همه کسانی که در بازار املاک فعالیت دارند.
      </p>
    </section>
  );
}

export function AccountAboutPage() {
  return (
    <AccountPageShell title="درباره ما">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="mx-auto w-full max-w-[360px] pb-1">
          <AboutIntroCard />

          <AboutSection
            description={
              <p className="m-0 text-justify">
                اگر مالک یا مستاجر هستید و می‌خواهید ملک خود را معرفی کنید، کافیست با چند کلیک آگهی‌تان را ثبت کنید.
              </p>
            }
            items={sectionItems.users}
            title="ثبت آگهی سریع و ساده برای کاربران"
          >
            <p className="m-0 text-justify">
              ما کاری می‌کنیم که آگهی شما در کوتاه‌ترین زمان در معرض دید هزاران کاربر قرار بگیرد.
            </p>
          </AboutSection>

          <AboutSection
            description={
              <p className="m-0 text-justify">
                آژانس‌های املاک همیشه با حجم بالای آگهی‌ها و مشتریان روبه‌رو هستند. سیستم CRM ما دقیقاً برای حل این چالش ساخته شده است.
              </p>
            }
            items={sectionItems.crm}
            title="CRM اختصاصی برای آژانس‌های املاک"
          >
            <p className="m-0 text-justify">
              با این CRM، آژانس‌ها می‌توانند وقت کمتری صرف کارهای اداری کرده و تمرکز خود را روی معامله‌های موفق بگذارند.
            </p>
          </AboutSection>

          <AboutSection
            description={
              <p className="m-0 text-justify">
                موفقیت یک آژانس به تیم مشاورین آن بستگی دارد. به همین دلیل ما ابزارهایی فراهم کرده‌ایم که مدیران آژانس بتوانند به بهترین شکل فعالیت مشاورین را مدیریت کنند:
              </p>
            }
            items={sectionItems.consultants}
            title="مدیریت حرفه‌ای مشاورین"
          >
            <p className="m-0 text-justify">
              این امکانات باعث می‌شود نظم کاری افزایش پیدا کند و مشتریان تجربه‌ای حرفه‌ای‌تر از همکاری با آژانس داشته باشند.
            </p>
          </AboutSection>

          <AboutSection items={sectionItems.whyUs} title="چرا ما؟">
            <p className="m-0 text-justify">
              ما اینجاییم تا خرید، فروش و اجاره ملک دیگر کار پیچیده‌ای نباشد.
            </p>
          </AboutSection>
        </div>
      </main>
    </AccountPageShell>
  );
}
