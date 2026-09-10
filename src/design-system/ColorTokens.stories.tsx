import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Design System/Tokens/Colors",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "مستندات پالت رنگی رسمی سیستم طراحی بنگاه (Bonga Design System). تمام رنگ‌ها به صورت متغیرهای CSS در فایل `tokens.css` و `theme.css` تعریف شده‌اند.",
      },
    },
  },
};

export default meta;

type ColorSwatchProps = {
  name: string;
  cssVar: string;
  hex: string;
  description: string;
  isDarkText?: boolean;
};

function ColorSwatch({ name, cssVar, hex, description, isDarkText = false }: ColorSwatchProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm transition hover:shadow-md">
      <div
        className="flex h-20 w-full items-end justify-between p-3 font-mono text-xs font-bold"
        style={{
          backgroundColor: hex,
          color: isDarkText ? "#1a1a1a" : "#ffffff",
        }}
      >
        <span>{name}</span>
        <span>{hex}</span>
      </div>
      <div className="flex flex-col p-3 text-right">
        <code className="text-xs text-[#0048c4] dir-ltr text-left font-mono">{cssVar}</code>
        <span className="mt-1 text-xs text-[#666666] leading-5">{description}</span>
      </div>
    </div>
  );
}

export const PrimaryPalette: StoryObj = {
  name: "رنگ‌های اصلی (Primary)",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">طیف آبی برند بنگاه (Primary Blue)</h2>
        <p className="mt-1 text-sm text-[#666666]">
          رنگ اصلی برند بنگاه برای دکمه‌های فراخوان عمل (CTA)، وضعیت‌های فعال، لینک‌ها و هویت بصری.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ColorSwatch name="Primary 100" cssVar="--primary-100" hex="#002099" description="عناوین برجسته تیره و متون هایلایت" />
        <ColorSwatch name="Primary 200" cssVar="--primary-200" hex="#0033AC" description="حالت فشرده شده (Active) المان‌های اصلی" />
        <ColorSwatch name="Primary 300" cssVar="--primary-300" hex="#003EB7" description="حالت هاور (Hover) المان‌های اصلی" />
        <ColorSwatch name="Primary 400" cssVar="--primary-400" hex="#0048C4" description="رنگ رسمی و دیفالت دکمه‌ها و عناصر اصلی برند" />
        <ColorSwatch name="Primary 500" cssVar="--primary-500" hex="#0D50CE" description="واریانت ثانویه آبی برند" />
        <ColorSwatch name="Primary 700" cssVar="--primary-700" hex="#7F97EA" description="بردرها و تزیینات روشن‌تر" isDarkText />
        <ColorSwatch name="Primary 800" cssVar="--primary-800" hex="#B1BDF0" description="خطوط تقسیم و بوردرهای آبی کمرنگ" isDarkText />
        <ColorSwatch name="Primary 900" cssVar="--primary-900" hex="#D7DDF8" description="پس‌زمینه‌های کم‌رنگ فعال یا بج‌ها" isDarkText />
        <ColorSwatch name="Primary 950" cssVar="--primary-950" hex="#EDF0FB" description="کانتینر دکمه‌های تونال و فیلدهای هایلایت" isDarkText />
      </div>
    </div>
  ),
};

export const TertiaryPalette: StoryObj = {
  name: "رنگ‌های سبز و موفقیت (Tertiary / Green)",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">طیف سبز و موفقیت (Brand Green / Success)</h2>
        <p className="mt-1 text-sm text-[#666666]">
          استفاده شده برای آگهی‌های تایید شده، تراکنش‌های موفق کیف‌پول، نشان‌های مثبت و نمودارها.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ColorSwatch name="Tertiary 100" cssVar="--tertiary-100" hex="#006038" description="متون تیره سبز در بج‌های تایید شده" />
        <ColorSwatch name="Tertiary 300" cssVar="--tertiary-300" hex="#069159" description="ستون‌های هاور شده نمودار و دکمه‌های اقدام مثبت" />
        <ColorSwatch name="Tertiary 400" cssVar="--tertiary-400" hex="#11A366" description="رنگ رسمی سبز موفقیت و تایید" />
        <ColorSwatch name="Tertiary 500" cssVar="--tertiary-500" hex="#1AB371" description="ستون‌های نمودار بازدید و نمادهای مثبت" />
        <ColorSwatch name="Tertiary 900" cssVar="--tertiary-900" hex="#C1E7D3" description="بردر بج‌های وضعیت موفق" isDarkText />
        <ColorSwatch name="Tertiary 950" cssVar="--tertiary-950" hex="#E6F6ED" description="پس‌زمینه بج «تایید شده» و کارت‌های موفق" isDarkText />
      </div>
    </div>
  ),
};

export const ErrorAndWarningPalette: StoryObj = {
  name: "خطا و هشدار (Error & Warning)",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">طیف‌های قرمز (خطا/حذف) و نارنجی (هشدار/نیمه‌کاره)</h2>
        <p className="mt-1 text-sm text-[#666666]">
          برای اعلام خطاها، آگهی‌های رد شده، دکمه‌های حذف، آگهی‌های نیمه‌کاره و یادآوری‌ها.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ColorSwatch name="Error 400" cssVar="--error-400" hex="#EE3623" description="رنگ اصلی خطای فیلدها و دکمه‌های خطر (حذف)" />
        <ColorSwatch name="Error 100" cssVar="--error-100" hex="#C11004" description="متن‌های تیره خطا و رد شدن" />
        <ColorSwatch name="Error 950" cssVar="--error-950" hex="#FFEBED" description="پس‌زمینه هشدارهای خطای فرم و بج «رد شده»" isDarkText />
        <ColorSwatch name="Warning 400" cssVar="--warning-400" hex="#FFB100" description="رنگ اصلی هشدار، ستاره‌های امتیاز و بج‌های انتظار" />
        <ColorSwatch name="Warning 100" cssVar="--warning-100" hex="#FF6D00" description="متن وضعیت‌های نیمه‌کاره و نیازمند اقدام" />
        <ColorSwatch name="Warning 950" cssVar="--warning-950" hex="#FFF8E1" description="پس‌زمینه وضعیت «نیمه‌کاره» و پیام‌های موقت" isDarkText />
      </div>
    </div>
  ),
};

export const NeutralPalette: StoryObj = {
  name: "رنگ‌های خنثی و خاکستری (Neutral & Grays)",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#1a1a1a]">طیف خاکستری، سطوح و متون (Neutrals)</h2>
        <p className="mt-1 text-sm text-[#666666]">
          رنگ‌های مورد استفاده در متون، خطوط جداکننده، کادرهای ورودی و پس‌زمینه‌های شِل برنامه.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ColorSwatch name="Neutral 100" cssVar="--netural-100" hex="#1A1A1A" description="رنگ اصلی متون و عناوین صفحات" />
        <ColorSwatch name="Neutral 300" cssVar="--netural-300" hex="#4D4D4D" description="متون پاراگراف‌ها، توضیحات و آیکون‌های تیره" />
        <ColorSwatch name="Neutral 500" cssVar="--netural-500" hex="#808080" description="متون فرعی، برچسب‌های متادیتا و متون راهنما" />
        <ColorSwatch name="Neutral 700" cssVar="--netural-700" hex="#B3B3B3" description="آیکون‌های غیرفعال و پلیس‌هولدرها" isDarkText />
        <ColorSwatch name="Neutral 800" cssVar="--netural-800" hex="#CCCCCC" description="خطوط حاشیه، بردر کادرها و جداکننده‌ها" isDarkText />
        <ColorSwatch name="Neutral 900" cssVar="--netural-900" hex="#E5E5E5" description="پس‌زمینه‌های خاکستری روشن و خطوط بسیار ملایم" isDarkText />
        <ColorSwatch name="Neutral 950" cssVar="--netural-950" hex="#F2F2F2" description="پس‌زمینه صفحات، فریم اپ و چیپ‌های دیفالت" isDarkText />
        <ColorSwatch name="Surface Low" cssVar="--surface-container-low" hex="#F5F5F5" description="سطح کارت‌ها و پنل‌های جانبی" isDarkText />
        <ColorSwatch name="Surface" cssVar="--surface" hex="#FAFAFA" description="سطح عمومی فرم‌ها و کانتینرها" isDarkText />
        <ColorSwatch name="Surface Lowest" cssVar="--surface-container-lowest" hex="#FFFFFF" description="رنگ سفید خالص کارت‌ها و پس‌زمینه محتوا" isDarkText />
      </div>
    </div>
  ),
};
