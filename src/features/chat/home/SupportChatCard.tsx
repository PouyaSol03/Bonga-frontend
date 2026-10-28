import { Typography } from "../../../shared/ui/Typography";
import { BlockedBadge, SystemChatIcon, UnreadBadge } from "./ChatBadges";
import { SelectionCheckbox } from "./SelectionCheckbox";
import { type ChatItem } from "./types";

export function SupportChatCard({
  chatId,
  isBulkDeleteMode,
  isSelected,
  displayItem,
  isHighlighted,
  onToggleSelected,
}: {
  chatId: string;
  isBulkDeleteMode: boolean;
  isSelected: boolean;
  displayItem: ChatItem;
  isHighlighted: boolean;
  onToggleSelected: (id: string) => void;
}) {
  return (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={`relative shrink-0 text-right ${isHighlighted ? "bg-primary-container/20" : "bg-surface-container-lowest"}`}
      onClick={isBulkDeleteMode ? () => onToggleSelected(chatId) : undefined}
      onKeyDown={
        isBulkDeleteMode
          ? (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;

              event.preventDefault();
              onToggleSelected(chatId);
            }
          : undefined
      }
      role={isBulkDeleteMode ? "button" : undefined}
      tabIndex={isBulkDeleteMode ? 0 : undefined}
    >
      <div className="border-outline-var flex items-start gap-2 border-b p-4 [direction:ltr]">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4 [direction:ltr]">
            <div className="text-outline flex shrink-0 items-center gap-2 text-xs leading-4 font-normal">
              <Typography as="span" variant="body" size="medium" weight="regular">
                {displayItem.date}
              </Typography>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-5.5 [direction:rtl]">
              <SystemChatIcon />
              <div className="flex min-w-0 flex-col gap-2">
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="medium"
                  className="text-on-surface text-sm font-medium"
                >
                  پیام سیستم
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="text-on-surface text-right text-sm font-normal"
                >
                  {displayItem.message}
                </Typography>
                {displayItem.isBlocked ? <BlockedBadge /> : null}
              </div>
            </div>
          </div>
        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={() => onToggleSelected(chatId)} />
        ) : null}
      </div>
    </article>
  );

}
