import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

const SUPPORT_REQUESTS_STORAGE_KEY = "bonga-support-requests";

type SupportRequestStatus = "open" | "in_progress" | "closed";
type SupportRequestFilter = "all" | SupportRequestStatus;

type RequestReply = {
  id: string;
  sender: "customer" | "support";
  text: string;
  time: string;
};

type CrmSupportRequest = {
  id: string;
  category: string;
  title: string;
  requestNumber: string;
  createdAt: string;
  status: SupportRequestStatus;
  priority?: string;
  description?: string;
  attachmentName?: string;
  customerName: string;
  customerMobile: string;
  replies: RequestReply[];
};

type CrmSupportRequestsViewProps = {
  notify: (message: string, tone?: "error" | "success") => void;
  refreshNonce: number;
};

const filterOptions: Array<{ id: SupportRequestFilter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "open", label: "باز" },
  { id: "in_progress", label: "در حال بررسی" },
  { id: "closed", label: "بسته شده" },
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

const sampleRequests: CrmSupportRequest[] = [
  {
    id: "crm-request-201",
    category: "آگهی‌ها",
    title: "مشکل در ثبت آگهی",
    requestNumber: "#۱۲۴۸۵",
    createdAt: "۲۵ تیر ۱۴۰۵ - ۱۰:۳۲",
    status: "open",
    priority: "فوری",
    description:
      "هنگام ثبت آگهی و بعد از انتخاب شهر، فهرست محله‌ها برای من نمایش داده نمی‌شود و امکان ادامه ثبت آگهی را ندارم.",
    attachmentName: "خطای-ثبت-آگهی.jpg",
    customerName: "محمد رضایی",
    customerMobile: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
    replies: [],
  },
  {
    id: "crm-request-202",
    category: "پرداخت و کیف پول",
    title: "اعتبار بسته به حساب اضافه نشده",
    requestNumber: "#۱۲۴۶۳",
    createdAt: "۲۵ تیر ۱۴۰۵ - ۰۹:۴۸",
    status: "in_progress",
    priority: "زیاد",
    description:
      "هزینه خرید بسته از حساب من کسر شده اما اعتبار آگهی و بروزرسانی به پنل اضافه نشده است.",
    customerName: "سارا احمدی",
    customerMobile: "۰۹۳۵ ۱۲۳ ۴۵۶۷",
    replies: [
      {
        id: "reply-202-1",
        sender: "support",
        text: "درخواست شما در حال بررسی واحد مالی است و نتیجه از همین بخش اطلاع‌رسانی می‌شود.",
        time: "۱۰:۰۵",
      },
    ],
  },
  {
    id: "crm-request-203",
    category: "حساب کاربری",
    title: "تغییر شماره تماس حساب",
    requestNumber: "#۱۲۳۹۸",
    createdAt: "۲۴ تیر ۱۴۰۵ - ۱۶:۲۱",
    status: "closed",
    priority: "متوسط",
    description:
      "شماره قبلی من غیرفعال شده و می‌خواهم شماره تماس حساب کاربری را تغییر دهم.",
    customerName: "علی حسینی",
    customerMobile: "۰۹۱۵ ۸۷۶ ۵۴۳۲",
    replies: [
      {
        id: "reply-203-1",
        sender: "support",
        text: "شماره تماس حساب شما پس از تأیید هویت بروزرسانی شد.",
        time: "۱۷:۱۰",
      },
    ],
  },
];

function isRequestStatus(value: unknown): value is SupportRequestStatus {
  return value === "open" || value === "in_progress" || value === "closed";
}

function normalizeReplies(value: unknown): RequestReply[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<RequestReply>;

    if (
      typeof candidate.id !== "string" ||
      (candidate.sender !== "customer" && candidate.sender !== "support") ||
      typeof candidate.text !== "string" ||
      typeof candidate.time !== "string"
    ) {
      return [];
    }

    return [candidate as RequestReply];
  });
}

function loadAccountRequests(): CrmSupportRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SUPPORT_REQUESTS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.category !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.requestNumber !== "string" ||
        typeof candidate.createdAt !== "string" ||
        !isRequestStatus(candidate.status)
      ) {
        return [];
      }

      return [
        {
          id: candidate.id,
          category: candidate.category,
          title: candidate.title,
          requestNumber: candidate.requestNumber,
          createdAt: candidate.createdAt,
          status: candidate.status,
          priority:
            typeof candidate.priority === "string" ? candidate.priority : undefined,
          description:
            typeof candidate.description === "string"
              ? candidate.description
              : undefined,
          attachmentName:
            typeof candidate.attachmentName === "string"
              ? candidate.attachmentName
              : undefined,
          customerName:
            typeof candidate.customerName === "string"
              ? candidate.customerName
              : "کاربر بنگاه",
          customerMobile:
            typeof candidate.customerMobile === "string"
              ? candidate.customerMobile
              : "شماره تماس ثبت نشده",
          replies: normalizeReplies(candidate.replies),
        },
      ];
    });
  } catch {
    return [];
  }
}

function loadRequests() {
  const accountRequests = loadAccountRequests();
  const accountRequestIds = new Set(accountRequests.map((request) => request.id));

  return [
    ...accountRequests,
    ...sampleRequests.filter((request) => !accountRequestIds.has(request.id)),
  ];
}

function persistAccountRequest(request: CrmSupportRequest) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(SUPPORT_REQUESTS_STORAGE_KEY);
    if (!raw) return;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    let didUpdate = false;
    const next = parsed.map((item) => {
      if (!item || typeof item !== "object") return item;
      const candidate = item as Record<string, unknown>;
      if (candidate.id !== request.id) return item;

      didUpdate = true;
      return {
        ...candidate,
        status: request.status,
        replies: request.replies,
      };
    });

    if (didUpdate) {
      window.localStorage.setItem(
        SUPPORT_REQUESTS_STORAGE_KEY,
        JSON.stringify(next),
      );
    }
  } catch {
    // CRM request handling remains available when storage is unavailable.
  }
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function createReplyId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function StatusChip({ status }: { status: SupportRequestStatus }) {
  const presentation = statusPresentation[status];

  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-medium ${presentation.className}`}
    >
      {presentation.label}
    </span>
  );
}

function RequestListCard({
  isActive,
  onClick,
  request,
}: {
  isActive: boolean;
  onClick: () => void;
  request: CrmSupportRequest;
}) {
  return (
    <button
      className={`w-full rounded-xl border p-3.5 text-right transition ${
        isActive
          ? "border-[#0048c4] bg-[#f5f8ff] shadow-[0_0_0_2px_rgba(0,72,196,0.06)]"
          : "border-[#ececec] bg-white hover:border-[#cfd9ea] hover:bg-[#fafcff]"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block truncate text-xs font-medium text-[#666666]">
            {request.category}
          </span>
          <strong className="mt-1 block truncate text-sm font-bold text-[#1a1a1a]">
            {request.title}
          </strong>
        </div>
        <StatusChip status={request.status} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-medium text-[#929292]">
        <span className="truncate">{request.createdAt}</span>
        <span className="shrink-0">{request.requestNumber}</span>
      </div>
    </button>
  );
}

function RequestReplyBubble({ reply }: { reply: RequestReply }) {
  const isSupport = reply.sender === "support";

  return (
    <div className={`flex ${isSupport ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
          isSupport
            ? "rounded-br-md bg-[#eaf1ff] text-[#1a1a1a]"
            : "rounded-bl-md border border-[#e8e8e8] bg-white text-[#303030]"
        }`}
      >
        <p className="m-0 text-sm font-medium leading-7">{reply.text}</p>
        <span className="mt-1 block text-left text-[11px] font-medium text-[#999999]">
          {reply.time}
        </span>
      </div>
    </div>
  );
}

export function CrmSupportRequestsView({
  notify,
  refreshNonce,
}: CrmSupportRequestsViewProps) {
  const [requests, setRequests] = useState<CrmSupportRequest[]>(loadRequests);
  const [activeFilter, setActiveFilter] =
    useState<SupportRequestFilter>("all");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    () => loadRequests()[0]?.id ?? null,
  );
  const [draft, setDraft] = useState("");
  const composerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const nextRequests = loadRequests();
    setRequests(nextRequests);
    setSelectedRequestId((current) =>
      current && nextRequests.some((request) => request.id === current)
        ? current
        : (nextRequests[0]?.id ?? null),
    );
  }, [refreshNonce]);

  const filteredRequests = useMemo(
    () =>
      activeFilter === "all"
        ? requests
        : requests.filter((request) => request.status === activeFilter),
    [activeFilter, requests],
  );

  useEffect(() => {
    if (
      selectedRequestId &&
      filteredRequests.some((request) => request.id === selectedRequestId)
    ) {
      return;
    }

    setSelectedRequestId(filteredRequests[0]?.id ?? null);
  }, [filteredRequests, selectedRequestId]);

  const selectedRequest = requests.find(
    (request) => request.id === selectedRequestId,
  );

  const updateRequest = (
    requestId: string,
    updater: (request: CrmSupportRequest) => CrmSupportRequest,
  ) => {
    setRequests((current) =>
      current.map((request) => {
        if (request.id !== requestId) return request;
        const nextRequest = updater(request);
        persistAccountRequest(nextRequest);
        return nextRequest;
      }),
    );
  };

  const sendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !selectedRequest || selectedRequest.status === "closed") return;

    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      status: request.status === "open" ? "in_progress" : request.status,
      replies: [
        ...request.replies,
        {
          id: createReplyId(),
          sender: "support",
          text,
          time: currentTimeLabel(),
        },
      ],
    }));

    setDraft("");
    notify("پاسخ درخواست ارسال شد.", "success");
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const closeRequest = () => {
    if (!selectedRequest || selectedRequest.status === "closed") return;

    updateRequest(selectedRequest.id, (request) => ({
      ...request,
      status: "closed",
    }));
    notify("درخواست بسته شد.", "success");
  };

  return (
    <section className="flex h-full min-h-[620px] flex-col gap-4" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4">
        <div>
          <h1 className="m-0 text-lg font-bold text-[#1a1a1a]">
            درخواست‌های پشتیبانی
          </h1>
          <p className="m-0 mt-1 text-sm font-medium text-[#808080]">
            مشاهده، پاسخگویی و پیگیری درخواست‌های ثبت‌شده کاربران
          </p>
        </div>

        <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce5f4] bg-[#f7faff] px-4">
          <span className="text-xs font-medium text-[#808080]">درخواست باز</span>
          <strong className="text-sm font-bold text-[#0048c4]">
            {new Intl.NumberFormat("fa-IR").format(
              requests.filter((request) => request.status !== "closed").length,
            )}
          </strong>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
          <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#eeeeee] px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  aria-pressed={isActive}
                  className={`h-9 shrink-0 rounded-lg border px-3 text-xs font-semibold transition ${
                    isActive
                      ? "border-[#1268d8] bg-[#eaf1ff] text-[#0048c4]"
                      : "border-[#d9d9d9] bg-white text-[#4d4d4d] hover:bg-[#f7f7f7]"
                  }`}
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  type="button"
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {filteredRequests.length ? (
              filteredRequests.map((request) => (
                <RequestListCard
                  isActive={request.id === selectedRequestId}
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  request={request}
                />
              ))
            ) : (
              <div className="grid h-full min-h-48 place-items-center px-6 text-center text-sm font-medium leading-7 text-[#999999]">
                درخواستی با این وضعیت وجود ندارد.
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
          {selectedRequest ? (
            <>
              <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
                      {selectedRequest.customerName}
                    </strong>
                    <span className="mt-1 block truncate text-xs font-medium text-[#808080]">
                      {selectedRequest.customerMobile}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusChip status={selectedRequest.status} />
                  <button
                    className="rounded-lg border border-[#e3a2a2] bg-white px-3 py-1 text-xs! font-semibold text-[#c32929] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:border-[#e4e4e4] disabled:text-[#a6a6a6]"
                    disabled={selectedRequest.status === "closed"}
                    onClick={closeRequest}
                    type="button"
                  >
                    بستن درخواست
                  </button>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-[#eeeeee] bg-white px-5 py-4 xl:grid-cols-4">
                <div>
                  <span className="block text-[11px] font-medium text-[#999999]">
                    دسته‌بندی
                  </span>
                  <strong className="mt-1 block text-xs font-semibold text-[#303030]">
                    {selectedRequest.category}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#999999]">
                    شماره درخواست
                  </span>
                  <strong className="mt-1 block text-xs font-semibold text-[#303030]">
                    {selectedRequest.requestNumber}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#999999]">
                    اولویت
                  </span>
                  <strong className="mt-1 block text-xs font-semibold text-[#303030]">
                    {selectedRequest.priority || "ثبت نشده"}
                  </strong>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-[#999999]">
                    زمان ثبت
                  </span>
                  <strong className="mt-1 block text-xs font-semibold text-[#303030]">
                    {selectedRequest.createdAt}
                  </strong>
                </div>
              </div>

              <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5">
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4">
                  <span className="text-xs font-medium text-[#808080]">
                    {selectedRequest.category}
                  </span>
                  <h2 className="m-0 mt-1 text-base font-bold text-[#1a1a1a]">
                    {selectedRequest.title}
                  </h2>
                  <p className="m-0 mt-3 text-sm font-medium leading-7 text-[#4d4d4d]">
                    {selectedRequest.description || "توضیحی برای این درخواست ثبت نشده است."}
                  </p>

                  {selectedRequest.attachmentName ? (
                    <button
                      className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce3ef] bg-[#f8faff] px-3 text-xs font-semibold text-[#0048c4]"
                      type="button"
                    >
                      <svg
                        fill="none"
                        height="17"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                        width="17"
                      >
                        <path d="m21 11.5-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 1 1-2.8-2.8l8.3-8.3" />
                      </svg>
                      {selectedRequest.attachmentName}
                    </button>
                  ) : null}
                </div>

                {selectedRequest.replies.map((reply) => (
                  <RequestReplyBubble key={reply.id} reply={reply} />
                ))}
              </main>

              <form
                className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4"
                onSubmit={sendReply}
              >
                <input
                  className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#303030] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10 disabled:bg-[#f5f5f5]"
                  disabled={selectedRequest.status === "closed"}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={
                    selectedRequest.status === "closed"
                      ? "این درخواست بسته شده است"
                      : "پاسخ خود را بنویسید..."
                  }
                  ref={composerRef}
                  value={draft}
                />
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-5 text-sm font-semibold text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !draft.trim() || selectedRequest.status === "closed"
                  }
                  type="submit"
                >
                  ارسال پاسخ
                  <svg
                    fill="none"
                    height="18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="grid h-full place-items-center px-8 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
                  <svg
                    fill="none"
                    height="32"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <path d="M5 4h14v16H5z" />
                    <path d="M8 8h8m-8 4h8m-8 4h5" />
                  </svg>
                </div>
                <h2 className="m-0 mt-5 text-lg font-bold text-[#1a1a1a]">
                  درخواستی انتخاب نشده است
                </h2>
                <p className="m-0 mt-2 text-sm font-medium text-[#808080]">
                  برای مشاهده جزئیات و پاسخگویی، یک درخواست را انتخاب کنید.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
