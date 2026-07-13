import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { getApiErrorMessage } from "../../api/api";
import { SwitchButton } from "../../components/SwitchButton";
import { getPackages } from "../../services/package.service";
import {
  deleteCrmPackage,
  getCrmRecordId,
  listCrmCheckoutProducts,
  saveCrmPackage,
  updateCrmCheckoutProduct,
  updateCrmCheckoutProductStatus,
  type CrmCheckoutProductPayload,
  type CrmPackageKind,
  type CrmPackagePayload,
  type CrmRecord,
} from "../../services/crm.service";

type Notify = (message: string, tone?: "error" | "success") => void;
type ViewProps = { notify: Notify; refreshNonce: number };

type PackageDraft = {
  ad: string;
  discount: string;
  endDate: string;
  gift: boolean;
  kind: CrmPackageKind;
  price: string;
  special: string;
  startDate: string;
  title: string;
  update: string;
};

const emptyDraft: PackageDraft = {
  ad: "", discount: "", endDate: "", gift: false, kind: "panel_subscription",
  price: "", special: "", startDate: "", title: "", update: "",
};
const inputClass = "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

function text(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

function numberValue(value: string, label: string): number;
function numberValue(value: string, label: string, optional: true): number | undefined;
function numberValue(value: string, label: string, optional = false): number | undefined {
  if (!value.trim() && optional) return undefined;
  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${label} باید عددی مثبت باشد.`);
  return parsed;
}

function validateJalali(value: string, label: string) {
  if (!/^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(value)) {
    throw new Error(`${label} را به فرمت شمسی YYYY/MM/DD وارد کنید.`);
  }
  return value;
}

function draftFromPackage(item: CrmRecord): PackageDraft {
  const kind = item.kind === "credit_bundle" ? "credit_bundle" : "panel_subscription";
  return {
    ad: text(item, ["ad_credit"]),
    discount: text(item, ["discount", "discount_percent"]),
    endDate: text(item, ["end_date"]),
    gift: Boolean(item.gift ?? item.is_gift),
    kind,
    price: text(item, ["price", "real_price"]),
    special: text(item, ["special_credit"]),
    startDate: text(item, ["start_date"]),
    title: text(item, ["title"]),
    update: text(item, ["renew_credit"]),
  };
}

function packagePayload(draft: PackageDraft): CrmPackagePayload {
  if (!draft.title.trim()) throw new Error("عنوان الزامی است.");
  const base = {
    title: draft.title.trim(), kind: draft.kind,
    real_price: numberValue(draft.price, "قیمت"),
    discount_percent: numberValue(draft.discount, "تخفیف", true),
  };
  if (draft.kind === "panel_subscription") {
    return { ...base, ad_credit: numberValue(draft.ad, "تعداد آگهی"), special_credit: numberValue(draft.special, "تعداد ویژه"), renew_credit: numberValue(draft.update, "تعداد بروزرسانی") };
  }
  return {
    ...base,
    start_date: validateJalali(draft.startDate, "تاریخ شروع"),
    end_date: validateJalali(draft.endDate, "تاریخ پایان"),
    gift: draft.gift,
    ...(draft.gift ? {
      ad_credit: numberValue(draft.ad, "هدیه آگهی", true),
      special_credit: numberValue(draft.special, "هدیه ویژه", true),
      renew_credit: numberValue(draft.update, "هدیه بروزرسانی", true),
    } : {}),
  };
}

export function CrmPackagesView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CrmRecord | null | undefined>(undefined);
  const [draft, setDraft] = useState<PackageDraft>(emptyDraft);
  const query = useQuery({
    queryFn: async () => (await getPackages()) as unknown as CrmRecord[],
    queryKey: ["crm", "packages", "public", refreshNonce],
  });
  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmPackagePayload }) => saveCrmPackage(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });
      notify("بسته با موفقیت ذخیره شد.");
      setEditing(undefined);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCrmPackage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });
      notify("بسته حذف شد.");
    },
  });

  useEffect(() => {
    if (query.error) notify(getApiErrorMessage(query.error, "دریافت بسته‌ها ناموفق بود."), "error");
  }, [notify, query.error]);

  const open = (item: CrmRecord | null) => {
    setEditing(item);
    setDraft(item ? draftFromPackage(item) : emptyDraft);
  };

  return (
    <>
      <section className="rounded-xl bg-white p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] pb-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-[#1a1a1a]">بسته‌ها و اعتبار پنل</h2>
            <p className="m-0 mt-2 text-sm text-[#7b8494]">بسته‌های اشتراک و اعتبارهای زمان‌دار را ایجاد و ویرایش کنید.</p>
          </div>
          <motion.button className="h-10 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white" onClick={() => open(null)} type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            + افزودن مورد
          </motion.button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {query.isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div className="h-[370px] animate-pulse rounded-2xl border border-[#e4e7ed] bg-[#fafbfc] p-5" key={index}>
                <div className="h-5 w-24 rounded bg-[#e9edf3]" />
                <div className="mt-5 h-6 w-2/3 rounded bg-[#e9edf3]" />
                <div className="mt-8 h-12 w-1/2 rounded bg-[#eef1f5]" />
                <div className="mt-6 h-32 rounded-xl bg-[#eaf5ef]" />
              </div>
            ))
          ) : query.data?.length ? (
            query.data.map((item, index) => {
              const id = getCrmRecordId(item);
              const isCreditBundle = item.kind === "credit_bundle";
              const kind = isCreditBundle ? "اعتبار پنل" : "بسته اشتراک";
              const discount = Number(text(item, ["discount_percent", "discount"], "0"));
              const realPrice = Number(text(item, ["real_price", "price"], "0"));
              const apiFinalPrice = Number(text(item, ["final_price"], "0"));
              const finalPrice = apiFinalPrice || Math.max(0, Math.round(realPrice * (1 - discount / 100)));
              const creditItems = [
                { label: "اعتبار آگهی", value: text(item, ["ad_credit"], "۰") },
                { label: "اعتبار ویژه", value: text(item, ["special_credit"], "۰") },
                { label: "اعتبار بروزرسانی", value: text(item, ["renew_credit"], "۰") },
              ];

              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex min-h-[370px] flex-col rounded-2xl border border-[#d9dde7] bg-gradient-to-b from-white to-[#f5f7fb] p-5 transition-shadow hover:border-[#0048c4] hover:shadow-[0_14px_36px_rgba(0,72,196,0.10)]"
                  initial={{ opacity: 0, y: 16 }}
                  key={id}
                  transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.28, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-lg bg-[#eef4ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">{kind}</span>
                    {discount > 0 ? <span className="rounded-lg border border-[#ee3623] bg-white px-2 py-1 text-xs font-medium text-[#ee3623]">{discount.toLocaleString("fa-IR")}٪ تخفیف</span> : null}
                  </div>

                  <h3 className="m-0 mt-5 text-lg font-bold text-[#0048c4]">{text(item, ["title"], "بدون عنوان")}</h3>

                  <div className="mt-5 flex min-h-[58px] items-end justify-between gap-3 [direction:ltr]">
                    {discount > 0 ? <span className="mb-1 text-sm font-semibold text-[#a6a6a6] line-through">{realPrice.toLocaleString("fa-IR")}</span> : <span />}
                    <div className="text-right [direction:rtl]">
                      <strong className="text-2xl font-bold text-[#1a1a1a]">{finalPrice.toLocaleString("fa-IR")}</strong>
                      <span className="mr-1 text-xs font-medium text-[#4d4d4d]">تومان</span>
                    </div>
                  </div>

                  <div className="my-5 border-t border-dashed border-[#cccccc]" />

                  <div className="rounded-xl border border-[#11a366] bg-[#11a36614] p-4 text-[#006038]">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#11a366]">
                      <GreenCheckIcon className="h-5 w-5" />
                      <span>{isCreditBundle && Boolean(item.gift ?? item.is_gift) ? "اعتبارهای هدیه" : "اعتبارهای بسته"}</span>
                    </div>
                    <div className="grid gap-2.5">
                      {creditItems.map((credit) => (
                        <div className="flex items-center justify-between gap-3 text-sm font-medium" key={credit.label}>
                          <span>{credit.label}</span>
                          <strong className="text-[#006038]">{credit.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isCreditBundle && (text(item, ["start_date"]) || text(item, ["end_date"])) ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-[#707a8a]">
                      <span>از {text(item, ["start_date"], "-")}</span>
                      <span>تا {text(item, ["end_date"], "-")}</span>
                    </div>
                  ) : null}

                  <div className="mt-auto flex gap-2 pt-5">
                    <motion.button className="h-10 flex-1 rounded-lg border border-[#0048c4] bg-white text-sm font-bold text-[#0048c4] transition group-hover:bg-[#0048c4] group-hover:text-white" onClick={() => open(item)} type="button" whileTap={{ scale: 0.97 }}>ویرایش</motion.button>
                    <motion.button
                      className="h-10 rounded-lg border border-[#d93645] bg-white px-4 text-sm font-bold text-[#d93645]"
                      disabled={deleteMutation.isPending}
                      onClick={async () => {
                        if (!window.confirm("این مورد حذف شود؟")) return;
                        try { await deleteMutation.mutateAsync(id); }
                        catch (error) { notify(getApiErrorMessage(error, "حذف ناموفق بود."), "error"); }
                      }}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                    >حذف</motion.button>
                  </div>
                </motion.article>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa] px-4 py-12 text-center text-sm text-[#7b8494]">بسته‌ای برای نمایش وجود ندارد.</div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {editing !== undefined ? (
          <PackageModal
            draft={draft}
            isPending={saveMutation.isPending}
            onChange={setDraft}
            onClose={() => setEditing(undefined)}
            onSubmit={async () => {
              try {
                await saveMutation.mutateAsync({ id: editing ? getCrmRecordId(editing) : null, payload: packagePayload(draft) });
              } catch (error) {
                notify(getApiErrorMessage(error, error instanceof Error ? error.message : "ذخیره ناموفق بود."), "error");
              }
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function GreenCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 1.4 12.4 3l2.9-.1.8 2.8 2 2-1.3 2.6.4 2.9-2.8 1-1.8 2.2-2.6-1.2-2.6 1.2-1.8-2.2-2.8-1 .4-2.9-1.3-2.6 2-2 .8-2.8 2.9.1L10 1.4Z" />
      <path d="m6.2 10 2.4 2.3 5.1-5.2" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function PackageModal({ draft, isPending, onChange, onClose, onSubmit }: { draft: PackageDraft; isPending: boolean; onChange: (draft: PackageDraft) => void; onClose: () => void; onSubmit: () => Promise<void> }) {
  const field = (key: keyof PackageDraft, value: string | boolean) => onChange({ ...draft, [key]: value });
  return <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 p-8" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <motion.form animate={{ opacity: 1, scale: 1, y: 0 }} className="max-h-[calc(100vh-64px)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" exit={{ opacity: 0, scale: 0.98, y: 8 }} initial={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.2 }} onSubmit={(event) => { event.preventDefault(); void onSubmit(); }}>
      <div className="flex items-center justify-between"><h2 className="m-0 text-lg font-bold">{draft.title ? "ویرایش مورد" : "افزودن مورد جدید"}</h2><button className="text-2xl text-[#596477]" onClick={onClose} type="button">×</button></div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Field label="نوع"><select className={inputClass} onChange={(e) => field("kind", e.target.value as CrmPackageKind)} value={draft.kind}><option value="panel_subscription">بسته</option><option value="credit_bundle">اعتبار پنل</option></select></Field>
        <Field label="عنوان"><input className={inputClass} onChange={(e) => field("title", e.target.value)} value={draft.title} /></Field>
        <Field label="قیمت (تومان)"><input className={inputClass} inputMode="numeric" onChange={(e) => field("price", e.target.value)} value={draft.price} /></Field>
        <Field label="تخفیف (اختیاری)"><input className={inputClass} inputMode="numeric" onChange={(e) => field("discount", e.target.value)} value={draft.discount} /></Field>
        {draft.kind === "credit_bundle" ? <><Field label="تاریخ شروع شمسی"><input className={inputClass} dir="ltr" placeholder="1405/01/01" onChange={(e) => field("startDate", e.target.value)} value={draft.startDate} /></Field><Field label="تاریخ پایان شمسی"><input className={inputClass} dir="ltr" placeholder="1405/12/29" onChange={(e) => field("endDate", e.target.value)} value={draft.endDate} /></Field><div className="col-span-2 flex items-center justify-between rounded-xl border border-[#e1e5eb] p-4"><div><strong className="block text-sm">هدیه</strong><span className="mt-1 block text-xs text-[#7b8494]">اعتبار رایگان همراه این مورد ارائه شود.</span></div><SwitchButton ariaLabel="فعال‌سازی هدیه" checked={draft.gift} onChange={(value) => field("gift", value)} /></div></> : null}
        {(draft.kind === "panel_subscription" || draft.gift) ? <><Field label={draft.gift ? "هدیه آگهی (اختیاری)" : "تعداد آگهی"}><input className={inputClass} inputMode="numeric" onChange={(e) => field("ad", e.target.value)} value={draft.ad} /></Field><Field label={draft.gift ? "هدیه ویژه (اختیاری)" : "تعداد ویژه"}><input className={inputClass} inputMode="numeric" onChange={(e) => field("special", e.target.value)} value={draft.special} /></Field><Field label={draft.gift ? "هدیه بروزرسانی (اختیاری)" : "تعداد بروزرسانی"}><input className={inputClass} inputMode="numeric" onChange={(e) => field("update", e.target.value)} value={draft.update} /></Field></> : null}
      </div>
      <div className="mt-6 flex justify-end gap-3"><button className="h-10 rounded-xl border border-[#d7dce5] px-5 text-sm font-bold" onClick={onClose} type="button">انصراف</button><button className="h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "در حال ذخیره..." : "ذخیره"}</button></div>
    </motion.form>
  </motion.div>;
}

function Field({ children, label }: { children: ReactNode; label: string }) { return <label><span className="mb-2 block text-sm font-bold text-[#4f5a6c]">{label}</span>{children}</label>; }

export function CrmCostsView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryFn: listCrmCheckoutProducts, queryKey: ["crm", "costs", refreshNonce] });
  const [editing, setEditing] = useState<CrmRecord | null>(null);
  useEffect(() => { if (query.error) notify(getApiErrorMessage(query.error, "دریافت هزینه‌ها ناموفق بود."), "error"); }, [notify, query.error]);
  const saveMutation = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: CrmCheckoutProductPayload }) => updateCrmCheckoutProduct(slug, payload),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["crm", "costs"] }); setEditing(null); notify("هزینه با موفقیت به‌روزرسانی شد."); },
  });
  const statusMutation = useMutation({
    mutationFn: ({ slug, active }: { slug: string; active: boolean }) => updateCrmCheckoutProductStatus(slug, active),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["crm", "costs"] }); notify("وضعیت هزینه به‌روزرسانی شد."); },
  });

  return <>
    <section className="rounded-xl bg-white p-5">
      <div className="border-b border-[#f0f0f0] pb-5"><h2 className="m-0 text-lg font-bold">مدیریت هزینه‌ها</h2><p className="m-0 mt-2 text-sm text-[#7b8494]">محصولات پرداخت ثبت، نردبان، ویژه، تمدید و خدمات ترکیبی آگهی را مدیریت کنید.</p></div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-[#edf0f5]">
        <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right text-sm">
          <thead><tr className="bg-[#fafbfc] text-[#697587]"><th className="px-4 py-3">عنوان</th><th className="px-4 py-3">شناسه</th><th className="px-4 py-3">قیمت</th><th className="px-4 py-3">اعتبار</th><th className="px-4 py-3">مدت</th><th className="px-4 py-3">وضعیت</th><th className="px-4 py-3">عملیات</th></tr></thead>
          <tbody>
            {query.isLoading ? <tr><td className="px-4 py-10 text-center text-[#7b8494]" colSpan={7}>در حال دریافت هزینه‌ها...</td></tr> : query.data?.length ? query.data.map((product) => {
              const slug = text(product, ["slug"]);
              const active = Boolean(product.is_active);
              const days = Number(product.duration_days ?? 0);
              const months = Number(product.duration_months ?? 0);
              return <tr className="border-b border-[#edf0f5]" key={slug}>
                <td className="border-t border-[#edf0f5] px-4 py-4"><strong>{text(product, ["title"], "بدون عنوان")}</strong><small className="mt-1 block text-[#8a94a3]">{text(product, ["description"], "-")}</small></td>
                <td className="border-t border-[#edf0f5] px-4 py-4 font-mono text-xs" dir="ltr">{slug}</td>
                <td className="border-t border-[#edf0f5] px-4 py-4 font-bold">{Number(product.price ?? 0).toLocaleString("fa-IR")} تومان</td>
                <td className="border-t border-[#edf0f5] px-4 py-4">{Number(product.credit_cost ?? 0).toLocaleString("fa-IR")}</td>
                <td className="border-t border-[#edf0f5] px-4 py-4">{months ? `${months.toLocaleString("fa-IR")} ماه` : days ? `${days.toLocaleString("fa-IR")} روز` : "-"}</td>
                <td className="border-t border-[#edf0f5] px-4 py-4"><SwitchButton ariaLabel={`وضعیت ${text(product, ["title"])}`} checked={active} onChange={(next) => statusMutation.mutate({ slug, active: next })} /></td>
                <td className="border-t border-[#edf0f5] px-4 py-4"><button className="h-9 rounded-lg border border-[#0048c4] px-4 font-bold text-[#0048c4]" onClick={() => setEditing(product)} type="button">ویرایش</button></td>
              </tr>;
            }) : <tr><td className="px-4 py-10 text-center text-[#7b8494]" colSpan={7}>محصولی برای نمایش وجود ندارد.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
    <AnimatePresence>{editing ? <CheckoutProductModal isPending={saveMutation.isPending} item={editing} onClose={() => setEditing(null)} onSubmit={async (payload) => {
      try { await saveMutation.mutateAsync({ slug: text(editing, ["slug"]), payload }); }
      catch (error) { notify(getApiErrorMessage(error, "ذخیره هزینه ناموفق بود."), "error"); }
    }} /> : null}</AnimatePresence>
  </>;
}

function CheckoutProductModal({ isPending, item, onClose, onSubmit }: { isPending: boolean; item: CrmRecord; onClose: () => void; onSubmit: (payload: CrmCheckoutProductPayload) => Promise<void> }) {
  const [draft, setDraft] = useState(() => ({
    title: text(item, ["title"]), description: text(item, ["description"]), price: text(item, ["price"]),
    creditCost: text(item, ["credit_cost"]), durationDays: text(item, ["duration_days"]), durationMonths: text(item, ["duration_months"]), sortOrder: text(item, ["sort_order"]),
  }));
  const set = (key: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  return <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 p-8" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <form className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => { event.preventDefault(); void onSubmit({
      title: draft.title.trim(), description: draft.description.trim(), price: numberValue(draft.price, "قیمت"), credit_cost: numberValue(draft.creditCost, "اعتبار"),
      duration_days: draft.durationDays ? numberValue(draft.durationDays, "مدت روز") : null, duration_months: draft.durationMonths ? numberValue(draft.durationMonths, "مدت ماه") : null,
      is_active: Boolean(item.is_active), sort_order: numberValue(draft.sortOrder || "0", "ترتیب"), metadata: item.metadata && typeof item.metadata === "object" && !Array.isArray(item.metadata) ? item.metadata as Record<string, unknown> : {},
    }); }}>
      <div className="flex items-center justify-between"><h2 className="m-0 text-lg font-bold">ویرایش {draft.title}</h2><button className="text-2xl text-[#596477]" onClick={onClose} type="button">×</button></div>
      <div className="mt-5 grid grid-cols-2 gap-4"><Field label="عنوان"><input className={inputClass} onChange={(e) => set("title", e.target.value)} value={draft.title} /></Field><Field label="قیمت (تومان)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("price", e.target.value)} value={draft.price} /></Field><Field label="هزینه اعتباری"><input className={inputClass} inputMode="numeric" onChange={(e) => set("creditCost", e.target.value)} value={draft.creditCost} /></Field><Field label="ترتیب نمایش"><input className={inputClass} inputMode="numeric" onChange={(e) => set("sortOrder", e.target.value)} value={draft.sortOrder} /></Field><Field label="مدت (روز)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationDays", e.target.value)} value={draft.durationDays} /></Field><Field label="مدت (ماه)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationMonths", e.target.value)} value={draft.durationMonths} /></Field><label className="col-span-2"><span className="mb-2 block text-sm font-bold text-[#4f5a6c]">توضیحات</span><textarea className={`${inputClass} min-h-24 py-3`} onChange={(e) => set("description", e.target.value)} value={draft.description} /></label></div>
      <div className="mt-6 flex justify-end gap-3"><button className="h-10 rounded-xl border border-[#d7dce5] px-5 text-sm font-bold" onClick={onClose} type="button">انصراف</button><button className="h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "در حال ذخیره..." : "ذخیره"}</button></div>
    </form>
  </motion.div>;
}
