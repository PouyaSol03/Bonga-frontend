import type { Meta, StoryObj } from "@storybook/react";
import { AgencyDashboardReportsView } from "./AgencyDashboardReportsView";
import { AgencyPublishedAdsPieCard } from "./reports/AgencyPublishedAdsPieCard";
import { AgencyViewsBarChartCard } from "./reports/AgencyViewsBarChartCard";
import { AgencyConsultantsBarChartCard } from "./reports/AgencyConsultantsBarChartCard";
import { AgencyRegistrationProgressLineCard } from "./reports/AgencyRegistrationProgressLineCard";
import { AgencyConversionFunnelCard } from "./reports/AgencyConversionFunnelCard";
import { AgencyRankScoreCard } from "./reports/AgencyRankScoreCard";

const meta: Meta<typeof AgencyDashboardReportsView> = {
  title: "Dashboard/Agency/AgencyDashboardReportsView",
  component: AgencyDashboardReportsView,
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
type Story = StoryObj<typeof AgencyDashboardReportsView>;

export const Default: Story = {
  args: {
    onBack: () => alert("Back to dashboard"),
  },
};

export const SectionPublishedAdsPie: StoryObj = {
  render: () => <AgencyPublishedAdsPieCard />,
};

export const SectionViewsBarChart: StoryObj = {
  render: () => <AgencyViewsBarChartCard />,
};

export const SectionConsultantsBarChart: StoryObj = {
  render: () => <AgencyConsultantsBarChartCard />,
};

export const SectionRegistrationProgressLine: StoryObj = {
  render: () => <AgencyRegistrationProgressLineCard />,
};

export const SectionConversionFunnel: StoryObj = {
  render: () => <AgencyConversionFunnelCard />,
};

export const SectionRankScore: StoryObj = {
  render: () => <AgencyRankScoreCard />,
};
