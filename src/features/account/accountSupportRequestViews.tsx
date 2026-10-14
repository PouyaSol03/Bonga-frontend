import LinearArrowDown1 from "../../shared/icons/LinearArrowDown1";
import LinearTick from "../../shared/icons/LinearTick";
import {
  BottomSheet,
  BottomSheetActionList,
  type BottomSheetAction,
} from "../../shared/components/BottomSheet";
import { Link } from "react-router";
import type { SupportRequestItem } from "../support/api/support-request.service";

import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

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
    description: "فقط در صورت اختلال جدی در استفاده از سامانه، گزینه «فوری» را انتخاب کنید.",
  },
];

const statusPresentation: Record<SupportRequestStatus, { label: string; className: string }> = {
  open: {
    label: "باز",
    className: "bg-tertiary-container/30 text-tertiary",
  },
  in_progress: {
    label: "در حال بررسی",
    className: "bg-primary-container text-primary",
  },
  closed: {
    label: "بسته شده",
    className: "bg-surface-container text-outline",
  },
};

function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

export function mapSupportRequest(item: SupportRequestItem): SupportRequest {
  const id = item.id === undefined || item.id === null ? "" : String(item.id);
  const threadId =
    item.thread_id === undefined || item.thread_id === null ? undefined : String(item.thread_id);
  const status: SupportRequestStatus =
    item.status === "closed" ? "closed" : item.status === "in_progress" ? "in_progress" : "open";
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
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="medium"
      className={`inline-flex h-6 shrink-0 items-center justify-center rounded-md px-2 text-[11px] leading-4 font-medium ${presentation.className}`}
    >
      {presentation.label}
    </Typography>
  );
}

export function SupportRequestCard({ request }: { request: SupportRequest }) {
  const card = (
    <article className="border-outline-var bg-surface-container-lowest rounded-2xl border px-4 py-3.5 text-right shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0 text-xs leading-5 font-normal"
          >
            {request.category}
          </Typography>
          <Typography
            as="h2"
            variant="title"
            size="small"
            weight="semibold"
            className="text-on-surface m-0 mt-1 text-sm leading-6 font-semibold"
          >
            {request.title}
          </Typography>
        </div>

        <SupportRequestStatusChip status={request.status} />
      </div>

      <div className="text-outline mt-3 flex items-center justify-between gap-3 text-[10px] leading-4 font-normal">
        <Typography as="span" variant="body" size="medium" weight="regular">
          {request.createdAt}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="truncate"
          dir="rtl"
        >
          شماره درخواست {request.requestNumber}
        </Typography>
      </div>
    </article>
  );

  return request.threadId ? (
    <Link
      className="block text-inherit no-underline"
      state={{ threadId: request.threadId }}
      to={`/account/support/chat/new?thread_id=${encodeURIComponent(request.threadId)}`}
    >
      {card}
    </Link>
  ) : (
    card
  );
}

export function SupportRequestsEmptyState() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-auto w-[64px] shrink-0"
        src="/vectors/NoSupportRequest.svg"
      />

      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-5 text-base leading-6 font-semibold"
      >
        درخواستی ثبت نشده است!
      </Typography>

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[300px] text-sm leading-6 font-normal"
      >
        اگر به راهنمایی یا پیگیری نیاز دارید، می‌توانید یک درخواست جدید برای تیم پشتیبانی ثبت کنید.
      </Typography>
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
      className="border-outline-var bg-surface-container-lowest flex h-[52px] shrink-0 [scrollbar-width:none] gap-2 overflow-x-auto border-b px-3 py-2 [-ms-overflow-style:none] [direction:rtl] [&::-webkit-scrollbar]:hidden"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <Button
            unstyled
            aria-pressed={isActive}
            className={`focus-visible:outline-primary/40 flex h-9 shrink-0 items-center justify-center rounded-lg border px-3 text-xs leading-4 font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-1 ${
              isActive
                ? "border-primary bg-primary-container text-primary"
                : "border-outline-var bg-surface-container-lowest text-on-surface-var active:bg-surface-container"
            }`}
            key={filter.id}
            onClick={() => onChange(filter.id)}
            type="button"
          >
            {filter.label}
          </Button>
        );
      })}
    </nav>
  );
}

export function RequiredLabel({ children }: { children: string }) {
  return (
    <Typography
      as="span"
      variant="label"
      size="medium"
      weight="medium"
      className="text-on-surface inline-flex items-center gap-1 text-sm leading-5 font-medium"
    >
      <Typography as="span" variant="body" size="medium" weight="regular">
        {children}
      </Typography>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        aria-hidden="true"
        className="text-error"
      >
        *
      </Typography>
    </Typography>
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
      <Button
        unstyled
        className={`border-outline-var bg-surface-container-lowest focus-visible:border-primary focus-visible:ring-primary/20 mt-2 flex h-12 w-full items-center justify-between rounded-xl border px-3 text-right text-sm leading-5 font-normal transition outline-none [direction:ltr] focus-visible:ring-3 ${
          value ? "text-on-surface" : "text-outline"
        }`}
        onClick={onClick}
        type="button"
      >
        <LinearArrowDown1 className="text-on-surface-var h-5 w-5 shrink-0" />
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="min-w-0 flex-1 truncate pr-2 text-right [direction:rtl]"
        >
          {value || placeholder}
        </Typography>
      </Button>
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
      isOpen={isOpen}
      onClose={onClose}
      showBackButton={false}
      showHeaderDivider
      title={title}
      titleAlign="center"
      variant="actions"
    >
      {options.some((option) => option.description) ? (
        <div>
          {options.map((option, index) => {
            const isSelected = option.id === selectedOption?.id;

            return (
              <div key={option.id}>
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className={`bg-surface-container-lowest focus-visible:ring-primary/40 relative flex min-h-12 w-full items-center justify-center px-10 py-2.5 text-center transition-colors outline-none focus-visible:ring-3 focus-visible:ring-inset ${
                    isSelected ? "text-primary" : "text-on-surface"
                  }`}
                  onClick={() => onSelect(option.value)}
                  tabIndex={isOpen ? 0 : -1}
                  type="button"
                >
                  {isSelected ? (
                    <LinearTick aria-hidden="true" className="absolute right-4 h-5 w-5" />
                  ) : null}

                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="flex min-w-0 flex-col items-center"
                  >
                    <Typography
                      as="span"
                      variant="body"
                      size="large"
                      weight="regular"
                      className="text-base leading-6 font-normal"
                    >
                      {option.title}
                    </Typography>
                    {option.description ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="small"
                        weight="regular"
                        className="text-outline mt-1 max-w-[360px] text-xs leading-5 font-normal"
                      >
                        {option.description}
                      </Typography>
                    ) : null}
                  </Typography>
                </Button>

                {index < options.length - 1 ? (
                  <div className="px-4 py-2">
                    <div className="bg-outline-var h-px" />
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
