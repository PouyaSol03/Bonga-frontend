import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  blockChat,
  createOrGetAdvertiseChat,
  deleteChat,
  getChatDetail,
  getChatMessages,
  getChatUnreadCount,
  getChats,
  reportChat,
} from "../services/chat.service";

export function useChatsQuery({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
} = {}) {
  return useQuery({
    queryFn: () => getChats({ page, perPage }),
    queryKey: queryKeys.chats.list({ page, perPage }),
  });
}

export function useChatEntryQuery({
  advertiseId,
  threadId,
}: {
  advertiseId?: string;
  threadId?: string;
}) {
  return useQuery({
    enabled: Boolean(advertiseId || threadId),
    queryFn: () =>
      threadId
        ? getChatDetail(threadId)
        : createOrGetAdvertiseChat(advertiseId ?? ""),
    queryKey: queryKeys.chats.entry({ advertiseId, threadId }),
  });
}

export function useChatMessagesQuery(threadId: string | null) {
  return useQuery({
    enabled: Boolean(threadId),
    queryFn: () => getChatMessages(threadId ?? ""),
    queryKey: queryKeys.chats.messages(threadId ?? ""),
  });
}

export function useChatUnreadCountQuery({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  return useQuery({
    enabled,
    queryFn: getChatUnreadCount,
    queryKey: queryKeys.chats.unreadCount(),
    refetchOnMount: "always",
  });
}

export function useBlockChatMutation() {
  return useMutation({
    mutationFn: blockChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chats.all,
      });
    },
  });
}

export function useDeleteChatMutation() {
  return useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chats.all,
      });
    },
  });
}

export function useReportChatMutation() {
  return useMutation({
    mutationFn: reportChat,
  });
}
