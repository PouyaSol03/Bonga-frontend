import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearCancel from "../../components/(icons)/LinearCancel";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearSent from "../../components/(icons)/LinearSent";
import LinearTick from "../../components/(icons)/LinearTick";

type SupportMessage = {
  id: string;
  sender: "customer" | "support";
  text: string;
  time: string;
};

type SupportCustomer = {
  id: string;
  messages: SupportMessage[];
  name: string;
  phone: string;
  unreadCount: number;
  waitingTime: string;
};

const initialCustomers: SupportCustomer[] = [
  {
    id: "support-101",
    name: "محمد رضایی",
    phone: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
    unreadCount: 0,
    waitingTime: "۴ دقیقه",
    messages: [
      {
        id: "m-101-1",
        sender: "customer",
        text: "سلام، هنگام ثبت آگهی در مرحله انتخاب محله با خطا روبه‌رو می‌شوم.",
        time: "۱۰:۳۲",
      },
      {
        id: "m-101-2",
        sender: "support",
        text: "سلام، وقت بخیر. لطفاً بفرمایید این خطا بعد از انتخاب شهر نمایش داده می‌شود؟",
        time: "۱۰:۳۳",
      },
      {
        id: "m-101-3",
        sender: "customer",
        text: "بله، شهر را انتخاب می‌کنم اما فهرست محله‌ها باز نمی‌شود.",
        time: "۱۰:۳۴",
      },
    ],
  },
  {
    id: "support-102",
    name: "سارا احمدی",
    phone: "۰۹۳۵ ۱۲۳ ۴۵۶۷",
    unreadCount: 2,
    waitingTime: "۷ دقیقه",
    messages: [
      {
        id: "m-102-1",
        sender: "customer",
        text: "سلام، مبلغ بسته از حسابم کم شده اما اعتبار پنل اضافه نشده است.",
        time: "۱۰:۲۸",
      },
      {
        id: "m-102-2",
        sender: "customer",
        text: "شماره پیگیری پرداخت را هم دارم؛ برای شما ارسال کنم؟",
        time: "۱۰:۳۰",
      },
    ],
  },
  {
    id: "support-103",
    name: "علی حسینی",
    phone: "۰۹۱۵ ۸۷۶ ۵۴۳۲",
    unreadCount: 1,
    waitingTime: "۱۲ دقیقه",
    messages: [
      {
        id: "m-103-1",
        sender: "customer",
        text: "برای تغییر شماره تماس حساب کاربری باید از کدام قسمت اقدام کنم؟",
        time: "۱۰:۲۳",
      },
    ],
  },
  {
    id: "support-104",
    name: "مریم کریمی",
    phone: "۰۹۰۱ ۲۲۲ ۳۳۴۴",
    unreadCount: 1,
    waitingTime: "۱۵ دقیقه",
    messages: [
      {
        id: "m-104-1",
        sender: "customer",
        text: "مدارک احراز هویت من رد شده است. لطفاً راهنمایی می‌کنید چه چیزی باید اصلاح شود؟",
        time: "۱۰:۲۰",
      },
    ],
  },
];

const persianNumberFormatter = new Intl.NumberFormat("fa-IR");

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function ChatBubble({
  message,
  shouldReduceMotion,
}: {
  message: SupportMessage;
  shouldReduceMotion: boolean;
}) {
  const isSupport = message.sender === "support";

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex ${isSupport ? "justify-start" : "justify-end"}`}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.98, y: -4 }
      }
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.97, y: 10 }
      }
      layout="position"
      transition={
        shouldReduceMotion
          ? { duration: 0.08 }
          : { damping: 30, stiffness: 430, type: "spring" }
      }
    >
      <motion.div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
          isSupport
            ? "rounded-br-md bg-[#eaf1ff] text-[#1a1a1a]"
            : "rounded-bl-md border border-[#ececec] bg-white text-[#303030]"
        }`}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      >
        <p className="m-0 text-sm font-medium leading-7">{message.text}</p>
        <span className="mt-1 block text-left text-[11px] font-medium text-[#999999]">
          {message.time}
        </span>
      </motion.div>
    </motion.div>
  );
}

function CloseConversationDialog({
  customerName,
  onCancel,
  onConfirm,
  shouldReduceMotion,
}: {
  customerName: string;
  onCancel: () => void;
  onConfirm: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label="تأیید بستن چت"
      aria-modal="true"
      className="fixed inset-0 z-[120] grid place-items-center bg-[#1a1a1a]/55 px-5"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      role="dialog"
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.18 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
        dir="rtl"
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: 10 }
        }
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: 18 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.08 }
            : { damping: 28, stiffness: 360, type: "spring" }
        }
      >
        <motion.div
          animate={{ rotate: 0, scale: 1 }}
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eaf1ff] text-[#0048c4]"
          initial={shouldReduceMotion ? false : { rotate: -12, scale: 0.8 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { damping: 18, delay: 0.08, stiffness: 380, type: "spring" }
          }
        >
          <LinearTick aria-hidden="true" className="h-7 w-7" />
        </motion.div>
        <h2 className="m-0 mt-4 text-center text-base font-bold text-[#1a1a1a]">
          آیا می‌خواهید این چت را ببندید؟
        </h2>
        <p className="m-0 mt-2 text-center text-sm font-medium leading-6 text-[#808080]">
          گفتگو با {customerName} از فهرست گفتگوهای باز حذف می‌شود.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <motion.button
            className="h-11 rounded-xl border border-[#d7dfeb] bg-white text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f5f7fb]"
            onClick={onCancel}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            انصراف
          </motion.button>
          <motion.button
            className="h-11 rounded-xl bg-[#0048c4] text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={onConfirm}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            بله، بستن چت
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function CrmSupportView() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [customers, setCustomers] = useState(initialCustomers);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(
    initialCustomers[0]?.id ?? null,
  );
  const [draft, setDraft] = useState("");
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const composerInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeCustomer = useMemo(
    () => customers.find((customer) => customer.id === activeCustomerId),
    [activeCustomerId, customers],
  );
  const totalUnreadCount = useMemo(
    () => customers.reduce((total, customer) => total + customer.unreadCount, 0),
    [customers],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeCustomer?.id, activeCustomer?.messages.length]);

  const selectCustomer = (customerId: string) => {
    setActiveCustomerId(customerId);
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === customerId && customer.unreadCount > 0
          ? { ...customer, unreadCount: 0 }
          : customer,
      ),
    );
    setDraft("");
    window.requestAnimationFrame(() => composerInputRef.current?.focus());
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text || !activeCustomer) return;

    setCustomers((current) =>
      current.map((customer) =>
        customer.id === activeCustomer.id
          ? {
              ...customer,
              messages: [
                ...customer.messages,
                {
                  id: createMessageId(),
                  sender: "support",
                  text,
                  time: currentTimeLabel(),
                },
              ],
            }
          : customer,
      ),
    );
    setDraft("");
    window.requestAnimationFrame(() => composerInputRef.current?.focus());
  };

  const closeActiveConversation = () => {
    if (!activeCustomer) return;

    const activeIndex = customers.findIndex(
      (customer) => customer.id === activeCustomer.id,
    );
    const nextCustomer =
      customers[activeIndex + 1] ?? customers[activeIndex - 1] ?? null;

    setCustomers((current) =>
      current
        .filter((customer) => customer.id !== activeCustomer.id)
        .map((customer) =>
          customer.id === nextCustomer?.id
            ? { ...customer, unreadCount: 0 }
            : customer,
        ),
    );
    setActiveCustomerId(nextCustomer?.id ?? null);
    setDraft("");
    setIsCloseDialogOpen(false);
  };

  if (!activeCustomer) {
    return (
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="grid h-full min-h-[520px] place-items-center rounded-xl bg-white p-8 text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2.6, ease: "easeInOut", repeat: Infinity }
            }
          >
            <LinearChat aria-hidden="true" className="h-8 w-8" />
          </motion.div>
          <h2 className="m-0 mt-5 text-lg font-bold text-[#1a1a1a]">
            گفتگوی بازی وجود ندارد
          </h2>
          <p className="m-0 mt-2 text-sm font-medium text-[#808080]">
            در حال حاضر مشتری دیگری منتظر پاسخگویی نیست.
          </p>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-h-[620px] flex-col gap-4"
      dir="rtl"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
    >
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.04, duration: 0.2 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-lg font-bold text-[#1a1a1a]">
              پشتیبانی آنلاین
            </h1>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#0048c4]">
              پاسخگویی فوری
            </span>
          </div>
          <p className="m-0 mt-1 text-sm font-medium text-[#808080]">
            بین گفتگوهای باز جابه‌جا شوید و بدون از دست دادن پیام‌ها پاسخ دهید.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce5f4] bg-[#f7faff] px-4">
            <span className="text-xs font-medium text-[#808080]">
              گفتگوهای باز
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.strong
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-[#0048c4]"
                exit={{ opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                key={customers.length}
                transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
              >
                {persianNumberFormatter.format(customers.length)} گفتگو
              </motion.strong>
            </AnimatePresence>
          </div>
          <motion.button
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={() => setIsCloseDialogOpen(true)}
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            <span>بستن چت</span>
            <LinearCancel aria-hidden="true" className="h-[19px] w-[19px]" />
          </motion.button>
        </div>
      </motion.header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex min-h-0 w-[360px] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
          <div className="shrink-0 border-b border-[#eeeeee] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-sm font-bold text-[#1a1a1a]">
                  گفتگوهای فعال
                </h2>
                <p className="m-0 mt-1 text-xs font-medium text-[#808080]">
                  برای مشاهده هر گفتگو روی آن کلیک کنید.
                </p>
              </div>
              <AnimatePresence initial={false} mode="popLayout">
                {totalUnreadCount > 0 ? (
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="shrink-0 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-bold text-[#d9363e]"
                    exit={{ opacity: 0, scale: 0.86 }}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }
                    }
                    key={totalUnreadCount}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { damping: 24, stiffness: 420, type: "spring" }
                    }
                  >
                    {persianNumberFormatter.format(totalUnreadCount)} پیام جدید
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            <AnimatePresence initial={false} mode="popLayout">
              {customers.map((customer, index) => {
                const isActive = customer.id === activeCustomer.id;
                const lastMessage = customer.messages.at(-1);

                return (
                  <motion.button
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition ${
                      isActive
                        ? "border-[#8eb5ff] bg-[#eef4ff] shadow-[0_4px_14px_rgba(0,72,196,0.08)]"
                        : "border-[#eeeeee] bg-white hover:border-[#cbd8ee] hover:bg-[#f8faff]"
                    }`}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, x: 16 }
                    }
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.98, x: 10 }
                    }
                    key={customer.id}
                    layout
                    onClick={() => selectCustomer(customer.id)}
                    transition={{
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.025, 0.1),
                      duration: shouldReduceMotion ? 0 : 0.18,
                    }}
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { x: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <motion.span
                      animate={{ scale: isActive ? 1.04 : 1 }}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#0048c4] text-white"
                          : "bg-[#f0f3f8] text-[#5d6879]"
                      }`}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { damping: 25, stiffness: 400, type: "spring" }
                      }
                    >
                      {customer.name.slice(0, 1)}
                    </motion.span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <strong
                          className={`block truncate text-xs font-bold ${
                            customer.unreadCount > 0
                              ? "text-[#1a1a1a]"
                              : "text-[#303030]"
                          }`}
                        >
                          {customer.name}
                        </strong>
                        <span className="shrink-0 text-[10px] font-medium text-[#999999]">
                          {customer.waitingTime}
                        </span>
                      </span>

                      <span className="mt-1 flex min-w-0 items-center gap-2">
                        <span
                          className={`block min-w-0 flex-1 truncate text-[11px] ${
                            customer.unreadCount > 0
                              ? "font-bold text-[#505b6d]"
                              : "font-medium text-[#999999]"
                          }`}
                        >
                          {lastMessage?.text ?? "هنوز پیامی ارسال نشده است."}
                        </span>
                        <AnimatePresence initial={false}>
                          {customer.unreadCount > 0 ? (
                            <motion.span
                              animate={{ opacity: 1, scale: 1 }}
                              className="shrink-0 rounded-full bg-[#0048c4] px-2 py-0.5 text-[10px] font-bold text-white"
                              exit={{ opacity: 0, scale: 0.75 }}
                              initial={
                                shouldReduceMotion
                                  ? false
                                  : { opacity: 0, scale: 0.75 }
                              }
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : {
                                      damping: 20,
                                      stiffness: 450,
                                      type: "spring",
                                    }
                              }
                            >
                              {persianNumberFormatter.format(customer.unreadCount)} پیام جدید
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex min-h-0 flex-1 flex-col"
            initial={
              shouldReduceMotion ? false : { opacity: 0, x: -12 }
            }
            key={activeCustomer.id}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-sm font-bold text-[#0048c4]"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.82 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { damping: 22, stiffness: 380, type: "spring" }
                  }
                >
                  {activeCustomer.name.slice(0, 1)}
                </motion.div>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
                    {activeCustomer.name}
                  </strong>
                  <span className="mt-1 block truncate text-xs font-medium text-[#808080]">
                    {activeCustomer.phone}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf8f1] px-3 py-1.5 text-[11px] font-bold text-[#198754]">
                <span className="relative flex h-2 w-2">
                  <motion.span
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: [0.45, 0], scale: [1, 2.1] }
                    }
                    className="absolute inset-0 rounded-full bg-current"
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { duration: 1.8, ease: "easeOut", repeat: Infinity }
                    }
                  />
                  <span className="relative h-2 w-2 rounded-full bg-current" />
                </span>
                چت باز
              </span>
            </div>

            <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#999999] shadow-sm"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: -4 }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              >
                امروز
              </motion.div>
              <AnimatePresence initial={false}>
                {activeCustomer.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </AnimatePresence>
              <div aria-hidden="true" ref={messagesEndRef} />
            </main>

            <form
              className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4"
              onSubmit={sendMessage}
            >
              <motion.button
                aria-label="پیوست فایل"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#dce3ef] bg-white text-[#6f7888] transition hover:bg-[#f5f7fb]"
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              >
                <LinearAttachment
                  aria-hidden="true"
                  className="h-[21px] w-[21px]"
                />
              </motion.button>
              <input
                className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#303030] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="پیام خود را بنویسید..."
                ref={composerInputRef}
                value={draft}
              />
              <motion.button
                animate={{ scale: draft.trim() ? 1 : 0.96 }}
                aria-label="ارسال پیام"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0048c4] text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!draft.trim()}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { damping: 25, stiffness: 420, type: "spring" }
                }
                type="submit"
                whileHover={
                  shouldReduceMotion || !draft.trim() ? undefined : { y: -1 }
                }
                whileTap={
                  shouldReduceMotion || !draft.trim()
                    ? undefined
                    : { scale: 0.9 }
                }
              >
                <LinearSent aria-hidden="true" className="h-[21px] w-[21px]" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCloseDialogOpen ? (
          <CloseConversationDialog
            customerName={activeCustomer.name}
            onCancel={() => setIsCloseDialogOpen(false)}
            onConfirm={closeActiveConversation}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
