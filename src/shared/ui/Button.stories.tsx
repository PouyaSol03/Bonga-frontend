import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import LinearArrowLeft1 from "../icons/LinearArrowLeft1";
import LinearCancelCircle from "../icons/LinearCancelCircle";
import LinearEdit from "../icons/LinearEdit";

const meta: Meta<typeof Button> = {
  title: "Shared UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "کامپوننت رسمی دکمه (Button) با انیمیشن فشردگی لمسی الاستیک (`active:scale-[0.97]`)، ۸ واریانت رنگی منطبق با دیزاین سیستم نشونو، سه سایز استاندارد و پشتیبانی کامل از لودینگ و آیکون.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "neutral",
        "neutral-outline",
        "neutral-text",
        "text",
        "danger",
      ],
      description: "نوع بصری دکمه بر اساس نقش عملکردی",
    },
    size: {
      control: "select",
      options: ["small", "x-medium", "medium"],
      description: "اندازه دکمه (Small: 28px, X-Medium: 40px, Medium: 56px)",
    },
    radius: {
      control: "select",
      options: ["small", "medium", "x-medium"],
      description: "شعاع گوشه دکمه",
    },
    disabled: { control: "boolean", description: "غیرفعال‌سازی دکمه" },
    loading: { control: "boolean", description: "نمایش اسپینر لودینگ" },
    fullWidth: { control: "boolean", description: "اشغال ۱۰۰٪ عرض والد" },
  },
  args: {
    children: "ثبت آگهی رایگان",
    variant: "primary",
    size: "medium",
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const InteractivePlayground: Story = {
  name: "محیط تعاملی (Playground)",
  args: {
    children: "دکمه تعاملی",
    variant: "primary",
    size: "medium",
  },
};

export const AllVariantsShowcase: Story = {
  name: "تمام ۸ واریانت دکمه",
  render: () => (
    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-4">
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Primary (اصلی برند)</span>
        <Button variant="primary">ثبت و ادامه</Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Secondary (حاشیه‌دار آبی)</span>
        <Button variant="secondary">انصراف و بازگشت</Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Danger (حذف و اقدام خطرناک)</span>
        <Button variant="danger" leadingIcon={<LinearCancelCircle className="h-5 w-5" />}>
          حذف آگهی
        </Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">
          Neutral Outline (حاشیه خاکستری)
        </span>
        <Button variant="neutral-outline" leadingIcon={<LinearEdit className="h-5 w-5" />}>
          ویرایش مشخصات
        </Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Neutral (پس‌زمینه خنثی)</span>
        <Button variant="neutral">ذخیره موقت</Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Ghost (شیشه‌ای آبی)</span>
        <Button variant="ghost">مشاهده جزئیات</Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Neutral Text (متن خاکستری)</span>
        <Button variant="neutral-text">رد کردن این مرحله</Button>
      </div>
      <div className="border-outline-var bg-surface-container-lowest flex flex-col gap-2 rounded-xl border p-4">
        <span className="text-on-surface-var text-xs font-bold">Text (متن آبی خالص)</span>
        <Button variant="text">قوانین و مقررات</Button>
      </div>
    </div>
  ),
};

export const SizesComparison: Story = {
  name: "مقایسه اندازه‌ها (Sizes)",
  render: () => (
    <div className="bg-surface-container-lowest border-outline-var flex flex-col gap-6 rounded-xl border p-4">
      <div className="border-outline-var flex items-center justify-between gap-4 border-b pb-4">
        <div className="text-on-surface text-sm font-bold">
          Medium (56px) - دکمه‌های اقدام اصلی صفحات و فرم‌های ثبت
        </div>
        <Button size="medium" variant="primary">
          تایید و پرداخت
        </Button>
      </div>
      <div className="border-outline-var flex items-center justify-between gap-4 border-b pb-4">
        <div className="text-on-surface text-sm font-bold">
          X-Medium (40px) - دکمه‌های کارت‌ها، اکشن‌بارها و مودال‌ها
        </div>
        <Button size="x-medium" variant="primary">
          ارسال پیام
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-on-surface text-sm font-bold">
          Small (28px) - دکمه‌های فشرده درون جدولی و بج‌های قابل اقدام
        </div>
        <Button size="small" variant="primary">
          تمدید
        </Button>
      </div>
    </div>
  ),
};

export const TactileFeedbackDemo: Story = {
  name: "دموی انیمیشن فشردگی لمسی (Tactile Tap Scale)",
  render: () => (
    <div className="bg-surface-container-lowest border-outline-var flex flex-col gap-4 rounded-xl border p-6 text-center">
      <h3 className="text-on-surface text-base font-bold">
        بر روی دکمه‌های زیر کلیک کنید یا نگه دارید:
      </h3>
      <p className="text-on-surface-var text-sm">
        انیمیشن انقباض لمسی نرم (`active:scale-[0.97]`) با نرخ پاسخ‌دهی ۷۵ میلی‌ثانیه فیدبک طبیعی
        ایجاد می‌کند.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Button variant="primary" size="medium">
          کلیک برای تست فیدبک
        </Button>
        <Button variant="secondary" size="medium">
          دکمه ثانویه تعاملی
        </Button>
        <Button variant="danger" size="medium">
          دکمه هشدار تعاملی
        </Button>
      </div>
    </div>
  ),
};

export const LoadingAndDisabledStates: Story = {
  name: "حالت‌های لودینگ و غیرفعال",
  render: () => (
    <div className="bg-surface-container-lowest border-outline-var flex flex-wrap gap-4 rounded-xl border p-4">
      <Button loading variant="primary">
        در حال ارسال اطلاعات...
      </Button>
      <Button loading variant="secondary">
        در حال پردازش
      </Button>
      <Button disabled variant="primary">
        غیرفعال (Disabled)
      </Button>
      <Button disabled variant="neutral-outline">
        ویرایش غیرفعال
      </Button>
    </div>
  ),
};

export const DialogActionPair: Story = {
  name: "جفت دکمه‌های تایید و انصراف مودال",
  render: () => (
    <div className="bg-surface-container-lowest border-outline-var flex max-w-md items-center gap-3 rounded-xl border p-4">
      <Button fullWidth variant="primary" trailingIcon={<LinearArrowLeft1 className="h-5 w-5" />}>
        تایید و ادامه
      </Button>
      <Button fullWidth variant="neutral-outline">
        انصراف
      </Button>
    </div>
  ),
};
