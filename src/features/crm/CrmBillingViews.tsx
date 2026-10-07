import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { getApiErrorMessage } from "../../shared/api/api";
import { SwitchButton } from "../../shared/components/SwitchButton";
import { Button } from "../../shared/ui/Button";
import { Typography } from "../../shared/ui/Typography";
import {
  listCrmCheckoutProducts,
  updateCrmCheckoutProduct,
  updateCrmCheckoutProductStatus,
  type CrmCheckoutProductPayload,
  type CrmRecord,
} from "./api/crm.service";
import { CheckoutProductModal, text } from "./CheckoutProductModal";

export { CrmPackagesView } from "./packages/CrmPackagesView";

type Notify = (message: string, tone?: "error" | "success") => void;
type ViewProps = { notify: Notify; refreshNonce: number };

export function CrmCostsView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryFn: listCrmCheckoutProducts, queryKey: ["crm", "costs", refreshNonce] });
  const [editing, setEditing] = useState<CrmRecord | null>(null);

  useEffect(() => {
    if (query.error) notify(getApiErrorMessage(query.error, "دریافت هزینه‌ها ناموفق بود."), "error");
  }, [notify, query.error]);

  const saveMutation = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: CrmCheckoutProductPayload }) =>
      updateCrmCheckoutProduct(slug, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "costs"] });
      setEditing(null);
      notify("هزینه با موفقیت به‌روزرسانی شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ slug, active }: { slug: string; active: boolean }) =>
      updateCrmCheckoutProductStatus(slug, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "costs"] });
      notify("وضعیت هزینه به‌روزرسانی شد.");
    },
  });

  return (
    <>
      <section className="rounded-xl bg-white p-5">
        <div className="border-b border-[#f0f0f0] pb-5">
          <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold">
            مدیریت هزینه‌ها
          </Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm text-[#7b8494]">
            محصولات پرداخت ثبت، نردبان، ویژه، تمدید و خدمات ترکیبی آگهی را مدیریت کنید.
          </Typography>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl border border-[#edf0f5]">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-right text-sm">
            <thead>
              <tr className="bg-[#fafbfc] text-[#697587]">
                <th className="px-4 py-3">عنوان</th>
                <th className="px-4 py-3">شناسه</th>
                <th className="px-4 py-3">قیمت</th>
                <th className="px-4 py-3">اعتبار</th>
                <th className="px-4 py-3">مدت</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <tr><td className="px-4 py-10 text-center text-[#7b8494]" colSpan={7}>در حال دریافت هزینه‌ها...</td></tr>
              ) : query.data?.length ? (
                query.data.map((product) => {
                  const slug = text(product, ["slug"]);
                  const active = Boolean(product.is_active);
                  const days = Number(product.duration_days ?? 0);
                  const months = Number(product.duration_months ?? 0);
                  return (
                    <tr className="border-b border-[#edf0f5]" key={slug}>
                      <td className="border-t border-[#edf0f5] px-4 py-4">
                        <strong>{text(product, ["title"], "بدون عنوان")}</strong>
                        <small className="mt-1 block text-[#8a94a3]">{text(product, ["description"], "-")}</small>
                      </td>
                      <td className="border-t border-[#edf0f5] px-4 py-4 font-mono text-xs" dir="ltr">{slug}</td>
                      <td className="border-t border-[#edf0f5] px-4 py-4 font-bold">{Number(product.price ?? 0).toLocaleString("fa-IR")} تومان</td>
                      <td className="border-t border-[#edf0f5] px-4 py-4">{Number(product.credit_cost ?? 0).toLocaleString("fa-IR")}</td>
                      <td className="border-t border-[#edf0f5] px-4 py-4">{months ? `${months.toLocaleString("fa-IR")} ماه` : days ? `${days.toLocaleString("fa-IR")} روز` : "-"}</td>
                      <td className="border-t border-[#edf0f5] px-4 py-4">
                        <SwitchButton ariaLabel={`وضعیت ${text(product, ["title"])}`} checked={active} onChange={(next) => statusMutation.mutate({ slug, active: next })} />
                      </td>
                      <td className="border-t border-[#edf0f5] px-4 py-4">
                        <Button unstyled className="h-9 rounded-lg border border-[#0048c4] px-4 font-bold text-[#0048c4]" onClick={() => setEditing(product)} type="button">ویرایش</Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td className="px-4 py-10 text-center text-[#7b8494]" colSpan={7}>محصولی برای نمایش وجود ندارد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <AnimatePresence>
        {editing ? (
          <CheckoutProductModal
            isPending={saveMutation.isPending}
            item={editing}
            onClose={() => setEditing(null)}
            onSubmit={async (payload) => {
              try {
                await saveMutation.mutateAsync({ slug: text(editing, ["slug"]), payload });
              } catch (error) {
                notify(getApiErrorMessage(error, "ذخیره هزینه ناموفق بود."), "error");
              }
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
