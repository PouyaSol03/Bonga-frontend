import { useMemo, useRef, useState, type FormEvent } from "react";

type SupportMessage = {
  id: string;
  sender: "customer" | "support";
  text: string;
  time: string;
};

type SupportCustomer = {
  id: string;
  name: string;
  phone: string;
  waitingTime: string;
  messages: SupportMessage[];
};

const initialCustomers: SupportCustomer[] = [
  {
    id: "support-101",
    name: "محمد رضایی",
    phone: "۰۹۱۲ ۳۴۵ ۶۷۸۹",
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
    waitingTime: "۷ دقیقه",
    messages: [
      {
        id: "m-102-1",
        sender: "customer",
        text: "سلام، مبلغ بسته از حسابم کم شده اما اعتبار پنل اضافه نشده است.",
        time: "۱۰:۲۸",
      },
    ],
  },
  {
    id: "support-103",
    name: "علی حسینی",
    phone: "۰۹۱۵ ۸۷۶ ۵۴۳۲",
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

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function ChatBubble({ message }: { message: SupportMessage }) {
  const isSupport = message.sender === "support";

  return (
    <div className={`flex ${isSupport ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${isSupport
            ? "rounded-br-md bg-[#eaf1ff] text-[#1a1a1a]"
            : "rounded-bl-md border border-[#ececec] bg-white text-[#303030]"
          }`}
      >
        <p className="m-0 text-sm font-medium leading-7">{message.text}</p>
        <span className="mt-1 block text-left text-[11px] font-medium text-[#999999]">
          {message.time}
        </span>
      </div>
    </div>
  );
}

function FinishConversationDialog({
  customerName,
  hasNextCustomer,
  onCancel,
  onConfirm,
}: {
  customerName: string;
  hasNextCustomer: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      aria-label="تأیید اتمام گفتگو"
      aria-modal="true"
      className="fixed inset-0 z-[120] grid place-items-center bg-[#1a1a1a]/55 px-5"
      role="dialog"
    >
      <section className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)]" dir="rtl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eaf1ff] text-[#0048c4]">
          <svg fill="none" height="25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="25">
            <path d="M20 11.5a8 8 0 1 1-3-6.2" />
            <path d="m9 11 2 2 7-7" />
          </svg>
        </div>
        <h2 className="m-0 mt-4 text-center text-base font-bold text-[#1a1a1a]">
          آیا گفتگو با مشتری به اتمام رسانده اید؟
        </h2>
        <p className="m-0 mt-2 text-center text-sm font-medium leading-6 text-[#808080]">
          گفتگو با {customerName} بسته می‌شود
          {hasNextCustomer ? " و مشتری بعدی از صف نمایش داده خواهد شد." : "."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="h-11 rounded-xl border border-[#d7dfeb] bg-white text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f5f7fb]"
            onClick={onCancel}
            type="button"
          >
            خیر
          </button>
          <button
            className="h-11 rounded-xl bg-[#0048c4] text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={onConfirm}
            type="button"
          >
            بله، اتمام گفتگو
          </button>
        </div>
      </section>
    </div>
  );
}

export function CrmSupportView() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const composerInputRef = useRef<HTMLInputElement | null>(null);

  const activeCustomer = customers[activeIndex];
  const waitingCount = Math.max(customers.length - activeIndex - 1, 0);
  const hasNextCustomer = waitingCount > 0;
  const queueCustomers = useMemo(
    () => customers.slice(activeIndex + 1),
    [activeIndex, customers],
  );

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text || !activeCustomer) return;

    setCustomers((current) =>
      current.map((customer, index) =>
        index === activeIndex
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

  const finishAndOpenNextCustomer = () => {
    setIsFinishDialogOpen(false);

    if (hasNextCustomer) {
      setActiveIndex((current) => current + 1);
      setDraft("");
      return;
    }

    setActiveIndex(customers.length);
    setDraft("");
  };

  if (!activeCustomer) {
    return (
      <section className="grid h-full min-h-[520px] place-items-center rounded-xl bg-white p-8 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
            <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="32">
              <path d="M4 5h16v11H8l-4 4z" />
              <path d="M8 9h8m-8 3h5" />
            </svg>
          </div>
          <h2 className="m-0 mt-5 text-lg font-bold text-[#1a1a1a]">صف پشتیبانی خالی است</h2>
          <p className="m-0 mt-2 text-sm font-medium text-[#808080]">
            در حال حاضر مشتری دیگری در صف پاسخگویی نیست.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-[620px] flex-col gap-4" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-lg font-bold text-[#1a1a1a]">پشتیبانی آنلاین</h1>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#0048c4]">
              پاسخگویی فوری
            </span>
          </div>
          <p className="m-0 mt-1 text-sm font-medium text-[#808080]">
            گفتگو با مشتریان حاضر در صف پشتیبانی
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce5f4] bg-[#f7faff] px-4">
            <span className="text-xs font-medium text-[#808080]">مشتریان در صف</span>
            <strong className="text-sm font-bold text-[#0048c4]">
              {new Intl.NumberFormat("fa-IR").format(waitingCount)} نفر
            </strong>
          </div>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={() => setIsFinishDialogOpen(true)}
            type="button"
          >
            <span>{hasNextCustomer ? "مشتری بعدی" : "اتمام گفتگو"}</span>
            <svg fill="none" height="19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="19">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[360px] shrink-0 min-h-0 flex-col overflow-hidden rounded-xl bg-white">
          <div className="shrink-0 border-b border-[#eeeeee] px-4 py-4">
            <h2 className="m-0 text-sm font-bold text-[#1a1a1a]">صف انتظار</h2>
            <p className="m-0 mt-1 text-xs font-medium text-[#808080]">
              ترتیب مشتریان بعدی
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {queueCustomers.length ? (
              queueCustomers.map((customer, index) => (
                <div className="flex items-center gap-3 rounded-xl border border-[#eeeeee] px-3 py-3" key={customer.id}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0f3f8] text-xs font-bold text-[#5d6879]">
                    {new Intl.NumberFormat("fa-IR").format(index + 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-xs font-bold text-[#303030]">
                      {customer.name}
                    </strong>
                    <span className="mt-1 block truncate text-[11px] font-medium text-[#999999]">
                      {customer.phone}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-[#999999]">
                    {customer.waitingTime}
                  </span>
                </div>
              ))
            ) : (
              <div className="grid h-full min-h-40 place-items-center text-center text-xs font-medium text-[#999999]">
                مشتری دیگری در صف نیست.
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-sm font-bold text-[#0048c4]">
                {activeCustomer.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
                  {activeCustomer.name}
                </strong>
                <span className="mt-1 block truncate text-xs font-medium text-[#808080]">
                  {activeCustomer.phone}
                </span>
              </div>
            </div>

          </div>

          <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5">
            <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#999999] shadow-sm">
              امروز
            </div>
            {activeCustomer.messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </main>

          <form className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4" onSubmit={sendMessage}>
            <button
              aria-label="پیوست فایل"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#dce3ef] bg-white text-[#6f7888] transition hover:bg-[#f5f7fb]"
              type="button"
            >
              <svg fill="none" height="21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="21">
                <path d="m21 11.5-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 1 1-2.8-2.8l8.3-8.3" />
              </svg>
            </button>
            <input
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#303030] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="پیام خود را بنویسید..."
              ref={composerInputRef}
              value={draft}
            />
            <button
              aria-label="ارسال پیام"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0048c4] text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!draft.trim()}
              type="submit"
            >
              <svg fill="none" height="21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="21">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {isFinishDialogOpen ? (
        <FinishConversationDialog
          customerName={activeCustomer.name}
          hasNextCustomer={hasNextCustomer}
          onCancel={() => setIsFinishDialogOpen(false)}
          onConfirm={finishAndOpenNextCustomer}
        />
      ) : null}
    </section>
  );
}
