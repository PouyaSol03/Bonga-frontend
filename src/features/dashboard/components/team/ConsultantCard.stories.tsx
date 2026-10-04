import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ConsultantCard,
  type TeamConsultant,
} from "./ConsultantManagementPage";

const sampleConsultant: TeamConsultant = {
  id: 14,
  agentId: 14,
  name: "حسین رفیعی",
  roleLabel: "مشاور",
  phone: "09156984578",
  status: "active",
  avatarSrc: "/figma/dashboard/consultant-avatar.jpg",
  scores: {
    ads: 12,
    steps: 5,
    rocket: 2,
  },
};

const samplePendingConsultant: TeamConsultant = {
  id: 15,
  agentId: 15,
  name: "رضا محمدی",
  roleLabel: "مشاور",
  phone: "09123456789",
  status: "pending",
  scores: {
    ads: 0,
    steps: 0,
    rocket: 0,
  },
};

const meta: Meta<typeof ConsultantCard> = {
  title: "Features/Dashboard/Team/ConsultantCard",
  component: ConsultantCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ConsultantCard>;

export const ActiveConsultant: Story = {
  name: "کارت مشاور فعال (مطابق طرح SVG فیگما)",
  render: () => (
    <div className="w-[360px] bg-surface-container p-4">
      <ConsultantCard consultant={sampleConsultant} />
    </div>
  ),
};

export const PendingConsultant: Story = {
  name: "کارت مشاور در انتظار تایید",
  render: () => (
    <div className="w-[360px] bg-surface-container p-4">
      <ConsultantCard consultant={samplePendingConsultant} />
    </div>
  ),
};

export const ConsultantsList: Story = {
  name: "لیست کارت‌های مشاورین",
  render: () => (
    <div className="w-[360px] space-y-1 bg-surface-container p-4">
      <ConsultantCard consultant={sampleConsultant} />
      <ConsultantCard
        consultant={{
          ...sampleConsultant,
          id: 16,
          name: "علی رضایی",
          phone: "09351234567",
          avatarSrc: undefined,
        }}
      />
    </div>
  ),
};
