import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountMyAdStatePage } from "./AccountMyAdStatePage";
import { AgencyStopPublishPage } from "./components/AgencyStopPublishPage";
import { AgencyDealResultPage } from "./components/AgencyDealResultPage";
import { IndependentConsultantAdAllocationReviewPage } from "./adManagement/IndependentConsultantAdAllocationReviewPage";
import { IndependentConsultantAdRejectPage } from "./adManagement/IndependentConsultantAdRejectPage";
import { IndependentConsultantAdPublishedPage } from "./adManagement/IndependentConsultantAdPublishedPage";
import { AdCloseResultPage } from "./adManagement/AdCloseResultPage";
import type { AdCardData } from "../advertisements/components/AdCard";

// Sample ad data matching the exact Figma designs in docs_UI
const figmaDocsAdCard: AdCardData = {
  id: "ad-130",
  title: "۱۳۰متر - دونبش جنوبی - معاوضه با...",
  agency: "آژانس جلیلیان",
  status: "منتشر شده",
  imageCount: "۴",
  priceLabelPrimary: "",
  pricePrimary: "۱۲,۰۰۰,۰۰۰,۰۰۰ تومان",
  priceLabelSecondary: "",
  priceSecondary: "",
  area: "۱۳۰ متر مربع",
  rooms: "۳ خواب",
  year: "۲ سال",
  timeAndLocation: "۳ روز پیش در محله",
  imageClassName: "",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  badges: [],
};

const figmaDocsAdDetail: Record<string, unknown> = {
  id: "ad-130",
  title: "۱۳۰متر - دونبش جنوبی - معاوضه با...",
  category: "فروش مسکونی / فروش آپارتمان",
  category_title: "فروش مسکونی / فروش آپارتمان",
  agency_name: "آژانس جلیلیان",
  assigned_agency_name: "آژانس جلیلیان",
  assigned_agency_id: 101,
  assignment_id: 501,
  is_assigned: true,
  published_time_ago: "۳ روز پیش (۱۴۰۴/۱۱/۰۹)",
  expires_time_ago: "۱۲ روز دیگر (۱۴۰۴/۱۱/۲۱)",
  created_at: "۱۴۰۴/۱۱/۰۹",
};

const meta: Meta<typeof AccountMyAdStatePage> = {
  title: "Features/Account/AccountMyAdStatePage",
  component: AccountMyAdStatePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "صفحه مدیریت وضعیت آگهی من (AccountMyAdStatePage). شامل پیاده‌سازی دقیق تمام صفحات واگذاری آگهی به آژانس (docs_UI) و وضعیت‌های شخصی.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountMyAdStatePage>;

// ============================================================================
// 10 Exact Frames from docs_UI (واگذاری به آژانس - منظر کاربر)
// ============================================================================

export const AgencyDocs_1_Published: Story = {
  name: "واگذاری به آژانس / ۱. منتشر شده",
  args: {
    card: { ...figmaDocsAdCard, status: "منتشر شده" },
    ad: figmaDocsAdDetail,
    status: "published",
    isAssigned: true,
  },
};

export const AgencyDocs_2_StopPublishPage = {
  name: "واگذاری به آژانس / ۲. صفحه درخواست توقف انتشار (صفحه مجزا)",
  render: () => <AgencyStopPublishPage adId="ad-130" returnTo="#" />,
};

export const AgencyDocs_3_WaitForAgency: Story = {
  name: "واگذاری به آژانس / ۳. در انتظار تایید آژانس",
  args: {
    card: { ...figmaDocsAdCard, status: "در انتظار تایید آژانس" },
    ad: figmaDocsAdDetail,
    status: "wait_for_agency",
    isAssigned: true,
  },
};

export const AgencyDocs_4_CancelAssignmentSheet: Story = {
  name: "واگذاری به آژانس / ۴. شیت لغو واگذاری به آژانس (تنها باتم‌شیت)",
  args: {
    card: { ...figmaDocsAdCard, status: "در انتظار تایید آژانس" },
    ad: figmaDocsAdDetail,
    status: "wait_for_agency",
    isAssigned: true,
    initialCancelAssignmentOpen: true,
  },
};

export const AgencyDocs_5_WaitForRepost: Story = {
  name: "واگذاری به آژانس / ۵. در انتظار ثبت مجدد",
  args: {
    card: { ...figmaDocsAdCard, status: "در انتظار ثبت مجدد" },
    ad: figmaDocsAdDetail,
    status: "wait_for_repost",
    isAssigned: true,
  },
};

export const AgencyDocs_6_Archived: Story = {
  name: "واگذاری به آژانس / ۶. بایگانی شده",
  args: {
    card: { ...figmaDocsAdCard, status: "بایگانی شده" },
    ad: figmaDocsAdDetail,
    status: "archived",
    isAssigned: true,
  },
};

export const AgencyDocs_7_DeletedAgencyDeal: Story = {
  name: "واگذاری به آژانس / ۷. حذف شده (آژانس آگهی را حذف کرده)",
  args: {
    card: { ...figmaDocsAdCard, status: "حذف شده" },
    ad: { ...figmaDocsAdDetail, deleted_reason: "agency_deal" },
    status: "wait_for_deal_confirmation",
    isAssigned: true,
    deletedVariant: "deal_confirmation",
  },
};

export const AgencyDocs_8_DealResultPage = {
  name: "واگذاری به آژانس / ۸. صفحه ثبت نتیجه درخواست (صفحه مجزا)",
  render: () => <AgencyDealResultPage adId="ad-130" returnTo="#" />,
};

export const AgencyDocs_9_DeletedRecoveryExpired: Story = {
  name: "واگذاری به آژانس / ۹. حذف شده (انقضای مهلت بازیابی)",
  args: {
    card: { ...figmaDocsAdCard, status: "حذف شده" },
    ad: figmaDocsAdDetail,
    status: "deleted",
    isAssigned: true,
    deletedVariant: "recovery_expired",
  },
};

export const AgencyDocs_10_DeletedUserStopped: Story = {
  name: "واگذاری به آژانس / ۱۰. حذف شده (۲) (توقف انتشار به درخواست کاربر)",
  args: {
    card: { ...figmaDocsAdCard, status: "حذف شده" },
    ad: { ...figmaDocsAdDetail, deleted_reason: "user_stopped" },
    status: "deleted",
    isAssigned: true,
    deletedVariant: "user_stopped",
  },
};

// ============================================================================
// Standard Personal Ad States (ثبت شخصی)
// ============================================================================

export const PersonalPublished: Story = {
  name: "شخصی / منتشر شده",
  args: {
    card: { ...figmaDocsAdCard, status: "منتشر شده" },
    ad: { ...figmaDocsAdDetail, is_assigned: false, assigned_agency_id: null },
    status: "published",
    isAssigned: false,
  },
};

export const PersonalPending: Story = {
  name: "شخصی / در انتظار تأیید انتشار",
  args: {
    card: { ...figmaDocsAdCard, status: "در انتظار تایید انتشار" },
    ad: { ...figmaDocsAdDetail, is_assigned: false, assigned_agency_id: null },
    status: "pending",
    isAssigned: false,
  },
};

export const PersonalWaitForPayment: Story = {
  name: "شخصی / در انتظار پرداخت",
  args: {
    card: { ...figmaDocsAdCard, status: "در انتظار پرداخت" },
    ad: { ...figmaDocsAdDetail, is_assigned: false, assigned_agency_id: null },
    status: "wait_for_payment",
    isAssigned: false,
  },
};

export const PersonalNeedsEdit: Story = {
  name: "شخصی / نیازمند ویرایش",
  args: {
    card: { ...figmaDocsAdCard, status: "نیازمند ویرایش" },
    ad: { ...figmaDocsAdDetail, is_assigned: false, assigned_agency_id: null },
    status: "needs_edit",
    isAssigned: false,
  },
};

// ============================================================================
// Agency Perspective: واگذاری / تخصیص آگهی از منظر آژانس املاک
// ============================================================================

const mockAgencyConsultants = [
  {
    id: "consultant-1",
    name: "علی محمدی (مشاور ارشد)",
    avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "consultant-2",
    name: "سارا احمدی (مشاور منطقه)",
    avatarSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "consultant-3",
    name: "رضا کریمی (مشاور رهن و اجاره)",
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
];

export const AgencyPerspective_1_ReviewDirectAgency = {
  name: "منظر آژانس / ۱. بررسی تخصیص (مدیریت مستقیم آژانس)",
  render: () => (
    <IndependentConsultantAdAllocationReviewPage
      ad={figmaDocsAdCard}
      initialPublisherType="agency"
      mockConsultants={mockAgencyConsultants}
    />
  ),
};

export const AgencyPerspective_2_ReviewAssignedConsultant = {
  name: "منظر آژانس / ۲. بررسی تخصیص (تخصیص به مشاور منتخب)",
  render: () => (
    <IndependentConsultantAdAllocationReviewPage
      ad={figmaDocsAdCard}
      initialPublisherType="consultant"
      initialAssignedConsultant={mockAgencyConsultants[0]}
      mockConsultants={mockAgencyConsultants}
    />
  ),
};

export const AgencyPerspective_3_ConsultantPicker = {
  name: "منظر آژانس / ۳. انتخاب مشاور مسئول (لیست مشاوران)",
  render: () => (
    <IndependentConsultantAdAllocationReviewPage
      ad={figmaDocsAdCard}
      initialPublisherType="consultant"
      initialConsultantPickerOpen={true}
      mockConsultants={mockAgencyConsultants}
    />
  ),
};

export const AgencyPerspective_4_RejectPage = {
  name: "منظر آژانس / ۴. عدم تأیید آگهی (رد تخصیص با دلیل)",
  render: () => (
    <IndependentConsultantAdRejectPage
      ad={figmaDocsAdCard}
      initialReason="عدم توافق با آگهی‌دهنده"
    />
  ),
};

export const AgencyPerspective_5_PublishedManagement = {
  name: "منظر آژانس / ۵. مدیریت آگهی منتشرشده سمت آژانس",
  render: () => (
    <IndependentConsultantAdPublishedPage
      ad={figmaDocsAdCard}
      expirationLabel="۲۱ روز دیگر (۱۴۰۴/۱۲/۰۱)"
    />
  ),
};

export const AgencyPerspective_6_CloseResultPage = {
  name: "منظر آژانس / ۶. ثبت نتیجه معامله و بستن آگهی توسط آژانس",
  render: () => (
    <AdCloseResultPage
      adId="ad-130"
      initialReason="successful"
    />
  ),
};
