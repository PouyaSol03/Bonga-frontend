import type { Meta, StoryObj } from "@storybook/react-vite";
import { typography } from "./typography";

const meta: Meta = {
  title: "Design System/Tokens/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "مستندات تایپوگرافی رسمی بنگاه بر پایه قلم دانا (DanaFaNum). شامل اندازه فونت، ارتفاع خط (line-height) و وزن‌های استاندارد ۴۰۰، ۵۰۰، ۶۰۰، ۷۰۰ و ۹۰۰.",
      },
    },
  },
};

export default meta;

type TypographyRowProps = {
  name: string;
  className: string;
  sizePx: string;
  lineHeightPx: string;
  weight: string;
  useCase: string;
  sampleText?: string;
};

function TypographyRow({
  name,
  className,
  sizePx,
  lineHeightPx,
  weight,
  useCase,
  sampleText = "خرید و اجاره آپارتمان در تهران با قیمت مناسب",
}: TypographyRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#e5e5e5] bg-white p-4 shadow-sm transition hover:border-[#0048c4]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f0f0] pb-2 text-xs text-[#666666]">
        <span className="font-bold text-[#0048c4]">{name}</span>
        <div className="flex items-center gap-4">
          <span>اندازه: <strong>{sizePx}</strong></span>
          <span>ارتفاع خط: <strong>{lineHeightPx}</strong></span>
          <span>وزن: <strong>{weight}</strong></span>
        </div>
      </div>
      <div className="py-2">
        <p className={`${className} m-0 text-[#1a1a1a]`}>{sampleText}</p>
      </div>
      <div className="text-xs text-[#808080]">
        کاربرد: {useCase}
      </div>
    </div>
  );
}

export const AllTypographyTokens: StoryObj = {
  name: "تمام رده‌های تایپوگرافی (Typography Scale)",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a1a1a]">سیستم مقیاس تایپوگرافی دانا (DanaFaNum)</h2>
        <p className="mt-1 text-sm text-[#666666]">
          این قلم برای خوانایی بالا در زبان فارسی و نمایش اعداد فارسی (FaNum) بهینه‌سازی شده است.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#0048c4]">عناوین نمایشی بزرگ (Display)</h3>
        <TypographyRow
          name="Display Large (displayLg)"
          className={typography.displayLg}
          sizePx="57px"
          lineHeightPx="64px"
          weight="Regular (400)"
          useCase="صفحات فرود، اعداد بزرگ آماری، ارقام فروش ویژه"
          sampleText="بنگاه املاک کشور"
        />
        <TypographyRow
          name="Display Medium (displayMd)"
          className={typography.displayMd}
          sizePx="45px"
          lineHeightPx="52px"
          weight="Regular (400)"
          useCase="اعداد اصلی داشبورد و بازدیدها"
          sampleText="۱۲,۵۰۰,۰۰۰ بازدید"
        />
        <TypographyRow
          name="Display Small (displaySm)"
          className={typography.displaySm}
          sizePx="36px"
          lineHeightPx="44px"
          weight="Regular (400)"
          useCase="تیترهای برجسته بنرها و صفحات معرفی"
          sampleText="سریع‌تر بفروش، بهتر دیده شو"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#0048c4]">سرتیترها (Headlines)</h3>
        <TypographyRow
          name="Headline Large (headlineLg)"
          className={typography.headlineLg}
          sizePx="32px"
          lineHeightPx="40px"
          weight="Regular (400)"
          useCase="سرتیتر اصلی بخش‌های بزرگ سایت"
        />
        <TypographyRow
          name="Headline Medium (headlineMd)"
          className={typography.headlineMd}
          sizePx="24px"
          lineHeightPx="36px"
          weight="Regular (400)"
          useCase="عناوین کارت‌های اصلی و هدر مودال‌ها"
        />
        <TypographyRow
          name="Headline Small (headlineSm)"
          className={typography.headlineSm}
          sizePx="24px"
          lineHeightPx="32px"
          weight="Regular (400)"
          useCase="عناوین بخش‌های فشرده"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#0048c4]">عناوین و سرستون‌ها (Titles)</h3>
        <TypographyRow
          name="Title Large (titleLg)"
          className={typography.titleLg}
          sizePx="22px"
          lineHeightPx="28px"
          weight="Semibold (600)"
          useCase="عنوان کارت آگهی و عنوان صفحات داخلی"
        />
        <TypographyRow
          name="Title Medium (titleMd)"
          className={typography.titleMd}
          sizePx="16px"
          lineHeightPx="24px"
          weight="Semibold (600)"
          useCase="عنوان هدر اپ‌بار و فیلدهای گروهی"
        />
        <TypographyRow
          name="Title Small (titleSm)"
          className={typography.titleSm}
          sizePx="14px"
          lineHeightPx="20px"
          weight="Semibold (600)"
          useCase="زیرعنوان‌های کارت و ردیف‌های لیست"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#0048c4]">متن بدنه (Body Text)</h3>
        <TypographyRow
          name="Body Large (bodyLg)"
          className={typography.bodyLg}
          sizePx="16px"
          lineHeightPx="24px"
          weight="Regular (400)"
          useCase="متن پاراگراف‌های اصلی، متن توضیحات آگهی"
        />
        <TypographyRow
          name="Body Medium (bodyMd)"
          className={typography.bodyMd}
          sizePx="14px"
          lineHeightPx="20px"
          weight="Regular (400)"
          useCase="استاندارد متن عمومی برنامه و گزینه‌های منو"
        />
        <TypographyRow
          name="Body Small (bodySm)"
          className={typography.bodySm}
          sizePx="12px"
          lineHeightPx="16px"
          weight="Regular (400)"
          useCase="توضیحات فرعی، متادیتا، تاریخ و ساعت آگهی"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#0048c4]">برچسب‌ها و دکمه‌ها (Labels & Functional)</h3>
        <TypographyRow
          name="Label Large (labelLg)"
          className={typography.labelLg}
          sizePx="16px"
          lineHeightPx="24px"
          weight="Medium (500)"
          useCase="متن دکمه‌های بزرگ (Medium 56px)"
          sampleText="ثبت رایگان آگهی ملک"
        />
        <TypographyRow
          name="Label Medium (labelMd)"
          className={typography.labelMd}
          sizePx="14px"
          lineHeightPx="20px"
          weight="Medium (500)"
          useCase="متن چیپ‌ها و دکمه‌های متوسط (40px)"
          sampleText="فروش آپارتمان مسکونی"
        />
        <TypographyRow
          name="Label Small (labelSm)"
          className={typography.labelSm}
          sizePx="12px"
          lineHeightPx="16px"
          weight="Medium (500)"
          useCase="متن بج‌های وضعیت (تایید شده / نیمه‌کاره)"
          sampleText="تایید شده توسط ناظر"
        />
      </div>
    </div>
  ),
};
