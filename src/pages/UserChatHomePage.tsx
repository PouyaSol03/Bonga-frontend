import { useState } from "react";

import { BottomNavigation } from "../components/BottomNavigation";
import { PageFrame } from "../app/PageFrame";

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

function ChatHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-[#f0f0f0] px-1 [direction:ltr]">
      <div className="flex h-12 w-[104px] shrink-0 items-center">
        <button
          aria-label="گزینه‌های بیشتر"
          className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onOpenMenu}
          type="button"
        >
          <MoreVerticalIcon className="h-6 w-6" />
        </button>
        <button
          aria-label="جستجو در چت‌ها"
          className="grid h-12 w-12 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          type="button"
        >
          <SearchIcon className="h-6 w-6" />
        </button>
      </div>

      <h1 className="m-0 min-w-0 flex-1 truncate px-4 text-right text-base font-semibold leading-6 text-[#1a1a1a]">
        چت و اعلان‌‌ها
      </h1>
    </header>
  );
}

function FilterTabs() {
  return (
    <section className="h-[52px] shrink-0 overflow-hidden bg-[#f0f0f0] px-4 py-2">
      <div className="flex h-9 gap-2 overflow-x-auto [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => (
          <button
            className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#cccccc] bg-white px-4 text-sm font-medium leading-5 text-[#4d4d4d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            key={filter}
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
    <div
      aria-hidden={!isOpen}
      className={`absolute inset-0 z-50 flex items-end justify-center overflow-hidden transition-[opacity,visibility] duration-200 ease-out ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      dir="rtl"
    >
      <button
        aria-label="بستن منوی چت"
        className="absolute inset-0 cursor-default bg-[#1a1a1a]/35"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <section
        aria-label="منوی چت"
        aria-modal="true"
        className={`relative z-10 h-[250px] w-full max-w-[500px] overflow-hidden rounded-t-2xl bg-white pb-4 pt-4 transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-1 w-14 rounded-full bg-[#cccccc]"
        />

        <div className="mt-3 h-[202px]">
          {chatMenuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.id}>
                <button
                  className="flex h-14 w-full items-center justify-between bg-white px-4 py-2 text-right [direction:ltr] focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
                  onClick={() => onSelect(item.id)}
                  tabIndex={isOpen ? 0 : -1}
                  type="button"
                >
                  <span className="flex h-10 w-[288px] min-w-0 items-center justify-end [direction:rtl]">
                    <span className="truncate text-base font-normal leading-6 text-[#1a1a1a]">
                      {item.title}
                    </span>
                  </span>
                  <Icon className="h-6 w-6 shrink-0 text-[#4d4d4d]" />
                </button>

                {index < chatMenuItems.length - 1 ? (
                  <div className="py-2">
                    <div className="mx-4 h-px bg-[#cccccc]" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
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
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${
          isSelected
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

  return (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={`relative h-[140px] shrink-0 overflow-visible border-b border-[#f0f0f0] px-4 py-4 text-right ${
        isHighlighted ? "bg-[#0048c41f]" : "bg-white"
      }`}
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
        className={`flex items-start justify-between [direction:ltr] ${
          isBulkDeleteMode ? "h-12" : "h-5"
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
}

export function UserChatHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedChatIndexes, setSelectedChatIndexes] = useState<Set<number>>(
    () => new Set(),
  );

  const handleMenuSelect = (id: string) => {
    setIsMenuOpen(false);

    if (id !== "bulk-delete") return;

    setIsBulkDeleteMode(true);
    setSelectedChatIndexes(new Set());
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

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#cccccc] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ChatHeader onOpenMenu={() => setIsMenuOpen(true)} />
      <FilterTabs />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {chatItems.map((item, index) => (
          <ChatCard
            index={index}
            isBulkDeleteMode={isBulkDeleteMode}
            isSelected={selectedChatIndexes.has(index)}
            item={item}
            key={`${item.userName}-${item.date}-${index}`}
            onToggleSelected={() => toggleSelectedChat(index)}
          />
        ))}
      </main>

      <BottomNavigation activeKey="chat" />

      <ChatMenuBottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelect={handleMenuSelect}
      />
    </PageFrame>
  );
}
