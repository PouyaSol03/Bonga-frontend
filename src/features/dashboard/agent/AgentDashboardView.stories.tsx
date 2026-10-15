import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentDashboardView } from "./AgentDashboardView";
import { AgentTasksCard } from "./components/AgentTasksCard";
import { AgentQuickAccessGrid } from "./components/AgentQuickAccessGrid";
import { AgentCreditsCard } from "./components/AgentCreditsCard";
import { AgentUrgentActionsCard } from "./components/AgentUrgentActionsCard";
import { AgentNotificationsCard } from "./components/AgentNotificationsCard";

const meta: Meta<typeof AgentDashboardView> = {
  title: "Dashboard/Agent/AgentDashboardView",
  component: AgentDashboardView,
  decorators: [
    (Story) => (
      <div className="mx-auto min-h-screen max-w-[400px] bg-[#F0F0F0]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AgentDashboardView>;

export const AgentInAgency: Story = {
  args: {
    role: "REAL_ESTATE_CONSULTANT",
    onViewReports: () => alert("مشاهده گزارش‌ها کلیک شد"),
  },
};

export const IndependentAgent: Story = {
  args: {
    role: "INDEPENDENT_CONSULTANT",
    onViewReports: () => alert("مشاهده گزارش‌ها کلیک شد"),
  },
};

export const TasksCardSection: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4 bg-[#F0F0F0] p-4">
      <AgentTasksCard role="REAL_ESTATE_CONSULTANT" />
      <AgentTasksCard role="INDEPENDENT_CONSULTANT" />
    </div>
  ),
};

export const QuickAccessSection: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4 bg-[#F0F0F0] p-4">
      <AgentQuickAccessGrid role="REAL_ESTATE_CONSULTANT" />
      <AgentQuickAccessGrid role="INDEPENDENT_CONSULTANT" />
    </div>
  ),
};

export const CreditsCardSection: StoryObj = {
  render: () => (
    <div className="bg-[#F0F0F0] p-4">
      <AgentCreditsCard />
    </div>
  ),
};

export const UrgentActionsSection: StoryObj = {
  render: () => (
    <div className="bg-[#F0F0F0] p-4">
      <AgentUrgentActionsCard />
    </div>
  ),
};

export const NotificationsSection: StoryObj = {
  render: () => (
    <div className="bg-[#F0F0F0] p-4">
      <AgentNotificationsCard />
    </div>
  ),
};
