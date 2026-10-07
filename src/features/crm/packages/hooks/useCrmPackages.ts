import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getApiErrorMessage } from "../../../../shared/api/api";
import {
  createCrmPackage,
  deleteCrmPackage,
  getCrmPackage,
  listCrmPackages,
  updateCrmPackage,
} from "../../api/crm.service";
import { packageRecordId, packageToPayload } from "../package.helpers";
import type { CrmPackagePayload, CrmRecord, Notify } from "../types";

export function useCrmPackages(notify: Notify, refreshNonce: number) {
  const queryClient = useQueryClient();

  const query = useQuery<CrmRecord[]>({
    queryKey: ["crm", "packages", refreshNonce],
    queryFn: listCrmPackages,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CrmPackagePayload }) =>
      updateCrmPackage(id, payload),
    onSuccess: async () => {
      await invalidate();
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CrmPackagePayload) => createCrmPackage(payload),
    onSuccess: async () => {
      await invalidate();
      notify("بسته جدید با موفقیت ایجاد شد.");
    },
  });

  const detailMutation = useMutation({
    mutationFn: (id: string) => getCrmPackage(id),
    onError: (error) => {
      notify(getApiErrorMessage(error, "دریافت جزئیات بسته ناموفق بود."), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCrmPackage(id),
    onSuccess: async () => {
      await invalidate();
      notify("بسته غیرفعال شد.");
    },
  });

  useEffect(() => {
    if (query.error) {
      notify(getApiErrorMessage(query.error, "دریافت بسته‌ها ناموفق بود."), "error");
    }
  }, [notify, query.error]);

  const savePackage = async (
    editingId: string | null | undefined,
    payload: CrmPackagePayload,
  ) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload });
        notify("بسته با موفقیت به‌روزرسانی شد.");
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      notify(getApiErrorMessage(error, "ذخیره بسته ناموفق بود."), "error");
      throw error;
    }
  };

  const toggleStatus = async (item: CrmRecord, nextStatus: boolean) => {
    const id = packageRecordId(item);
    if (!id) return;
    const payload = packageToPayload(item, nextStatus);
    try {
      await updateMutation.mutateAsync({ id, payload });
      notify(nextStatus ? "بسته فعال شد." : "بسته غیرفعال شد.");
    } catch (error) {
      notify(getApiErrorMessage(error, "تغییر وضعیت بسته ناموفق بود."), "error");
    }
  };

  const deactivatePackage = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      notify(getApiErrorMessage(error, "غیرفعال‌سازی بسته ناموفق بود."), "error");
    }
  };

  return {
    query,
    detailMutation,
    deleteMutation,
    updateMutation,
    createMutation,
    savePackage,
    toggleStatus,
    deactivatePackage,
    isSaving: updateMutation.isPending || createMutation.isPending,
  };
}
