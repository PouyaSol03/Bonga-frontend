import type { Meta, StoryObj } from "@storybook/react";
import { AgencyDashboardView } from "./AgencyDashboardView";
import { AgencyTasksCard } from "./components/AgencyTasksCard";
import { AgencyQuickAccessGrid } from "./components/AgencyQuickAccessGrid";
import { AgencyBadgeBanner } from "./components/AgencyBadgeBanner";
import { AgencyCreditsCard } from "./components/AgencyCreditsCard";
import { AgencyUrgentActionsCard } from "./components/AgencyUrgentActionsCard";
import { AgencyNotificationsCard } from "./components/AgencyNotificationsCard";
import { AgencyReportsTeaserCard } from "./components/AgencyReportsTeaserCard";
import { AgencyRecentAdsCard } from "./components/AgencyRecentAdsCard";

const meta: Meta<typeof AgencyDashboardView> = {
  title: "Dashboard/Agency/AgencyDashboardView",
  component: AgencyDashboardView,
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
type Story = StoryObj<typeof AgencyDashboardView>;

export const Default: Story = {
  args: {
    onViewReports: () => alert("Navigate to reports"),
    onNotificationsClick: () => alert("Notifications clicked"),
  },
};

export const SectionTasks: StoryObj = {
  render: () => <AgencyTasksCard />,
};

export const SectionQuickAccess: StoryObj = {
  render: () => <AgencyQuickAccessGrid />,
};

export const SectionBadgeBanner: StoryObj = {
  render: () => <AgencyBadgeBanner />,
};

export const SectionCredits: StoryObj = {
  render: () => <AgencyCreditsCard />,
};

export const SectionUrgentActions: StoryObj = {
  render: () => <AgencyUrgentActionsCard />,
};

export const SectionNotifications: StoryObj = {
  render: () => <AgencyNotificationsCard />,
};

export const SectionReportsTeaser: StoryObj = {
  render: () => (
    <AgencyReportsTeaserCard onViewReports={() => alert("Open reports")} />
  ),
};

export const SectionRecentAds: StoryObj = {
  render: () => <AgencyRecentAdsCard />,
};
