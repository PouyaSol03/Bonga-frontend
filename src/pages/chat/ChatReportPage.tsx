import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../../app/PageFrame";
import { RadioIndicator } from "../../components/RadioIndicator";
import { TopBar } from "../../components/TopBar";
import { useReportChatMutation } from "../../hooks/chat.hooks";

type ReportReasonId =
  | "fraud"
  | "illegal-or-unethical"
  | "wrong-category"
  | "wrong-price"
  | "wrong-information"
  | "duplicate-or-spam"
  | "other";

type ReportReason = {
  id: ReportReasonId;
  title: string;
};

const reportReasons: ReportReason[] = [
  { id: "fraud", title: "کلاه برداری" },
  { id: "illegal-or-unethical", title: "غیر قانون یا غیر اخلاقی" },
  { id: "wrong-category", title: "دسته بندی اشتباه" },
  { id: "wrong-price", title: "قیمت اشتباه" },
  { id: "wrong-information", title: "اطلاعات اشتباه" },
  { id: "duplicate-or-spam", title: "تکراری یا اسپم" },
  { id: "other", title: "سایر" },
];

function getReportThreadId() {
  const match = window.location.pathname.match(/^\/chat\/([^/]+)\/report\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function getReportReturnPath(threadId: string) {
  const state = window.history.state;

  if (state && typeof state === "object") {
    const returnTo = (state as { returnTo?: unknown }).returnTo;

    if (typeof returnTo === "string" && returnTo.startsWith("/chat/")) {
      return returnTo;
    }
  }

  return threadId ? `/chat/${encodeURIComponent(threadId)}` : "/chat";
}

function navigateTo(path: string, replace = false) {
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function ChatReportPage() {
  const threadId = useMemo(getReportThreadId, []);
  const returnPath = useMemo(() => getReportReturnPath(threadId), [threadId]);
  const [selectedReasonId, setSelectedReasonId] = useState<ReportReasonId | null>(null);
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const reportMutation = useReportChatMutation();
  const selectedReason = reportReasons.find((reason) => reason.id === selectedReasonId);
  const shouldShowDescription = selectedReasonId === "other";

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => navigateTo(returnPath, true), 700);
    return () => window.clearTimeout(timer);
  }, [returnPath, successMessage]);

  const submitReport = () => {
    if (!threadId || reportMutation.isPending) return;

    if (!selectedReason) {
      setValidationMessage("لطفا دلیل گزارش را انتخاب کنید.");
      return;
    }

    const cleanDescription = description.trim();

    if (shouldShowDescription && !cleanDescription) {
      setValidationMessage("لطفا توضیح گزارش را وارد کنید.");
      return;
    }

    setValidationMessage("");
    reportMutation.mutate(
      {
        description: shouldShowDescription ? cleanDescription : undefined,
        reason: selectedReason.title,
        threadId,
      },
      {
        onError: () => {
          setValidationMessage("ارسال گزارش تخلف با خطا مواجه شد.");
        },
        onSuccess: () => {
          setSuccessMessage("گزارش تخلف با موفقیت ارسال شد.");
        },
      },
    );
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={returnPath} title="گزارش تخلف" />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-28 pt-4">
        <p className="m-0 mb-2 text-sm font-semibold leading-6 text-[#303030]">
          دلیل گزارش را انتخاب کنید
        </p>
        <p className="m-0 mb-4 text-xs font-normal leading-6 text-[#808080]">
          گزارش شما بررسی می‌شود و اطلاعات آن برای طرف مقابل نمایش داده نخواهد شد.
        </p>

        <div className="divide-y divide-[#f0f0f0] rounded-xl border border-[#eeeeee] px-3">
          {reportReasons.map((reason) => {
            const checked = reason.id === selectedReasonId;

            return (
              <button
                aria-pressed={checked}
                className="flex min-h-14 w-full items-center justify-between gap-4 bg-white px-1 text-right focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
                key={reason.id}
                onClick={() => {
                  setSelectedReasonId(reason.id);
                  setValidationMessage("");
                  setSuccessMessage("");
                  if (reason.id !== "other") setDescription("");
                }}
                type="button"
              >
                <span className={`text-sm font-medium leading-6 ${checked ? "text-[#0048c4]" : "text-[#1a1a1a]"}`}>
                  {reason.title}
                </span>
                <RadioIndicator checked={checked} />
              </button>
            );
          })}
        </div>

        {shouldShowDescription ? (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-[#303030]" htmlFor="chat-report-description">
              توضیحات
            </label>
            <textarea
              className="h-32 w-full resize-none rounded-xl border border-[#cccccc] bg-white px-3 py-3 text-right text-sm font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
              id="chat-report-description"
              maxLength={500}
              onChange={(event) => {
                setDescription(event.target.value);
                setValidationMessage("");
                setSuccessMessage("");
              }}
              placeholder="لطفا دلیل گزارش را توضیح دهید"
              value={description}
            />
            <span className="mt-1 block text-left text-[11px] text-[#999999]">
              {new Intl.NumberFormat("fa-IR").format(description.length)} / ۵۰۰
            </span>
          </div>
        ) : null}

        {validationMessage ? (
          <p className="m-0 mt-3 rounded-lg bg-[#fff1f0] px-3 py-2 text-right text-xs font-medium leading-5 text-[#c11004]">
            {validationMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="m-0 mt-3 rounded-lg bg-[#edf9f1] px-3 py-2 text-right text-xs font-medium leading-5 text-[#18753b]">
            {successMessage}
          </p>
        ) : null}
      </main>

      <footer className="absolute inset-x-0 bottom-0 border-t border-[#f0f0f0] bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
        <button
          className="h-11 w-full rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={reportMutation.isPending || Boolean(successMessage)}
          onClick={submitReport}
          type="button"
        >
          {reportMutation.isPending ? "در حال ارسال..." : "ثبت گزارش"}
        </button>
      </footer>
    </PageFrame>
  );
}
