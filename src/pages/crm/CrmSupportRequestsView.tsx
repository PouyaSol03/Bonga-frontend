import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearBubbleChat from "../../components/(icons)/LinearBubbleChat";
import LinearCalendar from "../../components/(icons)/LinearCalendar";
import LinearCancel from "../../components/(icons)/LinearCancel";
import LinearCategory from "../../components/(icons)/LinearCategory";
import LinearCheckmark from "../../components/(icons)/LinearCheckmark";
import LinearClock from "../../components/(icons)/LinearClock";
import LinearDocument from "../../components/(icons)/LinearDocument";
import LinearFlag from "../../components/(icons)/LinearFlag";
import LinearPhone2 from "../../components/(icons)/LinearPhone2";
import LinearRefresh from "../../components/(icons)/LinearRefresh";
import LinearRequestList from "../../components/(icons)/LinearRequestList";
import LinearSearch from "../../components/(icons)/LinearSearch";
import LinearSendComment from "../../components/(icons)/LinearSendComment";
import LinearUserAccount from "../../components/(icons)/LinearUserAccount";

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
    // The CRM remains usable when browser storage is unavailable.
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

function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
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

function PriorityChip({ priority }: { priority?: string }) {
  const className =
    priority === "فوری"
      ? "bg-[#fff0ee] text-[#d92d20]"
      : priority === "زیاد"
        ? "bg-[#fff5e6] text-[#b54708]"
        : priority === "متوسط"
          ? "bg-[#eef4ff] text-[#0048c4]"
          : "bg-[#f3f3f3] text-[#666666]";

  return (
    <span className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${className}`}>
      {priority || "بدون اولویت"}
    </span>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-[138px] items-center gap-3 rounded-xl border border-[#e9edf4] bg-[#fafcff] px-3.5 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eaf1ff] text-[#0048c4]">
        {icon}
      </span>
      <div>
        <strong className="block text-base font-bold text-[#1a1a1a]">
          {formatCount(value)}
        </strong>
        <span className="mt-0.5 block text-[11px] font-medium text-[#808080]">
          {label}
        </span>
      </div>
    </div>
  );
}

function RequestListCard({
  isActive,
  onClick,
  prefersReducedMotion,
  request,
}: {
  isActive: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
  request: CrmSupportRequest;
}) {
  const isNew = request.status === "open" && request.replies.length === 0;

  return (
    <motion.button
      aria-current={isActive ? "true" : undefined}
      className={`relative w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-right outline-none transition-colors focus-visible:ring-3 focus-visible:ring-[#0048c4]/20 ${
        isActive
          ? "border-[#1268d8] bg-[#f5f8ff] shadow-[0_5px_20px_rgba(0,72,196,0.08)]"
          : "border-[#e1e1e1] bg-white hover:border-[#c8d4e7] hover:bg-[#fafcff]"
      }`}
      layout
      onClick={onClick}
      type="button"
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
    >
      {isActive ? (
        <motion.span
          className="absolute inset-y-3 right-0 w-1 rounded-l-full bg-[#0048c4]"
          layoutId="crm-request-active-indicator"
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-normal text-[#4d4d4d]">
              {request.category}
            </span>
            {isNew ? (
              <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-[#e7f8ef] px-2 text-[10px] font-bold text-[#079455]">
                جدید
              </span>
            ) : null}
          </div>
          <strong className="mt-1 block truncate text-sm font-semibold leading-6 text-[#1a1a1a]">
            {request.title}
          </strong>
        </div>
        <StatusChip status={request.status} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#666666]">
        <LinearUserAccount className="h-4 w-4 shrink-0 text-[#808080]" />
        <span className="truncate">{request.customerName}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-[10px] font-normal leading-4 text-[#808080]">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <LinearClock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{request.createdAt}</span>
        </span>
        <span className="shrink-0">شماره {request.requestNumber}</span>
      </div>
    </motion.button>
  );
}

function RequestReplyBubble({
  prefersReducedMotion,
  reply,
}: {
  prefersReducedMotion: boolean;
  reply: RequestReply;
}) {
  const isSupport = reply.sender === "support";

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isSupport ? "justify-start" : "justify-end"}`}
      initial={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 8, scale: 0.98 }
      }
      layout
      transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
    >
      <div
        className={`max-w-[76%] rounded-2xl px-4 py-3 shadow-sm ${
          isSupport
            ? "rounded-br-md bg-[#eaf1ff] text-[#1a1a1a]"
            : "rounded-bl-md border border-[#e8e8e8] bg-white text-[#303030]"
        }`}
      >
        <span className="mb-1 block text-[10px] font-semibold text-[#808080]">
          {isSupport ? "پشتیبانی بنگاه" : "کاربر"}
        </span>
        <p className="m-0 text-sm font-medium leading-7">{reply.text}</p>
        <span className="mt-1 block text-left text-[11px] font-medium text-[#999999]">
          {reply.time}
        </span>
      </div>
    </motion.div>
  );
}

function RequestMetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-[#fafafa] px-3 py-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#0048c4] shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        {icon}
      </span>
      <div className="min-w-0">
        <span className="block text-[10px] font-medium text-[#999999]">
          {label}
        </span>
        <strong className="mt-1 block truncate text-xs font-semibold text-[#303030]">
          {value}
        </strong>
      </div>
    </div>
  );
}

function EmptyListState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="grid h-full min-h-52 place-items-center px-7 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
          <LinearRequestList className="h-7 w-7" />
        </span>
        <strong className="mt-4 block text-sm font-bold text-[#303030]">
          {hasSearch ? "درخواستی پیدا نشد" : "درخواستی در این وضعیت نیست"}
        </strong>
        <p className="m-0 mt-2 text-xs font-medium leading-6 text-[#8a8a8a]">
          {hasSearch
            ? "عبارت جستجو یا فیلتر وضعیت را تغییر دهید."
            : "با ثبت درخواست جدید توسط کاربران، این فهرست بروزرسانی می‌شود."}
        </p>
      </div>
    </div>
  );
}

function CloseRequestDialog({
  isOpen,
  onCancel,
  onConfirm,
  prefersReducedMotion,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  prefersReducedMotion: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] grid place-items-center bg-[#111827]/35 p-5 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 12, scale: 0.97 }
            }
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0ee] text-[#d92d20]">
              <LinearCancel className="h-6 w-6" />
            </span>
            <h2 className="m-0 mt-4 text-base font-bold text-[#1a1a1a]">
              بستن درخواست
            </h2>
            <p className="m-0 mt-2 text-sm font-medium leading-7 text-[#666666]">
              بعد از بستن درخواست، امکان ارسال پاسخ جدید برای آن غیرفعال می‌شود.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="h-10 rounded-xl border border-[#d8dee8] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f5f5f5]"
                onClick={onCancel}
                type="button"
              >
                انصراف
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#d92d20] px-4 text-sm font-semibold text-white transition hover:bg-[#bd251a]"
                onClick={onConfirm}
                type="button"
              >
                <LinearCheckmark className="h-4 w-4" />
                بستن درخواست
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function CrmSupportRequestsView({
  notify,
  refreshNonce,
}: CrmSupportRequestsViewProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [initialState] = useState(() => {
    const items = loadRequests();
    return { items, selectedId: items[0]?.id ?? null };
  });
  const [requests, setRequests] = useState<CrmSupportRequest[]>(
    initialState.items,
  );
  const [activeFilter, setActiveFilter] =
    useState<SupportRequestFilter>("all");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    initialState.selectedId,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const composerRef = useRef<HTMLInputElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const replaceRequests = useCallback((nextRequests: CrmSupportRequest[]) => {
    setRequests(nextRequests);
    setSelectedRequestId((current) =>
      current && nextRequests.some((request) => request.id === current)
        ? current
        : (nextRequests[0]?.id ?? null),
    );
  }, []);

  useEffect(() => {
    replaceRequests(loadRequests());
  }, [refreshNonce, replaceRequests]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SUPPORT_REQUESTS_STORAGE_KEY) return;
      replaceRequests(loadRequests());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [replaceRequests]);

  const counts = useMemo(
    () => ({
      all: requests.length,
      open: requests.filter((request) => request.status === "open").length,
      in_progress: requests.filter(
        (request) => request.status === "in_progress",
      ).length,
      closed: requests.filter((request) => request.status === "closed").length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchQuery);

    return requests.filter((request) => {
      if (activeFilter !== "all" && request.status !== activeFilter) {
        return false;
      }

      if (!normalizedSearch) return true;

      return [
        request.title,
        request.category,
        request.requestNumber,
        request.customerName,
        request.customerMobile,
      ].some((value) =>
        normalizeSearchValue(value).includes(normalizedSearch),
      );
    });
  }, [activeFilter, requests, searchQuery]);

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

  useEffect(() => {
    setDraft("");
    setIsCloseDialogOpen(false);
  }, [selectedRequestId]);

  useEffect(() => {
    if (!selectedRequest) return;

    const frame = window.requestAnimationFrame(() => {
      conversationEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [prefersReducedMotion, selectedRequest, selectedRequest?.replies.length]);

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
    setIsCloseDialogOpen(false);
    notify("درخواست بسته شد.", "success");
  };

  const refreshRequests = () => {
    replaceRequests(loadRequests());
    notify("فهرست درخواست‌ها بروزرسانی شد.", "success");
  };

  return (
    <section className="flex h-full min-h-[620px] flex-col gap-4" dir="rtl">
      <header className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eaf1ff] text-[#0048c4]">
              <LinearRequestList className="h-6 w-6" />
            </span>
            <div>
              <h1 className="m-0 text-lg font-bold text-[#1a1a1a]">
                درخواست‌های کاربران
              </h1>
              <p className="m-0 mt-1 text-sm font-medium text-[#808080]">
                مشاهده، پاسخگویی و پیگیری درخواست‌های ثبت‌شده از حساب کاربری
              </p>
            </div>
          </div>

          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:border-[#0048c4] hover:text-[#0048c4]"
            onClick={refreshRequests}
            type="button"
          >
            <LinearRefresh className="h-5 w-5" />
            بروزرسانی
          </button>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SummaryCard
            icon={<LinearRequestList className="h-5 w-5" />}
            label="کل درخواست‌ها"
            value={counts.all}
          />
          <SummaryCard
            icon={<LinearBubbleChat className="h-5 w-5" />}
            label="درخواست باز"
            value={counts.open}
          />
          <SummaryCard
            icon={<LinearClock className="h-5 w-5" />}
            label="در حال بررسی"
            value={counts.in_progress}
          />
          <SummaryCard
            icon={<LinearCheckmark className="h-5 w-5" />}
            label="بسته شده"
            value={counts.closed}
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[390px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="shrink-0 border-b border-[#eeeeee] p-3">
            <label className="relative block">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#808080]">
                <LinearSearch className="h-5 w-5" />
              </span>
              <input
                className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#fafafa] pr-10 pl-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:bg-white focus:ring-2 focus:ring-[#0048c4]/10"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="جستجو در عنوان، شماره یا نام کاربر"
                type="search"
                value={searchQuery}
              />
            </label>
          </div>

          <nav
            aria-label="فیلتر وضعیت درخواست‌ها"
            className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#eeeeee] px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  aria-pressed={isActive}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
                    isActive
                      ? "border-[#1268d8] bg-[#eaf1ff] text-[#0048c4]"
                      : "border-[#d9d9d9] bg-white text-[#4d4d4d] hover:bg-[#f7f7f7]"
                  }`}
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  type="button"
                >
                  {filter.label}
                  <span
                    className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                      isActive
                        ? "bg-white text-[#0048c4]"
                        : "bg-[#f1f1f1] text-[#777777]"
                    }`}
                  >
                    {formatCount(counts[filter.id])}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            aria-live="polite"
            className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {filteredRequests.map((request) => (
                <RequestListCard
                  isActive={request.id === selectedRequestId}
                  key={request.id}
                  onClick={() => setSelectedRequestId(request.id)}
                  prefersReducedMotion={prefersReducedMotion}
                  request={request}
                />
              ))}
            </AnimatePresence>

            {filteredRequests.length === 0 ? (
              <EmptyListState hasSearch={Boolean(searchQuery.trim())} />
            ) : null}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <AnimatePresence initial={false} mode="wait">
            {selectedRequest ? (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex min-h-0 flex-1 flex-col"
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: -10 }
                }
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, x: 12 }
                }
                key={selectedRequest.id}
                transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              >
                <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                      <LinearUserAccount className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
                        {selectedRequest.customerName}
                      </strong>
                      <span className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-[#808080]">
                        <LinearPhone2 className="h-4 w-4 shrink-0" />
                        {selectedRequest.customerMobile}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusChip status={selectedRequest.status} />
                    <button
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e3a2a2] bg-white px-3 text-xs font-semibold text-[#c32929] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:border-[#e4e4e4] disabled:text-[#a6a6a6]"
                      disabled={selectedRequest.status === "closed"}
                      onClick={() => setIsCloseDialogOpen(true)}
                      type="button"
                    >
                      <LinearCancel className="h-4 w-4" />
                      بستن درخواست
                    </button>
                  </div>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-[#eeeeee] bg-white px-5 py-4 xl:grid-cols-4">
                  <RequestMetaItem
                    icon={<LinearCategory className="h-4 w-4" />}
                    label="دسته‌بندی"
                    value={selectedRequest.category}
                  />
                  <RequestMetaItem
                    icon={<LinearDocument className="h-4 w-4" />}
                    label="شماره درخواست"
                    value={selectedRequest.requestNumber}
                  />
                  <RequestMetaItem
                    icon={<LinearFlag className="h-4 w-4" />}
                    label="اولویت"
                    value={<PriorityChip priority={selectedRequest.priority} />}
                  />
                  <RequestMetaItem
                    icon={<LinearCalendar className="h-4 w-4" />}
                    label="زمان ثبت"
                    value={selectedRequest.createdAt}
                  />
                </div>

                <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5">
                  <motion.article
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 8 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-medium text-[#808080]">
                          شرح درخواست کاربر
                        </span>
                        <h2 className="m-0 mt-1 text-base font-bold text-[#1a1a1a]">
                          {selectedRequest.title}
                        </h2>
                      </div>
                      <PriorityChip priority={selectedRequest.priority} />
                    </div>
                    <p className="m-0 mt-3 text-sm font-medium leading-7 text-[#4d4d4d]">
                      {selectedRequest.description ||
                        "توضیحی برای این درخواست ثبت نشده است."}
                    </p>

                    {selectedRequest.attachmentName ? (
                      <button
                        className="mt-4 inline-flex h-9 max-w-full items-center gap-2 rounded-lg border border-[#dce3ef] bg-[#f8faff] px-3 text-xs font-semibold text-[#0048c4] transition hover:bg-[#eef4ff]"
                        type="button"
                      >
                        <LinearAttachment className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {selectedRequest.attachmentName}
                        </span>
                      </button>
                    ) : null}
                  </motion.article>

                  <AnimatePresence initial={false}>
                    {selectedRequest.replies.map((reply) => (
                      <RequestReplyBubble
                        key={reply.id}
                        prefersReducedMotion={prefersReducedMotion}
                        reply={reply}
                      />
                    ))}
                  </AnimatePresence>
                  <div ref={conversationEndRef} />
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
                  <motion.button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-5 text-sm font-semibold text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={
                      !draft.trim() || selectedRequest.status === "closed"
                    }
                    type="submit"
                    whileTap={
                      prefersReducedMotion ||
                      !draft.trim() ||
                      selectedRequest.status === "closed"
                        ? undefined
                        : { scale: 0.96 }
                    }
                  >
                    ارسال پاسخ
                    <LinearSendComment className="h-5 w-5" />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                className="grid h-full place-items-center px-8 text-center"
                initial={{ opacity: 0 }}
                key="empty-request-detail"
              >
                <div>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
                    <LinearRequestList className="h-8 w-8" />
                  </span>
                  <h2 className="m-0 mt-5 text-lg font-bold text-[#1a1a1a]">
                    درخواستی انتخاب نشده است
                  </h2>
                  <p className="m-0 mt-2 text-sm font-medium text-[#808080]">
                    برای مشاهده جزئیات و پاسخگویی، یک درخواست را انتخاب کنید.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CloseRequestDialog
        isOpen={isCloseDialogOpen}
        onCancel={() => setIsCloseDialogOpen(false)}
        onConfirm={closeRequest}
        prefersReducedMotion={prefersReducedMotion}
      />
    </section>
  );
}
