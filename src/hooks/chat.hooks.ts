import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  blockChat,
  createOrGetAdvertiseChat,
  createOrGetSupportChat,
  deleteChat,
  deleteChats,
  getChatDetail,
  getChatMessages,
  getChatUnreadCount,
  getChats,
  reportChat,
  unblockChat,
  type ChatCategory,
  type ChatThread,
} from "../services/chat.service";

export function useChatsQuery({
  category = "advertise",
  page = 1,
  perPage = 10,
}: {
  category?: ChatCategory;
  page?: number;
  perPage?: number;
} = {}) {
  return useQuery({
    queryFn: () => getChats({ category, page, perPage }),
    queryKey: queryKeys.chats.list({ category, page, perPage }),
  });
}

export function useChatEntryQuery({
  advertiseId,
  threadId,
}: {
  advertiseId?: string;
  initialThread?: ChatThread;
  threadId?: string;
}) {
  return useQuery({
    enabled: Boolean(advertiseId || threadId),
    // Cached initial thread data is temporarily disabled.
    // initialData: initialThread,
    queryFn: () =>
      threadId
        ? getChatDetail(threadId)
        : createOrGetAdvertiseChat(advertiseId ?? ""),
    queryKey: queryKeys.chats.entry({ advertiseId, threadId }),
  });
}

export function useCreateAdvertiseChatMutation() {
  return useMutation({
    mutationFn: createOrGetAdvertiseChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.chats.all, "list"],
      });
    },
  });
}

export function useCreateSupportChatMutation() {
  return useMutation({
    mutationFn: createOrGetSupportChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chats.all,
      });
    },
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
        queryKey: [...queryKeys.chats.all, "list"],
      });
    },
  });
}

export function useUnblockChatMutation() {
  return useMutation({
    mutationFn: unblockChat,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...queryKeys.chats.all, "list"],
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

export function useDeleteChatsMutation() {
  return useMutation({
    mutationFn: deleteChats,
    onSettled: () => {
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
