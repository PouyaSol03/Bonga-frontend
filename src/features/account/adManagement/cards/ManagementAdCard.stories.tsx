import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementAdCard } from "./ManagementAdCard";
import type { AdCardData } from "../../../advertisements/components/AdCard";

const sampleAd: AdCardData = {
  id: "ad-110",
  title: "آپارتمان ۱۱۰ متری شمال تک واحدی نوساز کلید نخورده",
  agency: "املاک سامان",
  status: "منتشر شده",
  imageCount: "۴",
  priceLabelPrimary: "قیمت کل",
  pricePrimary: "۱۵,۰۰۰,۰۰۰,۰۰۰ تومان",
  priceLabelSecondary: "",
  priceSecondary: "",
  timeAndLocation: "۲ ساعت پیش در سعادت‌آباد",
  imageClassName: "",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  badges: [],
};

const meta: Meta<typeof ManagementAdCard> = {
  title: "Features/Account/ManagementAdCard",
  component: ManagementAdCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    viewport: { defaultViewport: "mobile500" },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-[#F7F7F7] p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ManagementAdCard>;

// 1. Role: Agency (مدیر آژانس)
export const AgencyRole: Story = {
  args: {
    ad: sampleAd,
    roleType: "agency",
    publisherName: "املاک سامان",
    roleLabel: "آژانس",
    statusKey: "published",
    statusLabel: "منتشر شده",
    metrics: { views: 1856, impressions: 265, calls: 5, chats: 6 },
  },
};

// 2. Role: Independent Agent (مشاور مستقل)
export const IndependentAgentRole: Story = {
  args: {
    ad: sampleAd,
    roleType: "agent",
    publisherName: "علی رضایی",
    roleLabel: "مشاور مستقل",
    statusKey: "published",
    statusLabel: "منتشر شده",
    metrics: { views: 1856, impressions: 265, calls: 5, chats: 6 },
  },
};

// 3. Role: Agent in Agency (مشاور در آژانس - matching SVG)
export const AgentInAgencyRole: Story = {
  args: {
    ad: sampleAd,
    roleType: "agent_in_agency",
    publisherName: "ناصر اشرفی",
    roleLabel: "مشاور",
    statusKey: "published",
    statusLabel: "منتشر شده",
    metrics: { views: 1856, impressions: 265, calls: 5, chats: 6 },
  },
};

// 4. Status: Pending Approval (در انتظار تایید انتشار)
export const StatusPending: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "pending",
    statusLabel: "در انتظار تایید انتشار",
  },
};

// 5. Status: Expired (منقضی شده)
export const StatusExpired: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "expired",
    statusLabel: "منقضی شده",
  },
};

// 6. Status: Deleted (حذف شده)
export const StatusDeleted: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "deleted",
    statusLabel: "حذف شده",
  },
};

// 7. Status: Successful Deal (معامله موفق)
export const StatusDealSuccess: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "deal_success",
    statusLabel: "معامله موفق",
  },
};

// 8. Status: Unsuccessful Deal (معامله ناموفق)
export const StatusDealUnsuccessful: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "deal_unsuccessful",
    statusLabel: "معامله ناموفق",
  },
};

// 9. Status: Needs Edit (نیازمند ویرایش)
export const StatusNeedsEdit: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "needs_edit",
    statusLabel: "نیازمند ویرایش",
  },
};

// 10. Status: Waiting for Payment (در انتظار پرداخت)
export const StatusWaitForPayment: Story = {
  args: {
    ...AgentInAgencyRole.args,
    statusKey: "wait_for_payment",
    statusLabel: "در انتظار پرداخت",
  },
};

// 11. Full List Overview matching SVG mockup (Management Ad - Active (1).svg)
export const SvgMockupListOverview: Story = {
  render: () => {
    const cards = [
      { key: "pending", label: "در انتظار تایید انتشار", role: "agent_in_agency", name: "ناصر اشرفی" },
      { key: "published", label: "منتشر شده", role: "agency", name: "املاک سامان" },
      { key: "expired", label: "منقضی شده", role: "agent", name: "علی رضایی" },
      { key: "deleted", label: "حذف شده", role: "agent_in_agency", name: "ناصر اشرفی" },
      { key: "deal_success", label: "معامله موفق", role: "agency", name: "املاک سامان" },
      { key: "deal_unsuccessful", label: "معامله ناموفق", role: "agent", name: "علی رضایی" },
      { key: "needs_edit", label: "نیازمند ویرایش", role: "agent_in_agency", name: "ناصر اشرفی" },
    ] as const;

    return (
      <div className="flex flex-col gap-3 py-2">
        {cards.map((item, idx) => (
          <ManagementAdCard
            ad={{ ...sampleAd, id: `mock-${idx}` }}
            key={idx}
            metrics={{ views: 1856, impressions: 265, calls: 5, chats: 6 }}
            publisherName={item.name}
            roleType={item.role}
            statusKey={item.key}
            statusLabel={item.label}
          />
        ))}
      </div>
    );
  },
};
