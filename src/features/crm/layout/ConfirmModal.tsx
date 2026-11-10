import { useEffect, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { CrmIcon } from "./CrmIcon";
import { getApiErrorMessage } from "../../../shared/api/api";
import type { ConfirmState, CrmRoutePageProps } from "./types";
import { ModalShell } from "./ModalShell";
import { LoadingSpinner } from "./LoadingSpinner";
import { modalInputClassName, ghostButtonClassName, dangerButtonClassName } from "./constants";

export function ConfirmModal({
  confirm,
  notify,
  onClose,
}: {
  confirm: ConfirmState | null;
  notify: CrmRoutePageProps["notify"];
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    if (!confirm) {
      setIsPending(false);
      setPromptValue("");
    }
  }, [confirm]);

  if (!confirm) return null;

  const trimmedPromptValue = promptValue.trim();
  const isPromptInvalid = Boolean(confirm.prompt?.required && !trimmedPromptValue);

  const handleConfirm = async () => {
    if (isPromptInvalid) {
      notify("لطفاً دلیل را وارد کنید.", "error");
      return;
    }

    setIsPending(true);

    try {
      await confirm.onConfirm(confirm.prompt ? trimmedPromptValue : undefined);
      onClose();
    } catch (error) {
      notify(getApiErrorMessage(error, "انجام عملیات ناموفق بود."), "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalShell onClose={isPending ? undefined : onClose}>
      <section
        className="w-[min(440px,calc(100vw-40px))] rounded-xl bg-white p-6 shadow-[0_24px_70px_rgba(14,34,68,0.18)]"
        dir="rtl"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0] text-[#d62f3e]">
          <CrmIcon name="warning" size={24} />
        </div>
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 mt-4 text-base font-bold text-[#1a1a1a]"
        >
          {confirm.title}
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 mt-2 text-sm leading-7 text-[#707a8a]"
        >
          {confirm.body}
        </Typography>
        {confirm.prompt ? (
          <label className="mt-4 block">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="mb-2 block text-sm font-bold text-[#4f5a6c]"
            >
              {confirm.prompt.label}
            </Typography>
            <textarea
              className={`${modalInputClassName} min-h-28 resize-y py-3`}
              disabled={isPending}
              onChange={(event) => setPromptValue(event.target.value)}
              placeholder={confirm.prompt.placeholder}
              value={promptValue}
            />
          </label>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            unstyled
            className={ghostButtonClassName}
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button
            unstyled
            className={dangerButtonClassName}
            disabled={isPending || isPromptInvalid}
            onClick={handleConfirm}
            type="button"
          >
            {isPending ? <LoadingSpinner /> : null}
            {isPending ? "در حال انجام..." : (confirm.confirmLabel ?? "تأیید")}
          </Button>
        </div>
      </section>
    </ModalShell>
  );
}
