import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { getApiErrorMessage } from "../../shared/api/api";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";
import type { CrmRoutePageProps } from "./CrmLayout";
import {
  listCrmProfileFeedbackItems,
  createCrmProfileFeedbackItem,
  updateCrmProfileFeedbackItem,
  deleteCrmProfileFeedbackItem,
  type ProfileFeedbackItem,
} from "../dashboard/api/v2/profile-feedback.service";

type DraftItem = {
  id?: number;
  title: string;
  sort_order: number;
  is_active: boolean;
};

const emptyDraft: DraftItem = {
  title: "",
  sort_order: 0,
  is_active: true,
};

function toPersianDigits(value: number | string): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export function CrmFeedbackViews({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<DraftItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data: items = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["crmProfileFeedbackItems", refreshNonce],
    queryFn: listCrmProfileFeedbackItems,
  });

  const saveMutation = useMutation({
    mutationFn: async (draft: DraftItem) => {
      if (draft.id) {
        return updateCrmProfileFeedbackItem(draft.id, {
          title: draft.title.trim(),
          sort_order: Number(draft.sort_order),
          is_active: draft.is_active,
        });
      }
      return createCrmProfileFeedbackItem({
        title: draft.title.trim(),
        sort_order: Number(draft.sort_order),
        is_active: draft.is_active,
      });
    },
    onSuccess: (_, draft) => {
      queryClient.invalidateQueries({ queryKey: ["crmProfileFeedbackItems"] });
      queryClient.invalidateQueries({ queryKey: ["publicProfileFeedbackItems"] });
      notify(
        draft.id ? "معیار بازخورد با موفقیت ویرایش شد." : "معیار بازخورد جدید افزوده شد.",
        "success"
      );
      setEditingItem(null);
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "عملیات ذخیره‌سازی با خطا مواجه شد."), "error");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (item: ProfileFeedbackItem) =>
      updateCrmProfileFeedbackItem(item.id, { is_active: !item.is_active }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["crmProfileFeedbackItems"] });
      queryClient.invalidateQueries({ queryKey: ["publicProfileFeedbackItems"] });
      notify(
        `وضعیت «${updated.title}» به ${updated.is_active ? "فعال" : "غیرفعال"} تغییر یافت.`,
        "success"
      );
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "تغییر وضعیت با خطا مواجه شد."), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCrmProfileFeedbackItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crmProfileFeedbackItems"] });
      queryClient.invalidateQueries({ queryKey: ["publicProfileFeedbackItems"] });
      notify("معیار بازخورد با موفقیت حذف شد.", "success");
      setDeletingId(null);
    },
    onError: (err) => {
      notify(getApiErrorMessage(err, "حذف معیار با خطا مواجه شد."), "error");
    },
  });

  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6 [direction:rtl]">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8ecf4] bg-white p-5 shadow-xs">
        <div>
          <Typography as="h2" variant="title" size="large" weight="semibold" className="text-lg text-[#1e293b]">
            معیارهای بازخورد پروفایل
          </Typography>
          <Typography as="p" variant="body" size="small" weight="regular" className="mt-1 text-sm text-[#64748b]">
            تعریف و ویرایش سوالات بازخورد کیفی کاربران از مشاورین و آژانس‌ها
          </Typography>
        </div>
        <Button
          onClick={() => setEditingItem({ ...emptyDraft })}
          size="medium"
          variant="primary"
          className="h-10 rounded-xl px-4"
        >
          + افزودن معیار جدید
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e8ecf4] bg-white shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-[#64748b]">در حال بارگذاری لیست معیارها...</div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-[#d93645]">
            خطا در دریافت لیست معیارها.
            <Button unstyled className="mr-2 text-primary underline" onClick={() => refetch()} type="button">
              تلاش مجدد
            </Button>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#64748b]">هیچ معیاری ثبت نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-[#e8ecf4] bg-[#f8fafc] text-xs font-semibold text-[#475569]">
                <tr>
                  <th className="px-5 py-3.5">شناسه</th>
                  <th className="px-5 py-3.5">عنوان معیار</th>
                  <th className="px-5 py-3.5 text-center">ترتیب نمایش</th>
                  <th className="px-5 py-3.5 text-center">وضعیت</th>
                  <th className="px-5 py-3.5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {sortedItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#f8fafc]/80">
                    <td className="px-5 py-4 font-mono text-xs text-[#64748b]">{toPersianDigits(item.id)}</td>
                    <td className="px-5 py-4 font-medium text-[#1e293b]">{item.title}</td>
                    <td className="px-5 py-4 text-center font-mono text-xs text-[#64748b]">
                      {toPersianDigits(item.sort_order)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <SwitchButton
                          checked={item.is_active}
                          disabled={toggleStatusMutation.isPending}
                          onChange={() => toggleStatusMutation.mutate(item)}
                        />
                        <span className={`text-xs ${item.is_active ? "text-tertiary" : "text-outline"}`}>
                          {item.is_active ? "فعال" : "غیرفعال"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <div className="inline-flex items-center gap-2 [direction:ltr]">
                        <Button
                          unstyled
                          className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9]"
                          onClick={() =>
                            setEditingItem({
                              id: item.id,
                              title: item.title,
                              sort_order: item.sort_order,
                              is_active: item.is_active,
                            })
                          }
                          type="button"
                        >
                          ویرایش
                        </Button>
                        <Button
                          unstyled
                          className="rounded-lg border border-[#fee2e2] px-3 py-1.5 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2]"
                          onClick={() => setDeletingId(item.id)}
                          type="button"
                        >
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {editingItem ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl [direction:rtl]"
            >
              <Typography as="h3" variant="title" size="medium" weight="semibold" className="text-base text-[#1e293b]">
                {editingItem.id ? "ویرایش معیار بازخورد" : "افزودن معیار بازخورد"}
              </Typography>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editingItem.title.trim()) {
                    notify("عنوان معیار را وارد کنید.", "error");
                    return;
                  }
                  saveMutation.mutate(editingItem);
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-[#475569]">عنوان معیار</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="مانند: سرعت پاسخگویی"
                    className="mt-1 h-10 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#475569]">ترتیب نمایش (Sort Order)</label>
                  <input
                    type="number"
                    value={editingItem.sort_order}
                    onChange={(e) => setEditingItem({ ...editingItem, sort_order: Number(e.target.value) || 0 })}
                    className="mt-1 h-10 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <SwitchButton
                    checked={editingItem.is_active}
                    onChange={(checked) => setEditingItem({ ...editingItem, is_active: checked })}
                  />
                  <span className="text-xs font-medium text-[#334155]">
                    {editingItem.is_active ? "وضعیت: فعال" : "وضعیت: غیرفعال"}
                  </span>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button
                    type="submit"
                    loading={saveMutation.isPending}
                    size="medium"
                    variant="primary"
                    className="flex-1"
                  >
                    ذخیره
                  </Button>
                  <Button
                    type="button"
                    disabled={saveMutation.isPending}
                    onClick={() => setEditingItem(null)}
                    size="medium"
                    variant="neutral-outline"
                    className="flex-1"
                  >
                    انصراف
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId !== null ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl [direction:rtl]"
            >
              <Typography as="h3" variant="title" size="medium" weight="semibold" className="text-base text-[#1e293b]">
                حذف معیار بازخورد
              </Typography>
              <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-sm text-[#64748b]">
                آیا از حذف این معیار اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
              </Typography>

              <div className="mt-5 flex gap-3">
                <Button
                  loading={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(deletingId)}
                  size="medium"
                  variant="primary"
                  className="flex-1 bg-error hover:bg-error/90"
                >
                  حذف قطعی
                </Button>
                <Button
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeletingId(null)}
                  size="medium"
                  variant="neutral-outline"
                  className="flex-1"
                >
                  انصراف
                </Button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default CrmFeedbackViews;
