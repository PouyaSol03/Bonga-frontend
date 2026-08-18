import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type UIEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
} from "../chat/api/chat-socket";
import LinearAttachment from "../../shared/icons/LinearAttachment";
import LinearBubbleChat from "../../shared/icons/LinearBubbleChat";
import LinearCalendar from "../../shared/icons/LinearCalendar";
import LinearCancel from "../../shared/icons/LinearCancel";
import LinearCategory from "../../shared/icons/LinearCategory";
import LinearCheckmark from "../../shared/icons/LinearCheckmark";
import LinearClock from "../../shared/icons/LinearClock";
import LinearDocument from "../../shared/icons/LinearDocument";
import LinearFlag from "../../shared/icons/LinearFlag";
import LinearPhone2 from "../../shared/icons/LinearPhone2";
import LinearRefresh from "../../shared/icons/LinearRefresh";
import LinearRequestList from "../../shared/icons/LinearRequestList";
import LinearSearch from "../../shared/icons/LinearSearch";
import LinearSendComment from "../../shared/icons/LinearSendComment";
import LinearUserAccount from "../../shared/icons/LinearUserAccount";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { useInfiniteChatMessagesQuery } from "../chat/api/chat.hooks";
import {
  useAssignPanelSupportRequestMutation,
  usePanelSupportRequestsQuery,
  useSendPanelSupportRequestMessageMutation,
  useUpdatePanelSupportRequestStatusMutation,
} from "../support/api/support.hooks";
import type { ChatMessage } from "../chat/api/chat.service";
import type { PanelSupportRequestStatus } from "../support/api/panel-support.service";
import type { SupportRequestItem } from "../support/api/support-request.service";
import {
  formatSupportMessageTime,
  mapAccountSupportMessage,
  mergeSupportChatMessages,
  readChatPathText,
  readCurrentAccountUserId,
  readSocketSupportMessage,
  readSupportMessageThreadId,
  SupportMessageBubble,
  type SupportChatMessage,
} from "../account/accountSupportViews";
import type { CrmRoutePageProps } from "./CrmLayout";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type StatusFilter = "all" | PanelSupportRequestStatus;

type CrmSupportRequest = {
  assignedSupportId: string;
  attachmentName?: string;
  category: string;
  createdAt: string;
  customerMobile: string;
  customerName: string;
  description: string;
  id: string;
  priority: string;
  requestNumber: string;
  status: PanelSupportRequestStatus;
  threadId: string;
  title: string;
};

const filterOptions: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "open", label: "باز" },
  { id: "reviewing", label: "در حال بررسی" },
  { id: "closed", label: "بسته شده" },
];

const priorityOptions = [
  { label: "همه اولویت‌ها", value: "" },
  { label: "عادی", value: "normal" },
  { label: "مهم", value: "important" },
  { label: "فوری", value: "urgent" },
];

const statusPresentation: Record<
  PanelSupportRequestStatus,
  { className: string; label: string }
> = {
  open: { className: "bg-[#e6f8ef] text-[#079455]", label: "باز" },
  reviewing: { className: "bg-[#eaf1ff] text-[#0048c4]", label: "در حال بررسی" },
  closed: { className: "bg-[#f1f1f1] text-[#808080]", label: "بسته شده" },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeStatus(value: unknown): PanelSupportRequestStatus {
  const status = String(value ?? "").toLowerCase();
  if (status === "closed") return "closed";
  if (status === "reviewing" || status === "in_progress" || status === "in-progress") {
    return "reviewing";
  }
  return "open";
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

function readAttachmentName(item: SupportRequestItem) {
  const record = asRecord(item);
  const direct = readChatPathText(record, [
    "attachment_name",
    "attachment.file_name",
    "attachment.name",
    "file_name",
  ]);
  if (direct) return direct;

  const attachments = record.attachments;
  if (!Array.isArray(attachments) || attachments.length === 0) return undefined;
  return readChatPathText(attachments[0], ["file_name", "name", "title"]) || undefined;
}

function firstNonEmptyRecord(...values: unknown[]) {
  for (const value of values) {
    const record = asRecord(value);
    if (Object.keys(record).length > 0) return record;
  }
  return {};
}

function mapRequest(item: SupportRequestItem): CrmSupportRequest {
  const itemRecord = asRecord(item);
  const user = firstNonEmptyRecord(item.user, itemRecord.requester, itemRecord.customer);
  const assignedSupport = firstNonEmptyRecord(
    item.assigned_support,
    itemRecord.assignedSupport,
    itemRecord.assignee,
  );
  const firstName = readChatPathText(user, ["name", "first_name", "firstName"]);
  const family = readChatPathText(user, ["family", "last_name", "lastName"]);
  const id = readChatPathText(item, ["id", "_id", "request_id", "requestId"]);
  const threadId = readChatPathText(item, [
    "thread_id",
    "threadId",
    "chat_thread_id",
    "chatThreadId",
    "thread.id",
    "thread._id",
    "chat.id",
    "chat._id",
  ]);

  return {
    assignedSupportId:
      readChatPathText(item, ["assigned_support_id", "assignedSupportId", "support_user_id"]) ||
      readChatPathText(assignedSupport, ["id", "_id", "user_id", "userId"]),
    attachmentName: readAttachmentName(item),
    category:
      readChatPathText(item, [
        "category_label",
        "categoryLabel",
        "category.name",
        "category.title",
        "category",
      ]) || "پشتیبانی",
    createdAt: formatDate(readChatPathText(item, ["created_at", "createdAt"])),
    customerMobile:
      readChatPathText(user, ["mobile", "phone", "phone_number", "phoneNumber"]) ||
      "شماره تماس ثبت نشده",
    customerName:
      readChatPathText(user, ["full_name", "fullName"]) ||
      `${firstName} ${family}`.trim() ||
      "کاربر بنگاه",
    description:
      readChatPathText(item, ["description", "body", "message"]) ||
      "توضیحی برای این درخواست ثبت نشده است.",
    id: id || threadId,
    priority: readChatPathText(item, ["priority"]) || "normal",
    requestNumber: `#${id || "-"}`,
    status: normalizeStatus(asRecord(item).status),
    threadId,
    title: readChatPathText(item, ["subject", "title"]) || "درخواست پشتیبانی",
  };
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
}

function formatCount(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function priorityLabel(priority: string) {
  if (priority === "urgent" || priority === "فوری") return "فوری";
  if (priority === "important" || priority === "مهم") return "مهم";
  return "عادی";
}

function messageTimestamp(message: ChatMessage) {
  const value = readChatPathText(message, ["created_at", "createdAt", "sent_at", "sentAt"]);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function StatusChip({ status }: { status: PanelSupportRequestStatus }) {
  const presentation = statusPresentation[status];
  return (
    <Typography as="span" variant="label" size="small" weight="medium" className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${presentation.className}`}>
      {presentation.label}
    </Typography>
  );
}

function PriorityChip({ priority }: { priority: string }) {
  const label = priorityLabel(priority);
  const className =
    label === "فوری"
      ? "bg-[#fff0ee] text-[#d92d20]"
      : label === "مهم"
        ? "bg-[#fff6e5] text-[#b54708]"
        : "bg-[#f1f1f1] text-[#666666]";

  return <Typography as="span" variant="label" size="small" weight="medium" className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium ${className}`}>{label}</Typography>;
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex min-w-[155px] items-center gap-3 rounded-xl border border-[#eeeeee] bg-[#fafafa] px-4 py-3">
      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#0048c4]">{icon}</Typography>
      <Typography as="span" variant="body" size="medium" weight="regular">
        <strong className="block text-base font-bold text-[#1a1a1a]">{formatCount(value)}</strong>
        <Typography as="span" variant="body" size="small" weight="regular" className="mt-0.5 block text-xs text-[#808080]">{label}</Typography>
      </Typography>
    </div>
  );
}

function RequestMetaItem({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#fafafa] px-3 py-2.5">
      <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 text-[#808080]">{icon}</Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0">
        <Typography as="span" variant="body" size="small" weight="regular" className="block text-[10px] text-[#999999]">{label}</Typography>
        <Typography as="span" variant="label" size="small" weight="semibold" className="mt-1 block truncate text-xs font-semibold text-[#303030]">{value}</Typography>
      </Typography>
    </div>
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
    <motion.button
      className={`w-full rounded-xl border p-3 text-right transition ${
        isActive
          ? "border-[#1268d8] bg-[#f3f7ff]"
          : "border-[#eeeeee] bg-white hover:bg-[#fafcff]"
      }`}
      layout
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-start justify-between gap-2">
        <strong className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]">{request.title}</strong>
        <StatusChip status={request.status} />
      </Typography>
      <Typography as="span" variant="body" size="small" weight="regular" className="mt-2 block truncate text-xs text-[#666666]">
        {request.customerName} · {request.category}
      </Typography>
      <Typography as="span" variant="body" size="small" weight="regular" className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[#999999]">
        <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">{request.createdAt}</Typography>
        <PriorityChip priority={request.priority} />
      </Typography>
    </motion.button>
  );
}

export function CrmSupportRequestsView({ notify, refreshNonce }: CrmRoutePageProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [draft, setDraft] = useState("");
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const composerRef = useRef<HTMLInputElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useMemo(readCurrentAccountUserId, []);

  const filters = useMemo(
    () => ({
      category: category.trim() || undefined,
      page,
      perPage: 20,
      priority: priority || undefined,
      status: activeFilter === "all" ? undefined : activeFilter,
    }),
    [activeFilter, category, page, priority],
  );
  const requestsQuery = usePanelSupportRequestsQuery(filters);
  const assignMutation = useAssignPanelSupportRequestMutation();
  const statusMutation = useUpdatePanelSupportRequestStatusMutation();
  const sendMessageMutation = useSendPanelSupportRequestMessageMutation();

  const requests = useMemo(
    () => (requestsQuery.data?.data ?? []).map(mapRequest).filter((request) => request.id),
    [requestsQuery.data?.data],
  );
  const filteredRequests = useMemo(() => {
    const search = normalizeSearch(searchQuery);
    if (!search) return requests;

    return requests.filter((request) =>
      [
        request.title,
        request.category,
        request.requestNumber,
        request.customerName,
        request.customerMobile,
        request.description,
      ]
        .join(" ")
        .toLocaleLowerCase("fa-IR")
        .includes(search),
    );
  }, [requests, searchQuery]);

  useEffect(() => {
    void requestsQuery.refetch();
  }, [refreshNonce]);

  useEffect(() => {
    if (selectedRequestId && filteredRequests.some((request) => request.id === selectedRequestId)) {
      return;
    }
    setSelectedRequestId(filteredRequests[0]?.id ?? "");
  }, [filteredRequests, selectedRequestId]);

  const selectedRequest = filteredRequests.find((request) => request.id === selectedRequestId);

  useEffect(() => {
    setAssignUserId(selectedRequest?.assignedSupportId ?? "");
    setDraft("");
  }, [selectedRequest?.assignedSupportId, selectedRequest?.id]);

  const messagesQuery = useInfiniteChatMessagesQuery(selectedRequest?.threadId || null, 30);
  const apiMessages = useMemo(() => {
    if (!selectedRequest?.threadId) return [];
    const rawMessages = (messagesQuery.data?.pages ?? [])
      .flatMap((messagePage) => messagePage.data)
      .sort((first, second) => messageTimestamp(first) - messageTimestamp(second));

    return rawMessages.flatMap((message, index) => {
      const mapped = mapAccountSupportMessage(
        message,
        index,
        currentUserId,
        selectedRequest.threadId,
      );
      return mapped ? [mapped] : [];
    });
  }, [currentUserId, messagesQuery.data?.pages, selectedRequest?.threadId]);
  const messages = useMemo(
    () =>
      mergeSupportChatMessages([
        ...apiMessages,
        ...liveMessages.filter((message) => message.threadId === selectedRequest?.threadId),
      ]),
    [apiMessages, liveMessages, selectedRequest?.threadId],
  );

  useEffect(() => {
    const threadId = selectedRequest?.threadId;
    if (!threadId) return undefined;

    const socket = joinChatThread({ category: "support", threadId });
    const handleNewMessage = (payload: unknown) => {
      const rawMessage = readSocketSupportMessage(payload);
      if (!rawMessage) return;
      const payloadThreadId =
        readSupportMessageThreadId(payload) ||
        readSupportMessageThreadId(rawMessage) ||
        threadId;
      if (payloadThreadId !== threadId) return;

      const mapped = mapAccountSupportMessage(rawMessage, Date.now(), currentUserId, threadId);
      if (!mapped) return;
      setLiveMessages((current) => mergeSupportChatMessages([...current, mapped]));
      markChatRead(threadId, "support");
    };
    const handleSocketError = (payload: { message?: string }) => {
      notify(payload.message || "ارسال پیام زنده با خطا مواجه شد.", "error");
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:error", handleSocketError);
    markChatRead(threadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:error", handleSocketError);
      leaveChatThread(threadId, "support");
    };
  }, [currentUserId, notify, selectedRequest?.threadId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      conversationEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, prefersReducedMotion, selectedRequestId]);

  const changeStatus = (status: PanelSupportRequestStatus) => {
    if (!selectedRequest || status === selectedRequest.status) return;
    statusMutation.mutate(
      { requestId: selectedRequest.id, status },
      {
        onError: () => notify("تغییر وضعیت درخواست انجام نشد.", "error"),
        onSuccess: () => {
          notify("وضعیت درخواست بروزرسانی شد.");
          void requestsQuery.refetch();
        },
      },
    );
  };

  const assignRequest = () => {
    if (!selectedRequest) return;
    const supportUserId = Number(assignUserId);
    if (!Number.isInteger(supportUserId) || supportUserId <= 0) {
      notify("شناسه عددی کارشناس پشتیبانی را وارد کنید.", "error");
      return;
    }

    assignMutation.mutate(
      { requestId: selectedRequest.id, supportUserId },
      {
        onError: () => notify("تخصیص درخواست انجام نشد.", "error"),
        onSuccess: () => {
          notify("درخواست به کارشناس تخصیص داده شد.");
          void requestsQuery.refetch();
        },
      },
    );
  };

  const sendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedRequest || selectedRequest.status === "closed") return;

    if (selectedRequest.threadId) {
      setLiveMessages((current) =>
        mergeSupportChatMessages([
          ...current,
          {
            direction: "outgoing",
            id: `local-${Date.now()}`,
            text: body,
            threadId: selectedRequest.threadId,
            time: formatSupportMessageTime(new Date().toISOString()),
            type: "text",
          },
        ]),
      );
    }
    setDraft("");

    sendMessageMutation.mutate(
      { body, requestId: selectedRequest.id },
      {
        onError: () => {
          if (!selectedRequest.threadId) {
            notify("ارسال پاسخ انجام نشد.", "error");
            setDraft(body);
            return;
          }

          // Socket fallback: join must happen before the first message in a new room.
          joinChatThread({ category: "support", threadId: selectedRequest.threadId });
          sendChatTextMessage({
            body,
            category: "support",
            threadId: selectedRequest.threadId,
          });
          notify("پاسخ از مسیر گفتگوی زنده ارسال شد.");
        },
        onSuccess: () => {
          notify("پاسخ ارسال شد.");
          if (selectedRequest.status === "open") {
            changeStatus("reviewing");
          }
          void messagesQuery.refetch();
          void requestsQuery.refetch();
        },
      },
    );

    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  const handleMessagesScroll = (event: UIEvent<HTMLElement>) => {
    if (
      event.currentTarget.scrollTop < 80 &&
      messagesQuery.hasNextPage &&
      !messagesQuery.isFetchingNextPage
    ) {
      void messagesQuery.fetchNextPage();
    }
  };

  const total = requestsQuery.data?.total ?? requests.length;
  const perPage = requestsQuery.data?.perPage ?? 20;
  const hasNextPage = page * perPage < total;
  const counts = {
    all: activeFilter === "all" ? total : requests.length,
    open: requests.filter((request) => request.status === "open").length,
    reviewing: requests.filter((request) => request.status === "reviewing").length,
    closed: requests.filter((request) => request.status === "closed").length,
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4" dir="rtl">
      <header className="shrink-0 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf1ff] text-[#0048c4]">
              <LinearRequestList className="h-6 w-6" />
            </Typography>
            <div>
              <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold text-[#1a1a1a]">درخواست‌های پشتیبانی</Typography>
              <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-1 text-sm text-[#808080]">
                مشاهده، تخصیص، پاسخگویی و پیگیری درخواست‌های کاربران
              </Typography>
            </div>
          </div>
          <Button unstyled
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ef] px-4 text-sm font-semibold text-[#4d4d4d] hover:border-[#0048c4] hover:text-[#0048c4]"
            onClick={() => void requestsQuery.refetch().then(() => notify("فهرست درخواست‌ها بروزرسانی شد."))}
            type="button"
          >
            <LinearRefresh className="h-5 w-5" />
            بروزرسانی
          </Button>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SummaryCard icon={<LinearRequestList className="h-5 w-5" />} label="کل درخواست‌ها" value={counts.all} />
          <SummaryCard icon={<LinearBubbleChat className="h-5 w-5" />} label="درخواست باز" value={counts.open} />
          <SummaryCard icon={<LinearClock className="h-5 w-5" />} label="در حال بررسی" value={counts.reviewing} />
          <SummaryCard icon={<LinearCheckmark className="h-5 w-5" />} label="بسته شده" value={counts.closed} />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[390px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <div className="shrink-0 space-y-3 border-b border-[#eeeeee] p-3">
            <label className="relative block">
              <LinearSearch className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#808080]" />
              <input
                className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#fafafa] pr-10 pl-3 text-sm outline-none focus:border-[#0048c4] focus:bg-white"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="جستجو در عنوان، شماره یا نام کاربر"
                type="search"
                value={searchQuery}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="h-10 min-w-0 rounded-xl border border-[#d9d9d9] px-3 text-xs outline-none focus:border-[#0048c4]"
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                placeholder="دسته‌بندی"
                value={category}
              />
              <select
                className="h-10 min-w-0 rounded-xl border border-[#d9d9d9] bg-white px-3 text-xs outline-none focus:border-[#0048c4]"
                onChange={(event) => {
                  setPriority(event.target.value);
                  setPage(1);
                }}
                value={priority}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-[#eeeeee] px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <Button unstyled
                  className={`h-9 shrink-0 rounded-lg border px-3 text-xs font-semibold ${
                    isActive
                      ? "border-[#1268d8] bg-[#eaf1ff] text-[#0048c4]"
                      : "border-[#d9d9d9] bg-white text-[#4d4d4d]"
                  }`}
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setPage(1);
                  }}
                  type="button"
                >
                  {filter.label}
                </Button>
              );
            })}
          </nav>

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
            {requestsQuery.isLoading ? (
              <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">در حال دریافت درخواست‌ها...</Typography>
            ) : requestsQuery.isError ? (
              <div className="py-16 text-center">
                <Typography as="p" variant="body" size="medium" weight="regular" className="text-sm text-[#d92d20]">دریافت درخواست‌ها با خطا مواجه شد.</Typography>
                <Button unstyled className="mt-3 h-9 rounded-lg bg-[#0048c4] px-4 text-xs font-semibold text-white" onClick={() => void requestsQuery.refetch()} type="button">تلاش دوباره</Button>
              </div>
            ) : filteredRequests.length === 0 ? (
              <SearchEmptyState className="min-h-[300px] px-4" />
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {filteredRequests.map((request) => (
                  <RequestListCard
                    isActive={request.id === selectedRequestId}
                    key={request.id}
                    onClick={() => setSelectedRequestId(request.id)}
                    request={request}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-[#eeeeee] p-3 text-xs text-[#666666]">
            <Button unstyled className="h-8 rounded-lg border border-[#d9d9d9] px-3 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">قبلی</Button>
            <Typography as="span" variant="body" size="medium" weight="regular">صفحه {formatCount(page)}</Typography>
            <Button unstyled className="h-8 rounded-lg border border-[#d9d9d9] px-3 disabled:opacity-40" disabled={!hasNextPage} onClick={() => setPage((current) => current + 1)} type="button">بعدی</Button>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          {!selectedRequest ? (
            <SearchEmptyState className="h-full min-h-0 flex-1" description="برای مشاهده جزئیات، یک درخواست را انتخاب کنید." title="درخواستی انتخاب نشده است" />
          ) : (
            <motion.div className="flex min-h-0 flex-1 flex-col" key={selectedRequest.id} initial={prefersReducedMotion ? undefined : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"><LinearUserAccount className="h-6 w-6" /></Typography>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-bold text-[#1a1a1a]">{selectedRequest.customerName}</strong>
                    <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#808080]"><LinearPhone2 className="h-4 w-4" />{selectedRequest.customerMobile}</Typography>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <select
                    className="h-9 rounded-lg border border-[#d9d9d9] bg-white px-3 text-xs font-semibold outline-none focus:border-[#0048c4]"
                    disabled={statusMutation.isPending}
                    onChange={(event) => changeStatus(event.target.value as PanelSupportRequestStatus)}
                    value={selectedRequest.status}
                  >
                    <option value="open">باز</option>
                    <option value="reviewing">در حال بررسی</option>
                    <option value="closed">بسته شده</option>
                  </select>
                  <Button unstyled
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e3a2a2] px-3 text-xs font-semibold text-[#c32929] disabled:opacity-40"
                    disabled={selectedRequest.status === "closed" || statusMutation.isPending}
                    onClick={() => changeStatus("closed")}
                    type="button"
                  >
                    <LinearCancel className="h-4 w-4" />بستن درخواست
                  </Button>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-[#eeeeee] px-5 py-4 xl:grid-cols-4">
                <RequestMetaItem icon={<LinearCategory className="h-4 w-4" />} label="دسته‌بندی" value={selectedRequest.category} />
                <RequestMetaItem icon={<LinearDocument className="h-4 w-4" />} label="شماره درخواست" value={selectedRequest.requestNumber} />
                <RequestMetaItem icon={<LinearFlag className="h-4 w-4" />} label="اولویت" value={<PriorityChip priority={selectedRequest.priority} />} />
                <RequestMetaItem icon={<LinearCalendar className="h-4 w-4" />} label="زمان ثبت" value={selectedRequest.createdAt} />
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#eeeeee] px-5 py-3">
                <input
                  className="h-9 w-52 rounded-lg border border-[#d9d9d9] px-3 text-xs outline-none focus:border-[#0048c4]"
                  inputMode="numeric"
                  onChange={(event) => setAssignUserId(event.target.value)}
                  placeholder="شناسه کارشناس پشتیبانی"
                  value={assignUserId}
                />
                <Button unstyled className="h-9 rounded-lg bg-[#0048c4] px-4 text-xs font-semibold text-white disabled:opacity-50" disabled={assignMutation.isPending} onClick={assignRequest} type="button">تخصیص درخواست</Button>
                <Typography as="span" variant="body" size="small" weight="regular" className="text-xs text-[#808080]">{selectedRequest.assignedSupportId ? `کارشناس فعلی: ${selectedRequest.assignedSupportId}` : "هنوز تخصیص داده نشده"}</Typography>
              </div>

              <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5" onScroll={handleMessagesScroll}>
                <article className="rounded-2xl border border-[#e8e8e8] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Typography as="span" variant="body" size="small" weight="regular" className="text-xs text-[#808080]">شرح درخواست کاربر</Typography>
                      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-1 text-base font-bold text-[#1a1a1a]">{selectedRequest.title}</Typography>
                    </div>
                    <PriorityChip priority={selectedRequest.priority} />
                  </div>
                  <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4d4d4d]">{selectedRequest.description}</Typography>
                  {selectedRequest.attachmentName ? (
                    <Typography as="span" variant="label" size="small" weight="semibold" className="mt-4 inline-flex h-9 max-w-full items-center gap-2 rounded-lg border border-[#dce3ef] bg-[#f8faff] px-3 text-xs font-semibold text-[#0048c4]"><LinearAttachment className="h-4 w-4" /><Typography as="span" variant="body" size="medium" weight="regular" className="truncate">{selectedRequest.attachmentName}</Typography></Typography>
                  ) : null}
                </article>

                {!selectedRequest.threadId ? (
                  <Typography as="p" variant="body" size="medium" weight="regular" className="py-8 text-center text-sm text-[#808080]">این درخواست هنوز گفتگوی متصل ندارد؛ پاسخ از API درخواست ارسال می‌شود.</Typography>
                ) : messagesQuery.isLoading ? (
                  <Typography as="p" variant="body" size="medium" weight="regular" className="py-8 text-center text-sm text-[#808080]">در حال دریافت پیام‌ها...</Typography>
                ) : messages.length === 0 ? (
                  <Typography as="p" variant="body" size="medium" weight="regular" className="py-8 text-center text-sm text-[#808080]">هنوز پاسخی ثبت نشده است.</Typography>
                ) : (
                  messages.map((message) => <SupportMessageBubble key={message.id} message={message} />)
                )}
                <div ref={conversationEndRef} />
              </main>

              <form className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4" onSubmit={sendReply}>
                <input
                  className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] px-4 text-sm outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] disabled:bg-[#f5f5f5]"
                  disabled={selectedRequest.status === "closed" || sendMessageMutation.isPending}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={selectedRequest.status === "closed" ? "این درخواست بسته شده است" : "پاسخ خود را بنویسید..."}
                  ref={composerRef}
                  value={draft}
                />
                <Button unstyled className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0048c4] px-5 text-sm font-semibold text-white disabled:opacity-50" disabled={!draft.trim() || selectedRequest.status === "closed" || sendMessageMutation.isPending} type="submit">
                  ارسال پاسخ<LinearSendComment className="h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
