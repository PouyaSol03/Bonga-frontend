import { useRef, type FormEvent } from "react";
import LinearAttachment from "../../../../shared/icons/LinearAttachment";
import LinearSent from "../../../../shared/icons/LinearSent";
import LinearTickDouble from "../../../../shared/icons/LinearTickDouble";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { SupportChatMessage } from "../types";

export function SupportMessageBubble({ message }: { message: SupportChatMessage }) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <div className={`flex w-full ${isOutgoing ? "justify-start" : "justify-end"}`}>
      <article
        className={`max-w-[78%] min-w-[82px] px-3 py-2.5 text-right ${
          isOutgoing
            ? "bg-primary-container rounded-[10px] rounded-tr-[2px]"
            : "border-outline-var bg-surface-container-lowest rounded-[10px] rounded-tl-[2px] border"
        }`}
        dir="rtl"
      >
        {message.sender ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="text-primary mb-1 text-[11px] leading-4 font-medium"
          >
            {message.sender}
          </Typography>
        ) : null}

        {message.attachmentUrl ? (
          message.type === "image" ? (
            <a href={message.attachmentUrl} rel="noreferrer" target="_blank">
              <img
                alt={message.fileName || "تصویر پیوست‌شده"}
                className="mb-2 max-h-52 w-full rounded-lg object-cover"
                src={message.attachmentUrl}
              />
            </a>
          ) : (
            <a
              className="text-primary mb-2 block text-xs font-medium break-all underline"
              href={message.attachmentUrl}
              rel="noreferrer"
              target="_blank"
            >
              {message.fileName || "مشاهده فایل پیوست"}
            </a>
          )
        ) : null}

        {message.text ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface text-[12px] leading-[19px] font-normal whitespace-pre-line"
          >
            {message.text}
          </Typography>
        ) : null}

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] leading-4 ${
            isOutgoing ? "text-primary justify-start [direction:ltr]" : "text-outline justify-end"
          }`}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            {message.time}
          </Typography>
          {isOutgoing ? <LinearTickDouble className="h-3.5 w-3.5" /> : null}
        </div>
      </article>
    </div>
  );
}

export function SupportChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <Typography
        as="span"
        variant="body"
        size="small"
        weight="regular"
        className="bg-surface-container text-outline rounded-md px-2.5 py-1 text-[10px] leading-4 font-normal"
      >
        امروز
      </Typography>
    </div>
  );
}

export function SupportChatComposer({
  isSending = false,
  message,
  onAttachmentClick,
  onChange,
  onSubmit,
}: {
  isSending?: boolean;
  message: string;
  onAttachmentClick?: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <form
      className="bg-surface-container flex items-center gap-1.5 rounded-full p-1.5 shadow-[0_1px_5px_rgba(0,0,0,0.08)] [direction:ltr]"
      onSubmit={submitMessage}
    >
      <Button
        unstyled
        aria-label="افزودن فایل"
        className="text-on-surface-var focus-visible:ring-primary/20 grid h-10 w-10 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 active:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSending}
        onClick={onAttachmentClick}
        type="button"
      >
        <LinearAttachment className="h-5 w-5" />
      </Button>

      <label className="min-w-0 flex-1">
        <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">
          پیام خود را بنویسید
        </Typography>
        <input
          ref={inputRef}
          className="text-on-surface placeholder:text-outline h-10 w-full border-0 bg-transparent px-2 text-right text-xs leading-5 outline-none focus:ring-0"
          dir="rtl"
          onChange={(event) => onChange(event.target.value)}
          placeholder="پیام خود را بنویسید"
          type="text"
          value={message}
        />
      </label>

      <Button
        unstyled
        aria-label="ارسال پیام"
        className="bg-primary text-on-primary focus-visible:ring-primary/20 grid h-10 w-10 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSending || !message.trim()}
        type="submit"
      >
        <LinearSent className="h-5 w-5" />
      </Button>
    </form>
  );
}
