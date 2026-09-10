import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdCard, type AdCardData } from "./AdCard";

const sampleAd: AdCardData = {
  id: "ad-101",
  title: "آپارتمان ۱۴۰ متری نوساز سه خوابه فرمانیه",
  agency: "املاک بزرگ نیاوران",
  status: "تایید شده",
  statusBadgeClassName: "bg-[#e6f6ed] text-[#11a366]",
  imageCount: "۵",
  priceLabelPrimary: "قیمت کل",
  pricePrimary: "۲۱,۰۰۰,۰۰۰,۰۰۰ تومان",
  priceLabelSecondary: "قیمت هر متر",
  priceSecondary: "۱۵۰,۰۰۰,۰۰۰ تومان",
  area: "۱۴۰",
  rooms: "۳ خواب",
  year: "۱۴۰۲",
  timeAndLocation: "۲ ساعت پیش در نیاوران",
  imageClassName: "",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80",
  badges: ["فوری", "ویژه"],
};

const meta: Meta<typeof AdCard> = {
  title: "Features/Advertisements/AdCard",
  component: AdCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "کارت آگهی ملک (AdCard) در لیست‌های جستجو، داشبورد مشاورین و صفحه آگهی‌های من، شامل تصویر، نشان‌های وضعیت، متراژ، خواب، سال ساخت و قیمت‌ها.",
      },
    },
  },
  args: {
    ad: sampleAd,
  },
};

export default meta;
type Story = StoryObj<typeof AdCard>;

export const StandardSearchCard: Story = {
  name: "کارت استاندارد در نتایج جستجو",
  args: {
    ad: sampleAd,
    variant: "standard",
    showBadges: true,
    showAgency: true,
  },
};

export const IncompleteUserAd: Story = {
  name: "آگهی نیمه‌کاره کاربر عادی (Incomplete Status)",
  args: {
    ad: {
      ...sampleAd,
      title: "ویلای دوبلکس ۳۵۰ متری لواسان",
      status: "نیمه کاره",
      statusBadgeClassName: "bg-[#fff8e1] text-[#b25e00]",
      badges: [],
      agency: "",
    },
    variant: "dashboard",
    showStatusBadge: true,
    showAgency: false,
  },
};

export const ApprovedAd: Story = {
  name: "آگهی تایید شده و فعال (Approved)",
  args: {
    ad: {
      ...sampleAd,
      status: "تایید شده",
      statusBadgeClassName: "bg-[#e6f6ed] text-[#11a366]",
    },
    variant: "dashboard",
    showStatusBadge: true,
  },
};

export const RejectedAd: Story = {
  name: "آگهی رد شده با کادر خطا (Rejected)",
  args: {
    ad: {
      ...sampleAd,
      title: "زمین کلنگی ۴۰۰ متری تجریش",
      status: "رد شده",
      statusBadgeClassName: "bg-[#ffebed] text-[#c11004]",
      badges: [],
    },
    variant: "dashboard",
    showStatusBadge: true,
  },
};

export const WithoutImage: Story = {
  name: "آگهی بدون تصویر (Fallback Placeholder)",
  args: {
    ad: {
      ...sampleAd,
      imageUrl: undefined,
      badges: [],
    },
    variant: "standard",
  },
};
