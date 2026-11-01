import { useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  useDeletePropertyRequestMutation,
  useRenamePropertyRequestMutation,
} from "../api/property-request.hooks";
import type { PropertySearchRequest } from "../api/property-request.service";

export function useRequestMutations({
  requests,
  showToast,
}: {
  requests: PropertySearchRequest[];
  showToast: (
    message: string,
    title?: string,
    variant?: "error" | "success" | "info" | "warning",
  ) => void;
}) {
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dismissedReceivedRequestIds, setDismissedReceivedRequestIds] = useState<Set<string>>(
    () => new Set(),
  );

  const renameRequestMutation = useRenamePropertyRequestMutation();
  const deleteRequestMutation = useDeletePropertyRequestMutation();

  const editingRequest = requests.find((request) => request.id === editingRequestId) ?? null;

  const openEditSheet = (request: PropertySearchRequest) => {
    setEditingRequestId(request.id);
    setEditTitle(request.title);
  };

  const closeEditSheet = () => {
    setEditingRequestId(null);
    setEditTitle("");
  };

  const confirmEdit = () => {
    const nextTitle = editTitle.trim();
    if (!editingRequest || !nextTitle) {
      showToast("عنوان درخواست را وارد کنید.", "خطا", "error");
      return;
    }
    if (renameRequestMutation.isPending) return;

    renameRequestMutation.mutate(
      { id: editingRequest.id, name: nextTitle },
      {
        onError: (error) => {
          showToast(getApiErrorMessage(error, "ویرایش درخواست با خطا مواجه شد."), "خطا", "error");
        },
        onSuccess: () => {
          closeEditSheet();
          showToast("درخواست با موفقیت ویرایش شد.");
        },
      },
    );
  };

  const cancelRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;
    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        showToast(getApiErrorMessage(error, "لغو درخواست با خطا مواجه شد."), "خطا", "error");
      },
      onSuccess: () => {
        showToast("درخواست لغو شد.");
      },
    });
  };

  const deleteReceivedRequest = (requestId: string) => {
    if (deleteRequestMutation.isPending) return;
    setDismissedReceivedRequestIds((current) => {
      const next = new Set(current);
      next.add(requestId);
      return next;
    });

    deleteRequestMutation.mutate(requestId, {
      onError: (error) => {
        setDismissedReceivedRequestIds((current) => {
          const next = new Set(current);
          next.delete(requestId);
          return next;
        });
        showToast(
          getApiErrorMessage(error, "حذف درخواست دریافتی با خطا مواجه شد."),
          "خطا",
          "error",
        );
      },
      onSuccess: () => {
        showToast("درخواست دریافتی حذف شد.");
      },
    });
  };

  return {
    cancelRequest,
    closeEditSheet,
    confirmEdit,
    deleteReceivedRequest,
    dismissedReceivedRequestIds,
    editTitle,
    editingRequest,
    openEditSheet,
    setDismissedReceivedRequestIds,
    setEditTitle,
  };
}
