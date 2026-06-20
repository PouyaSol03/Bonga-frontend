import { type ReactNode, useState } from "react";

import { BottomSheet, BottomSheetActionList } from "../components/BottomSheet";
import { DemoNotice } from "../components/DemoNotice";
import { useDemoNotice } from "../hooks/useDemoNotice";
import { TopBar } from "../components/TopBar";
import { PageFrame } from "../app/PageFrame";
import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import { RouteLink } from "../routes/RouteLink";

type ChatItem = {
  adCategory: string;
  adLabel: string;
  adTitle: string;
  badgeCount?: string;
  date: string;
  highlighted?: boolean;
  isBlocked?: boolean;
  message: string;
  userName: string;
};

const filters = ["پشتیبانی", "خوانده نشده", "آگهی‌های من", "آگهی‌های دیگران"];

const chatItems: ChatItem[] = [
  {
    adCategory: "اجاره روزانه باغ ویلا",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    badgeCount: "2",
    date: "12 فروردین",
    highlighted: true,
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "اجاره آپارتمان",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    badgeCount: "1",
    date: "12 فروردین",
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "03/12/6",
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "12/2",
    isBlocked: true,
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
  {
    adCategory: "باغ ویلا با استخر آب گرم",
    adLabel: "آگهی من",
    adTitle: "باغ ویلا با استخر آب گرم",
    date: "12/2",
    message:
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را در تلگرام یا روبیکا به همین شماره ارسال کنید تا عکس های باغ بهمراه قیمت خدمت شما ارسال شود",
    userName: "ناصر اشرفی",
  },
];

const chatCardOverrides: Partial<ChatItem>[] = [
  {},
  {
    adCategory: "فروش آپارتمان",
    badgeCount: undefined,
    date: "25 خرداد",
    isBlocked: true,
  },
  {
    adCategory: "اجاره آپارتمان",
    date: "6 شهریور",
    isBlocked: true,
  },
];

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.2 16.2 3.8 3.8" />
    </svg>
  );
}

function MoreVerticalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 6h.01M12 12h.01M12 18h.01" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function BlockedIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="5.5" />
      <path d="m4.5 11.5 7-7" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 18 18"
    >
      <path d="m5.1 9.1 2.3 2.3 5.5-5.5" />
    </svg>
  );
}

function BuildingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M4 21h16" />
      <path d="M6 21V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V21" />
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" />
    </svg>
  );
}

function LinkChainIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
    >
      <path d="M10.5 13.5 13.5 10.5" />
      <path d="M8.5 17.5 6.8 19.2a4 4 0 0 1-5.7-5.7l3.2-3.2a4 4 0 0 1 5.7 0" />
      <path d="m15.5 6.5 1.7-1.7a4 4 0 0 1 5.7 5.7l-3.2 3.2a4 4 0 0 1-5.7 0" />
    </svg>
  );
}

function SendMessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M10.6 13.4 13.4 10.6" />
      <path d="M10.6 13.4 3.70058 11.8502C2.82251 11.6506 2.74934 10.4279 3.59735 10.125L17.7955 5.05425C18.5106 4.79885 19.2011 5.48933 18.9458 6.20445L13.875 20.4026C13.5721 21.2506 12.3494 21.1775 12.1498 20.2994L10.6 13.4Z" />
    </svg>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M7.5 6.5 9 4h6l1.5 2.5H19A2.5 2.5 0 0 1 21.5 9v8A2.5 2.5 0 0 1 19 19.5H5A2.5 2.5 0 0 1 2.5 17V9A2.5 2.5 0 0 1 5 6.5h2.5Z" />
      <path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </svg>
  );
}

function AlbumIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="16" rx="2.5" width="18" x="3" y="4" />
      <path d="m6.5 16 3.1-3.2a1.4 1.4 0 0 1 2 0l1.4 1.4 2.1-2.1a1.4 1.4 0 0 1 2 0l2.4 2.4" />
      <path d="M8.5 8.5h.01" />
    </svg>
  );
}

function MapLocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 21s7-5.2 7-11.2A7 7 0 0 0 5 9.8C5 15.8 12 21 12 21Z" />
      <path d="M12 12.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
    </svg>
  );
}

function DoubleTickIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="m3.5 12.5 3.5 3.5 7-8" />
      <path d="m11 15.5 1 1 8-9" />
    </svg>
  );
}

function ClockAlarmIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M8 2.75 3.75 6.2" />
      <path d="M16 2.75 20.25 6.2" />
      <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 8.5V12l2.5 2.2" />
      <path d="m7.5 20.5-1.4 1.4" />
      <path d="m16.5 20.5 1.4 1.4" />
    </svg>
  );
}

function HeadphoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M4 13.2v-1.4a8 8 0 0 1 16 0v1.4" />
      <path d="M4 13.4a2.2 2.2 0 0 1 2.2-2.2H8v6H6.2A2.2 2.2 0 0 1 4 15v-1.6Z" />
      <path d="M20 13.4a2.2 2.2 0 0 0-2.2-2.2H16v6h1.8A2.2 2.2 0 0 0 20 15v-1.6Z" />
      <path d="M16 18.5h-2.2a2 2 0 0 1-2-2V16" />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6.5 7 7.4 20a2 2 0 0 0 2 1.8h5.2a2 2 0 0 0 2-1.8L17.5 7" />
      <path d="M9 7V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6V7" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v6" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2.05 2.05 0 0 1-2.9 2.9l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2.05 2.05 0 0 1-4.1 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.05 2.05 0 0 1-2.9-2.9l.06-.06A1.7 1.7 0 0 0 4.3 15a1.7 1.7 0 0 0-1.56-1.03h-.09a2.05 2.05 0 0 1 0-4.1h.09A1.7 1.7 0 0 0 4.3 8.74a1.7 1.7 0 0 0-.34-1.87L3.9 6.8a2.05 2.05 0 0 1 2.9-2.9l.06.06A1.7 1.7 0 0 0 8.73 4.3h.08a1.7 1.7 0 0 0 1.03-1.56v-.09a2.05 2.05 0 0 1 4.1 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.05 2.05 0 0 1 2.9 2.9l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.09a2.05 2.05 0 0 1 0 4.1h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function ChatHeader({
  onOpenMenu,
  onOpenSearch,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
        {
          icon: <SearchIcon className="h-6 w-6" />,
          id: "search",
          label: "جستجو در چت‌ها",
          onClick: onOpenSearch,
        },
      ]}
      backTo="/home"
      title="چت و اعلان‌‌ها"
    />
  );
}

function FilterTabs({
  activeFilter,
  onSelect,
}: {
  activeFilter: string | null;
  onSelect: (filter: string) => void;
}) {
  return (
    <section className="h-[52px] shrink-0 overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter}
            className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-medium leading-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${activeFilter === filter
                ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
                : "border-[#cccccc] bg-white text-[#4d4d4d]"
              }`}
            key={filter}
            onClick={() => onSelect(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}

const chatMenuItems = [
  {
    id: "hours",
    icon: ClockAlarmIcon,
    title: "ساعات پاسخگویی",
  },
  {
    id: "bulk-delete",
    icon: BlockedIcon,
    title: "حذف گروهی گفتگوها",
  },
  {
    id: "settings",
    icon: SettingsIcon,
    title: "تنظیمات",
  },
];

function ChatMenuBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="منوی چت"
      contentClassName="mt-4"
      heightClassName="h-[298px]"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-[#1a1a1a]/35"
      title="چت"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        items={chatMenuItems.map((item) => ({
          id: item.id,
          title: item.title,
          Icon: item.icon,
        }))}
        onSelect={(item) => onSelect(item.id)}
      />
    </BottomSheet>
  );
}

function UnreadBadge({ count }: { count?: string }) {
  if (!count) return null;

  return (
    <span className="grid h-4 min-w-3.5 place-items-center rounded-full bg-[#0048c4] px-1 text-xs font-medium leading-4 text-white">
      {count}
    </span>
  );
}

function BlockedBadge() {
  return (
    <span className="flex h-5 items-center gap-1 rounded-lg bg-[#dd2b1e1f] px-2 text-xs font-normal leading-4 text-[#c11004]">
      <BlockedIcon className="h-3 w-3" />
      <span>مسدود</span>
    </span>
  );
}

function SelectionCheckbox({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-pressed={isSelected}
      aria-label={isSelected ? "برداشتن انتخاب گفتگو" : "انتخاب گفتگو"}
      className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      type="button"
    >
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
}

function ChatCard({
  index,
  isBulkDeleteMode,
  isSelected,
  item,
  onToggleSelected,
}: {
  index: number;
  isBulkDeleteMode: boolean;
  isSelected: boolean;
  item: ChatItem;
  onToggleSelected: () => void;
}) {
  const displayItem = { ...item, ...chatCardOverrides[index] };
  const isHighlighted = isBulkDeleteMode
    ? isSelected
    : Boolean(displayItem.highlighted);

  const cardClassName = `relative h-[140px] shrink-0 overflow-visible border-b border-[#f0f0f0] px-4 py-4 text-right ${isHighlighted ? "bg-[#0048c41f]" : "bg-white"
    }`;

  const cardContent = (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={cardClassName}
      onClick={isBulkDeleteMode ? onToggleSelected : undefined}
      onKeyDown={
        isBulkDeleteMode
          ? (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            onToggleSelected();
          }
          : undefined
      }
      role={isBulkDeleteMode ? "button" : undefined}
      tabIndex={isBulkDeleteMode ? 0 : undefined}
    >
      <div
        className={`flex items-start justify-between [direction:ltr] ${isBulkDeleteMode ? "h-12" : "h-5"
          }`}
      >
        <div className={isBulkDeleteMode ? "w-[276px] min-w-0" : "w-full min-w-0"}>
          <div className="flex h-5 items-center justify-between [direction:ltr]">
            <div className="flex items-center gap-2 text-xs font-normal leading-4 text-[#808080]">
              <span>{displayItem.date}</span>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-4 [direction:rtl]">
              <span className="flex min-w-0 items-center gap-1 text-sm font-medium leading-5 text-[#1a1a1a]">
                <UserIcon className="h-5 w-5 text-[#4d4d4d]" />
                <span className="truncate">{displayItem.userName}</span>
              </span>
              {displayItem.isBlocked ? <BlockedBadge /> : null}
            </div>
          </div>

          {isBulkDeleteMode ? (
            <p className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
              {displayItem.message}
            </p>
          ) : null}
        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={onToggleSelected} />
        ) : null}
      </div>

      {!isBulkDeleteMode ? (
        <p className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
          {displayItem.message}
        </p>
      ) : null}

      <div className="mt-3 flex h-12 items-center justify-between [direction:ltr]">
        <div className="min-w-0 flex-1 pr-2 text-right">
          <div className="flex h-5 items-center justify-end gap-2 [direction:rtl]">
            <span className="rounded bg-[#0048c414] px-2 py-0.5 text-xs font-normal leading-4 text-[#0048c4]">
              {displayItem.adLabel}
            </span>
            <span className="truncate text-xs font-normal leading-4 text-[#808080]">
              {displayItem.adCategory}
            </span>
          </div>
          <div className="mt-2 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
            {displayItem.adTitle}
          </div>
        </div>
        <img
          alt=""
          className="h-12 w-[72px] shrink-0 rounded object-cover"
          src="/figma/view-ad-album.png"
        />
      </div>
    </article>
  );

  if (isBulkDeleteMode) {
    return cardContent;
  }

  return (
    <RouteLink
      aria-label={`${displayItem.userName} - ${displayItem.adTitle}`}
      className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      to={`/chat/${index + 1}`}
    >
      {cardContent}
    </RouteLink>
  );
}

function ChatDetailHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
      ]}
      backLabel="بازگشت به چت‌ها"
      backTo="/chat"
      className="border-b border-[#e6e6e6]"
      contentClassName="px-0"
      heightClassName="h-[52px]"
      title="آژانس جلالیان"
      titleClassName="text-base font-semibold leading-6"
    />
  );
}

function ChatPropertyStrip() {
  return (
    <section className="flex shrink-0 items-center gap-2 bg-[#F5F5F5] py-2 px-4 text-right [direction:rtl]">
      <img
        alt=""
        className="h-10 w-[54px] shrink-0 rounded-md object-cover"
        src="/figma/view-ad-album.png"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-normal leading-4 text-[#1a1a1a]">
          فروش مسکونی / آپارتمان
        </p>
        <p className="mt-1 truncate text-xs font-medium leading-4 text-[#1a1a1a]">
          ۱۳۰متر - دونبش جنوبی - معاوضه با آپارتمان شما
        </p>
      </div>
    </section>
  );
}

function AgencyResponseCard() {
  return (
    <section className="h-[84px] rounded-lg border border-[#0048c4] bg-[#eef4ff] px-3 py-2 text-right">
      <div className="flex h-5 items-center gap-1.5 [direction:rtl]">
        <HeadphoneIcon className="h-5 w-5 shrink-0 text-[#0048c4]" />
        <h2 className="text-sm font-semibold leading-5 text-[#0048c4]">
          ساعت پاسخگویی آژانس
        </h2>
      </div>
      <div className="mt-2 space-y-1 text-xs font-normal leading-4">
        <p className="flex items-center justify-between gap-3">
          <span className="text-[#808080]">روزهای هفته:</span>
          <span className="text-[#1a1a1a]">شنبه تا چهارشنبه</span>
        </p>
        <p className="flex items-center justify-between gap-3">
          <span className="text-[#808080]">ساعت:</span>
          <span className="text-[#1a1a1a]">از 8 صبح - تا 9 شب</span>
        </p>
      </div>
    </section>
  );
}

function ChatBubble({
  children,
  direction,
  time = "18:21",
  wide = false,
}: {
  children: ReactNode;
  direction: "incoming" | "outgoing";
  time?: string;
  wide?: boolean;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`${wide ? "w-[168px]" : "w-fit min-w-[72px] max-w-[198px]"} rounded-lg px-3 py-2 text-right ${isOutgoing
            ? "bg-[#eef3fb] rounded-tr-none"
            : "border border-[#e6e6e6] bg-white rounded-tl-none"
          }`}
        dir="rtl"
      >
        <p className="whitespace-pre-line text-[11px] font-normal leading-[18px] text-[#1a1a1a]">
          {children}
        </p>
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] font-normal leading-4 ${isOutgoing ? "justify-end [direction:ltr] text-[#0048c4]" : "justify-start text-[#808080]"
            }`}
        >
          <span>{time}</span>
          {isOutgoing ? <DoubleTickIcon className="h-3.5 w-3.5 text-[#0048c4]" /> : null}
        </div>
      </div>
    </div>
  );
}

function ChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <span className="rounded-lg bg-[#f5f5f5] px-3 py-1 text-[10px] font-normal leading-4 text-[#808080]">
        22 بهمن
      </span>
    </div>
  );
}

function ChatComposer({
  message,
  onChangeMessage,
  onOpenAttach,
  onSend,
}: {
  message: string;
  onChangeMessage: (message: string) => void;
  onOpenAttach: () => void;
  onSend: () => void;
}) {
  return (
    <footer className="shrink-0 bg-transparent px-2 pb-4 pt-1">
      <div className="flex items-center gap-2 rounded-full border border-transparent p-1.5 [direction:ltr] shadow-[0_-1px_0px_0px_#FFFFFF] [background:linear-gradient(#CCCCCC29,#CCCCCC29)_padding-box,linear-gradient(to_bottom,transparent,#CCCCCC29)_border-box]">
        <button
          aria-label="ارسال فایل"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#808080] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onOpenAttach}
          type="button"
        >
          <LinkChainIcon className="h-6 w-6" />
        </button>

        <label className="min-w-0 flex-1">
          <span className="sr-only">پیام خود را بنویسید</span>
          <input
            className="h-11 w-full rounded-xl border-0 px-2 text-right text-[12px] leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:ring-0"
            dir="rtl"
            placeholder="پیام خود را بنویسید"
            type="text"
            value={message}
            onChange={(event) => onChangeMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSend();
              }
            }}
          />
        </label>

        <button
          aria-label="ارسال پیام"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0048c4] text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003da8]"
          onClick={onSend}
          type="button"
        >
          <SendMessageIcon className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
}

type SendFileOption = {
  id: string;
  title: string;
  Icon: typeof CameraIcon;
};

const sendFileOptions: SendFileOption[] = [
  {
    id: "camera",
    title: "عکس با دوربین",
    Icon: CameraIcon,
  },
  {
    id: "gallery",
    title: "عکس از گالری",
    Icon: AlbumIcon,
  },
  {
    id: "map",
    title: "موقعیت در نقشه",
    Icon: MapLocationIcon,
  },
];

function SendFileBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="ارسال فایل"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      heightClassName="h-[200px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      scrimClassName="bg-[#1a1a1a]/65"
      title="ارسال"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={sendFileOptions}
        onSelect={(item) => onSelect(item.title)}
      />
    </BottomSheet>
  );
}

const chatSettingsOptions = [
  {
    id: "block",
    title: "مسدود کردن",
    Icon: BlockedIcon,
  },
  {
    id: "delete",
    title: "حذف مکالمه",
    Icon: TrashIcon,
  },
  {
    id: "report",
    title: "گزارش تخلف",
    Icon: InfoIcon,
  },
];

function ChatSettingsBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="تنظیمات مکالمه"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      heightClassName="h-[200px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-2"
      scrimClassName="bg-[#1a1a1a]/65"
      title="تنظیمات مکالمه"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={chatSettingsOptions}
        onSelect={(item) => onSelect(item.title)}
      />
    </BottomSheet>
  );
}

export function UserChatDetailPage() {
  const [isSendFileSheetOpen, setIsSendFileSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const { message, showNotice } = useDemoNotice();

  const sendMessage = (nextMessage = draftMessage) => {
    const text = nextMessage.trim();
    if (!text) return;

    setSentMessages((current) => [...current, text]);
    setDraftMessage("");
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ChatDetailHeader onOpenMenu={() => setIsSettingsSheetOpen(true)} />
      <ChatPropertyStrip />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-2.5 pb-3 pt-3">
        <AgencyResponseCard />

        <div className="mt-3 space-y-3">
          <ChatBubble direction="outgoing" wide>
            سلام{"\n"}قیمت این خونه ای که گذاشتین چقدر هست و اگر بخوام رهن و بیشتر کنم امکانش هست؟
          </ChatBubble>
          <ChatBubble direction="incoming" wide>
            سلام دوست عزیز{"\n"}قیمت و داخل آگهی گذاشتم و قیمت مناسبی هم هست{"\n"}رهن و اجاره قابل تبدیل هست
          </ChatBubble>
          <ChatDateChip />
          <ChatBubble direction="outgoing">خیلی ممنونم</ChatBubble>
          <ChatBubble direction="incoming">خواهش میکنم</ChatBubble>
          {sentMessages.map((sentMessage, index) => (
            <ChatBubble direction="outgoing" key={`${sentMessage}-${index}`}>
              {sentMessage}
            </ChatBubble>
          ))}
        </div>
      </main>

      <ChatComposer
        message={draftMessage}
        onChangeMessage={setDraftMessage}
        onOpenAttach={() => setIsSendFileSheetOpen(true)}
        onSend={() => sendMessage()}
      />
      <SendFileBottomSheet
        isOpen={isSendFileSheetOpen}
        onClose={() => setIsSendFileSheetOpen(false)}
        onSelect={(title) => {
          sendMessage(`[${title}]`);
          setIsSendFileSheetOpen(false);
        }}
      />
      <ChatSettingsBottomSheet
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        onSelect={(title) => {
          showNotice(`${title} انتخاب شد`);
          setIsSettingsSheetOpen(false);
        }}
      />
      <DemoNotice className="bottom-20" message={message} />
    </PageFrame>
  );
}

export function UserChatHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [chatIndexes, setChatIndexes] = useState(() => chatItems.map((_, index) => index));
  const [selectedChatIndexes, setSelectedChatIndexes] = useState<Set<number>>(
    () => new Set(),
  );
  const { message, showNotice } = useDemoNotice();

  const handleMenuSelect = (id: string) => {
    setIsMenuOpen(false);

    if (id === "hours") {
      showNotice("ساعت پاسخگویی: شنبه تا چهارشنبه، ۸ صبح تا ۹ شب");
      return;
    }

    if (id === "settings") {
      showNotice("تنظیمات نمایشی گفتگو باز شد");
      return;
    }

    if (id === "bulk-delete") {
      setIsBulkDeleteMode(true);
      setSelectedChatIndexes(new Set());
    }
  };

  const toggleSelectedChat = (index: number) => {
    setSelectedChatIndexes((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const visibleChatIndexes = chatIndexes.filter((index) => {
    const item = { ...chatItems[index], ...chatCardOverrides[index] };
    const normalizedQuery = query.trim();

    if (normalizedQuery && !`${item.userName} ${item.adTitle} ${item.message}`.includes(normalizedQuery)) {
      return false;
    }
    if (activeFilter === "خوانده نشده" && !item.badgeCount) return false;
    if (activeFilter === "پشتیبانی" && !item.isBlocked) return false;
    if (activeFilter === "آگهی‌های من" && item.adLabel !== "آگهی من") return false;
    if (activeFilter === "آگهی‌های دیگران" && item.adLabel === "آگهی من") return false;
    return true;
  });

  const deleteSelectedChats = () => {
    const count = selectedChatIndexes.size;
    setChatIndexes((current) => current.filter((index) => !selectedChatIndexes.has(index)));
    setSelectedChatIndexes(new Set());
    setIsBulkDeleteMode(false);
    showNotice(`${count} گفتگو حذف شد`);
  };

  return (
    <TopBarNavigationLayout
      activeKey="chat"
      contentClassName="bg-white"
      fixedAfterTopBar={
        <>
          {isSearchOpen ? (
            <div className="shrink-0 bg-[#f0f0f0] px-4 pb-2">
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-[#cccccc] bg-white px-4 text-right text-sm text-[#1a1a1a] outline-none focus:border-[#0048c4]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="جستجو در گفتگوها"
                type="search"
                value={query}
              />
            </div>
          ) : null}
          <FilterTabs
            activeFilter={activeFilter}
            onSelect={(filter) =>
              setActiveFilter((current) => (current === filter ? null : filter))
            }
          />
          {isBulkDeleteMode ? (
            <div className="flex h-12 shrink-0 items-center justify-between bg-white px-4 [direction:ltr]">
              <button
                className="text-sm font-medium text-[#4d4d4d]"
                onClick={() => {
                  setIsBulkDeleteMode(false);
                  setSelectedChatIndexes(new Set());
                }}
                type="button"
              >
                انصراف
              </button>
              <button
                className="rounded-lg bg-[#ee3623] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                disabled={selectedChatIndexes.size === 0}
                onClick={deleteSelectedChats}
                type="button"
              >
                حذف ({selectedChatIndexes.size})
              </button>
            </div>
          ) : null}
        </>
      }
      frameClassName="relative bg-[#cccccc] text-[#1a1a1a] [direction:rtl]"
      overlay={
        <ChatMenuBottomSheet
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={handleMenuSelect}
        />
      }
      topBar={
        <ChatHeader
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenSearch={() => {
            setIsSearchOpen((current) => !current);
            setQuery("");
          }}
        />
      }
    >
      {visibleChatIndexes.map((index) => (
        <ChatCard
          index={index}
          isBulkDeleteMode={isBulkDeleteMode}
          isSelected={selectedChatIndexes.has(index)}
          item={chatItems[index]}
          key={index}
          onToggleSelected={() => toggleSelectedChat(index)}
        />
      ))}
      {visibleChatIndexes.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#808080]">گفتگویی یافت نشد</p>
      ) : null}
      <DemoNotice message={message} />
    </TopBarNavigationLayout>
  );
}
