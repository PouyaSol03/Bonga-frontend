import { Typography } from "../../../shared/ui/Typography";
import { MapLocationIcon } from "./attachmentIcons";
import { formatChatMessageTime } from "./chatDates";
import { DoubleTickIcon } from "./statusIcons";

export function ChatLocationBubble({
  direction = "outgoing",
  isRead = false,
  mapsUrl,
  time = formatChatMessageTime(),
}: {
  direction?: "incoming" | "outgoing";
  isRead?: boolean;
  mapsUrl: string;
  time?: string;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <a
        className={`block w-[220px] rounded-lg px-3 py-2 text-right no-underline ${
          isOutgoing
            ? "bg-primary-container/20 rounded-tr-none"
            : "border-outline-var bg-surface-container-lowest rounded-tl-none border"
        }`}
        dir="rtl"
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center gap-2 [direction:rtl]">
          <MapLocationIcon />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-on-surface text-xs leading-5 font-medium"
          >
            موقعیت در نقشه
          </Typography>
        </div>
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var mt-2 text-[11px] leading-4"
        >
          برای مشاهده موقعیت روی نقشه لمس کنید.
        </Typography>
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] leading-4 [direction:ltr] ${
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
      </a>
    </div>
  );
}
