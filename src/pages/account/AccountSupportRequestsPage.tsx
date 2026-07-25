import { useMemo, useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { PageFrame } from "../../app/PageFrame";
import LinearAdd from "../../components/(icons)/LinearAdd";
import LinearArrowDown1 from "../../components/(icons)/LinearArrowDown1";
import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearTick from "../../components/(icons)/LinearTick";
import {
  BottomSheet,
  BottomSheetActionList,
  type BottomSheetAction,
} from "../../components/BottomSheet";
import { TopBar } from "../../components/TopBar";
import { EmptyState } from "../../components/EmptyState";
import { getRequestErrorState } from "../../components/ErrorState";
import { RouteLink } from "../../routes/RouteLink";
import { replaceRoute } from "../../routes/navigation";
import {
  createSupportRequest,
  getSupportRequests,
  type SupportRequestItem,
} from "../../services/support-request.service";

const SUPPORT_PATH = "/account/support";
const REQUESTS_PATH = "/account/support/requests";
const NEW_REQUEST_PATH = "/account/support/requests/new";
type SupportRequestStatus = "open" | "in_progress" | "closed";
type SupportRequestFilter = "all" | SupportRequestStatus;

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

const categoryOptions: SelectOption[] = [
  { id: "advertises", title: "آگهی‌ها", value: "advertises" },
  { id: "requests", title: "درخواست‌ها", value: "requests" },
  { id: "chats", title: "چت‌ها", value: "chats" },
  { id: "payments_wallet", title: "پرداخت و کیف پول", value: "payments_wallet" },
  { id: "account", title: "حساب کاربری", value: "account" },
  { id: "agency", title: "آژانس و مشاوران", value: "agency" },
  { id: "technical", title: "فنی", value: "technical" },
  { id: "report", title: "گزارش تخلف", value: "report" },
];

const priorityOptions: SelectOption[] = [
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

function mapSupportRequest(item: SupportRequestItem): SupportRequest {
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

function SupportRequestCard({ request }: { request: SupportRequest }) {
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

function SupportRequestsEmptyState() {
  return (
    <EmptyState
      description="اگر به راهنمایی یا پیگیری نیاز دارید، می‌توانید یک درخواست جدید برای تیم پشتیبانی ثبت کنید."
      iconSrc="/vectors/NoSupportRequest.svg"
      title="درخواستی ثبت نشده است!"
    />
  );
}

function SupportRequestTabs({
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

export function AccountSupportRequestsPage() {
  const [activeFilter, setActiveFilter] = useState<SupportRequestFilter>("all");
  const requestsQuery = useQuery({
    queryFn: () => getSupportRequests({ page: 1, perPage: 100 }),
    queryKey: ["support-requests", "account"],
  });
  const requests = useMemo(
    () => (requestsQuery.data?.data ?? []).map(mapSupportRequest),
    [requestsQuery.data?.data],
  );
  const filteredRequests = useMemo(
    () =>
      activeFilter === "all"
        ? requests
        : requests.filter((request) => request.status === activeFilter),
    [activeFilter, requests],
  );
  const RequestErrorState = requestsQuery.isError
    ? getRequestErrorState(requestsQuery.error)
    : null;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        backTo={SUPPORT_PATH}
        className="border-b border-[#e6e6e6]"
        heightClassName="h-[52px]"
        placement="inline"
        reserveStartSpace
        title="درخواست‌های من"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <SupportRequestTabs
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      <main
        className={`min-h-0 flex-1 overflow-y-auto bg-white px-3 pb-[76px] ${
          requests.length === 0 ? "flex pt-0" : "pt-3"
        }`}
      >
        {requestsQuery.isLoading ? (
          <p className="w-full py-16 text-center text-sm text-[#808080]">در حال دریافت درخواست‌ها...</p>
        ) : RequestErrorState ? (
          <RequestErrorState onRetry={() => void requestsQuery.refetch()} />
        ) : requests.length === 0 ? (
          <SupportRequestsEmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <SupportRequestCard key={request.id} request={request} />
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center px-4 text-center text-sm leading-6 text-[#808080]">
                درخواستی با این وضعیت وجود ندارد.
              </div>
            ) : null}
          </>
        )}
      </main>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-3 pb-2.5 pt-2">
        <RouteLink
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0759cf] px-4 text-sm font-semibold leading-5 text-white no-underline outline-none active:bg-[#0048b5] focus-visible:ring-3 focus-visible:ring-[#0759cf40]"
          to={NEW_REQUEST_PATH}
        >
          <LinearAdd className="h-4.5 w-4.5" />
          <span>ایجاد درخواست جدید</span>
        </RouteLink>
      </div>
    </PageFrame>
  );
}

function RequiredLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium leading-5 text-[#1a1a1a]">
      <span>{children}</span>
      <span aria-hidden="true" className="text-[#d92d20]">
        *
      </span>
    </span>
  );
}

function RequestSelectField({
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

function RequestOptionBottomSheet({
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

export function AccountSupportNewRequestPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isPrioritySheetOpen, setIsPrioritySheetOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const createRequestMutation = useMutation({ mutationFn: createSupportRequest });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSubject = subject.trim();
    const normalizedDescription = description.trim();

    if (!normalizedSubject || !category || !priority || !normalizedDescription) {
      setErrorMessage("لطفاً همه فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    createRequestMutation.mutate({
      category,
      description: normalizedDescription,
      priority: priority as "normal" | "important" | "urgent",
      subject: normalizedSubject,
    }, {
      onError: () => {
        setErrorMessage("ثبت درخواست با خطا مواجه شد. دوباره تلاش کنید.");
      },
      onSuccess: (request) => {
        const threadId = request.thread_id === undefined || request.thread_id === null
          ? ""
          : String(request.thread_id);

        replaceRoute(
          threadId
            ? `/account/support/chat/new?thread_id=${encodeURIComponent(threadId)}`
            : REQUESTS_PATH,
          threadId ? { threadId } : undefined,
          { rememberCurrent: false },
        );
      },
    });
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        backTo={REQUESTS_PATH}
        className="border-b border-[#e6e6e6]"
        heightClassName="h-[52px]"
        placement="inline"
        reserveStartSpace
        title="ایجاد درخواست"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit}
      >
        <main className="min-h-0 flex-1 overflow-y-auto bg-white px-3 pb-[76px] pt-4">
          <div className="space-y-5">
            <label className="block">
              <RequiredLabel>موضوع درخواست</RequiredLabel>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-[#d0d0d0] bg-white px-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-3 focus:ring-[#0048c420]"
                onChange={(event) => {
                  setSubject(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="موضوع درخواست را وارد کنید"
                type="text"
                value={subject}
              />
            </label>

            <RequestSelectField
              label="دسته‌بندی"
              onClick={() => setIsCategorySheetOpen(true)}
              placeholder="موضوع درخواست را وارد کنید"
              value={categoryOptions.find((option) => option.value === category)?.title ?? ""}
            />

            <RequestSelectField
              label="اولویت"
              onClick={() => setIsPrioritySheetOpen(true)}
              placeholder="موضوع درخواست را وارد کنید"
              value={priorityOptions.find((option) => option.value === priority)?.title ?? ""}
            />

            <label className="block">
              <RequiredLabel>شرح مشکل</RequiredLabel>
              <textarea
                className="mt-2 min-h-[104px] w-full resize-none rounded-xl border border-[#d0d0d0] bg-white px-3 py-3 text-right text-sm font-normal leading-6 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-3 focus:ring-[#0048c420]"
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="شرح مشکل خود را به طور کامل بنویسید"
                value={description}
              />
            </label>

            <div>
              <p className="m-0 text-sm font-medium leading-5 text-[#1a1a1a]">
                افزودن فایل
                <span className="mr-1 text-xs font-normal text-[#808080]">
                  (اختیاری)
                </span>
              </p>

              <input
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] ?? null;

                  if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
                    setAttachment(null);
                    setErrorMessage("حجم فایل انتخاب‌شده نباید بیشتر از ۵ مگابایت باشد.");
                  } else {
                    setAttachment(selectedFile);
                    setErrorMessage("");
                  }

                  event.target.value = "";
                }}
                ref={fileInputRef}
                type="file"
              />

              <button
                className="mt-2 flex min-h-[92px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#b6b6b6] bg-white px-4 py-4 text-center outline-none transition active:bg-[#fafafa] focus-visible:border-[#0048c4] focus-visible:ring-3 focus-visible:ring-[#0048c420]"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <LinearAttachment className="h-5 w-5 text-[#4d4d4d]" />
                {attachment ? (
                  <span className="mt-2 max-w-full truncate text-xs font-medium leading-5 text-[#1a1a1a]">
                    {attachment.name}
                  </span>
                ) : (
                  <>
                    <span className="mt-2 text-xs font-normal leading-5 text-[#4d4d4d]">
                      برای انتخاب فایل لمس کنید
                    </span>
                    <span className="text-[10px] font-normal leading-4 text-[#a6a6a6]">
                      حداکثر حجم فایل ۵ مگابایت
                    </span>
                  </>
                )}
              </button>
            </div>

            {errorMessage ? (
              <p
                className="m-0 rounded-lg bg-[#fff1f0] px-3 py-2 text-right text-xs font-normal leading-5 text-[#c11004]"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>
        </main>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-3 pb-2.5 pt-2">
          <button
            className="h-10 w-full rounded-lg bg-[#0759cf] px-4 text-sm font-semibold leading-5 text-white outline-none active:bg-[#0048b5] focus-visible:ring-3 focus-visible:ring-[#0759cf40]"
            disabled={createRequestMutation.isPending}
            type="submit"
          >
            {createRequestMutation.isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </button>
        </div>
      </form>

      <RequestOptionBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        onSelect={(value) => {
          setCategory(value);
          setErrorMessage("");
          setIsCategorySheetOpen(false);
        }}
        options={categoryOptions}
        selectedValue={category}
        title="دسته‌بندی"
      />

      <RequestOptionBottomSheet
        isOpen={isPrioritySheetOpen}
        onClose={() => setIsPrioritySheetOpen(false)}
        onSelect={(value) => {
          setPriority(value);
          setErrorMessage("");
          setIsPrioritySheetOpen(false);
        }}
        options={priorityOptions}
        selectedValue={priority}
        title="اولویت"
      />
    </PageFrame>
  );
}
