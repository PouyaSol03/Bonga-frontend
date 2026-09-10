import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "./TopBar";
import LinearShare from "../icons/LinearShare";
import LinearBookmarkSolid from "../icons/LinearBookmarkSolid";
import LinearNotification from "../icons/LinearNotification";

const meta: Meta<typeof TopBar> = {
  title: "Shared Components/TopBar",
  component: TopBar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "نوار بالای صفحه (TopBar / Navigation Bar) اپلیکیشن بنگاه با پشتیبانی از بازگشت، عناوین، منوی عملیات (Actions) و کادر جستجوی یکپارچه.",
      },
    },
  },
  args: {
    title: "عنوان صفحه",
    onBack: () => alert("کلیک روی دکمه بازگشت"),
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const DefaultPageHeader: Story = {
  name: "هدر استاندارد صفحه داخلی",
  args: {
    title: "آگهی‌های من",
  },
};

export const DetailPageWithActions: Story = {
  name: "هدر جزئیات آگهی با عملیات اشتراک و نشان",
  args: {
    title: "آپارتمان ۱۴۰ متری نیاوران",
    actions: [
      {
        id: "share",
        label: "اشتراک‌گذاری",
        icon: <LinearShare className="h-5 w-5" />,
        onClick: () => alert("اشتراک‌گذاری آگهی"),
      },
      {
        id: "bookmark",
        label: "نشان کردن",
        icon: <LinearBookmarkSolid className="h-5 w-5" />,
        onClick: () => alert("نشان کردن آگهی"),
      },
    ],
  },
};

export const SearchHeader: Story = {
  name: "هدر با نوار جستجوی یکپارچه و جستجوهای ذخیره‌شده",
  args: {
    search: {
      label: "جستجو در املاک تهران (خرید، رهن و اجاره)...",
      onClick: () => alert("باز کردن جستجو"),
      savedCount: 4,
      onSavedClick: () => alert("مشاهده ۴ جستجوی ذخیره‌شده"),
    },
  },
};

export const WithStartSlot: Story = {
  name: "هدر با المان سفارشی در سمت چپ (آیکون اعلان)",
  args: {
    title: "داشبورد مشاور",
    startSlot: (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#4d4d4d] hover:bg-[#f0f0f0] transition"
        onClick={() => alert("اعلانات")}
      >
        <LinearNotification className="h-5 w-5" />
      </button>
    ),
  },
};
