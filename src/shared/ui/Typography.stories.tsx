import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
  title: "Shared UI/Typography",
  component: Typography,
  tags: ["autodocs"],
  args: {
    children: "بنگاه: سامانه جامع خرید، فروش و رهن و اجاره املاک",
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const DisplayVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="display" size="large">
        نمایش بزرگ (Display Large)
      </Typography>
      <Typography variant="display" size="medium">
        نمایش متوسط (Display Medium)
      </Typography>
      <Typography variant="display" size="small">
        نمایش کوچک (Display Small)
      </Typography>
    </div>
  ),
};

export const HeadlineVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="headline" size="large">
        سرتیتر بزرگ (Headline Large)
      </Typography>
      <Typography variant="headline" size="medium">
        سرتیتر متوسط (Headline Medium)
      </Typography>
      <Typography variant="headline" size="small">
        سرتیتر کوچک (Headline Small)
      </Typography>
    </div>
  ),
};

export const TitleVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="title" size="large" weight="semibold">
        عنوان بزرگ نیمه‌پررنگ (Title Large Semibold)
      </Typography>
      <Typography variant="title" size="medium" weight="medium">
        عنوان متوسط متوسط (Title Medium Medium)
      </Typography>
      <Typography variant="title" size="small">
        عنوان کوچک (Title Small)
      </Typography>
    </div>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="body" size="large" weight="medium">
        متن اصلی بزرگ (Body Large Medium) - برای پاراگراف‌های مهم و توضیحات اصلی
      </Typography>
      <Typography variant="body" size="medium" weight="regular">
        متن اصلی متوسط (Body Medium Regular) - استاندارد خوانش متن‌ها در صفحات
      </Typography>
      <Typography variant="body" size="small" weight="regular">
        متن اصلی کوچک (Body Small Regular) - برای توضیحات فرعی و متادیتا
      </Typography>
    </div>
  ),
};

export const LabelVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="label" size="large" weight="semibold">
        برچسب بزرگ (Label Large)
      </Typography>
      <Typography variant="label" size="medium" weight="medium">
        برچسب متوسط (Label Medium)
      </Typography>
      <Typography variant="label" size="small">
        برچسب کوچک (Label Small)
      </Typography>
    </div>
  ),
};
