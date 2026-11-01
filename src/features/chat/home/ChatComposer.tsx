import { useRef } from "react";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { LinkChainIcon, SendMessageIcon } from "./attachmentIcons";

export function ChatComposer({
  message,
  onChangeMessage,
  onOpenAttach,
  onSend,
}: {
  message: string;
  onChangeMessage: (message: string) => void;
  onOpenAttach: () => void;
  onSend: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sentByPointerRef = useRef(false);

  const keepKeyboardOpen = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  const sendFromComposer = () => {
    onSend();

    // Keep focus on the input so mobile keyboard does not close
    keepKeyboardOpen();
  };

  return (
    <footer className="bg shrink-0 bg-transparent px-2 pt-1 pb-4">
      <div className="flex items-center gap-2 rounded-full border border-transparent bg-gray-100 p-1.5 shadow-sm [direction:ltr]">
        <Button
          unstyled
          aria-label="ارسال فایل"
          className="text-outline focus-visible:outline-primary/40 grid h-11 w-11 shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-2"
          onClick={onOpenAttach}
          type="button"
        >
          <LinkChainIcon className="h-6 w-6" />
        </Button>

        <label className="min-w-0 flex-1">
          <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">
            پیام خود را بنویسید
          </Typography>
          <input
            ref={inputRef}
            className="text-on-surface placeholder:text-outline h-11 w-full rounded-xl border-0 px-2 text-right text-[12px] leading-5 outline-none focus:ring-0"
            dir="rtl"
            placeholder="پیام خود را بنویسید"
            type="text"
            value={message}
            onChange={(event) => onChangeMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendFromComposer();
              }
            }}
          />
        </label>

        <Button
          unstyled
          aria-label="ارسال پیام"
          className="bg-primary focus-visible:outline-primary/40 grid h-11 w-11 shrink-0 place-items-center rounded-full text-white focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-90"
          onPointerDown={(event) => {
            event.preventDefault();
            sentByPointerRef.current = true;
            sendFromComposer();
          }}
          onClick={(event) => {
            event.preventDefault();

            if (sentByPointerRef.current) {
              sentByPointerRef.current = false;
              return;
            }

            sendFromComposer();
          }}
          type="button"
        >
          <SendMessageIcon className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
}
