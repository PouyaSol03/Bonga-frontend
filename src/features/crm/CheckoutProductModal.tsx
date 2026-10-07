import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import type { CrmCheckoutProductPayload, CrmRecord } from "./api/crm.service";

export const inputClass =
  "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

export function text(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function numberValue(value: string, label: string) {
  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} باید عدد صفر یا بزرگ‌تر باشد.`);
  }
  return parsed;
}

export function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">
        {label}
      </Typography>
      {children}
    </label>
  );
}

export function CheckoutProductModal({
  isPending,
  item,
  onClose,
  onSubmit,
}: {
  isPending: boolean;
  item: CrmRecord;
  onClose: () => void;
  onSubmit: (payload: CrmCheckoutProductPayload) => Promise<void>;
}) {
  const [draft, setDraft] = useState(() => ({
    title: text(item, ["title"]),
    description: text(item, ["description"]),
    price: text(item, ["price"]),
    creditCost: text(item, ["credit_cost"]),
    durationDays: text(item, ["duration_days"]),
    durationMonths: text(item, ["duration_months"]),
    sortOrder: text(item, ["sort_order"]),
  }));

  const set = (key: keyof typeof draft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 p-8"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit({
            title: draft.title.trim(),
            description: draft.description.trim(),
            price: numberValue(draft.price, "قیمت"),
            credit_cost: numberValue(draft.creditCost, "اعتبار"),
            duration_days: draft.durationDays ? numberValue(draft.durationDays, "مدت روز") : null,
            duration_months: draft.durationMonths ? numberValue(draft.durationMonths, "مدت ماه") : null,
            is_active: Boolean(item.is_active),
            sort_order: numberValue(draft.sortOrder || "0", "ترتیب"),
            metadata: item.metadata && typeof item.metadata === "object" && !Array.isArray(item.metadata) ? item.metadata as Record<string, unknown> : {},
          });
        }}
      >
        <div className="flex items-center justify-between">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold">
            ویرایش {draft.title}
          </Typography>
          <Button unstyled className="text-2xl text-[#596477]" onClick={onClose} type="button">×</Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <Field label="عنوان"><input className={inputClass} onChange={(e) => set("title", e.target.value)} value={draft.title} /></Field>
          <Field label="قیمت (تومان)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("price", e.target.value)} value={draft.price} /></Field>
          <Field label="هزینه اعتباری"><input className={inputClass} inputMode="numeric" onChange={(e) => set("creditCost", e.target.value)} value={draft.creditCost} /></Field>
          <Field label="ترتیب نمایش"><input className={inputClass} inputMode="numeric" onChange={(e) => set("sortOrder", e.target.value)} value={draft.sortOrder} /></Field>
          <Field label="مدت (روز)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationDays", e.target.value)} value={draft.durationDays} /></Field>
          <Field label="مدت (ماه)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationMonths", e.target.value)} value={draft.durationMonths} /></Field>
          <label className="col-span-2">
            <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">توضیحات</Typography>
            <textarea className={`${inputClass} min-h-24 py-3`} onChange={(e) => set("description", e.target.value)} value={draft.description} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button unstyled className="h-10 rounded-xl border border-[#d7dce5] px-5 text-sm font-bold" onClick={onClose} type="button">انصراف</Button>
          <Button unstyled className="h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "در حال ذخیره..." : "ذخیره"}</Button>
        </div>
      </form>
    </motion.div>
  );
}
