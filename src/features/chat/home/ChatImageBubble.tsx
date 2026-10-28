import { Typography } from "../../../shared/ui/Typography";
import { formatChatMessageTime } from "./chatDates";
import { DoubleTickIcon } from "./statusIcons";

export function ChatImageBubble({
  direction = "outgoing",
  fileName,
  imageUrl,
  isRead = false,
  time = formatChatMessageTime(),
}: {
  direction?: "incoming" | "outgoing";
  fileName: string;
  imageUrl: string;
  isRead?: boolean;
  time?: string;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[220px] rounded-lg p-1.5 text-right ${
          isOutgoing
            ? "bg-primary-container/20 rounded-tr-none"
            : "border-outline-var bg-surface-container-lowest rounded-tl-none border"
        }`}
        dir="rtl"
      >
        <a href={imageUrl} target="_blank" rel="noreferrer" aria-label={`مشاهده ${fileName}`}>
          <img
            alt={fileName || "تصویر ارسالی"}
            className="max-h-[220px] w-full rounded-md object-cover"
            src={imageUrl}
          />
        </a>
        <div
          className={`mt-1 flex items-center gap-1 px-1 text-[10px] leading-4 [direction:ltr] ${
            isOutgoing ? "text-primary justify-end" : "text-outline justify-start"
          }`}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">
            {time}
          </Typography>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-3.5 w-3.5 ${isRead ? "text-primary" : "text-outline"}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
