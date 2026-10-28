import { SupportChatCard } from "./SupportChatCard";
import { memo } from "react";
import { Link } from "react-router";
import LinearImage from "../../../shared/icons/LinearImage";
import { Typography } from "../../../shared/ui/Typography";
import { BlockedBadge, UnreadBadge } from "./ChatBadges";
import { SelectionCheckbox } from "./SelectionCheckbox";
import { type ChatItem } from "./types";

export const ChatCard = memo(function ChatCard({
  chatId,
  index,
  isBulkDeleteMode,
  isSelected,
  item,
  onToggleSelected,
}: {
  chatId: string;
  index: number;
  isBulkDeleteMode: boolean;
  isSelected: boolean;
  item: ChatItem;
  onToggleSelected: (id: string) => void;
}) {
  const displayItem = item;
  const isSupportChat = displayItem.category === "support";
  const isHighlighted = isBulkDeleteMode ? isSelected : Boolean(displayItem.highlighted);

  const cardClassName = `relative shrink-0 overflow-visible border-b px-4 text-right ${
    isBulkDeleteMode
      ? "h-[147px] border-outline-var pb-[19px] pt-5"
      : "h-[140px] border-outline-var py-4"
  } ${isHighlighted ? "bg-primary-container/20" : "bg-surface-container-lowest"}`;

  const advertiseCardContent = (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={cardClassName}
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
      <div
        className={`flex items-start justify-between [direction:ltr] ${
          isBulkDeleteMode ? "h-12 gap-2" : "h-5"
        }`}
      >
        <div className={isBulkDeleteMode ? "min-w-0 flex-1" : "w-full min-w-0"}>
          <div className="flex h-5 items-center justify-between [direction:ltr]">
            <div className="text-outline flex items-center gap-2 text-xs leading-4 font-normal">
              <Typography as="span" variant="body" size="medium" weight="regular">
                {displayItem.date}
              </Typography>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-4 [direction:rtl]">
              <Typography
                as="span"
                variant="label"
                size="medium"
                weight="medium"
                className="text-on-surface flex min-w-0 items-center text-sm leading-5 font-medium"
              >
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="truncate"
                >
                  {displayItem.userName}
                </Typography>
              </Typography>
              {displayItem.isBlocked ? <BlockedBadge /> : null}
            </div>
          </div>

          {isBulkDeleteMode ? (
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="text-on-surface-var mt-3 line-clamp-1 text-right text-xs leading-4 font-normal"
            >
              {displayItem.message}
            </Typography>
          ) : null}
        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={() => onToggleSelected(chatId)} />
        ) : null}
      </div>

      {!isBulkDeleteMode ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var mt-3 line-clamp-1 text-right text-xs leading-4 font-normal"
        >
          {displayItem.message}
        </Typography>
      ) : null}

      <div className="mt-3 flex h-12 items-center justify-between [direction:ltr]">
        <div className="min-w-0 flex-1 pr-2 text-right">
          <div className="flex h-5 min-w-0 items-center justify-start gap-2 [direction:rtl]">
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-outline min-w-0 truncate text-xs leading-4 font-normal"
            >
              {displayItem.adCategory}
            </Typography>
            {displayItem.adLabel ? (
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="bg-primary-container/20 text-primary shrink-0 rounded px-2 py-0.5 text-xs leading-4 font-normal"
              >
                {displayItem.adLabel}
              </Typography>
            ) : null}
          </div>
          <div className="text-on-surface mt-2 truncate text-sm leading-5 font-medium">
            {displayItem.adTitle}
          </div>
        </div>
        <div className="bg-primary-container/20 text-outline relative grid h-12 w-[72px] shrink-0 place-items-center overflow-hidden rounded">
          <LinearImage className="h-6 w-6" aria-hidden="true" />
          {displayItem.imageUrl ? (
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              src={displayItem.imageUrl}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
  const cardContent = isSupportChat ? (
    <SupportChatCard
      chatId={chatId}
      isBulkDeleteMode={isBulkDeleteMode}
      isSelected={isSelected}
      displayItem={displayItem}
      isHighlighted={isHighlighted}
      onToggleSelected={onToggleSelected}
    />
  ) : advertiseCardContent;

  if (isBulkDeleteMode) {
    return cardContent;
  }

  return (
    <Link
      aria-label={`${displayItem.userName} - ${displayItem.adTitle}`}
      className="focus-visible:outline-inset focus-visible:outline-primary/40 block text-inherit no-underline focus-visible:outline-3"
      state={displayItem.detailState}
      to={displayItem.detailPath ?? `/chat/${index + 1}`}
    >
      {cardContent}
    </Link>
  );
});
