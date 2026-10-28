import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import { TopBar } from "../../../shared/components/TopBar";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { useChatShowingNameQuery, useUpdateChatShowingNameMutation } from "../api/chat.hooks";
import { CHAT_RENAME_NOTICE_STORAGE_KEY } from "./routeState";

export function UserChatRenamePage() {
  const navigate = useNavigate();
  const showingNameQuery = useChatShowingNameQuery();
  const updateShowingNameMutation = useUpdateChatShowingNameMutation();
  const [chatName, setChatName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const didHydrateShowingNameRef = useRef(false);

  useEffect(() => {
    if (showingNameQuery.data === undefined || didHydrateShowingNameRef.current) return;

    didHydrateShowingNameRef.current = true;
    setChatName(showingNameQuery.data ?? "");
  }, [showingNameQuery.data]);

  const saveChatName = async () => {
    const normalizedName = chatName.trim();

    try {
      setErrorMessage("");
      await updateShowingNameMutation.mutateAsync(normalizedName || null);
      window.sessionStorage.setItem(
        CHAT_RENAME_NOTICE_STORAGE_KEY,
        normalizedName ? "تغییر نام با موفقیت انجام شد" : "نام نمایشی پاک شد",
      );
      navigate("/chat", { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "ثبت نام نمایشی با خطا مواجه شد."));
    }
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به چت‌ها"
        backTo="/chat"
        className="border-outline-var border-b"
        contentClassName="px-1"
        heightClassName="h-[60px]"
        title="تغییر نام چت"
        titleClassName="font-semibold"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto p-4">
        <section className="text-right">
          <label className="text-on-surface block font-semibold" htmlFor="chat-display-name">
            نام و نام خانوادگی
          </label>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline mt-1 mb-3 text-sm font-normal"
          >
            کاربران در چت شما را با این نام می‌بینند
          </Typography>
          <input
            autoComplete="name"
            className={`bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/20 w-full rounded-xl border px-3 py-3.75 text-right text-sm leading-5 font-normal outline-none focus:ring-2 ${
              errorMessage ? "border-error" : "border-outline-var"
            }`}
            id="chat-display-name"
            maxLength={80}
            onChange={(event) => {
              setChatName(event.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="نام خود را وارد کنید"
            value={chatName}
          />
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline mt-2 text-[11px] leading-4"
          >
            برای نمایش نام و نام خانوادگی اصلی، این فیلد را خالی ذخیره کنید.
          </Typography>
          {errorMessage ? (
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-error mt-1.5 text-[11px] leading-4"
            >
              {errorMessage}
            </Typography>
          ) : null}
        </section>
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 px-4 pt-3 pb-4 shadow-[0_-8px_22px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 [direction:rtl]">
          <Button
            unstyled
            className="bg-primary focus-visible:outline-primary/40 h-11 min-w-0 flex-1 rounded-lg text-xs leading-5 font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-90"
            disabled={showingNameQuery.isLoading || updateShowingNameMutation.isPending}
            onClick={() => void saveChatName()}
            type="button"
          >
            {updateShowingNameMutation.isPending ? "در حال ذخیره..." : "ذخیره نام"}
          </Button>
          <Button
            unstyled
            className="border-primary bg-surface-container-lowest text-primary focus-visible:outline-primary/40 active:bg-primary-container/10 h-11 min-w-0 flex-1 rounded-lg border text-xs leading-5 font-semibold focus-visible:outline-3 focus-visible:outline-offset-2"
            onClick={() => navigate("/chat", { replace: true })}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </footer>
    </PageFrame>
  );
}
