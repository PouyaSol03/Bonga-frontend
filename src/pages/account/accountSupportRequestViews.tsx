import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearTick from "../../components/(icons)/LinearTick";
import { BottomSheet, BottomSheetActionList, type BottomSheetAction } from "../../components/BottomSheet";
import { RouteLink } from "../../routes/RouteLink";
import type { SupportRequestItem } from "../../services/support-request.service";


export const SUPPORT_PATH = "/account/support";
export const REQUESTS_PATH = "/account/support/requests";
export const NEW_REQUEST_PATH = "/account/support/requests/new";
type SupportRequestStatus = "open" | "in_progress" | "closed";
export type SupportRequestFilter = "all" | SupportRequestStatus;

type SupportRequest = {
  id: string;
  category: string;
  title: string;
  requestNumber: string;
  createdAt: string;
  status: SupportRequestStatus;
  priority?: string;
  description?: string;
  attachmentName?: string;
  threadId?: string;
};

type SelectOption = BottomSheetAction & {
  value: string;
};

const filters: Array<{ id: SupportRequestFilter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "open", label: "باز" },
  { id: "in_progress", label: "در حال بررسی" },
  { id: "closed", label: "بسته شده" },
];

export const categoryOptions: SelectOption[] = [
  { id: "advertises", title: "آگهی‌ها", value: "advertises" },
  { id: "requests", title: "درخواست‌ها", value: "requests" },
  { id: "chats", title: "چت‌ها", value: "chats" },
  { id: "payments_wallet", title: "پرداخت و کیف پول", value: "payments_wallet" },
  { id: "account", title: "حساب کاربری", value: "account" },
  { id: "agency", title: "آژانس و مشاوران", value: "agency" },
  { id: "technical", title: "فنی", value: "technical" },
  { id: "report", title: "گزارش تخلف", value: "report" },
];

export const priorityOptions: SelectOption[] = [
  { id: "normal", title: "عادی", value: "normal" },
  { id: "important", title: "مهم", value: "important" },
  {
    id: "urgent",
    title: "فوری",
    value: "urgent",
    description:
      "فقط در صورت اختلال جدی در استفاده از سامانه، گزینه «فوری» را انتخاب کنید.",
  },
];

const statusPresentation: Record<
  SupportRequestStatus,
  { label: string; className: string }
> = {
  open: {
    label: "باز",
    className: "bg-[#e6f8ef] text-[#079455]",
  },
  in_progress: {
    label: "در حال بررسی",
    className: "bg-[#eaf1ff] text-[#0048c4]",
  },
  closed: {
    label: "بسته شده",
    className: "bg-[#f1f1f1] text-[#808080]",
  },
};

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function mapSupportRequest(item: SupportRequestItem): SupportRequest {
  const id = item.id === undefined || item.id === null ? "" : String(item.id);
  const threadId = item.thread_id === undefined || item.thread_id === null
    ? undefined
    : String(item.thread_id);
  const status: SupportRequestStatus = item.status === "closed"
    ? "closed"
    : item.status === "in_progress"
      ? "in_progress"
      : "open";
  const createdAt = item.created_at
    ? new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        day: "numeric",
        month: "long",
        timeZone: "Asia/Tehran",
        year: "numeric",
      }).format(new Date(item.created_at))
    : "";

  return {
    category: item.category_label || item.category || "پشتیبانی",
    createdAt,
    description: item.description,
    id: id || threadId || "support-request",
    priority: item.priority,
    requestNumber: `#${toPersianDigits(id || "-")}`,
    status,
    threadId,
    title: item.subject || "درخواست پشتیبانی",
  };
}

function SupportRequestStatusChip({ status }: { status: SupportRequestStatus }) {
  const presentation = statusPresentation[status];

  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-medium leading-4 ${presentation.className}`}
    >
      {presentation.label}
    </span>
  );
}

export function SupportRequestCard({ request }: { request: SupportRequest }) {
  const card = (
    <article className="rounded-2xl border border-[#e1e1e1] bg-white px-4 py-3.5 text-right shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-xs font-normal leading-5 text-[#4d4d4d]">
            {request.category}
          </p>
          <h2 className="m-0 mt-1 text-sm font-semibold leading-6 text-[#1a1a1a]">
            {request.title}
          </h2>
        </div>

        <SupportRequestStatusChip status={request.status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-normal leading-4 text-[#808080]">
        <span>{request.createdAt}</span>
        <span className="truncate" dir="rtl">
          شماره درخواست {request.requestNumber}
        </span>
      </div>
    </article>
  );

  return request.threadId ? (
    <RouteLink
      className="block text-inherit no-underline"
      state={{ threadId: request.threadId }}
      to={`/account/support/chat/new?thread_id=${encodeURIComponent(request.threadId)}`}
    >
      {card}
    </RouteLink>
  ) : card;
}

export function SupportRequestsEmptyState() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-6 pb-8 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-auto w-[64px] shrink-0"
        src="/vectors/NoSupportRequest.svg"
      />

      <h2 className="m-0 mt-5 text-base font-semibold leading-6 text-[#1a1a1a]">
        درخواستی ثبت نشده است!
      </h2>

      <p className="m-0 mt-2 max-w-[300px] text-sm font-normal leading-6 text-[#666666]">
        اگر به راهنمایی یا پیگیری نیاز دارید، می‌توانید یک درخواست جدید برای تیم
        پشتیبانی ثبت کنید.
      </p>
    </div>
  );
}

export function SupportRequestTabs({
  activeFilter,
  onChange,
}: {
  activeFilter: SupportRequestFilter;
  onChange: (filter: SupportRequestFilter) => void;
}) {
  return (
    <nav
      aria-label="فیلتر وضعیت درخواست‌ها"
      className="flex h-[52px] shrink-0 gap-2 overflow-x-auto border-b border-[#e6e6e6] bg-white px-3 py-2 [direction:rtl] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            aria-pressed={isActive}
            className={`flex h-9 shrink-0 items-center justify-center rounded-lg border px-3 text-xs font-medium leading-4 transition-colors focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-[#0048c440] ${
              isActive
                ? "border-[#1268d8] bg-[#eaf1ff] text-[#0048c4]"
                : "border-[#d6d6d6] bg-white text-[#4d4d4d] active:bg-[#f5f5f5]"
            }`}
            key={filter.id}
            onClick={() => onChange(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        );
      })}
    </nav>
  );
}

export function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-[#1a1a1a]">
      <span>{children}</span>
      <span aria-hidden="true" className="text-[#d92d20]">
        *
      </span>
    </span>
  );
}

export function RequestSelectField({
  label,
  onClick,
  placeholder,
  value,
}: {
  label: string;
  onClick: () => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="block">
      <RequiredLabel>{label}</RequiredLabel>
      <button
        className={`mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-[#d0d0d0] bg-white px-3 text-right text-sm font-normal leading-5 outline-none transition focus-visible:border-[#0048c4] focus-visible:ring-3 focus-visible:ring-[#0048c420] [direction:ltr] ${
          value ? "text-[#1a1a1a]" : "text-[#a6a6a6]"
        }`}
        onClick={onClick}
        type="button"
      >
        <LinearArrowDown1 className="h-5 w-5 shrink-0 text-[#4d4d4d]" />
        <span className="min-w-0 flex-1 truncate pr-2 text-right [direction:rtl]">
          {value || placeholder}
        </span>
      </button>
    </label>
  );
}

export function RequestOptionBottomSheet({
  isOpen,
  onClose,
  onSelect,
  options,
  selectedValue,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  options: SelectOption[];
  selectedValue: string;
  title: string;
}) {
  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <BottomSheet
      ariaLabel={title}
      contentClassName="max-h-[calc(100dvh-150px)] overflow-y-auto pb-3"
      heightClassName="h-auto max-h-[calc(100dvh-72px)] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showBackButton={false}
      showHeaderDivider
      title={title}
      titleAlign="center"
    >
      {options.some((option) => option.description) ? (
        <div>
          {options.map((option, index) => {
            const isSelected = option.id === selectedOption?.id;

            return (
              <div key={option.id}>
                <button
                  aria-pressed={isSelected}
                  className={`relative flex min-h-12 w-full items-center justify-center bg-white px-10 py-2.5 text-center outline-none transition-colors focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-[#0048c440] ${
                    isSelected ? "text-[#0048c4]" : "text-[#1a1a1a]"
                  }`}
                  onClick={() => onSelect(option.value)}
                  tabIndex={isOpen ? 0 : -1}
                  type="button"
                >
                  {isSelected ? (
                    <LinearTick
                      aria-hidden="true"
                      className="absolute right-4 h-5 w-5"
                    />
                  ) : null}

                  <span className="flex min-w-0 flex-col items-center">
                    <span className="text-base font-normal leading-6">
                      {option.title}
                    </span>
                    {option.description ? (
                      <span className="mt-1 max-w-[360px] text-xs font-normal leading-5 text-[#808080]">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </button>

                {index < options.length - 1 ? (
                  <div className="px-4 py-2">
                    <div className="h-px bg-[#f0f0f0]" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <BottomSheetActionList
          align="center"
          isOpen={isOpen}
          items={options}
          onSelect={(option) => onSelect(option.value)}
          selectedId={selectedOption?.id}
          showCheckIcon
        />
      )}
    </BottomSheet>
  );
}
