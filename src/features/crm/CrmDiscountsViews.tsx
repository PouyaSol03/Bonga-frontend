import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { getApiErrorMessage } from "../../shared/api/api";
import { SwitchButton } from "../../shared/components/SwitchButton";
import {
  createCrmDiscountCode,
  deleteCrmDiscountCode,
  listCrmDiscountCodes,
  toggleCrmDiscountCodeStatus,
  updateCrmDiscountCode,
  type CrmDiscountCode,
  type CrmDiscountCodePayload,
  type CrmDiscountServiceType,
} from "./api/crm-discount.service";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

type Notify = (message: string, tone?: "error" | "success") => void;
type ViewProps = { notify: Notify; refreshNonce: number };

type DiscountDraft = {
  code: string;
  discountPercent: string;
  services: CrmDiscountServiceType[];
  maxDiscountAmount: string;
  usageLimit: string;
  expireAt: string;
  description: string;
  isActive: boolean;
};

const emptyDraft: DiscountDraft = {
  code: "",
  discountPercent: "",
  services: ["advertise", "package", "panel"],
  maxDiscountAmount: "",
  usageLimit: "",
  expireAt: "",
  description: "",
  isActive: true,
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

const serviceLabels: Record<CrmDiscountServiceType, string> = {
  advertise: "ثبت و ارتقای آگهی",
  package: "بسته‌های اعتباری",
  panel: "اشتراک پنل",
};

const serviceBadgeColors: Record<CrmDiscountServiceType, string> = {
  advertise: "bg-blue-50 text-blue-700 border-blue-200",
  package: "bg-amber-50 text-amber-700 border-amber-200",
  panel: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatPersianNumber(value: number | string): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return num.toLocaleString("fa-IR");
}

function formatDatePersian(dateStr: string | null | undefined): string {
  if (!dateStr) return "بدون محدودیت";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function CrmDiscountsViews({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CrmDiscountCode | null>(null);
  const [draft, setDraft] = useState<DiscountDraft>(emptyDraft);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: discountCodes = [], isLoading, isError } = useQuery({
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

  function handleSubmit(e: React.FormEvent) {
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

  return (
    <div className="space-y-6 [direction:rtl]">
      {/* Header & Create Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography as="h2" variant="title" size="large" weight="semibold" className="text-xl font-bold text-on-surface">
            مدیریت کدهای تخفیف
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-on-surface-var">
            تعریف کدهای تخفیف درصدی و ۱۰۰٪ و تخصیص به سرویس‌های آگهی، بسته و پنل
          </Typography>
        </div>

        <Button
          className="h-11 px-5"
          onClick={openCreateModal}
          type="button"
          variant="primary"
        >
          + ایجاد کد تخفیف جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-outline-var bg-surface-container-lowest p-4">
          <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface-var">
            کل کدهای تخفیف
          </Typography>
          <div className="mt-2 text-2xl font-bold text-on-surface">
            {formatPersianNumber(totalCodes)}
          </div>
        </div>

        <div className="rounded-2xl border border-outline-var bg-surface-container-lowest p-4">
          <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface-var">
            کدهای فعال
          </Typography>
          <div className="mt-2 text-2xl font-bold text-[#11a366]">
            {formatPersianNumber(activeCodes)}
          </div>
        </div>

        <div className="rounded-2xl border border-outline-var bg-surface-container-lowest p-4">
          <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface-var">
            کدهای تخفیف ۱۰۰٪
          </Typography>
          <div className="mt-2 text-2xl font-bold text-[#0048c4]">
            {formatPersianNumber(hundredPercentCodes)}
          </div>
        </div>

        <div className="rounded-2xl border border-outline-var bg-surface-container-lowest p-4">
          <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface-var">
            مجموع دفعات استفاده
          </Typography>
          <div className="mt-2 text-2xl font-bold text-on-surface">
            {formatPersianNumber(totalUsed)}
          </div>
        </div>
      </div>

      {/* Table of Discount Codes */}
      <div className="overflow-hidden rounded-2xl border border-outline-var bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-outline-var bg-surface-container text-xs font-semibold text-on-surface-var">
              <tr>
                <th className="px-4 py-3.5">کد تخفیف</th>
                <th className="px-4 py-3.5">درصد تخفیف</th>
                <th className="px-4 py-3.5">سرویس‌های مجاز</th>
                <th className="px-4 py-3.5">سقف تخفیف</th>
                <th className="px-4 py-3.5">تعداد استفاده</th>
                <th className="px-4 py-3.5">انقضا</th>
                <th className="px-4 py-3.5">وضعیت</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-var">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-var">
                    در حال بارگذاری کدهای تخفیف...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-error">
                    خطا در دریافت کدهای تخفیف. لطفاً دوباره تلاش کنید.
                  </td>
                </tr>
              ) : discountCodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-on-surface-var">
                    هیچ کد تخفیفی تاکنون تعریف نشده است.
                  </td>
                </tr>
              ) : (
                discountCodes.map((item) => {
                  const is100 = item.discount_percent >= 100;
                  const isExpired = item.expire_at && new Date(item.expire_at) < new Date();

                  return (
                    <tr className="hover:bg-surface-container-low transition-colors" key={item.id}>
                      <td className="px-4 py-4 font-mono font-bold text-on-surface" dir="ltr">
                        <span className="rounded-lg bg-surface-container-high px-2.5 py-1 text-sm font-semibold tracking-wider text-primary">
                          {item.code}
                        </span>
                        {item.description ? (
                          <div className="mt-1 font-sans text-xs font-normal text-on-surface-var" dir="rtl">
                            {item.description}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        {is100 ? (
                          <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                            ۱۰۰٪ (رایگان)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            {formatPersianNumber(item.discount_percent)}٪
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(item.services || []).map((srv) => (
                            <span
                              className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                                serviceBadgeColors[srv] || "bg-gray-100 text-gray-700"
                              }`}
                              key={srv}
                            >
                              {serviceLabels[srv] || srv}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-on-surface">
                        {item.max_discount_amount
                          ? `${formatPersianNumber(item.max_discount_amount)} تومان`
                          : "بدون سقف"}
                      </td>

                      <td className="px-4 py-4 text-on-surface">
                        <span className="font-semibold">{formatPersianNumber(item.used_count || 0)}</span>
                        {item.usage_limit ? (
                          <span className="text-on-surface-var"> / {formatPersianNumber(item.usage_limit)}</span>
                        ) : (
                          <span className="text-xs text-on-surface-var"> (نامحدود)</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className={isExpired ? "text-error font-medium" : "text-on-surface"}>
                          {formatDatePersian(item.expire_at)}
                        </span>
                        {isExpired ? (
                          <div className="text-xs font-medium text-error">منقضی شده</div>
                        ) : null}
                      </td>

                      <td className="px-4 py-4">
                        <SwitchButton
                          checked={item.is_active}
                          disabled={toggleMutation.isPending}
                          onChange={() => toggleMutation.mutate(item.id)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button unstyled
                            className="h-8 rounded-lg bg-surface-container px-3 text-xs font-medium text-on-surface hover:bg-surface-container-high transition"
                            onClick={() => openEditModal(item)}
                            type="button"
                          >
                            ویرایش
                          </Button>
                          <Button unstyled
                            className="h-8 rounded-lg bg-error-container/30 px-3 text-xs font-medium text-error hover:bg-error-container/50 transition"
                            onClick={() => setDeleteConfirmId(item.id)}
                            type="button"
                          >
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg rounded-2xl border border-outline-var bg-surface-container-lowest p-6 shadow-xl [direction:rtl]"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between border-b border-outline-var pb-4">
                <Typography as="h3" variant="title" size="medium" weight="semibold" className="text-lg font-bold text-on-surface">
                  {editingItem ? "ویرایش کد تخفیف" : "افزودن کد تخفیف جدید"}
                </Typography>
                <button
                  className="rounded-lg p-1 text-on-surface-var hover:bg-surface-container"
                  onClick={closeModal}
                  type="button"
                >
                  ✕
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                    کد تخفیف <span className="text-error">*</span>
                  </label>
                  <input
                    className={inputClass}
                    dir="ltr"
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                      }))
                    }
                    placeholder="مثال: OFF100 یا BONGA50"
                    required
                    value={draft.code}
                  />
                  <span className="text-[11px] text-on-surface-var">کد تخفیف به صورت خودکار به حروف بزرگ تبدیل می‌شود.</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                      درصد تخفیف (۱ تا ۱۰۰) <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      inputMode="numeric"
                      max={100}
                      min={1}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, discountPercent: e.target.value }))
                      }
                      placeholder="۱۰۰"
                      required
                      type="number"
                      value={draft.discountPercent}
                    />
                    {Number(draft.discountPercent) === 100 ? (
                      <span className="text-[11px] font-medium text-emerald-600">
                        تخفیف ۱۰۰٪ درگاه پرداخت را غیرفعال کرده و پرداخت از کیف پول را رایگان می‌کند.
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                      سقف تخفیف (تومان) - اختیاری
                    </label>
                    <input
                      className={inputClass}
                      inputMode="numeric"
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, maxDiscountAmount: e.target.value }))
                      }
                      placeholder="مثال: ۵۰۰۰۰۰"
                      type="number"
                      value={draft.maxDiscountAmount}
                    />
                  </div>
                </div>

                {/* Services Checkboxes */}
                <div className="rounded-xl border border-outline-var bg-surface-container-low p-3.5">
                  <label className="block text-xs font-semibold text-on-surface mb-2">
                    سرویس‌های مجاز برای این کد تخفیف <span className="text-error">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(["advertise", "package", "panel"] as CrmDiscountServiceType[]).map((service) => {
                      const isChecked = draft.services.includes(service);
                      return (
                        <label
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                            isChecked
                              ? "border-primary bg-primary/5 text-primary font-bold"
                              : "border-outline-var bg-surface-container-lowest text-on-surface-var"
                          }`}
                          key={service}
                        >
                          <input
                            checked={isChecked}
                            className="accent-primary"
                            onChange={() => toggleService(service)}
                            type="checkbox"
                          />
                          <span>{serviceLabels[service]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                      حداکثر تعداد دفعات استفاده
                    </label>
                    <input
                      className={inputClass}
                      inputMode="numeric"
                      min={1}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, usageLimit: e.target.value }))
                      }
                      placeholder="خالی = نامحدود"
                      type="number"
                      value={draft.usageLimit}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                      تاریخ انقضا
                    </label>
                    <input
                      className={inputClass}
                      dir="ltr"
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, expireAt: e.target.value }))
                      }
                      type="date"
                      value={draft.expireAt}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-var mb-1.5">
                    توضیحات یا یادداشت ادمین
                  </label>
                  <input
                    className={inputClass}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="مثال: کمپین نوروزی اینستاگرام"
                    value={draft.description}
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-outline-var p-3">
                  <span className="text-xs font-medium text-on-surface">کد تخفیف هم‌اکنون فعال باشد</span>
                  <SwitchButton
                    checked={draft.isActive}
                    onChange={(checked) =>
                      setDraft((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-outline-var">
                  <Button
                    className="h-10 px-4"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    onClick={closeModal}
                    type="button"
                    variant="neutral-outline"
                  >
                    انصراف
                  </Button>
                  <Button
                    className="h-10 px-5"
                    loading={createMutation.isPending || updateMutation.isPending}
                    type="submit"
                    variant="primary"
                  >
                    {editingItem ? "بروزرسانی کد" : "ایجاد کد تخفیف"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-2xl border border-outline-var bg-surface-container-lowest p-6 shadow-xl [direction:rtl]"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
            >
              <Typography as="h3" variant="title" size="medium" weight="semibold" className="text-base font-bold text-error">
                حذف کد تخفیف
              </Typography>
              <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-sm text-on-surface-var">
                آیا از حذف این کد تخفیف اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
              </Typography>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  className="h-9 px-4"
                  onClick={() => setDeleteConfirmId(null)}
                  type="button"
                  variant="neutral-outline"
                >
                  انصراف
                </Button>
                <Button
                  className="h-9 px-4"
                  loading={deleteMutation.isPending}
                  onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
                  type="button"
                  variant="danger"
                >
                  حذف قطعی
                </Button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
