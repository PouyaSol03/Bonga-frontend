import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TextField } from "./TextField";
import LinearCall from "../icons/LinearCall";
import LinearLocation from "../icons/LinearLocation";

const meta: Meta<typeof TextField> = {
  title: "Shared UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "فیلد ورودی متن (TextField) دیزاین سیستم بنگاه با پشتیبانی از لیبل شناور (Floating Label)، فرمت‌بندی خودکار ارقام، نشان واحد پولی (تومان/مترمربع)، پاک‌کننده سریع متن، وضعیت خطا و متن راهنما.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "عنوان شناور فیلد" },
    placeholder: { control: "text", description: "متن راهنمای درون کادر" },
    badge: { control: "text", description: "برچسب واحد (تومان، متر و ...)" },
    error: { control: "text", description: "متن خطای اعتبارسنجی فیلد" },
    supportingText: { control: "text", description: "توضیحات راهنما زیر فیلد" },
    formatNumber: { control: "boolean", description: "فرمت‌دهی سه‌رقم‌سه‌رقم اعداد" },
    disabled: { control: "boolean", description: "غیرفعال‌سازی ورودی" },
  },
  args: {
    label: "شماره موبایل",
    placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const InteractivePlayground: Story = {
  name: "محیط تعاملی فیلد",
  args: {
    label: "عنوان آگهی",
    placeholder: "مثال: آپارتمان نوساز ۱۴۰ متری در نیاوران",
    supportingText: "عنوان آگهی باید کوتاه و رسا باشد.",
  },
};

export const PriceInputWithBadge: Story = {
  name: "ورودی قیمت با فرمت خودکار و نشان تومان",
  render: function Render() {
    const [price, setPrice] = useState("18500000000");
    return (
      <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5]">
        <TextField
          badge="تومان"
          formatNumber
          label="قیمت کل فروش"
          onChange={(e) => setPrice(e.target.value)}
          onClear={() => setPrice("")}
          supportingText="مبلغ را به تومان وارد کنید (اعداد به طور خودکار سه‌رقم جدا می‌شوند)."
          value={price}
        />
      </div>
    );
  },
};

export const ValidationErrorState: Story = {
  name: "وضعیت خطا و پیام نامعتبر",
  render: () => (
    <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5] space-y-4">
      <TextField
        defaultValue="0935"
        error="شماره موبایل باید ۱۱ رقم باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)"
        label="شماره موبایل مالک"
      />
      <TextField
        defaultValue="-50"
        error="متراژ نمی‌تواند مقدار منفی باشد"
        label="متراژ مفید"
        badge="متر مربع"
      />
    </div>
  ),
};

export const WithIconsAndSlots: Story = {
  name: "ورودی همراه با آیکون‌های ابتدا و انتها",
  render: () => (
    <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5] space-y-4">
      <TextField
        label="شماره تماس جهت هماهنگی"
        leadingSlot={<LinearCall className="h-5 w-5 text-[#808080]" />}
        placeholder="۰۹۱۲..."
      />
      <TextField
        label="محله یا منطقه"
        leadingSlot={<LinearLocation className="h-5 w-5 text-[#808080]" />}
        placeholder="مثال: سعادت‌آباد، شهرک غرب..."
      />
    </div>
  ),
};

export const DisabledAndReadonly: Story = {
  name: "ورودی غیرفعال (Disabled)",
  render: () => (
    <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5]">
      <TextField
        defaultValue="علی رضایی (غیرقابل تغییر)"
        disabled
        label="مالک سیم‌کارت"
        supportingText="برای تغییر مالکیت، از بخش تنظیمات حساب اقدام کنید."
      />
    </div>
  ),
};
