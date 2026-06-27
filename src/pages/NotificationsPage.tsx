import { useMemo, useRef, useState } from "react";
import { PageFrame } from "../app/PageFrame";
import { BottomSheet } from "../components/BottomSheet";
import { DemoNotice } from "../components/DemoNotice";
import { TopBar } from "../components/TopBar";
import { useDemoNotice } from "../hooks/useDemoNotice";

type NotificationType = "ads" | "deals" | "requests" | "chats" | "system" | "financial";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  actionLabel: string;
  time: string;
  colorClassName: string;
};

type FilterOption = {
  id: NotificationType;
  label: string;
};

const notificationFilterOptions: FilterOption[] = [
  { id: "ads", label: "آگهی‌ها" },
  { id: "deals", label: "معاملات" },
  { id: "requests", label: "درخواست‌ها" },
  { id: "chats", label: "چت‌ها" },
  { id: "system", label: "سیستم" },
  { id: "financial", label: "مالی" },
];

const initialNotifications: NotificationItem[] = [
  {
    id: "published",
    type: "ads",
    title: "آگهی شما منتشر شد",
    description: "آگهی آپارتمان ۱۵۰ متری سعادت‌آباد، با موفقیت منتشر شد.",
    actionLabel: "مشاهده آگهی",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#00a66a]",
  },
  {
    id: "rejected",
    type: "ads",
    title: "آگهی شما تایید نشد",
    description: "آگهی ثبت‌شده به دلیل مغایرت با قوانین منتشر نشد.",
    actionLabel: "مشاهده دلیل رد",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#ff3b30]",
  },
  {
    id: "incomplete",
    type: "ads",
    title: "اطلاعات آگهی ناقص است",
    description: "برای انتشار آگهی، اطلاعات خواسته‌شده را تکمیل کنید.",
    actionLabel: "ویرایش آگهی",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#14905a]",
  },
  {
    id: "updated",
    type: "ads",
    title: "اطلاعات آگهی بروزرسانی شد",
    description: "تغییرات اعمال‌شده با موفقیت ذخیره شد.",
    actionLabel: "ویرایش آگهی",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#0048c4]",
  },
  {
    id: "special",
    type: "financial",
    title: "آگهی شما ویژه شد",
    description: "آگهی اکنون با اولویت بیشتری نمایش داده می‌شود.",
    actionLabel: "ویرایش آگهی",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#f1c232]",
  },
  {
    id: "renewed",
    type: "financial",
    title: "آگهی تمدید شد",
    description: "مدت نمایش آگهی شما افزایش یافت.",
    actionLabel: "مشاهده آگهی",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#67d69a]",
  },
  {
    id: "chat",
    type: "chats",
    title: "پیام جدید دریافت کردید",
    description: "یک کاربر درباره آگهی آپارتمان شما پیام داده است.",
    actionLabel: "مشاهده چت",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#0048c4]",
  },
  {
    id: "deal",
    type: "deals",
    title: "وضعیت معامله بروزرسانی شد",
    description: "وضعیت معامله شما در سامانه تغییر کرد.",
    actionLabel: "مشاهده معامله",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#8b5cf6]",
  },
  {
    id: "request",
    type: "requests",
    title: "درخواست جدید ثبت شد",
    description: "یک درخواست جدید برای بررسی در حساب شما ثبت شده است.",
    actionLabel: "مشاهده درخواست",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#f97316]",
  },
  {
    id: "system",
    type: "system",
    title: "پیام سیستمی جدید",
    description: "نسخه جدید قوانین استفاده از سامانه منتشر شده است.",
    actionLabel: "مشاهده پیام",
    time: "دیروز ۱۲:۳۰",
    colorClassName: "bg-[#64748b]",
  },
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

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M9.5 4.5h5M5 7h14M7 7l.7 12.2A2 2 0 0 0 9.7 21h4.6a2 2 0 0 0 2-1.8L17 7M10 11v6M14 11v6"
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

function NotificationHeader({ onRefresh }: { onRefresh: () => void }) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: () => undefined,
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
    <button
      className="relative flex p-2 shrink-0 items-center gap-1 rounded-xl border border-[#2E2D3E29] bg-white px-2.5 text-sm font-medium leading-5 text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#f7f7f7]"
      onClick={onClick}
      type="button"
    >
      <FilterSlidersIcon className="h-5 w-5" />
      <span>فیلتر</span>
      {count > 0 ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#0048c4] px-1 text-xs font-semibold leading-5 text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function NotificationFilterBar({
  onOpenFilters,
  onRemoveFilter,
  selectedFilters,
}: {
  onOpenFilters: () => void;
  onRemoveFilter: (id: NotificationType) => void;
  selectedFilters: FilterOption[];
}) {
  return (
    <section
      className={`shrink-0 overflow-hidden bg-[#f0f0f0] px-4 py-2`}
      aria-label="فیلتر اعلان‌ها"
    >
      <div className="flex min-h-10 items-center gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <NotificationFilterButton count={selectedFilters.length} onClick={onOpenFilters} />
        {selectedFilters.map((filter) => (
          <button
            aria-label={`حذف فیلتر ${filter.label}`}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#0048C4] bg-[#0048c414] px-3 text-sm font-medium leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            key={filter.id}
            onClick={() => onRemoveFilter(filter.id)}
            type="button"
          >
            <span>{filter.label}</span>
            <CloseIcon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </section>
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
  onToggle: (id: NotificationType) => void;
  selectedFilterIds: Set<NotificationType>;
}) {
  return (
    <BottomSheet
      ariaLabel="فیلتر اعلان‌ها"
      className="rounded-t-[22px]"
      contentClassName="mt-4"
      heightClassName="h-[440px]"
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
            <button
              aria-pressed={isSelected}
              className="flex h-[72px] w-full items-center justify-between text-right text-base font-medium leading-6 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
            >
              <span>{option.label}</span>
              <span
                className={`grid h-[18px] w-[18px] place-items-center rounded border ${isSelected
                  ? "border-[#0048c4] bg-[#0048c4] text-white"
                  : "border-[#808080] bg-white text-transparent"
                  }`}
              >
                <CheckIcon className="h-[14px] w-[14px]" />
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

function NotificationActionButton({ label, type }: { label: string; type: NotificationType }) {
  return (
    <button
      className="flex px-4 py-1.5 items-center gap-1 rounded-lg border border-[#d9d9d9] bg-white !text-xs !font-medium leading-4 text-[#333333] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#f7f7f7]"
      onClick={() => {
        if (type === "chats") {
          navigateTo("/chat");
        }
      }}
      type="button"
    >
      <span>{label}</span>
      <ChevronLeftIcon className="h-4 w-4" />
    </button>
  );
}

function SwipeableNotificationCard({
  item,
  onDelete,
}: {
  item: NotificationItem;
  onDelete: () => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isSwipeRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  const resetSwipe = () => {
    setDragOffset(0);
    setIsDragging(false);
    startXRef.current = null;
    startYRef.current = null;
    isSwipeRef.current = false;
    pointerIdRef.current = null;
  };

  return (
    <div className="relative overflow-hidden border-b border-[#eeeeee] bg-white">
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 z-0 flex w-[84px] flex-col items-center justify-center gap-2 bg-[#f9d9d9] text-[#ef1f1f]"
      >
        <TrashIcon className="h-6 w-6" />
        <span className="text-xs font-semibold leading-4">حذف</span>
      </div>

      <article
        className={`relative z-10 flex h-full touch-pan-y select-none flex-col gap-y-4 bg-white px-4 py-4 text-right ${isDragging ? "" : "transition-transform duration-200 ease-out"
          }`}
        style={{ transform: `translateX(${dragOffset}px)` }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;

          startXRef.current = event.clientX;
          startYRef.current = event.clientY;
          pointerIdRef.current = event.pointerId;
          isSwipeRef.current = false;
        }}
        onPointerMove={(event) => {
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
          setDragOffset(Math.min(dx, 128));
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

          if (wasSwipe && dx >= 96 && Math.abs(dx) > Math.abs(dy)) {
            setDragOffset(128);
            window.setTimeout(onDelete, 120);
            return;
          }

          setDragOffset(0);
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
            {item.time}
          </time>

          <div className="min-w-0 flex-1 text-right [direction:rtl]">
            <div className="flex items-center justify-start gap-2">
              <span className={`h-3 w-3 shrink-0 rotate-45 rounded-[2px] ${item.colorClassName}`} />
              <h2 className="m-0 truncate text-sm font-semibold leading-6 text-[#4D4D4D]">
                {item.title}
              </h2>
            </div>

            <p className="mt-2 line-clamp-1 text-xs font-normal leading-5 text-[#4D4D4D]">
              {item.description}
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-start [direction:rtl]">
          <NotificationActionButton label={item.actionLabel} type={item.type} />
        </div>
      </article>
    </div>
  );
}

export function NotificationsPage() {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedFilterIds, setSelectedFilterIds] = useState<Set<NotificationType>>(
    () => new Set(),
  );
  const { message, showNotice } = useDemoNotice();

  const selectedFilters = useMemo(
    () => notificationFilterOptions.filter((option) => selectedFilterIds.has(option.id)),
    [selectedFilterIds],
  );

  const visibleNotifications = useMemo(() => {
    if (selectedFilterIds.size === 0) return notifications;

    return notifications.filter((notification) => selectedFilterIds.has(notification.type));
  }, [notifications, selectedFilterIds]);

  const toggleFilter = (id: NotificationType) => {
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

  const removeFilter = (id: NotificationType) => {
    setSelectedFilterIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
    showNotice("اعلان حذف شد");
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <NotificationHeader onRefresh={() => showNotice("اعلان‌ها بروزرسانی شد")} />
      <NotificationFilterBar
        onOpenFilters={() => setIsFilterSheetOpen(true)}
        onRemoveFilter={removeFilter}
        selectedFilters={selectedFilters}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-5 [-webkit-overflow-scrolling:touch]">
        {visibleNotifications.map((notification) => (
          <SwipeableNotificationCard
            item={notification}
            key={notification.id}
            onDelete={() => deleteNotification(notification.id)}
          />
        ))}

        {visibleNotifications.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#808080]">اعلانی یافت نشد</p>
        ) : null}
      </main>

      <NotificationFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        onToggle={toggleFilter}
        selectedFilterIds={selectedFilterIds}
      />
      <DemoNotice message={message} />
    </PageFrame>
  );
}
