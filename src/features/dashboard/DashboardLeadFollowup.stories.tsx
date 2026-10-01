import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DashboardLeadFollowupPage,
  type LeadFollowupItem,
} from "./DashboardLeadFollowupPage";
import { DashboardLeadFollowupCard } from "./components/DashboardLeadFollowupCard";

const sampleLeadItem: LeadFollowupItem = {
  id: "lead-1",
  title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
  consultantName: "ناصر اشرفی",
  roleTitle: "مشاور",
  followupCount: 5,
  visitCount: 2,
  imageUrl: "/figma/dashboard/lead-apartment.jpg",
  adId: "1",
};

const sampleLeadList: LeadFollowupItem[] = [
  sampleLeadItem,
  {
    id: "lead-2",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
    consultantName: "ناصر اشرفی",
    roleTitle: "مشاور",
    followupCount: 5,
    visitCount: 2,
    imageUrl: "/figma/dashboard/lead-apartment.jpg",
    adId: "2",
  },
  {
    id: "lead-3",
    title: "آپارتمان ۱۱۰متری شمال تک واحدی سنددار",
    consultantName: "ناصر اشرفی",
    roleTitle: "مشاور",
    followupCount: 5,
    visitCount: 2,
    imageUrl: "/figma/dashboard/lead-apartment.jpg",
    adId: "3",
  },
];

const meta: Meta<typeof DashboardLeadFollowupPage> = {
  title: "Features/Dashboard/LeadFollowup",
  component: DashboardLeadFollowupPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLeadFollowupPage>;

export const PageWithData: Story = {
  name: "صفحه پیگیری سرنخ (با داده نمونه)",
  args: {
    items: sampleLeadList,
  },
};

export const PageEmptyState: Story = {
  name: "صفحه پیگیری سرنخ (بدون داده / Empty State)",
  args: {
    items: [],
  },
};

export const SingleCard: StoryObj<typeof DashboardLeadFollowupCard> = {
  name: "کارت تک پیگیری سرنخ (مطابق فیگما)",
  render: () => (
    <div className="p-4 bg-[#F0F0F0] max-w-[400px] mx-auto">
      <DashboardLeadFollowupCard item={sampleLeadItem} />
    </div>
  ),
};
