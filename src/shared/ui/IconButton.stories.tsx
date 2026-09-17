import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton";
import LinearArrowRight2 from "../icons/LinearArrowRight2";
import LinearShare from "../icons/LinearShare";
import LinearBookmarkSolid from "../icons/LinearBookmarkSolid";
import LinearNotification from "../icons/LinearNotification";
import LinearCancelCircle from "../icons/LinearCancelCircle";
import LinearCall from "../icons/LinearCall";

const meta: Meta<typeof IconButton> = {
  title: "Shared UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "دکمه آیکونی (IconButton) با ابعاد استاندارد ۴۸ و ۴۰ پیکسل و انیمیشن لمسی فشردگی نرم (`active:scale-[0.93]`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "outlined", "tonal"],
    },
    size: {
      control: "select",
      options: ["dense", "default"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    "aria-label": "دکمه آیکون",
    variant: "standard",
    size: "default",
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const AllVariants: Story = {
  name: "تمام واریانت‌های دکمه آیکونی",
  render: () => (
    <div className="flex flex-wrap items-center gap-6 p-4 bg-surface-container-lowest rounded-xl border border-outline-var">
      <div className="flex flex-col items-center gap-2">
        <IconButton aria-label="اشتراک‌گذاری" variant="filled">
          <LinearShare className="h-6 w-6" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Filled (آبی پررنگ)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <IconButton aria-label="نشان کردن" variant="tonal">
          <LinearBookmarkSolid className="h-6 w-6" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Tonal (تونال ملایم)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <IconButton aria-label="تماس" variant="outlined">
          <LinearCall className="h-6 w-6" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Outlined (حاشیه‌دار)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <IconButton aria-label="بازگشت" variant="standard">
          <LinearArrowRight2 className="h-6 w-6" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Standard (شفاف)</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: "مقایسه اندازه‌ها (Default 48px vs Dense 40px)",
  render: () => (
    <div className="flex items-center gap-6 p-4 bg-surface-container-lowest rounded-xl border border-outline-var">
      <div className="flex items-center gap-2">
        <IconButton aria-label="نوتیفیکیشن" size="default" variant="tonal">
          <LinearNotification className="h-6 w-6" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Default (48px)</span>
      </div>

      <div className="flex items-center gap-2">
        <IconButton aria-label="حذف" size="dense" variant="tonal">
          <LinearCancelCircle className="h-5 w-5" />
        </IconButton>
        <span className="text-xs text-on-surface-var">Dense (40px)</span>
      </div>
    </div>
  ),
};
