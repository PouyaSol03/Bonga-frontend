import type { Meta, StoryObj } from "@storybook/react";
import { AgentDashboardReportsView } from "./AgentDashboardReportsView";
import { AgentPublishedAdsPieCard } from "./reports/AgentPublishedAdsPieCard";
import { AgentViewsBarChartCard } from "./reports/AgentViewsBarChartCard";
import { AgentRegistrationProgressLineCard } from "./reports/AgentRegistrationProgressLineCard";
import { AgentConversionFunnelCard } from "./reports/AgentConversionFunnelCard";
import { AgentRankScoreCard } from "./reports/AgentRankScoreCard";

const meta: Meta<typeof AgentDashboardReportsView> = {
  title: "Dashboard/Agent/AgentDashboardReportsView",
  component: AgentDashboardReportsView,
  decorators: [
    (Story) => (
      <div className="max-w-[400px] mx-auto min-h-screen bg-[#F0F0F0]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AgentDashboardReportsView>;

export const Default: Story = {
  args: {
    onBack: () => alert("بازگشت کلیک شد"),
  },
};

export const PublishedAdsPieSection: StoryObj = {
  render: () => (
    <div className="p-4 bg-[#F0F0F0]">
      <AgentPublishedAdsPieCard />
    </div>
  ),
};

export const ViewsBarChartSection: StoryObj = {
  render: () => (
    <div className="p-4 bg-[#F0F0F0]">
      <AgentViewsBarChartCard />
    </div>
  ),
};

export const RegistrationProgressLineSection: StoryObj = {
  render: () => (
    <div className="p-4 bg-[#F0F0F0]">
      <AgentRegistrationProgressLineCard />
    </div>
  ),
};

export const ConversionFunnelSection: StoryObj = {
  render: () => (
    <div className="p-4 bg-[#F0F0F0]">
      <AgentConversionFunnelCard />
    </div>
  ),
};

export const RankScoreSection: StoryObj = {
  render: () => (
    <div className="p-4 bg-[#F0F0F0]">
      <AgentRankScoreCard />
    </div>
  ),
};
