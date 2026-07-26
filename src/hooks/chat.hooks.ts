import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  blockChat,
  createOrGetAdvertiseChat,
  createOrGetSupportChat,
  deleteChat,
  deleteChats,
  getChatAvailability,
  getChatDetail,
  getChatMessages,
  getChatMessagesPage,
  getChatUnreadCount,
  getChats,
  reportChat,
  updateChatAvailability,
  uploadChatAttachment,
  unblockChat,
  type ChatCategory,
  type ChatFilter,
  type ChatThread,
  type UpdateChatAvailabilityPayload,
} from "../services/chat.service";

export function useChatsQuery({
  category,
  filter,
  page = 1,
  perPage = 10,
}: {
  category?: ChatCategory;
  filter?: ChatFilter;
  page?: number;
  perPage?: number;
} = {}) {
  const resolvedFilter = filter ?? (category === "support" ? "support" : undefined);

  return useQuery({
    queryFn: () => getChats({ filter: resolvedFilter, page, perPage }),
    queryKey: queryKeys.chats.list({ filter: resolvedFilter, page, perPage }),
  });
}

export function useChatAvailabilityQuery() {
  return useQuery({
    queryFn: getChatAvailability,
    queryKey: queryKeys.chats.availability(),
  });
}

export function useUpdateChatAvailabilityMutation() {
  return useMutation({
    mutationFn: (payload: UpdateChatAvailabilityPayload) =>
      updateChatAvailability(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chats.all,
      });
    },
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

export function useInfiniteChatMessagesQuery(threadId: string | null, limit = 30) {
  return useInfiniteQuery({
    enabled: Boolean(threadId),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      getChatMessagesPage(threadId ?? "", {
        cursor: pageParam,
        limit,
      }),
    queryKey: [...queryKeys.chats.messages(threadId ?? ""), "infinite", limit],
  });
}

export function useUploadChatAttachmentMutation() {
  return useMutation({
    mutationFn: ({ file, threadId }: { file: File; threadId: string }) =>
      uploadChatAttachment(threadId, file),
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
