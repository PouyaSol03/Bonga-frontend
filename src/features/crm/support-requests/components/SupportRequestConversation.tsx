import type { FormEvent, RefObject, UIEvent } from "react";
import LinearAttachment from "../../../../shared/icons/LinearAttachment";
import LinearSendComment from "../../../../shared/icons/LinearSendComment";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import {
  SupportMessageBubble,
  type SupportChatMessage,
} from "../../../account/accountSupportViews";
import type { CrmSupportRequest } from "../types";
import { PriorityChip } from "./SupportRequestChips";

export function SupportRequestConversation({
  composerRef,
  conversationEndRef,
  draft,
  isMessagesLoading,
  isSendingMessage,
  messages,
  onDraftChange,
  onMessagesScroll,
  onSendReply,
  selectedRequest,
}: {
  composerRef: RefObject<HTMLInputElement | null>;
  conversationEndRef: RefObject<HTMLDivElement | null>;
  draft: string;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  messages: SupportChatMessage[];
  onDraftChange: (value: string) => void;
  onMessagesScroll: (event: UIEvent<HTMLElement>) => void;
  onSendReply: (event: FormEvent<HTMLFormElement>) => void;
  selectedRequest: CrmSupportRequest;
}) {
  return (
    <>
      <main
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5"
        onScroll={onMessagesScroll}
      >
        <article className="rounded-2xl border border-[#e8e8e8] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-xs text-[#808080]"
              >
                شرح درخواست کاربر
              </Typography>
              <Typography
                as="h2"
                variant="title"
                size="medium"
                weight="semibold"
                className="m-0 mt-1 text-base font-bold text-[#1a1a1a]"
              >
                {selectedRequest.title}
              </Typography>
            </div>
            <PriorityChip priority={selectedRequest.priority} />
          </div>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-3 text-sm leading-7 whitespace-pre-wrap text-[#4d4d4d]"
          >
            {selectedRequest.description}
          </Typography>
          {selectedRequest.attachmentName ? (
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="mt-4 inline-flex h-9 max-w-full items-center gap-2 rounded-lg border border-[#dce3ef] bg-[#f8faff] px-3 text-xs font-semibold text-[#0048c4]"
            >
              <LinearAttachment className="h-4 w-4" />
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="truncate"
              >
                {selectedRequest.attachmentName}
              </Typography>
            </Typography>
          ) : null}
        </article>

        {!selectedRequest.threadId ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="py-8 text-center text-sm text-[#808080]"
          >
            این درخواست هنوز گفتگوی متصل ندارد؛ پاسخ از API درخواست ارسال می‌شود.
          </Typography>
        ) : isMessagesLoading ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="py-8 text-center text-sm text-[#808080]"
          >
            در حال دریافت پیام‌ها...
          </Typography>
        ) : messages.length === 0 ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="py-8 text-center text-sm text-[#808080]"
          >
            هنوز پاسخی ثبت نشده است.
          </Typography>
        ) : (
          messages.map((message) => (
            <SupportMessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={conversationEndRef} />
      </main>

      <form
        className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4"
        onSubmit={onSendReply}
      >
        <input
          className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] px-4 text-sm outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] disabled:bg-[#f5f5f5]"
          disabled={selectedRequest.status === "closed" || isSendingMessage}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={
            selectedRequest.status === "closed"
              ? "این درخواست بسته شده است"
              : "پاسخ خود را بنویسید..."
          }
          ref={composerRef}
          value={draft}
        />
        <Button
          unstyled
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0048c4] px-5 text-sm font-semibold text-white disabled:opacity-50"
          disabled={
            !draft.trim() ||
            selectedRequest.status === "closed" ||
            isSendingMessage
          }
          type="submit"
        >
          ارسال پاسخ
          <LinearSendComment className="h-5 w-5" />
        </Button>
      </form>
    </>
  );
}
