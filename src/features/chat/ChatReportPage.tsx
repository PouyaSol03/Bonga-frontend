import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { PageFrame } from "../../shared/layout/PageFrame";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { TopBar } from "../../shared/components/TopBar";
import { useReportChatMutation } from "./api/chat.hooks";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type ReportReasonId = "spam" | "harassment" | "fraud" | "inappropriate_content" | "other";

type ReportReason = {
  id: ReportReasonId;
  title: string;
};

const reportReasons: ReportReason[] = [
  { id: "spam", title: "هرزنامه یا پیام‌های تکراری" },
  { id: "harassment", title: "مزاحمت یا آزار" },
  { id: "fraud", title: "کلاهبرداری" },
  { id: "inappropriate_content", title: "محتوای نامناسب" },
  { id: "other", title: "سایر" },
];

function getReportThreadId() {
  const match = window.location.pathname.match(/^\/chat\/([^/]+)\/report\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

function getReportMessageId() {
  const messageId = new URLSearchParams(window.location.search).get("message_id")?.trim();

  return messageId || undefined;
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

export function ChatReportPage() {
  const navigate = useNavigate();
  const threadId = useMemo(getReportThreadId, []);
  const messageId = useMemo(getReportMessageId, []);
  const returnPath = useMemo(() => getReportReturnPath(threadId), [threadId]);
  const [selectedReasonId, setSelectedReasonId] = useState<ReportReasonId>("fraud");
  const [description, setDescription] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const reportMutation = useReportChatMutation();
  const selectedReason = reportReasons.find((reason) => reason.id === selectedReasonId);

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => navigate(returnPath, { replace: true }), 700);
    return () => window.clearTimeout(timer);
  }, [returnPath, successMessage]);

  const submitReport = () => {
    if (!threadId || !selectedReason || reportMutation.isPending) return;

    const cleanDescription = description.trim();

    if (selectedReasonId === "other" && !cleanDescription) {
      setValidationMessage("لطفا توضیح گزارش را وارد کنید.");
      return;
    }

    setValidationMessage("");
    reportMutation.mutate(
      {
        description: cleanDescription || undefined,
        messageId,
        reason: selectedReason.id,
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
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo={returnPath}
        centerClassName="px-2"
        contentClassName="px-2"
        heightClassName="h-[60px]"
        title="گزارش تخلف کاربر"
        titleClassName="text-base font-semibold leading-6"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-4 pt-3 pb-24">
        <div role="radiogroup" aria-label="دلیل گزارش تخلف">
          {reportReasons.map((reason) => {
            const checked = reason.id === selectedReasonId;

            return (
              <Button
                unstyled
                aria-checked={checked}
                className="bg-surface-container-lowest focus-visible:outline-inset focus-visible:outline-primary/40 flex h-16 w-full items-center justify-between gap-4 px-5 text-right focus-visible:outline-3"
                key={reason.id}
                onClick={() => {
                  setSelectedReasonId(reason.id);
                  setValidationMessage("");
                  setSuccessMessage("");
                }}
                role="radio"
                type="button"
              >
                <Typography
                  as="span"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="text-on-surface text-base leading-6 font-normal"
                >
                  {reason.title}
                </Typography>
                <RadioIndicator checked={checked} className="h-[18px] w-[18px]" />
              </Button>
            );
          })}
        </div>

        <textarea
          aria-label="یادداشت شما"
          className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/10 mt-4 h-[121px] w-full resize-none rounded-xl border p-4 text-right text-sm leading-6 font-normal outline-none focus:ring-2"
          maxLength={500}
          onChange={(event) => {
            setDescription(event.target.value);
            setValidationMessage("");
            setSuccessMessage("");
          }}
          placeholder="یادداشت شما"
          value={description}
        />

        {validationMessage ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="bg-error-container/30 text-error m-0 mt-3 rounded-lg px-3 py-2 text-right text-xs leading-5 font-medium"
          >
            {validationMessage}
          </Typography>
        ) : null}

        {successMessage ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="bg-tertiary-container/30 text-tertiary m-0 mt-3 rounded-lg px-3 py-2 text-right text-xs leading-5 font-medium"
          >
            {successMessage}
          </Typography>
        ) : null}
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 flex h-16 items-center gap-4 px-4 shadow-[0_-4px_16px_rgba(26,26,26,0.08)] [direction:ltr]">
        <Button
          unstyled
          className="bg-primary text-on-primary h-10 min-w-0 flex-1 rounded-[10px] text-sm leading-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={reportMutation.isPending || Boolean(successMessage)}
          onClick={submitReport}
          type="button"
        >
          {reportMutation.isPending ? "در حال ارسال..." : "تایید"}
        </Button>
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary h-10 min-w-0 flex-1 rounded-[10px] border text-sm leading-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={reportMutation.isPending}
          onClick={() => navigate(returnPath, { replace: true })}
          type="button"
        >
          انصراف
        </Button>
      </footer>
    </PageFrame>
  );
}
