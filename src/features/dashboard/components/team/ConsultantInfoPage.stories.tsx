import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConsultantInfoPage } from "./ConsultantInfoPage";

const sampleConsultant = {
  id: 14,
  agentId: 14,
  name: "حسین رفیعی",
  roleLabel: "مشاور",
  phone: "09156984578",
  status: "active" as const,
  isActive: true,
  levelSlug: "selected_agent",
  avatarSrc: "/vectors/agentLevel/selected_agent.png",
  rankingScore: 85,
  adQuota: 34,
  renewQuota: 21,
  specialQuota: 11,
  scores: {
    ads: 51,
    steps: 21,
    rocket: 11,
  },
};

const meta: Meta<typeof ConsultantInfoPage> = {
  title: "Features/Dashboard/Team/ConsultantInfoPage",
  component: ConsultantInfoPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ConsultantInfoPage>;

export const DefaultInfoPage: Story = {
  name: "صفحه اطلاعات مشاور (مطابق طرح SVG فیگما)",
  render: () => (
    <div className="min-h-screen bg-surface-container py-4">
      <ConsultantInfoPage consultantOverride={sampleConsultant} />
    </div>
  ),
};
