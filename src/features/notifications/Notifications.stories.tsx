import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SwipeableNotificationCard,
  NotificationsEmptyState,
  NotificationManagementPage,
} from "./NotificationsPage";
import type { NotificationItem } from "./api/notification.service";
import { Typography } from "../../shared/ui/Typography";

const timeYesterday = "دیروز ۱۲:۲۰";

// ==========================================
// 1. پیام های آگهی (15 Items from SVG) - Role: User
// ==========================================
export const adsNotificationsList: NotificationItem[] = [
  {
    id: "adv-1",
    category: "advertise",
    title: "آگهی شما منتشر شد",
    description: "آگهی «آپارتمان ۱۲۰ متری سعادت‌آباد» با موفقیت منتشر شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 101 },
  },
  {
    id: "adv-2",
    category: "advertise",
    title: "اطلاعات آگهی بروزرسانی شد",
    description: "تغییرات اعمال‌شده با موفقیت ذخیره شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 102 },
  },
  {
    id: "adv-3",
    category: "advertise",
    title: "اعتبار آگهی در حال اتمام است",
    description: "تنها ۲ روز تا پایان نمایش آگهی باقی مانده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "advertise", advertise_id: 103 },
  },
  {
    id: "adv-4",
    category: "advertise",
    title: "آگهی شما به آژانس واگذار شد",
    description: "آژانس جلالیان مدیریت انتشار آگهی شما را برعهده گرفت.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 104, agency_id: 50 },
  },
  {
    id: "adv-5",
    category: "advertise",
    title: "انتشار آگهی متوقف شد",
    description: "درخواست توقف انتشار آگهی شما تأیید شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 105 },
  },
  {
    id: "adv-6",
    category: "advertise",
    title: "آگهی در انتظار بررسی است",
    description: "آگهی شما ثبت شد و پس از تأیید منتشر خواهد شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 106, action: "none" },
  },
  {
    id: "adv-7",
    category: "advertise",
    title: "آگهی شما تأیید نشد",
    description: "آگهی ثبت‌شده به دلیل مغایرت با قوانین منتشر نشد.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "advertise", advertise_id: 107 },
  },
  {
    id: "adv-8",
    category: "advertise",
    title: "آگهی شما ویژه شد",
    description: "آگهی اکنون با اولویت بیشتری نمایش داده می‌شود.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 108 },
  },
  {
    id: "adv-9",
    category: "advertise",
    title: "آگهی بایگانی شد",
    description: "آگهی شما از لیست آگهی‌های فعال خارج شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 109 },
  },
  {
    id: "adv-10",
    category: "advertise",
    title: "آژانس همکاری را پذیرفت",
    description: "آگهی شما توسط آژانس پذیرفته شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 110, agency_id: 51 },
  },
  {
    id: "adv-11",
    category: "advertise",
    title: "توقف انتشار تأیید نشد",
    description: "درخواست توقف انتشار توسط آژانس رد شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 111 },
  },
  {
    id: "adv-12",
    category: "advertise",
    title: "اطلاعات آگهی ناقص است",
    description: "برای انتشار آگهی، اطلاعات خواسته‌شده را تکمیل کنید.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "advertise", advertise_id: 112 },
  },
  {
    id: "adv-13",
    category: "advertise",
    title: "آگهی تمدید شد",
    description: "مدت نمایش آگهی شما افزایش یافت.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 113 },
  },
  {
    id: "adv-14",
    category: "advertise",
    title: "آگهی حذف شد",
    description: "آگهی شما از سامانه حذف شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 114 },
  },
  {
    id: "adv-15",
    category: "advertise",
    title: "آژانس همکاری را نپذیرفت",
    description: "درخواست انتشار آگهی توسط آژانس رد شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "advertise", advertise_id: 115, agency_id: 52 },
  },
];

// ==========================================
// 2. پیام های معاملات (4 Items from SVG) - Role: User
// ==========================================
export const tradesNotificationsList: NotificationItem[] = [
  {
    id: "trade-1",
    category: "trades",
    title: "نتیجه معامله ثبت شد",
    description: "آژانس نتیجه معامله مربوط به آگهی شما را ثبت کرده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "trade", trade_id: 201 },
  },
  {
    id: "trade-2",
    category: "trades",
    title: "نتیجه معامله نیاز به تأیید دارد",
    description: "لطفاً نتیجه معامله ثبت‌شده را بررسی و تأیید کنید.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "trade", trade_id: 202 },
  },
  {
    id: "trade-3",
    category: "trades",
    title: "معامله نهایی شد",
    description: "نتیجه معامله توسط طرفین تأیید شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "trade", trade_id: 203 },
  },
  {
    id: "trade-4",
    category: "trades",
    title: "معامله ناموفق اعلام شد",
    description: "نتیجه معامله به عنوان ناموفق ثبت شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "trade", trade_id: 204 },
  },
];

// ==========================================
// 3. اعلان های درخواست (4 Items from SVG) - Role: User
// ==========================================
export const requestsNotificationsList: NotificationItem[] = [
  {
    id: "req-1",
    category: "requests",
    title: "درخواست شما ثبت شد",
    description: "درخواست شما با موفقیت ثبت شد.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "request", request_id: 301 },
  },
  {
    id: "req-2",
    category: "requests",
    title: "پاسخ جدید دریافت شد",
    description: "برای درخواست شما یک پاسخ جدید ثبت شده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "request", request_id: 302 },
  },
  {
    id: "req-3",
    category: "requests",
    title: "آگهی جدید برای درخواست شما",
    description: "یک ملک جدید مطابق درخواست شما منتشر شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "request", request_id: 303, advertise_id: 116 },
  },
  {
    id: "req-4",
    category: "requests",
    title: "نتیجه درخواست آماده مشاهده است",
    description: "نتایج مرتبط با درخواست شما بروزرسانی شده‌اند.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "request", request_id: 304 },
  },
];

// ==========================================
// 4. نوتیف های چت (3 Items from SVG) - Role: User
// ==========================================
export const chatsNotificationsList: NotificationItem[] = [
  {
    id: "chat-1",
    category: "chats",
    title: "پیام جدید دریافت کردید",
    description: "یک پیام جدید در گفتگوهای شما ثبت شده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "chat", chat_thread_id: 401 },
  },
  {
    id: "chat-2",
    category: "chats",
    title: "پیام شما مشاهده شد",
    description: "طرف مقابل پیام شما را مشاهده کرده است.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "chat", chat_thread_id: 402 },
  },
  {
    id: "chat-3",
    category: "chats",
    title: "گفتگو پایان یافت",
    description: "این گفتگو توسط یکی از طرفین بسته شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "chat", chat_thread_id: 403 },
  },
];

// ==========================================
// 5. پیام های سیستمی سامانه (13 Items from SVG) - Role: User
// ==========================================
export const systemNotificationsList: NotificationItem[] = [
  {
    id: "sys-1",
    category: "systems",
    title: "تصویر پروفایل بروزرسانی شد",
    description: "تصویر جدید با موفقیت ثبت شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { action: "none", target: "profile" },
  },
  {
    id: "sys-2",
    category: "systems",
    title: "پروفایل شما ناقص است",
    description: "برای استفاده بهتر از امکانات، اطلاعات حساب را تکمیل کنید.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "profile" },
  },
  {
    id: "sys-3",
    category: "systems",
    title: "پروفایل شما تکمیل شد",
    description: "اطلاعات حساب کاربری با موفقیت ثبت شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { action: "none", target: "profile" },
  },
  {
    id: "sys-4",
    category: "systems",
    title: "کد تخفیف دریافت کردید",
    description: "یک کد تخفیف جدید برای شما فعال شده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { discount_code: "۲۵۴۸۶۲۴", target: "payment" },
  },
  {
    id: "sys-5",
    category: "systems",
    title: "دریافت اعلان‌ها فعال شد",
    description: "اعلان‌های سامانه دوباره برای شما ارسال خواهد شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "system" },
  },
  {
    id: "sys-6",
    category: "systems",
    title: "دریافت اعلان‌ها غیرفعال شد",
    description: "از این پس اعلان‌های سامانه برای شما ارسال نمی‌شود.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "system" },
  },
  {
    id: "sys-7",
    category: "systems",
    title: "قوانین و شرایط استفاده بروزرسانی شد",
    description: "لطفاً نسخه جدید قوانین را مطالعه کنید.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "system" },
  },
  {
    id: "sys-8",
    category: "systems",
    title: "سامانه بروزرسانی شد",
    description: "آخرین نسخه سامانه با موفقیت منتشر شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "system" },
  },
  {
    id: "sys-9",
    category: "systems",
    title: "قابلیت جدید اضافه شد",
    description: "امکانات جدیدی به سامانه اضافه شده است.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "system" },
  },
  {
    id: "sys-10",
    category: "support",
    title: "وضعیت درخواست پشتیبانی تغییر کرد",
    description: "اطلاعات جدیدی به درخواست شما اضافه شده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "support", support_ticket_id: "501" },
  },
  {
    id: "sys-11",
    category: "support",
    title: "درخواست پشتیبانی بسته شد",
    description: "درخواست شما با موفقیت رسیدگی و بسته شد.",
    created_at: timeYesterday,
    is_read: true,
    payload: { target: "support", support_ticket_id: "502" },
  },
  {
    id: "sys-12",
    category: "support",
    title: "پاسخ جدید دریافت کردید",
    description: "تیم پشتیبانی به درخواست شما پاسخ داده است.",
    created_at: timeYesterday,
    is_read: false,
    payload: { target: "support", support_ticket_id: "503" },
  },
  {
    id: "sys-13",
    category: "systems",
    title: "اختلال موقت در سامانه",
    description: "برخی امکانات سامانه ممکن است به درستی عمل نکنند.",
    created_at: timeYesterday,
    is_read: false,
    payload: { action: "none", target: "system" },
  },
];

export const allUserNotifications: NotificationItem[] = [
  ...adsNotificationsList,
  ...tradesNotificationsList,
  ...requestsNotificationsList,
  ...chatsNotificationsList,
  ...systemNotificationsList,
];

// ==========================================
// Meta & Story Setup
// ==========================================
const meta: Meta = {
  title: "Features/Notifications/UserNotificationsFigma",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "مجموعه نوتیفیکیشن‌های استخراج‌شده از ۵ فایل SVG فیگما (آگهی، معاملات، درخواست، چت و پیام‌های سیستمی سامانه) ویژه نقش کاربر عادی جهت مقایسه و تطبیق ۱۰۰٪ با فیگما.",
      },
    },
  },
};

export default meta;

// ==========================================
// 1. Ads Notifications Story (15 Items)
// ==========================================
export const AdsNotificationsStory: StoryObj = {
  name: "۱. پیام‌های آگهی (۱۵ حالت فیگما)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          پیام‌های دسته آگهی (۱۵ حالت)
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          استخراج دقیق از «پیام های آگهی.svg» شامل اکشن‌های مشاهده، ویرایش، تمدید، بازیابی و مشاهده دلیل.
        </Typography>
      </div>
      <div className="flex flex-col">
        {adsNotificationsList.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 2. Trades Notifications Story (4 Items)
// ==========================================
export const TradesNotificationsStory: StoryObj = {
  name: "۲. پیام‌های معاملات (۴ حالت فیگما)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          پیام‌های دسته معاملات (۴ حالت)
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          استخراج شده از «پیام های دسته بندی معاملات.svg» شامل دو دکمه «تایید» و «عدم تایید» و مشاهده معامله.
        </Typography>
      </div>
      <div className="flex flex-col">
        {tradesNotificationsList.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 3. Requests Notifications Story (4 Items)
// ==========================================
export const RequestsNotificationsStory: StoryObj = {
  name: "۳. اعلان‌های درخواست (۴ حالت فیگما)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          اعلان‌های دسته درخواست (۴ حالت)
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          استخراج شده از «اعلان های درخواست.svg» با دکمه‌های مشاهده درخواست، مشاهده آگهی و مشاهده نتایج.
        </Typography>
      </div>
      <div className="flex flex-col">
        {requestsNotificationsList.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 4. Chats Notifications Story (3 Items)
// ==========================================
export const ChatsNotificationsStory: StoryObj = {
  name: "۴. نوتیف‌های چت (۳ حالت فیگما)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          نوتیف‌های پیام‌رسان و چت (۳ حالت)
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          استخراج شده از «نوتیف های چت.svg» با دکمه «مشاهده گفتگو».
        </Typography>
      </div>
      <div className="flex flex-col">
        {chatsNotificationsList.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 5. System Notifications Story (13 Items)
// ==========================================
export const SystemNotificationsStory: StoryObj = {
  name: "۵. پیام‌های سیستمی سامانه (۱۳ حالت فیگما)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          پیام‌های سیستمی و پشتیبانی سامانه (۱۳ حالت)
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          استخراج شده از «پیام های سیستمی سامانه.svg» شامل کپی کد تخفیف، مدیریت اعلان‌ها، قوانین، بروزرسانی و پشتیبانی.
        </Typography>
      </div>
      <div className="flex flex-col">
        {systemNotificationsList.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 6. All User Notifications Showcase (39 Items)
// ==========================================
export const AllUserNotificationsShowcase: StoryObj = {
  name: "۶. کل ۳۹ نوتیفیکیشن کاربر عادی در یکجا",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <div className="border-b border-outline-var p-4 bg-surface-container-low">
        <Typography as="h1" variant="title" size="large" weight="semibold" className="text-on-surface">
          تمامی ۳۹ مدل نوتیفیکیشن کاربر عادی
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-outline">
          بر اساس ۵ فایل SVG دانلود شده، هماهنگ با طراحی فیگما بونگا.
        </Typography>
      </div>
      <div className="flex flex-col">
        {allUserNotifications.map((item) => (
          <SwipeableNotificationCard
            key={String(item.id)}
            item={item}
            isDeleting={false}
            isRespondingToAgencyRequest={false}
            onDelete={() => {}}
            onOpen={() => console.log("Open:", item)}
            onAgencyRequestDecision={() => {}}
          />
        ))}
      </div>
    </div>
  ),
};

// ==========================================
// 7. Empty States Comparison
// ==========================================
export const EmptyStatesComparison: StoryObj = {
  name: "۷. مقایسه حالت‌های خالی (عادی و فیلتر پیدا نشده)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-6 bg-surface-container p-4 font-sans [direction:rtl]">
      <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-4">
        <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-2 text-primary">
          ۱. حالت بدون هیچ اعلان (عادی):
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mb-4 text-outline">
          عنوان: «هنوز اعلانی دریافت نکرده‌اید» (title medium semibold)
        </Typography>
        <div className="rounded-lg border border-outline-var bg-surface-container-lowest py-8">
          <NotificationsEmptyState isFiltered={false} />
        </div>
      </div>

      <div className="rounded-xl border border-outline-var bg-surface-container-lowest p-4">
        <Typography as="h3" variant="title" size="small" weight="semibold" className="mb-2 text-primary">
          ۲. حالت فیلتر روشن و بدون نتیجه (فیلتر پیدا نشد):
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mb-4 text-outline">
          عنوان: «اعلانی با فیلترهای انتخاب‌شده پیدا نشد» (title medium semibold)
          <br />
          توضیحات: «فیلترها را تغییر دهید یا پاک کنید.»
        </Typography>
        <div className="rounded-lg border border-outline-var bg-surface-container-lowest py-8">
          <NotificationsEmptyState isFiltered={true} />
        </div>
      </div>
    </div>
  ),
};

// ==========================================
// 8. Management Page Typography
// ==========================================
export const NotificationManagementTypography: StoryObj = {
  name: "۸. صفحه مدیریت اعلان‌ها (تایپوگرافی body large regular)",
  render: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface-container-lowest font-sans [direction:rtl]">
      <NotificationManagementPage />
    </div>
  ),
};
