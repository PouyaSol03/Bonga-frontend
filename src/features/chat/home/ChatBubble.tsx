import { type ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { formatChatMessageTime } from "./chatDates";
import { DoubleTickIcon } from "./statusIcons";

export function ChatBubble({
  children,
  direction,
  isRead = false,
  time = formatChatMessageTime(),
  wide = false,
}: {
  children: ReactNode;
  direction: "incoming" | "outgoing";
  isRead?: boolean;
  time?: string;
  wide?: boolean;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`${wide ? "w-[168px]" : "w-fit max-w-[198px] min-w-[72px]"} rounded-lg px-3 py-2 text-right ${
          isOutgoing
            ? "bg-primary-container/20 rounded-tr-none"
            : "border-outline-var bg-surface-container-lowest rounded-tl-none border"
        }`}
        dir="rtl"
      >
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface text-sm leading-[18px] font-normal [overflow-wrap:anywhere] break-words whitespace-pre-line"
        >
          {children}
        </Typography>
        <div
          className={`mt-1 flex items-center gap-0.5 text-[11px] leading-4 font-normal ${
            isOutgoing ? "text-primary justify-end [direction:ltr]" : "text-outline justify-start"
          }`}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            {time}
          </Typography>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-4 w-4 ${isRead ? "text-primary" : "text-outline"}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChatDateChip() {
  const todayPersian = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(new Date());

  return (
    <div className="flex justify-center py-0.5">
      <Typography
        as="span"
        variant="body"
        size="small"
        weight="regular"
        className="bg-surface-container text-outline rounded-lg px-3 py-1 text-[10px] leading-4 font-normal"
      >
        {todayPersian}
      </Typography>
    </div>
  );
}
