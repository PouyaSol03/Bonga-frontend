import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  createCrmDiscountCode,
  deleteCrmDiscountCode,
  listCrmDiscountCodes,
  toggleCrmDiscountCodeStatus,
  updateCrmDiscountCode,
  type CrmDiscountCode,
  type CrmDiscountCodePayload,
  type CrmDiscountServiceType,
} from "../api/crm-discount.service";
import { emptyDraft, type DiscountDraft, type Notify } from "./types";

export function useCrmDiscountsFlow(notify: Notify, refreshNonce: number) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CrmDiscountCode | null>(null);
  const [draft, setDraft] = useState<DiscountDraft>(emptyDraft);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const {
    data: discountCodes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["crm", "discount-codes", refreshNonce],
    queryFn: listCrmDiscountCodes,
  });

  const createMutation = useMutation({
    mutationFn: createCrmDiscountCode,
    onSuccess: () => {
      notify("کد تخفیف با موفقیت ایجاد شد.", "success");
      void queryClient.invalidateQueries({ queryKey: ["crm", "discount-codes"] });
      closeModal();
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "ایجاد کد تخفیف با خطا مواجه شد."), "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CrmDiscountCodePayload> }) =>
      updateCrmDiscountCode(id, payload),
    onSuccess: () => {
      notify("کد تخفیف با موفقیت بروزرسانی شد.", "success");
      void queryClient.invalidateQueries({ queryKey: ["crm", "discount-codes"] });
      closeModal();
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "بروزرسانی کد تخفیف با خطا مواجه شد."), "error");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCrmDiscountCodeStatus,
    onSuccess: () => {
      notify("وضعیت کد تخفیف تغییر کرد.", "success");
      void queryClient.invalidateQueries({ queryKey: ["crm", "discount-codes"] });
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "تغییر وضعیت کد تخفیف با خطا مواجه شد."), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCrmDiscountCode,
    onSuccess: () => {
      notify("کد تخفیف با موفقیت حذف شد.", "success");
      void queryClient.invalidateQueries({ queryKey: ["crm", "discount-codes"] });
      setDeleteConfirmId(null);
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "حذف کد تخفیف با خطا مواجه شد."), "error");
    },
  });

  function openCreateModal() {
    setEditingItem(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEditModal(item: CrmDiscountCode) {
    setEditingItem(item);
    setDraft({
      code: item.code,
      discountPercent: String(item.discount_percent),
      services: item.services && item.services.length > 0 ? item.services : ["package", "panel"],
      maxDiscountAmount: item.max_discount_amount ? String(item.max_discount_amount) : "",
      usageLimit: item.usage_limit ? String(item.usage_limit) : "",
      expireAt: item.expire_at ? item.expire_at.split("T")[0] : "",
      description: item.description || "",
      isActive: item.is_active,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
    setDraft(emptyDraft);
  }

  function toggleService(service: CrmDiscountServiceType) {
    setDraft((prev) => {
      const exists = prev.services.includes(service);
      const updated = exists
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: updated };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!draft.code.trim()) {
      notify("کد تخفیف نمی‌تواند خالی باشد.", "error");
      return;
    }

    const percent = Number(draft.discountPercent);
    if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
      notify("درصد تخفیف باید عددی بین ۱ تا ۱۰۰ باشد.", "error");
      return;
    }

    if (draft.services.length === 0) {
      notify("حداقل یک سرویس باید برای اعمال کد تخفیف انتخاب شود.", "error");
      return;
    }

    const payload: CrmDiscountCodePayload = {
      code: draft.code.trim().toUpperCase(),
      discount_percent: percent,
      services: draft.services,
      max_discount_amount: draft.maxDiscountAmount ? Number(draft.maxDiscountAmount) : null,
      usage_limit: draft.usageLimit ? Number(draft.usageLimit) : null,
      expire_at: draft.expireAt ? new Date(draft.expireAt).toISOString() : null,
      description: draft.description.trim() || null,
      is_active: draft.isActive,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const totalCodes = discountCodes.length;
  const activeCodes = discountCodes.filter((c) => c.is_active).length;
  const hundredPercentCodes = discountCodes.filter((c) => c.discount_percent >= 100).length;
  const totalUsed = discountCodes.reduce((sum, c) => sum + (c.used_count || 0), 0);

  return {
    activeCodes,
    closeModal,
    createMutation,
    deleteConfirmId,
    deleteMutation,
    discountCodes,
    draft,
    editingItem,
    handleSubmit,
    hundredPercentCodes,
    isError,
    isLoading,
    modalOpen,
    openCreateModal,
    openEditModal,
    setDeleteConfirmId,
    setDraft,
    toggleMutation,
    toggleService,
    totalCodes,
    totalUsed,
    updateMutation,
  };
}
