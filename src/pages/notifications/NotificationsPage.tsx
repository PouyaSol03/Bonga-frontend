import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  subscribeToNotifications,
  disconnectNotificationSocket,
  type NotificationReadPayload,
} from "../../core/api/notification-socket";
import { queryClient } from "../../core/api/query-client";
import { queryKeys } from "../../core/api/query-keys";
import { PageFrame } from "../../app/layout/PageFrame";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { getRequestErrorState } from "../../shared/components/ErrorState";
import { HorizontalFilterBar } from "../../shared/components/HorizontalFilterBar";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { TopBar } from "../../shared/components/TopBar";
import LinearDelete from "../../shared/icons/LinearDelete";
import LinearNotification from "../../shared/icons/LinearNotification";
import LinearTickDouble from "../../shared/icons/LinearTickDouble";
import {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationPreferencesQuery,
  useNotificationsInfiniteQuery,
  useNotificationUnreadCountQuery,
  useUpdateNotificationPreferenceMutation,
} from "../../core/hooks/notification.hooks";
import type {
  NotificationCategory,
  NotificationItem,
} from "../../core/services/notification.service";
import LinearArrowRight2 from "../../shared/icons/LinearArrowRight2";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type FilterOption = {
  id: NotificationCategory;
  label: string;
};

const notificationsPerPage = 20;
const notificationDeleteActionWidth = 84;
const notificationDeleteThreshold = 56;

const notificationFilterOptions: FilterOption[] = [
  { id: "advertise", label: "آگهی‌ها" },
  { id: "trades", label: "معاملات" },
  { id: "requests", label: "درخواست‌ها" },
  { id: "chats", label: "چت‌ها" },
  { id: "support", label: "پشتیبانی" },
  { id: "systems", label: "سیستم" },
];

const categoryColorClassNames: Record<NotificationCategory, string> = {
  advertise: "bg-[#00a66a]",
  chats: "bg-[#0048c4]",
  requests: "bg-[#f97316]",
  support: "bg-[#11a366]",
  systems: "bg-[#64748b]",
  trades: "bg-[#8b5cf6]",
};

const allPreferenceCategories = notificationFilterOptions.map((option) => option.id);

const notificationManagementOptions: Array<{
  category: NotificationCategory;
  description: string;
  label: string;
}> = [
  { category: "advertise", description: "انتشار مجدد و وضعیت آگهی‌ها", label: "آگهی‌ها" },
  { category: "trades", description: "ثبت، تایید و نتیجه معاملات", label: "معاملات" },
  { category: "requests", description: "درخواست‌های جدید و پاسخ‌ها", label: "درخواست‌ها" },
  { category: "chats", description: "گفتگوها", label: "چت‌ها" },
  { category: "systems", description: "امنیت حساب و بروزرسانی‌ها", label: "سیستم" },
];

function MoreVerticalIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 12h.01M12 6h.01M12 18h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4.84961 20V16.7998C4.84971 16.3857 5.18546 16.0498 5.59961 16.0498H8.44434C8.85848 16.0498 9.19423 16.3857 9.19434 16.7998C9.19434 17.214 8.85855 17.5498 8.44434 17.5498H7.33594C8.59714 18.611 10.2237 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 11.5858 19.5858 11.25 20 11.25C20.4142 11.25 20.75 11.5858 20.75 12C20.75 16.8325 16.8325 20.75 12 20.75C9.84562 20.75 7.87375 19.9701 6.34961 18.6797V20C6.34961 20.4142 6.01375 20.7499 5.59961 20.75C5.1854 20.75 4.84961 20.4142 4.84961 20ZM3.25 12C3.25 7.16751 7.16751 3.25 12 3.25C14.1542 3.25 16.1263 4.02916 17.6504 5.31934V4C17.6504 3.58584 17.9863 3.25009 18.4004 3.25C18.8146 3.25 19.1504 3.58579 19.1504 4V7.2002C19.1503 7.61432 18.8145 7.9502 18.4004 7.9502H15.5557C15.1415 7.9502 14.8058 7.61432 14.8057 7.2002C14.8057 6.78598 15.1415 6.4502 15.5557 6.4502H16.6641C15.4029 5.38902 13.7763 4.75 12 4.75C7.99593 4.75 4.75 7.99593 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75C3.58579 12.75 3.25 12.4142 3.25 12Z" fill="#1A1A1A" />
    </svg>
  );
}

function FilterSlidersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M14.6688 12.5002C14.6688 12.4183 14.5879 12.2918 14.4116 12.2918H10.8822C10.706 12.2919 10.625 12.4183 10.625 12.5002V15.8335C10.625 15.9154 10.706 16.0417 10.8822 16.0418H14.4116C14.5879 16.0418 14.6688 15.9154 14.6688 15.8335V12.5002ZM6.91162 13.5418C7.2568 13.5418 7.53662 13.8217 7.53662 14.1668C7.53662 14.512 7.2568 14.7918 6.91162 14.7918H2.5C2.15482 14.7918 1.875 14.512 1.875 14.1668C1.875 13.8217 2.15482 13.5418 2.5 13.5418H6.91162ZM9.375 4.16683C9.375 4.08497 9.29398 3.95859 9.11784 3.9585H5.58838C5.41211 3.9585 5.33122 4.08495 5.33122 4.16683V7.50016C5.33122 7.58204 5.41211 7.7085 5.58838 7.7085H9.11784C9.29398 7.7084 9.375 7.58202 9.375 7.50016V4.16683ZM17.5 5.2085C17.8452 5.2085 18.125 5.48832 18.125 5.8335C18.125 6.17867 17.8452 6.4585 17.5 6.4585H13.0884C12.7432 6.4585 12.4634 6.17867 12.4634 5.8335C12.4634 5.48832 12.7432 5.2085 13.0884 5.2085H17.5ZM15.9188 13.5418H17.5C17.8452 13.5418 18.125 13.8217 18.125 14.1668C18.125 14.512 17.8452 14.7918 17.5 14.7918H15.9188V15.8335C15.9188 16.6721 15.21 17.2918 14.4116 17.2918H10.8822C10.0839 17.2917 9.375 16.672 9.375 15.8335V12.5002C9.375 11.6616 10.0839 11.0419 10.8822 11.0418H14.4116C15.21 11.0418 15.9188 11.6616 15.9188 12.5002V13.5418ZM10.625 7.50016C10.625 8.33868 9.91613 8.9584 9.11784 8.9585H5.58838C4.79003 8.9585 4.08122 8.33875 4.08122 7.50016V6.4585H2.5C2.15482 6.4585 1.875 6.17867 1.875 5.8335C1.875 5.48832 2.15482 5.2085 2.5 5.2085H4.08122V4.16683C4.08122 3.32824 4.79003 2.7085 5.58838 2.7085H9.11784C9.91613 2.70859 10.625 3.32832 10.625 4.16683V7.50016Z" fill="#4D4D4D" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 18 18">
      <path
        d="m5.1 9.1 2.3 2.3 5.5-5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
      <path
        d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 16 16">
      <path
        d="M10 4 6 8l4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function readPayloadId(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);

  return "";
}

function formatNotificationTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(yesterday);
  const time = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);

  if (dateKey === todayKey) return `امروز ${time}`;
  if (dateKey === yesterdayKey) return `دیروز ${time}`;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

function getNotificationPath(notification: NotificationItem) {
  const payload = notification.payload ?? {};
  const target = typeof payload.target === "string" ? payload.target : "";

  switch (target) {
    case "advertise": {
      const advertiseId = readPayloadId(payload.advertise_id);
      return advertiseId ? `/ads/${advertiseId}` : "";
    }

    case "chat": {
      const threadId = readPayloadId(payload.chat_thread_id);
      return threadId ? `/chat/${threadId}` : "/chat";
    }

    case "payment":
      return "/account/wallet/history";

    case "agency":
      return "/account/dashboard/agency";

    case "support":
      {
        const threadId = readPayloadId(payload.chat_thread_id);
        if (threadId) {
          return `/account/support/chat/new?thread_id=${encodeURIComponent(threadId)}`;
        }

        return "/account/support/requests";
      }

    case "profile":
      return "/account/profile";

    case "request":
      return payload.support_ticket_id
        ? "/account/support/requests"
        : "/account/requests";

    default:
      return "";
  }
}

function getNotificationActionLabel(notification: NotificationItem) {
  const target = notification.payload?.target;

  if (target === "advertise") return "مشاهده آگهی";
  if (target === "chat") return "مشاهده چت";
  if (target === "payment") return "مشاهده پرداخت";
  if (target === "agency") return "مشاهده آژانس";
  if (target === "profile") return "مشاهده پروفایل";
  if (target === "request") return "مشاهده درخواست";
  if (target === "support") return "مشاهده پشتیبانی";

  return notification.is_read ? "مشاهده" : "خواندن اعلان";
}

function NotificationHeader({
  onOpenSettings,
  onRefresh,
}: {
  onOpenSettings: () => void;
  onRefresh: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "تنظیمات اعلان‌ها",
          onClick: onOpenSettings,
        },
        {
          icon: <RefreshIcon className="h-6 w-6" />,
          id: "refresh",
          label: "بروزرسانی اعلان‌ها",
          onClick: onRefresh,
        },
      ]}
      backLabel="بازگشت به خانه"
      backTo="/home"
      heightClassName="h-14"
      title="اعلان‌ها"
    />
  );
}

function NotificationFilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button unstyled
      className="relative flex shrink-0 items-center gap-1 rounded-xl border border-[#2E2D3E29] bg-white px-2.5 py-2 text-sm font-medium leading-5 text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#f7f7f7]"
      onClick={onClick}
      type="button"
    >
      <FilterSlidersIcon className="h-5 w-5" />
      <Typography as="span" variant="body" size="medium" weight="regular">فیلتر</Typography>
      {count > 0 ? (
        <Typography as="span" variant="label" size="small" weight="semibold" className="grid h-5 min-w-5 place-items-center rounded-full bg-[#0048c4] px-1 text-xs font-semibold leading-5 text-white">
          {count}
        </Typography>
      ) : null}
    </Button>
  );
}

function NotificationFilterBar({
  onOpenFilters,
  onRemoveFilter,
  selectedFilters,
}: {
  onOpenFilters: () => void;
  onRemoveFilter: (id: NotificationCategory) => void;
  selectedFilters: FilterOption[];
}) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر اعلان‌ها"
      className="bg-[#f0f0f0]"
      contentClassName="min-h-10"
    >
      <NotificationFilterButton count={selectedFilters.length} onClick={onOpenFilters} />
      {selectedFilters.map((filter) => (
        <Button unstyled
          aria-label={`حذف فیلتر ${filter.label}`}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#0048C4] bg-[#0048c414] px-3 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          key={filter.id}
          onClick={() => onRemoveFilter(filter.id)}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular">{filter.label}</Typography>
          <CloseIcon className="h-4 w-4" />
        </Button>
      ))}
    </HorizontalFilterBar>
  );
}

function NotificationFilterSheet({
  isOpen,
  onClose,
  onToggle,
  selectedFilterIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggle: (id: NotificationCategory) => void;
  selectedFilterIds: Set<NotificationCategory>;
}) {
  return (
    <BottomSheet
      ariaLabel="فیلتر اعلان‌ها"
      className="rounded-t-[22px]"
      contentClassName="mt-4"
      heightClassName="h-[400px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-[#1a1a1a]/60"
      title="فیلتر"
      showHeaderDivider={false}
    >
      <div className="px-4 pb-5">
        {notificationFilterOptions.map((option) => {
          const isSelected = selectedFilterIds.has(option.id);

          return (
            <Button unstyled
              aria-pressed={isSelected}
              className="flex h-[64px] w-full items-center justify-between text-right text-base font-medium leading-6 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">{option.label}</Typography>
              <Typography as="span" variant="body" size="medium" weight="regular"
                className={`grid h-[18px] w-[18px] place-items-center rounded border ${
                  isSelected
                    ? "border-[#0048c4] bg-[#0048c4] text-white"
                    : "border-[#808080] bg-white text-transparent"
                }`}
              >
                <CheckIcon className="h-[14px] w-[14px]" />
              </Typography>
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

function NotificationSettingsSheet({
  isClearingRead,
  isMarkingAllRead,
  isOpen,
  markAllUnread,
  onClearRead,
  onClose,
  onMarkAllRead,
  onMarkAllUnreadChange,
  onManage,
}: {
  isClearingRead: boolean;
  isMarkingAllRead: boolean;
  isOpen: boolean;
  markAllUnread: boolean;
  onClearRead: () => void;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkAllUnreadChange: (checked: boolean) => void;
  onManage: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="تنظیمات اعلان"
      className="rounded-t-[16px]"
      contentClassName="mt-2"
      handleClassName="h-[3px] w-[42px] rounded-full bg-[#e0e0e0]"
      heightClassName=""
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2.5"
      scrimClassName="bg-[#1a1a1a]/70"
      showHeader={false}
    >
      <div className="px-3">
        <div className="flex h-[72px] items-center gap-2 border-b border-[#f0f0f0] px-1 text-right [direction:rtl]">
          <LinearArrowRight2 className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
          <Typography as="h2" variant="headline" size="large" className="m-0 font-medium leading-5 text-[#1a1a1a]">تنظیمات اعلان</Typography>
        </div>

        <div className="flex h-[72px] items-center justify-between border-b border-[#f0f0f0] px-1 [direction:ltr]">
          <SwitchButton
            ariaLabel="علامت‌گذاری همه به‌عنوان خوانده‌نشده"
            checked={markAllUnread}
            onChange={onMarkAllUnreadChange}
          />
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-right font-normal leading-4 text-[#1a1a1a]" dir="rtl">
            علامت‌گذاری همه به‌عنوان خوانده‌نشده
          </Typography>
        </div>

        <Button unstyled
          className="flex h-[72px] w-full items-center justify-between border-b border-[#f0f0f0] px-1 text-[#1a1a1a] [direction:ltr]"
          onClick={onManage}
          type="button"
        >
          <LinearArrowLeft1 className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
          <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center gap-2 font-normal leading-4 [direction:rtl]">
            <LinearNotification className="h-6 w-6 text-[#4D4D4D]" />
            مدیریت اعلان‌ها
          </Typography>
        </Button>

        <Button unstyled
          className="flex h-[72px] w-full items-center gap-2 border-b border-[#f0f0f0] px-1 text-[11px] font-normal leading-4 text-[#1a1a1a] disabled:cursor-wait disabled:opacity-60 [direction:rtl]"
          disabled={isMarkingAllRead}
          onClick={onMarkAllRead}
          type="button"
        >
          <LinearTickDouble className="h-6 w-6 text-[#4D4D4D]" />
          <Typography as="span" variant="body" size="medium" weight="regular">{isMarkingAllRead ? "در حال ثبت..." : "علامت‌گذاری همه به‌عنوان خوانده شده"}</Typography>
        </Button>

        <Button unstyled
          className="flex h-[72px] w-full items-center gap-2 px-1 text-[11px] font-normal leading-4 text-[#1a1a1a] disabled:cursor-wait disabled:opacity-60 [direction:rtl]"
          disabled={isClearingRead}
          onClick={onClearRead}
          type="button"
        >
          <LinearDelete className="h-6 w-6 text-[#4D4D4D]" />
          <Typography as="span" variant="body" size="medium" weight="regular">{isClearingRead ? "در حال پاک کردن..." : "پاک کردن اعلان‌های خوانده شده"}</Typography>
        </Button>
      </div>
    </BottomSheet>
  );
}


function NotificationsEmptyState() {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-10 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="mb-4 h-[66px] w-[66px] object-contain"
        src="/vectors/NoNotification.svg"
      />
      <Typography as="h2" variant="headline" size="large" className="m-0 font-semibold text-[#1a1a1a]">
        هنوز اعلانی دریافت نکرده‌اید
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm font-normal leading-6 text-[#4d4d4d]">
        تغییرات مربوط به آگهی‌ها، درخواست‌ها، پرداخت‌ها و فعالیت آژانس‌ها از اینجا به شما اطلاع داده می‌شود.
      </Typography>
    </section>
  );
}

function NotificationActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button unstyled
      className="flex items-center gap-1 rounded-lg border border-[#d9d9d9] bg-white px-4 py-1.5 !text-xs !font-medium leading-4 text-[#333333] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#f7f7f7]"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular">{label}</Typography>
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  );
}

function SwipeableNotificationCard({
  isDeleting,
  item,
  onDelete,
  onOpen,
}: {
  isDeleting: boolean;
  item: NotificationItem;
  onDelete: () => void;
  onOpen: () => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isSwipeRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const category = item.category ?? "systems";
  const isUnread = item.is_read === false;

  const updateDragOffset = (nextOffset: number) => {
    const clampedOffset = Math.max(0, Math.min(nextOffset, notificationDeleteActionWidth));
    dragOffsetRef.current = clampedOffset;
    setDragOffset(clampedOffset);
  };

  const resetSwipe = () => {
    updateDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
    startYRef.current = null;
    isSwipeRef.current = false;
    pointerIdRef.current = null;
  };

  return (
    <div
      className={`relative w-full max-w-full overflow-hidden border-b border-[#eeeeee] bg-[#f9d9d9] [contain:paint] ${
        isDeleting ? "opacity-60" : ""
      }`}
      style={{ touchAction: "pan-y" }}
    >
      <Button unstyled
        aria-label={`حذف اعلان ${item.title || ""}`.trim()}
        className="absolute inset-y-0 left-0 z-0 flex w-[84px] flex-col items-center justify-center gap-2 bg-[#f9d9d9] text-[#ef1f1f] disabled:cursor-not-allowed"
        disabled={isDeleting}
        onClick={onDelete}
        type="button"
      >
        <LinearDelete className="h-6 w-6" />
        <Typography as="span" variant="label" size="small" weight="semibold" className="text-xs font-semibold leading-4">حذف</Typography>
      </Button>

      <article
        className={`relative z-10 flex h-full w-full max-w-full touch-pan-y select-none flex-col gap-y-4 overflow-hidden px-4 py-4 text-right will-change-transform ${
          isUnread ? "bg-[#f7faff]" : "bg-white"
        } ${isDragging ? "" : "transition-transform duration-200 ease-out"}`}
        style={{ transform: `translateX(${dragOffset}px)` }}
        onPointerDown={(event) => {
          if (isDeleting) return;
          if (event.pointerType === "mouse" && event.button !== 0) return;

          startXRef.current = event.clientX;
          startYRef.current = event.clientY;
          pointerIdRef.current = event.pointerId;
          isSwipeRef.current = false;
        }}
        onPointerMove={(event) => {
          if (isDeleting) return;
          const startX = startXRef.current;
          const startY = startYRef.current;

          if (startX === null || startY === null) return;

          const dx = event.clientX - startX;
          const dy = event.clientY - startY;
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);

          if (!isSwipeRef.current) {
            if (absX < 8 && absY < 8) return;
            if (absY > absX || dx <= 0) {
              resetSwipe();
              return;
            }

            isSwipeRef.current = true;
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }

          event.preventDefault();
          updateDragOffset(dx);
        }}
        onPointerUp={(event) => {
          const startX = startXRef.current;
          const startY = startYRef.current;
          const wasSwipe = isSwipeRef.current;

          startXRef.current = null;
          startYRef.current = null;
          isSwipeRef.current = false;
          pointerIdRef.current = null;

          if (startX === null || startY === null) {
            setIsDragging(false);
            return;
          }

          const dx = event.clientX - startX;
          const dy = event.clientY - startY;

          setIsDragging(false);

          const finalOffset = dragOffsetRef.current;

          if (
            !isDeleting &&
            wasSwipe &&
            finalOffset >= notificationDeleteThreshold &&
            Math.abs(dx) > Math.abs(dy)
          ) {
            updateDragOffset(notificationDeleteActionWidth);
            window.setTimeout(onDelete, 120);
            return;
          }

          updateDragOffset(0);
        }}
        onPointerCancel={(event) => {
          if (
            pointerIdRef.current !== null &&
            event.currentTarget.hasPointerCapture(pointerIdRef.current)
          ) {
            event.currentTarget.releasePointerCapture(pointerIdRef.current);
          }
          resetSwipe();
        }}
      >
        <div className="flex items-start justify-between gap-3 [direction:ltr]">
          <time className="shrink-0 pt-0.5 text-xs font-normal leading-4 text-[#999999]">
            {formatNotificationTime(item.created_at)}
          </time>

          <div className="min-w-0 flex-1 text-right [direction:rtl]">
            <div className="flex items-center justify-start gap-2">
              <Typography as="span" variant="body" size="medium" weight="regular"
                className={`h-3 w-3 shrink-0 rotate-45 rounded-[2px] ${
                  categoryColorClassNames[category]
                }`}
              />
              <Typography as="h2" variant="title" size="small" weight="semibold"
                className={`m-0 truncate text-sm leading-6 ${
                  isUnread ? "font-bold text-[#1a1a1a]" : "font-semibold text-[#4D4D4D]"
                }`}
              >
                {item.title || "اعلان جدید"}
              </Typography>
              {isUnread ? (
                <Typography as="span" variant="body" size="medium" weight="regular" className="h-2 w-2 shrink-0 rounded-full bg-[#ef1f1f]" aria-label="خوانده نشده" />
              ) : null}
            </div>

            <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 line-clamp-2 text-xs font-normal leading-5 text-[#4D4D4D]">
              {item.description || "برای مشاهده جزئیات اعلان را باز کنید."}
            </Typography>
          </div>
        </div>

        <div className="mt-auto flex justify-start [direction:rtl]">
          <NotificationActionButton
            label={getNotificationActionLabel(item)}
            onClick={onOpen}
          />
        </div>
      </article>
    </div>
  );
}

function mergeNotifications(
  realtimeNotifications: NotificationItem[],
  serverNotifications: NotificationItem[],
) {
  const usedIds = new Set<string>();
  const merged: NotificationItem[] = [];

  [...realtimeNotifications, ...serverNotifications].forEach((notification) => {
    const notificationId = String(notification.id);

    if (usedIds.has(notificationId)) return;
    usedIds.add(notificationId);
    merged.push(notification);
  });

  return merged;
}

export function NotificationsPage() {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isClearingRead, setIsClearingRead] = useState(false);
  const [markAllUnread, setMarkAllUnread] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState<NotificationItem[]>([]);
  const [selectedFilterIds, setSelectedFilterIds] = useState<Set<NotificationCategory>>(
    () => new Set(),
  );
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);

  const notificationsQuery = useNotificationsInfiniteQuery({
    perPage: notificationsPerPage,
  });
  const unreadCountQuery = useNotificationUnreadCountQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();

  const serverNotifications = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [notificationsQuery.data],
  );

  const notifications = useMemo(
    () => mergeNotifications(realtimeNotifications, serverNotifications),
    [realtimeNotifications, serverNotifications],
  );

  const selectedFilters = useMemo(
    () => notificationFilterOptions.filter((option) => selectedFilterIds.has(option.id)),
    [selectedFilterIds],
  );

  const visibleNotifications = useMemo(() => {
    if (selectedFilterIds.size === 0) return notifications;

    return notifications.filter((notification) =>
      selectedFilterIds.has(notification.category ?? "systems"),
    );
  }, [notifications, selectedFilterIds]);

  const ErrorState = getRequestErrorState(notificationsQuery.error);
  const fetchNextNotificationsPage = notificationsQuery.fetchNextPage;
  const hasNextNotificationsPage = notificationsQuery.hasNextPage;
  const isFetchingNextNotificationsPage = notificationsQuery.isFetchingNextPage;
  const refetchNotifications = notificationsQuery.refetch;
  const refetchUnreadCount = unreadCountQuery.refetch;

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (!node || !hasNextNotificationsPage || isFetchingNextNotificationsPage) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextNotificationsPage &&
            !isFetchingNextNotificationsPage
          ) {
            void fetchNextNotificationsPage();
          }
        },
        { root: null, rootMargin: "220px 0px", threshold: 0 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [
      fetchNextNotificationsPage,
      hasNextNotificationsPage,
      isFetchingNextNotificationsPage,
    ],
  );

  useEffect(() => {
    const socket = subscribeToNotifications({
      onSnapshot: (snapshot) => {
        if (typeof snapshot.unread_count === "number") {
          /*
          queryClient.setQueryData(
            queryKeys.notifications.unreadCount(),
            snapshot.unread_count,
          );
          */
          void refetchUnreadCount();
        }
      },
      perPage: notificationsPerPage,
    });

    const handleNewNotification = ({
      notification,
      unread_count: nextUnreadCount,
    }: {
      notification?: NotificationItem;
      unread_count?: number;
    }) => {
      if (notification) {
        setRealtimeNotifications((current) => [
          notification,
          ...current.filter((item) => String(item.id) !== String(notification.id)),
        ]);
      }

      if (typeof nextUnreadCount === "number") {
        /*
        queryClient.setQueryData(
          queryKeys.notifications.unreadCount(),
          nextUnreadCount,
        );
        */
        void refetchUnreadCount();
      }
    };

    const handleUnreadCount = ({ count }: { count?: number }) => {
      if (typeof count === "number") {
        // queryClient.setQueryData(queryKeys.notifications.unreadCount(), count);
        void refetchUnreadCount();
      }
    };

    const handleRead = (payload: NotificationReadPayload) => {
      if ("all" in payload && payload.all) {
        setRealtimeNotifications((current) =>
          current.map((notification) =>
            !payload.category || notification.category === payload.category
              ? { ...notification, is_read: true }
              : notification,
          ),
        );
      } else if (payload.notification_id) {
        setRealtimeNotifications((current) =>
          current.map((notification) =>
            String(notification.id) === payload.notification_id
              ? { ...notification, is_read: true }
              : notification,
          ),
        );
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    };

    const handleConnect = () => {
      void refetchNotifications();
      void refetchUnreadCount();
    };

    const handleSocketError = ({ message: socketMessage }: { message?: string }) => {
      if (import.meta.env.DEV) {
        console.error(socketMessage || "اتصال اعلان‌ها با خطا مواجه شد");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);
    socket.on("notification:read", handleRead);
    socket.on("notification:error", handleSocketError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
      socket.off("notification:read", handleRead);
      socket.off("notification:error", handleSocketError);
      loadMoreObserverRef.current?.disconnect();
      disconnectNotificationSocket();
    };
  }, [refetchNotifications, refetchUnreadCount]);

  const toggleFilter = (id: NotificationCategory) => {
    setSelectedFilterIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const removeFilter = (id: NotificationCategory) => {
    setSelectedFilterIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const refreshNotifications = async () => {
    setRealtimeNotifications([]);
    await Promise.all([notificationsQuery.refetch(), unreadCountQuery.refetch()]);
  };

  const openNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      setRealtimeNotifications((current) =>
        current.map((item) =>
          String(item.id) === String(notification.id) ? { ...item, is_read: true } : item,
        ),
      );

      try {
        await markReadMutation.mutateAsync(String(notification.id));
      } catch {
        void notificationsQuery.refetch();
        void unreadCountQuery.refetch();
      }
    }

    const path = getNotificationPath(notification);

    if (path) {
      navigateTo(path);
    }
  };

  const removeNotification = async (notification: NotificationItem) => {
    const notificationId = String(notification.id);
    const wasRealtimeNotification = realtimeNotifications.some(
      (item) => String(item.id) === notificationId,
    );

    setRealtimeNotifications((current) =>
      current.filter((item) => String(item.id) !== notificationId),
    );

    try {
      await deleteMutation.mutateAsync(notificationId);
    } catch {
      if (wasRealtimeNotification) {
        setRealtimeNotifications((current) =>
          current.some((item) => String(item.id) === notificationId)
            ? current
            : [notification, ...current],
        );
      }
    }
  };

  const markAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync(undefined);
      setRealtimeNotifications((current) =>
        current.map((notification) => ({ ...notification, is_read: true })),
      );
      setIsSettingsSheetOpen(false);
    } catch {
      void notificationsQuery.refetch();
      void unreadCountQuery.refetch();
    }
  };

  const clearReadNotifications = async () => {
    if (isClearingRead) return;
    const readNotificationIds = notifications
      .filter((notification) => notification.is_read === true)
      .map((notification) => String(notification.id));

    setIsClearingRead(true);
    try {
      for (const notificationId of readNotificationIds) {
        await deleteMutation.mutateAsync(notificationId);
      }
      setRealtimeNotifications((current) =>
        current.filter((notification) => notification.is_read === false),
      );
      await notificationsQuery.refetch();
      setIsSettingsSheetOpen(false);
    } catch {
      void notificationsQuery.refetch();
    } finally {
      setIsClearingRead(false);
    }
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <NotificationHeader
        onOpenSettings={() => setIsSettingsSheetOpen(true)}
        onRefresh={() => void refreshNotifications()}
      />
      <NotificationFilterBar
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onRemoveFilter={removeFilter}
        selectedFilters={selectedFilters}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white pb-5 [-webkit-overflow-scrolling:touch]">
        {notificationsQuery.isLoading ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">
            در حال دریافت اعلان‌ها...
          </Typography>
        ) : null}

        {notificationsQuery.isError ? (
          <ErrorState
            className="h-full min-h-0 flex-1"
            onRetry={() => void refreshNotifications()}
          />
        ) : null}

        {!notificationsQuery.isLoading &&
          !notificationsQuery.isError &&
          visibleNotifications.map((notification, index) => {
            const shouldAttachLoadMoreRef =
              index === Math.max(visibleNotifications.length - 10, 0) &&
              notificationsQuery.hasNextPage &&
              !notificationsQuery.isFetchingNextPage;

            return (
              <div
                key={String(notification.id)}
                ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
              >
                <SwipeableNotificationCard
                  isDeleting={
                    deleteMutation.isPending &&
                    deleteMutation.variables === String(notification.id)
                  }
                  item={notification}
                  onDelete={() => void removeNotification(notification)}
                  onOpen={() => void openNotification(notification)}
                />
              </div>
            );
          })}

        {!notificationsQuery.isLoading &&
        !notificationsQuery.isError &&
        visibleNotifications.length === 0 ? (
          selectedFilterIds.size > 0 ? <SearchEmptyState /> : <NotificationsEmptyState />
        ) : null}

        {notificationsQuery.isFetchingNextPage ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="py-4 text-center text-xs text-[#808080]">
            در حال دریافت اعلان‌های بیشتر...
          </Typography>
        ) : null}
      </main>

      <NotificationFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onToggle={toggleFilter}
        selectedFilterIds={selectedFilterIds}
      />
      <NotificationSettingsSheet
        isClearingRead={isClearingRead}
        isMarkingAllRead={markAllReadMutation.isPending}
        isOpen={isSettingsSheetOpen}
        markAllUnread={markAllUnread}
        onClearRead={() => void clearReadNotifications()}
        onClose={() => setIsSettingsSheetOpen(false)}
        onMarkAllRead={() => void markAllRead()}
        onMarkAllUnreadChange={setMarkAllUnread}
        onManage={() => {
          setIsSettingsSheetOpen(false);
          navigateTo("/notifications/settings");
        }}
      />
    </PageFrame>
  );
}

export function NotificationManagementPage() {
  const preferencesQuery = useNotificationPreferencesQuery();
  const updatePreferenceMutation = useUpdateNotificationPreferenceMutation();
  const [optimisticPreferences, setOptimisticPreferences] = useState<
    Partial<Record<NotificationCategory, boolean>>
  >({});
  const [pendingCategories, setPendingCategories] = useState<Set<NotificationCategory>>(
    () => new Set(),
  );
  const preferenceMap = new Map<NotificationCategory, boolean>(
    (preferencesQuery.data ?? []).map((preference) => [
      preference.category,
      preference.enabled,
    ]),
  );

  allPreferenceCategories.forEach((category) => {
    const optimisticValue = optimisticPreferences[category];

    if (optimisticValue !== undefined) {
      preferenceMap.set(category, optimisticValue);
    }
  });

  useEffect(() => {
    if (!preferencesQuery.data) return;

    setOptimisticPreferences((current) => {
      const next = { ...current };
      let hasChanges = false;

      preferencesQuery.data.forEach((preference) => {
        if (
          next[preference.category] !== undefined &&
          next[preference.category] === preference.enabled
        ) {
          delete next[preference.category];
          hasChanges = true;
        }
      });

      return hasChanges ? next : current;
    });
  }, [preferencesQuery.data]);

  const allNotificationsEnabled = allPreferenceCategories.every(
    (category) => preferenceMap.get(category) ?? true,
  );

  const updateCategory = async (
    category: NotificationCategory,
    enabled: boolean,
  ) => {
    const previousOptimisticValue = optimisticPreferences[category];

    setOptimisticPreferences((current) => ({ ...current, [category]: enabled }));
    setPendingCategories((current) => new Set(current).add(category));

    try {
      await updatePreferenceMutation.mutateAsync({ category, enabled });
    } catch {
      setOptimisticPreferences((current) => {
        if (current[category] !== enabled) return current;

        const next = { ...current };

        if (previousOptimisticValue === undefined) {
          delete next[category];
        } else {
          next[category] = previousOptimisticValue;
        }

        return next;
      });
      void preferencesQuery.refetch();
    } finally {
      setPendingCategories((current) => {
        const next = new Set(current);
        next.delete(category);
        return next;
      });
    }
  };

  const updateAllCategories = async (enabled: boolean) => {
    const previousOptimisticValues = { ...optimisticPreferences };

    setOptimisticPreferences((current) => {
      const next = { ...current };
      allPreferenceCategories.forEach((category) => {
        next[category] = enabled;
      });
      return next;
    });
    setPendingCategories((current) =>
      new Set([...current, ...allPreferenceCategories]),
    );

    try {
      for (const category of allPreferenceCategories) {
        await updatePreferenceMutation.mutateAsync({ category, enabled });
      }
    } catch {
      setOptimisticPreferences((current) => {
        const next = { ...current };

        allPreferenceCategories.forEach((category) => {
          if (current[category] !== enabled) return;

          const previousValue = previousOptimisticValues[category];

          if (previousValue === undefined) {
            delete next[category];
          } else {
            next[category] = previousValue;
          }
        });

        return next;
      });
      void preferencesQuery.refetch();
    } finally {
      setPendingCategories((current) => {
        const next = new Set(current);
        allPreferenceCategories.forEach((category) => next.delete(category));
        return next;
      });
    }
  };

  const hasPendingCategories = pendingCategories.size > 0;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به اعلان‌ها"
        backTo="/notifications"
        heightClassName="h-14"
        title="مدیریت اعلان‌ها"
        titleClassName="text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white pb-6">
        <section className="flex  items-center justify-between px-4 py-3 [direction:ltr]">
          <SwitchButton
            ariaLabel="فعال‌سازی اعلان‌ها"
            checked={allNotificationsEnabled}
            disabled={preferencesQuery.isLoading || hasPendingCategories}
            onChange={(enabled) => void updateAllCategories(enabled)}
          />
          <div className="flex min-w-0 flex-1 items-start gap-2 text-right [direction:rtl]">
            <LinearNotification className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
            <div className="min-w-0">
              <Typography as="h2" variant="headline" size="large" className="m-0 text-[#1a1a1a]">فعال‌سازی اعلان‌ها</Typography>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 max-w-[220px] text-sm text-[#a6a6a6]">
                با غیرفعال کردن این گزینه، همه اعلان‌ها متوقف می‌شوند.
              </Typography>
            </div>
          </div>
        </section>

        <div className="h-1.5 bg-[#f5f5f5]" />

        <section aria-label="دسته‌بندی اعلان‌ها">
          {notificationManagementOptions.map((option) => {
            const enabled = preferenceMap.get(option.category) ?? true;

            return (
              <div
                className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3.5 [direction:ltr] last:border-b-0"
                key={option.category}
              >
                <SwitchButton
                  ariaLabel={`تغییر وضعیت ${option.label}`}
                  checked={enabled}
                  disabled={preferencesQuery.isLoading || pendingCategories.has(option.category)}
                  onChange={(nextEnabled) => void updateCategory(option.category, nextEnabled)}
                />
                <div className="min-w-0 flex-1 text-right" dir="rtl">
                  <Typography as="h2" variant="headline" size="large" className="m-0 text-[#1a1a1a]">{option.label}</Typography>
                  <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-sm font-normal text-[#a6a6a6]">
                    {option.description}
                  </Typography>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </PageFrame>
  );
}
