import type { Dispatch, FormEvent, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SwitchButton } from "../../../../shared/components/SwitchButton";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmDiscountCode, CrmDiscountServiceType } from "../../api/crm-discount.service";
import { inputClass, type DiscountDraft } from "../types";
import { DiscountServiceCheckboxes } from "./DiscountServiceCheckboxes";
import { DiscountFormActions } from "./DiscountFormActions";

export function DiscountFormModal({
  draft,
  editingItem,
  isPending,
  isOpen,
  onClose,
  onSubmit,
  setDraft,
  toggleService,
}: {
  draft: DiscountDraft;
  editingItem: CrmDiscountCode | null;
  isPending: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  setDraft: Dispatch<SetStateAction<DiscountDraft>>;
  toggleService: (service: CrmDiscountServiceType) => void;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="border-outline-var bg-surface-container-lowest w-full max-w-lg rounded-2xl border p-6 shadow-xl [direction:rtl]"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <div className="border-outline-var flex items-center justify-between border-b pb-4">
              <Typography
                as="h3"
                variant="title"
                size="medium"
                weight="semibold"
                className="text-on-surface text-lg font-bold"
              >
                {editingItem ? "ویرایش کد تخفیف" : "افزودن کد تخفیف جدید"}
              </Typography>
              <button
                className="text-on-surface-var hover:bg-surface-container rounded-lg p-1"
                onClick={onClose}
                type="button"
              >
                ✕
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
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
                <span className="text-on-surface-var text-[11px]">
                  کد تخفیف به صورت خودکار به حروف بزرگ تبدیل می‌شود.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
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
                  <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
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

              <DiscountServiceCheckboxes
                selectedServices={draft.services}
                toggleService={toggleService}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
                    حداکثر تعداد دفعات استفاده
                  </label>
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    min={1}
                    onChange={(e) => setDraft((prev) => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="خالی = نامحدود"
                    type="number"
                    value={draft.usageLimit}
                  />
                </div>

                <div>
                  <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
                    تاریخ انقضا
                  </label>
                  <input
                    className={inputClass}
                    dir="ltr"
                    onChange={(e) => setDraft((prev) => ({ ...prev, expireAt: e.target.value }))}
                    type="date"
                    value={draft.expireAt}
                  />
                </div>
              </div>

              <div>
                <label className="text-on-surface-var mb-1.5 block text-xs font-semibold">
                  توضیحات یا یادداشت ادمین
                </label>
                <input
                  className={inputClass}
                  onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="مثال: کمپین نوروزی اینستاگرام"
                  value={draft.description}
                />
              </div>

              <div className="border-outline-var flex items-center justify-between rounded-xl border p-3">
                <span className="text-on-surface text-xs font-medium">
                  کد تخفیف هم‌اکنون فعال باشد
                </span>
                <SwitchButton
                  checked={draft.isActive}
                  onChange={(checked) => setDraft((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>

              <DiscountFormActions
                editingItem={Boolean(editingItem)}
                isPending={isPending}
                onClose={onClose}
              />
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
