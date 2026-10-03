import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DashboardExpiringAdsPage,
  type ExpiringAdItem,
} from "./DashboardExpiringAdsPage";
import { DashboardExpiringAdCard } from "./components/DashboardExpiringAdCard";

const sampleExpiringAd: ExpiringAdItem = {
  id: "expiring-1",
  title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
  agencyOrConsultant: "ناصر اشرفی",
  roleTitle: "مشاور",
  timeRemaining: "۱۲ ساعت و ۳۶ دقیقه",
  imageUrl: "/figma/dashboard/expiring-ad-thumb.jpg",
  adId: "1",
};

const sampleExpiringList: ExpiringAdItem[] = [
  sampleExpiringAd,
  {
    id: "expiring-2",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
    agencyOrConsultant: "آژانس جلیلیان",
    timeRemaining: "۱۲ ساعت و ۳۶ دقیقه",
    imageUrl: "/figma/dashboard/expiring-ad-thumb.jpg",
    adId: "2",
  },
  {
    id: "expiring-3",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
    agencyOrConsultant: "ناصر اشرفی",
    roleTitle: "مشاور",
    timeRemaining: "۱۲ ساعت و ۳۶ دقیقه",
    imageUrl: "/figma/dashboard/expiring-ad-thumb.jpg",
    adId: "3",
  },
];

const meta: Meta<typeof DashboardExpiringAdsPage> = {
  title: "Features/Dashboard/ExpiringAds",
  component: DashboardExpiringAdsPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DashboardExpiringAdsPage>;

export const PageWithData: Story = {
  name: "صفحه آگهی در آستانه انقضا (با داده نمونه)",
  args: {
    ads: sampleExpiringList,
  },
};

export const PageEmptyState: Story = {
  name: "صفحه آگهی در آستانه انقضا (بدون داده / Empty State)",
  args: {
    ads: [],
  },
};

export const SingleCard: StoryObj<typeof DashboardExpiringAdCard> = {
  name: "کارت تک آگهی در آستانه انقضا (مطابق فیگما)",
  render: () => (
    <div className="p-4 bg-[#F0F0F0] max-w-[400px] mx-auto">
      <DashboardExpiringAdCard ad={sampleExpiringAd} />
    </div>
  ),
};
