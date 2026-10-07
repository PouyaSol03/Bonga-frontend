import { motion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { PackageModalFields } from "./PackageModalFields";
import type { PackageDraft } from "../types";

interface PackageModalProps {
  draft: PackageDraft;
  isEditing: boolean;
  isPending: boolean;
  onChange: (draft: PackageDraft) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export function PackageModal({
  draft,
  isEditing,
  isPending,
  onChange,
  onClose,
  onSubmit,
}: PackageModalProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 p-8"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <motion.form
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[calc(100vh-64px)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold">
              {isEditing ? "ویرایش بسته" : "افزودن بسته جدید"}
            </Typography>
            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 text-xs text-[#7b8494]">
              مبلغ نهایی بر اساس قیمت اصلی و درصد تخفیف توسط سرور محاسبه می‌شود.
            </Typography>
          </div>
          <Button unstyled className="text-2xl text-[#596477]" onClick={onClose} type="button">
            ×
          </Button>
        </div>

        <PackageModalFields draft={draft} onChange={onChange} />

        <div className="mt-6 flex justify-end gap-3">
          <Button unstyled
            className="h-10 rounded-xl border border-[#d7dce5] px-5 text-sm font-bold"
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button unstyled
            className="h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
