import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "../../api/api";
import { SwitchButton } from "../../components/SwitchButton";
import { getPackages } from "../../services/package.service";
import {
  deleteCrmPackage,
  getCrmCosts,
  getCrmRecordId,
  saveCrmPackage,
  updateCrmCosts,
  type CrmCostPayload,
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
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] }); notify("بسته با موفقیت ذخیره شد."); setEditing(undefined); },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCrmPackage,
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] }); notify("بسته حذف شد."); },
  });

  useEffect(() => { if (query.error) notify(getApiErrorMessage(query.error, "دریافت بسته‌ها ناموفق بود."), "error"); }, [notify, query.error]);
  const open = (item: CrmRecord | null) => { setEditing(item); setDraft(item ? draftFromPackage(item) : emptyDraft); };

  return <>
    <section className="rounded-xl bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] pb-5">
        <div><h2 className="m-0 text-lg font-bold">بسته‌ها و اعتبار پنل</h2><p className="m-0 mt-2 text-sm text-[#7b8494]">بسته‌های اشتراک و اعتبارهای زمان‌دار را ایجاد و ویرایش کنید.</p></div>
        <button className="h-10 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white" onClick={() => open(null)} type="button">+ افزودن مورد</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {query.isLoading ? <p className="text-sm text-[#7b8494]">در حال دریافت اطلاعات...</p> : query.data?.map((item) => {
          const id = getCrmRecordId(item); const kind = item.kind === "credit_bundle" ? "اعتبار پنل" : "بسته";
          const discount = Number(text(item, ["discount_percent"], "0"));
          const finalPrice = Number(text(item, ["final_price", "real_price"], "0"));
          return <article className="rounded-xl border border-[#d9dde7] bg-white p-5 first:border-[#0048c4] first:bg-[#eef4ff]" key={id}>
            <div className="flex items-center justify-between"><span className="text-xs font-bold text-[#0048c4]">{kind}</span>{discount ? <span className="rounded-lg bg-[#fff0f0] px-2 py-1 text-xs text-[#ee3623]">{discount.toLocaleString("fa-IR")}٪ تخفیف</span> : null}</div>
            <h3 className="m-0 mt-4 text-base font-bold text-[#0048c4]">{text(item, ["title"], "بدون عنوان")}</h3>
            <div className="mt-4 text-left"><span className="block text-sm text-[#a6a6a6] line-through">{Number(text(item, ["real_price"], "0")).toLocaleString("fa-IR")}</span><strong className="text-xl text-[#1a1a1a]">{finalPrice.toLocaleString("fa-IR")} <small className="text-xs">تومان</small></strong></div>
            <div className="my-4 border-t border-dashed border-[#cccccc]" />
            <div className="space-y-3 text-sm"><p className="m-0">🟢 {text(item, ["ad_credit"], "۰")} اعتبار آگهی</p><p className="m-0">🟢 {text(item, ["special_credit"], "۰")} اعتبار ویژه</p><p className="m-0">🟢 {text(item, ["renew_credit"], "۰")} اعتبار بروزرسانی</p></div>
            <div className="mt-4 flex gap-2"><button className="h-9 flex-1 rounded-lg border border-[#0048c4] text-sm font-bold text-[#0048c4]" onClick={() => open(item)} type="button">ویرایش</button><button className="h-9 rounded-lg border border-[#d93645] px-4 text-sm font-bold text-[#d93645]" disabled={deleteMutation.isPending} onClick={async () => { if (!window.confirm("این مورد حذف شود؟")) return; try { await deleteMutation.mutateAsync(id); } catch (error) { notify(getApiErrorMessage(error, "حذف ناموفق بود."), "error"); } }} type="button">حذف</button></div>
          </article>;
        })}
      </div>
    </section>
    {editing !== undefined ? <PackageModal draft={draft} isPending={saveMutation.isPending} onChange={setDraft} onClose={() => setEditing(undefined)} onSubmit={async () => { try { await saveMutation.mutateAsync({ id: editing ? getCrmRecordId(editing) : null, payload: packagePayload(draft) }); } catch (error) { notify(getApiErrorMessage(error, error instanceof Error ? error.message : "ذخیره ناموفق بود."), "error"); } }} /> : null}
  </>;
}

function PackageModal({ draft, isPending, onChange, onClose, onSubmit }: { draft: PackageDraft; isPending: boolean; onChange: (draft: PackageDraft) => void; onClose: () => void; onSubmit: () => Promise<void> }) {
  const field = (key: keyof PackageDraft, value: string | boolean) => onChange({ ...draft, [key]: value });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#172033]/45 p-8" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <form className="max-h-[calc(100vh-64px)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onSubmit={(event) => { event.preventDefault(); void onSubmit(); }}>
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
    </form>
  </div>;
}

function Field({ children, label }: { children: ReactNode; label: string }) { return <label><span className="mb-2 block text-sm font-bold text-[#4f5a6c]">{label}</span>{children}</label>; }

export function CrmCostsView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient(); const query = useQuery({ queryFn: getCrmCosts, queryKey: ["crm", "costs", refreshNonce] });
  const [values, setValues] = useState({ ad_price: "", special_price: "", update_price: "" });
  useEffect(() => { if (!query.data) return; setValues({ ad_price: text(query.data, ["ad_price", "ad"]), special_price: text(query.data, ["special_price", "special"]), update_price: text(query.data, ["update_price", "renew_price", "update"]) }); }, [query.data]);
  useEffect(() => { if (query.error) notify(getApiErrorMessage(query.error, "دریافت هزینه‌ها ناموفق بود."), "error"); }, [notify, query.error]);
  const mutation = useMutation({ mutationFn: updateCrmCosts, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["crm", "costs"] }); notify("هزینه‌ها با موفقیت بروزرسانی شدند."); } });
  const submit = async (event: FormEvent) => { event.preventDefault(); try { const payload: CrmCostPayload = { ad_price: numberValue(values.ad_price, "هزینه آگهی"), special_price: numberValue(values.special_price, "هزینه ویژه"), update_price: numberValue(values.update_price, "هزینه بروزرسانی") }; await mutation.mutateAsync(payload); } catch (error) { notify(getApiErrorMessage(error, error instanceof Error ? error.message : "ذخیره هزینه‌ها ناموفق بود."), "error"); } };
  return <section className="rounded-xl bg-white p-5"><div className="border-b border-[#f0f0f0] pb-5"><h2 className="m-0 text-lg font-bold">مدیریت هزینه‌ها</h2><p className="m-0 mt-2 text-sm text-[#7b8494]">هزینه مصرف اعتبار برای هر عملیات را از یک محل مدیریت کنید.</p></div><form className="mt-6 max-w-3xl" onSubmit={submit}><div className="grid grid-cols-3 gap-4"><Field label="هزینه ثبت آگهی"><input className={inputClass} inputMode="numeric" onChange={(e) => setValues((v) => ({ ...v, ad_price: e.target.value }))} value={values.ad_price} /></Field><Field label="هزینه ویژه کردن"><input className={inputClass} inputMode="numeric" onChange={(e) => setValues((v) => ({ ...v, special_price: e.target.value }))} value={values.special_price} /></Field><Field label="هزینه بروزرسانی"><input className={inputClass} inputMode="numeric" onChange={(e) => setValues((v) => ({ ...v, update_price: e.target.value }))} value={values.update_price} /></Field></div><button className="mt-6 h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60" disabled={mutation.isPending || query.isLoading} type="submit">{mutation.isPending ? "در حال ذخیره..." : "ذخیره هزینه‌ها"}</button></form></section>;
}
