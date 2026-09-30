import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  SwipeableNotificationCard,
  NotificationFilterBar,
  NotificationFilterSheet,
  NotificationSettingsSheet,
  NotificationsEmptyState,
  NotificationHeader,
  NotificationActionButton,
  NotificationManagementPage,
  notificationFilterOptions,
  type AgencyConsultantRequestDisplayState,
} from "./NotificationsPage";
import type { NotificationItem, NotificationCategory } from "./api/notification.service";
import { Typography } from "../../shared/ui/Typography";

// ==========================================
// Sample Data Covering All Notification Types & Categories
// ==========================================

const nowIso = new Date().toISOString();
const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgoIso = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

// 1. Advertise Category Notifications (bg-tertiary diamond)
export const sampleAdvertiseUnread: NotificationItem = {
  id: "notif-adv-1",
  category: "advertise",
  title: "آگهی شما منتشر شد",
  description: "آگهی شما با عنوان «آپارتمان ۱۴۰ متری نیاوران» تایید و برای عموم کاربران منتشر شد.",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "advertise",
    advertise_id: 101,
  },
};

export const sampleAdvertiseExpiring: NotificationItem = {
  id: "notif-adv-2",
  category: "advertise",
  title: "اعتبار آگهی درحال اتمام است",
  description: "مهلت نمایش آگهی شما ۲ روز دیگر به پایان می‌رسد. برای تمدید اقدام کنید.",
  created_at: yesterdayIso,
  is_read: true,
  payload: {
    target: "advertise",
    advertise_id: 102,
  },
};

export const sampleAdvertiseIncomplete: NotificationItem = {
  id: "notif-adv-3",
  category: "advertise",
  title: "اطلاعات آگهی ناقص است",
  description: "برای ادامه فرایند انتشار، عکس‌ها یا اطلاعات ثبتی آگهی خود را تکمیل کنید.",
  created_at: twoDaysAgoIso,
  is_read: false,
  payload: {
    target: "advertise",
    advertise_id: 103,
  },
};

// 2. Trades Category Notifications (bg-primary diamond)
export const sampleTradeResultUnread: NotificationItem = {
  id: "notif-trade-1",
  category: "trades",
  title: "نتیجه معامله ثبت شد",
  description: "معامله مربوط به آگهی با موفقیت ثبت شد و مدارک نهایی بارگذاری گردید.",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "trade",
    trade_id: 501,
  },
};

export const sampleTradeApprovalNeeded: NotificationItem = {
  id: "notif-trade-2",
  category: "trades",
  title: "نتیجه معامله نیاز به تایید دارد",
  description: "مشاور کمیسیون و مشخصات قرارداد را ثبت کرده و منتظر تایید مدیریت آژانس است.",
  created_at: yesterdayIso,
  is_read: true,
  payload: {
    target: "trade",
    trade_id: 502,
  },
};

// 3. Requests Category Notifications (bg-warning diamond)
export const sampleRequestInAreaUnread: NotificationItem = {
  id: "notif-req-1",
  category: "requests",
  title: "درخواست جدید در محدوده آژانس",
  description: "یک تقاضای جدید برای «خرید آپارتمان ۱۰۰ متری در فرمانیه» ثبت گردید.",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "request",
    request_id: 301,
  },
};

export const sampleRequestMatchingAd: NotificationItem = {
  id: "notif-req-2",
  category: "requests",
  title: "آگهی جدید برای درخواست شما",
  description: "ملکی متناسب با بودجه و متراژ درخواستی شما در سامانه ثبت شد.",
  created_at: yesterdayIso,
  is_read: true,
  payload: {
    target: "request",
    request_id: 302,
    advertise_id: 104,
  },
};

// 4. Chats Category Notifications (bg-primary diamond)
export const sampleChatMessageUnread: NotificationItem = {
  id: "notif-chat-1",
  category: "chats",
  title: "پیام جدید دریافت کردید",
  description: "کاربر رضا محمدی: «سلام، آیا امکان بازدید حضوری ملک فردا عصر وجود دارد؟»",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "chat",
    chat_thread_id: 201,
    message_id: 901,
  },
};

export const sampleChatClosed: NotificationItem = {
  id: "notif-chat-2",
  category: "chats",
  title: "گفتگو پایان یافت",
  description: "این گفتگو توسط طرف مقابل بسته شد و به بایگانی منتقل گردید.",
  created_at: twoDaysAgoIso,
  is_read: true,
  payload: {
    target: "chat",
    chat_thread_id: 202,
  },
};

// 5. Support Category Notifications (bg-tertiary diamond)
export const sampleSupportReplyUnread: NotificationItem = {
  id: "notif-sup-1",
  category: "support",
  title: "پاسخ جدید دریافت کردید",
  description: "پشتیبانی بونگا به تیکت شما با موضوع «خطا در درگاه پرداخت کیف پول» پاسخ داد.",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "support",
    support_ticket_id: 801,
  },
};

export const sampleSupportClosed: NotificationItem = {
  id: "notif-sup-2",
  category: "support",
  title: "درخواست پشتیبانی بسته شد",
  description: "درخواست پشتیبانی شماره #۸۰۱ با تایید شما با موفقیت حل و بسته شد.",
  created_at: yesterdayIso,
  is_read: true,
  payload: {
    target: "support",
    support_ticket_id: 801,
  },
};

// 6. Systems Category Notifications (bg-outline diamond)
export const sampleSystemUpdateUnread: NotificationItem = {
  id: "notif-sys-1",
  category: "systems",
  title: "کد تخفیف دریافت کردید",
  description: "کد تخفیف ۳۰ درصدی برای خرید پکیج نردبان و فوری به کیف پول شما اضافه شد.",
  created_at: nowIso,
  is_read: false,
  payload: {
    target: "payment",
    payment_id: 401,
  },
};

export const sampleSystemTermsUpdated: NotificationItem = {
  id: "notif-sys-2",
  category: "systems",
  title: "قوانین و شرایط استفاده بروزرسانی شد",
  description: "بخش شرایط تسویه حساب و اعتبارسنجی مشاورین با اصلاحات جدید منتشر گردید.",
  created_at: twoDaysAgoIso,
  is_read: true,
  payload: {},
};

// 7. Agency Consultant Invitation Notifications (Interactive Action Cards)
export const sampleAgencyRequestPending: NotificationItem = {
  id: "notif-agency-req-1",
  type: "agency_consultant_request",
  category: "systems",
  title: "دعوت همکاری جدید",
  description: "یک آژانس شما را برای همکاری دعوت کرده است.",
  created_at: nowIso,
  is_read: false,
  payload: {
    agency_id: 42,
    agency_name: "املاک بزرگ نیاوران",
    agent_id: 12,
  },
};

export const sampleAgencyRequestAccepted: NotificationItem = {
  id: "notif-agency-req-2",
  type: "agency_consultant_request",
  category: "systems",
  title: "دعوت همکاری جدید",
  description: "درخواست همکاری از آژانس «املاک کوروش»",
  created_at: yesterdayIso,
  is_read: true,
  payload: {
    agency_id: 43,
    agency_name: "املاک کوروش",
    agent_id: 12,
    request_status: "accept",
  },
};

export const sampleAgencyRequestRejected: NotificationItem = {
  id: "notif-agency-req-3",
  type: "agency_consultant_request",
  category: "systems",
  title: "دعوت همکاری جدید",
  description: "درخواست همکاری از آژانس «املاک پاسارگاد»",
  created_at: twoDaysAgoIso,
  is_read: true,
  payload: {
    agency_id: 44,
    agency_name: "املاک پاسارگاد",
    agent_id: 12,
    request_status: "reject",
  },
};

export const sampleAgencyRequestCancelled: NotificationItem = {
  id: "notif-agency-req-4",
  type: "agency_consultant_request",
  category: "systems",
  title: "دعوت همکاری جدید",
  description: "درخواست همکاری از آژانس «املاک پارس»",
  created_at: twoDaysAgoIso,
  is_read: true,
  payload: {
    agency_id: 45,
    agency_name: "املاک پارس",
    agent_id: 12,
    request_status: "cancel",
  },
};

// ==========================================
// Meta & Story Setup
// ==========================================

const meta: Meta = {
  title: "Features/Notifications/AllNotifications",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "کاتالوگ جامع و کامل تمام مدل‌ها و حالت‌های نوتیفیکیشن‌ها (Notification Cards, Action Buttons, Swipe-to-delete, Categories, Badges, Sheets & Empty State) برای مقایسه دقیق با فیگما.",
      },
    },
  },
};

export default meta;

// ==========================================
// 1. All Notification Cards in One Comparison View
// ==========================================

export const AllNotificationCardsShowcase: StoryObj = {
  name: "همه مدل‌های کارت اعلان (مقایسه کامل با فیگما)",
  render: () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
      sampleAgencyRequestPending,
      sampleAdvertiseUnread,
      sampleChatMessageUnread,
      sampleRequestInAreaUnread,
      sampleSupportReplyUnread,
      sampleTradeResultUnread,
      sampleSystemUpdateUnread,
      sampleAdvertiseExpiring,
      sampleTradeApprovalNeeded,
      sampleRequestMatchingAd,
      sampleChatClosed,
      sampleSupportClosed,
      sampleSystemTermsUpdated,
      sampleAgencyRequestAccepted,
      sampleAgencyRequestRejected,
      sampleAgencyRequestCancelled,
    ]);

    const [decisions, setDecisions] = useState<Record<string, AgencyConsultantRequestDisplayState>>({
      "notif-agency-req-2": "accept",
      "notif-agency-req-3": "reject",
      "notif-agency-req-4": "cancel",
    });

    const handleDelete = (id: string | number) => {
      setNotifications((prev) => prev.filter((item) => String(item.id) !== String(id)));
    };

    const handleDecision = (id: string, decision: AgencyConsultantRequestDisplayState) => {
      setDecisions((prev) => ({ ...prev, [id]: decision }));
    };

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <div className="border-b border-outline-var p-4 bg-surface-container-low">
          <Typography as="h1" variant="headline" size="medium" className="text-on-surface">
            مقایسه همه مدل‌های نوتیفیکیشن
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
            شامل تمام ۶ دسته‌بندی رنگی، خوانده‌شده/نشده، دکمه‌های اکشن اختصاصی، و دعوت به همکاری آژانس با استیت‌های مختلف.
          </Typography>
        </div>

        <div className="flex flex-col">
          {notifications.map((item) => {
            const itemId = String(item.id);
            return (
              <SwipeableNotificationCard
                key={itemId}
                item={item}
                agencyRequestDecision={decisions[itemId]}
                isDeleting={false}
                isRespondingToAgencyRequest={false}
                onDelete={() => handleDelete(itemId)}
                onOpen={() => console.log("Open notification:", item)}
                onAgencyRequestDecision={(dec) => handleDecision(itemId, dec)}
              />
            );
          })}
        </div>
      </div>
    );
  },
};

// ==========================================
// 2. Unread vs Read State Comparison
// ==========================================

export const UnreadVsReadComparison: StoryObj = {
  name: "مقایسه حالت خوانده‌شده و خوانده‌نشده",
  render: () => {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-surface-container p-4 font-sans [direction:rtl]">
        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-2 text-primary">
            ۱. حالت خوانده‌نشده (Unread):
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="mb-3 text-outline">
            دارای نقطه قرمز (bg-error)، عنوان پررنگ (font-bold)، پس‌زمینه متمایز (bg-surface-container-low).
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAdvertiseUnread}
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>

        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-2 text-primary">
            ۲. حالت خوانده‌شده (Read):
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="mb-3 text-outline">
            بدون نقطه قرمز، فونت عنوان خنثی‌تر، پس‌زمینه پایه سفید/روشن (bg-surface-container-lowest).
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAdvertiseExpiring}
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>
      </div>
    );
  },
};

// ==========================================
// 3. Category Color Indicators (Lozenges / Diamonds)
// ==========================================

export const CategoryColorShowcase: StoryObj = {
  name: "۶ دسته‌بندی با لوزی‌های رنگی اختصاصی",
  render: () => {
    const categorySamples = [
      { cat: "آگهی‌ها (Advertise) - فیروزه‌ای bg-tertiary", item: sampleAdvertiseUnread },
      { cat: "معاملات (Trades) - بنفش/آبی اصلی bg-primary", item: sampleTradeResultUnread },
      { cat: "درخواست‌ها (Requests) - کهربایی bg-warning", item: sampleRequestInAreaUnread },
      { cat: "چت‌ها (Chats) - بنفش/آبی اصلی bg-primary", item: sampleChatMessageUnread },
      { cat: "پشتیبانی (Support) - فیروزه‌ای bg-tertiary", item: sampleSupportReplyUnread },
      { cat: "سیستم (Systems) - خاکستری کانتور bg-outline", item: sampleSystemUpdateUnread },
    ];

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <div className="border-b border-outline-var p-4 bg-surface-container-low">
          <Typography as="h2" variant="headline" size="small">
            رنگ‌بندی لوزی‌های شاخص هر دسته در فیگما
          </Typography>
        </div>
        {categorySamples.map(({ cat, item }, idx) => (
          <div key={idx} className="border-b border-outline-var">
            <div className="bg-surface-container px-4 py-1 text-xs font-semibold text-outline">
              {cat}
            </div>
            <SwipeableNotificationCard
              item={item}
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        ))}
      </div>
    );
  },
};

// ==========================================
// 4. Agency Consultant Request Interactive States
// ==========================================

export const AgencyConsultantRequestStates: StoryObj = {
  name: "دعوت همکاری آژانس به مشاور (تمام حالات دکمه‌ها)",
  render: () => {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-surface-container p-4 font-sans [direction:rtl]">
        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-1 text-on-surface">
            ۱. در انتظار تصمیم (Pending Action):
          </Typography>
          <Typography as="p" variant="body" size="small" className="mb-2 text-outline">
            دکمه «پذیرش همکاری» (آبی پر) و «رد دعوت» (سفید دورخط‌دار آبی).
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAgencyRequestPending}
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>

        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-1 text-on-surface">
            ۲. در حال پردازش / ارسال به سرور (Responding State):
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAgencyRequestPending}
              isDeleting={false}
              isRespondingToAgencyRequest={true}
              pendingAgencyRequestDecision="accept"
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>

        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-1 text-on-surface">
            ۳. پذیرفته شده (Accepted State):
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAgencyRequestAccepted}
              agencyRequestDecision="accept"
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>

        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-1 text-on-surface">
            ۴. رد شده (Rejected State):
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAgencyRequestRejected}
              agencyRequestDecision="reject"
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>

        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-3">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-1 text-on-surface">
            ۵. لغو شده توسط کاربر (Cancelled State):
          </Typography>
          <div className="rounded-lg border border-outline-var overflow-hidden">
            <SwipeableNotificationCard
              item={sampleAgencyRequestCancelled}
              agencyRequestDecision="cancel"
              isDeleting={false}
              isRespondingToAgencyRequest={false}
              onDelete={() => {}}
              onOpen={() => {}}
              onAgencyRequestDecision={() => {}}
            />
          </div>
        </div>
      </div>
    );
  },
};

// ==========================================
// 5. Swipe to Delete Revealed State
// ==========================================

export const SwipeToDeleteRevealed: StoryObj = {
  name: "حالت سوایپ به چپ برای حذف (Swipe-to-delete)",
  render: () => {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-surface-container p-4 font-sans [direction:rtl]">
        <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-4">
          <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-2 text-on-surface">
            لایه حذف زیرین هنگام کشیدن کارت به چپ
          </Typography>
          <Typography as="p" variant="body" size="small" className="mb-4 text-outline">
            کاربر با کشیدن کارت به سمت راست در راست‌به‌چپ (یا درگ با ماوس) دکمه قرمز حذف و آیکون سطل آشغال را مشاهده می‌کند.
          </Typography>

          <div className="relative overflow-hidden rounded-xl border border-outline-var">
            {/* Simulated revealed state with transform 84px */}
            <div className="relative w-full max-w-full overflow-hidden border-b border-outline-var bg-error-container/30">
              <div className="absolute inset-y-0 left-0 z-0 flex w-[84px] flex-col items-center justify-center gap-2 bg-error-container/30 text-error">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-xs font-semibold leading-4">حذف</span>
              </div>

              <article
                className="relative z-10 flex w-full max-w-full select-none flex-col overflow-hidden bg-surface-container-low px-4 py-4 text-right h-full gap-y-4 shadow-md"
                style={{ transform: "translateX(84px)" }}
              >
                <div className="flex items-start justify-between gap-3 [direction:ltr]">
                  <time className="shrink-0 pt-0.5 text-xs font-normal leading-4 text-outline">
                    امروز ۱۱:۴۵
                  </time>
                  <div className="min-w-0 flex-1 text-right [direction:rtl]">
                    <div className="flex items-center justify-start gap-2">
                      <span className="h-3 w-3 shrink-0 rotate-45 rounded-[2px] bg-tertiary" />
                      <h2 className="m-0 truncate text-sm font-bold leading-6 text-on-surface">
                        آگهی شما منتشر شد
                      </h2>
                      <span className="h-2 w-2 shrink-0 rounded-full bg-error" />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-normal leading-5 text-on-surface-var">
                      آگهی شما با موفقیت منتشر شد و برای کاربران قابل مشاهده است.
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex justify-start [direction:rtl]">
                  <NotificationActionButton label="مشاهده آگهی" onClick={() => {}} />
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ==========================================
// 6. Filter Bar and Filter Sheet
// ==========================================

export const FilterBarAndSheetShowcase: StoryObj = {
  name: "نوار فیلتر و شیت انتخاب دسته‌بندی‌ها",
  render: () => {
    const [selectedFilters, setSelectedFilters] = useState<NotificationCategory[]>([
      "advertise",
      "trades",
    ]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleRemoveFilter = (id: NotificationCategory) => {
      setSelectedFilters((prev) => prev.filter((item) => item !== id));
    };

    const handleToggleFilter = (id: NotificationCategory) => {
      setSelectedFilters((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    };

    const filterOptions = notificationFilterOptions.filter((opt) =>
      selectedFilters.includes(opt.id),
    );

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <NotificationHeader onOpenSettings={() => {}} onRefresh={() => {}} />
        <div className="p-3 bg-surface-container border-b border-outline-var">
          <Typography as="p" variant="body" size="small" className="mb-2 text-outline">
            روی دکمه فیلتر کلیک کنید تا شیت انتخاب دسته‌بندی باز شود:
          </Typography>
          <NotificationFilterBar
            selectedFilters={filterOptions}
            onOpenFilters={() => setIsSheetOpen(true)}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>

        <div className="p-4">
          <Typography as="h3" variant="title" size="medium" weight="semibold">
            لیست فیلترشده ({selectedFilters.length} فیلتر فعال)
          </Typography>
          <Typography as="p" variant="body" size="small" className="mt-2 text-outline">
            فیلترهای فعال: {selectedFilters.join("، ") || "بدون فیلتر (نمایش همه)"}
          </Typography>
        </div>

        <NotificationFilterSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onToggle={handleToggleFilter}
          selectedFilterIds={new Set(selectedFilters)}
        />
      </div>
    );
  },
};

// ==========================================
// 7. Notification Settings Sheet
// ==========================================

export const NotificationSettingsSheetShowcase: StoryObj = {
  name: "شیت تنظیمات اعلان‌ها (Settings BottomSheet)",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [markAllUnread, setMarkAllUnread] = useState(false);

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <div className="p-6 text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary shadow-sm"
          >
            باز کردن شیت تنظیمات اعلان‌ها
          </button>
        </div>

        <NotificationSettingsSheet
          isOpen={isOpen}
          isClearingRead={false}
          isMarkingAllRead={false}
          markAllUnread={markAllUnread}
          onClearRead={() => alert("پاک‌کردن اعلان‌های خوانده شده")}
          onClose={() => setIsOpen(false)}
          onManage={() => alert("انتقال به صفحه مدیریت اعلان‌ها")}
          onMarkAllRead={() => alert("علامت‌گذاری همه به‌عنوان خوانده شده")}
          onMarkAllUnreadChange={(val) => setMarkAllUnread(val)}
        />
      </div>
    );
  },
};

// ==========================================
// 8. Empty State (No Notifications)
// ==========================================

export const EmptyNotificationsState: StoryObj = {
  name: "صفحه خالی اعلان‌ها (Empty State)",
  render: () => {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <NotificationHeader onOpenSettings={() => {}} onRefresh={() => {}} />
        <div className="flex flex-1 items-center justify-center py-20">
          <NotificationsEmptyState />
        </div>
      </div>
    );
  },
};

// ==========================================
// 9. Full Notification Management Page
// ==========================================

export const NotificationManagementScreen: StoryObj = {
  name: "صفحه تنظیمات و مدیریت اعلان‌ها (Management Page)",
  render: () => {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
        <NotificationManagementPage />
      </div>
    );
  },
};
