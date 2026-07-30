import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { getApiErrorMessage } from "../../api/api";
import { SwitchButton } from "../../components/SwitchButton";
import {
  deleteCrmPackage,
  getCrmPackage,
  getCrmRecordId,
  listCrmCheckoutProducts,
  listCrmPackages,
  saveCrmPackage,
  updateCrmCheckoutProduct,
  updateCrmCheckoutProductStatus,
  updateCrmPackageStatus,
  type CrmCheckoutProductPayload,
  type CrmPackageKind,
  type CrmPackagePayload,
  type CrmRecord,
} from "../../services/crm.service";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";

type Notify = (message: string, tone?: "error" | "success") => void;
type ViewProps = { notify: Notify; refreshNonce: number };

type PackageDraft = {
  adCredit: string;
  discountPercent: string;
  durationDays: string;
  id: string;
  isActive: boolean;
  kind: CrmPackageKind;
  realPrice: string;
  renewCredit: string;
  slug: string;
  sortOrder: string;
  specialCredit: string;
  title: string;
};

const emptyDraft: PackageDraft = {
  adCredit: "",
  discountPercent: "",
  durationDays: "",
  id: "",
  isActive: true,
  kind: "panel_subscription",
  realPrice: "",
  renewCredit: "",
  slug: "",
  sortOrder: "",
  specialCredit: "",
  title: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

function text(record: CrmRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

function numberValue(value: string, label: string) {
  const parsed = Number(value.replace(/,/g, ""));

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} باید عدد صفر یا بزرگ‌تر باشد.`);
  }

  return parsed;
}

function integerValue(value: string, label: string) {
  const parsed = numberValue(value, label);

  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} باید عدد صحیح باشد.`);
  }

  return parsed;
}

function positiveIntegerValue(value: string, label: string) {
  const parsed = integerValue(value, label);

  if (parsed < 1) {
    throw new Error(`${label} باید حداقل ۱ باشد.`);
  }

  return parsed;
}

function nullableNumberValue(value: string, label: string) {
  return value.trim() ? numberValue(value, label) : null;
}

function nullableIntegerValue(value: string, label: string) {
  return value.trim() ? integerValue(value, label) : null;
}

function nullablePositiveIntegerValue(value: string, label: string) {
  return value.trim() ? positiveIntegerValue(value, label) : null;
}

function nullableDiscountValue(value: string) {
  if (!value.trim()) return null;

  const parsed = numberValue(value, "درصد تخفیف");

  if (parsed > 100) {
    throw new Error("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.");
  }

  return parsed;
}

function visibleNumberText(record: CrmRecord, key: string) {
  const value = record[key];
  const parsed = Number(value);

  return value !== null && value !== undefined && Number.isFinite(parsed) && parsed !== 0
    ? String(value)
    : "";
}

function packageRecordId(item: CrmRecord) {
  return getCrmRecordId(item) || text(item, ["slug"]);
}

function draftFromPackage(item: CrmRecord): PackageDraft {
  return {
    adCredit: visibleNumberText(item, "ad_credit"),
    discountPercent: visibleNumberText(item, "discount_percent"),
    durationDays: visibleNumberText(item, "duration_days"),
    id: text(item, ["id", "_id"]),
    isActive: item.is_active !== false,
    kind: item.kind === "credit_bundle" ? "credit_bundle" : "panel_subscription",
    realPrice: visibleNumberText(item, "real_price"),
    renewCredit: visibleNumberText(item, "renew_credit"),
    slug: text(item, ["slug"]),
    sortOrder: visibleNumberText(item, "sort_order"),
    specialCredit: visibleNumberText(item, "special_credit"),
    title: text(item, ["title"]),
  };
}

function packagePayload(draft: PackageDraft): CrmPackagePayload {
  const id = draft.id.trim();
  const slug = draft.slug.trim();
  const title = draft.title.trim();

  if (!id) throw new Error("شناسه بسته الزامی است.");
  if (!slug) throw new Error("اسلاگ بسته الزامی است.");
  if (!title) throw new Error("عنوان بسته الزامی است.");

  const isPanelSubscription = draft.kind === "panel_subscription";

  return {
    id,
    slug,
    kind: draft.kind,
    title,
    real_price: nullableNumberValue(draft.realPrice, "قیمت"),
    discount_percent: nullableDiscountValue(draft.discountPercent),
    duration_days: isPanelSubscription
      ? nullablePositiveIntegerValue(draft.durationDays, "مدت بسته")
      : null,
    ad_credit: isPanelSubscription ? null : nullableIntegerValue(draft.adCredit, "اعتبار آگهی"),
    special_credit: isPanelSubscription ? null : nullableIntegerValue(draft.specialCredit, "اعتبار ویژه"),
    renew_credit: isPanelSubscription ? null : nullableIntegerValue(draft.renewCredit, "اعتبار بروزرسانی"),
    sort_order: nullableIntegerValue(draft.sortOrder, "ترتیب نمایش"),
    is_active: draft.isActive,
  };
}

export function CrmPackagesView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CrmRecord | null | undefined>(undefined);
  const [draft, setDraft] = useState<PackageDraft>(emptyDraft);
  const [viewKind, setViewKind] = useState<CrmPackageKind>("panel_subscription");

  const query = useQuery({
    queryFn: listCrmPackages,
    queryKey: ["crm", "packages", refreshNonce],
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmPackagePayload }) =>
      saveCrmPackage(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });
      notify("بسته با موفقیت ذخیره شد.");
      setEditing(undefined);
    },
  });

  const detailMutation = useMutation({
    mutationFn: getCrmPackage,
    onSuccess: (item) => {
      setEditing(item);
      setDraft(draftFromPackage(item));
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "دریافت جزئیات بسته ناموفق بود."), "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCrmPackage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });
      notify("بسته غیرفعال شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateCrmPackageStatus(id, isActive),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "packages"] });
      notify(variables.isActive ? "بسته فعال شد." : "بسته غیرفعال شد.");
    },
  });

  useEffect(() => {
    if (query.error) {
      notify(getApiErrorMessage(query.error, "دریافت بسته‌ها ناموفق بود."), "error");
    }
  }, [notify, query.error]);

  const open = (item: CrmRecord | null) => {
    if (!item) {
      setEditing(null);
      setDraft({ ...emptyDraft, kind: viewKind });
      return;
    }

    const id = packageRecordId(item);

    if (!id) {
      setEditing(item);
      setDraft(draftFromPackage(item));
      return;
    }

    detailMutation.mutate(id);
  };

  const visiblePackages = (query.data ?? []).filter((item) =>
    viewKind === "credit_bundle"
      ? item.kind === "credit_bundle"
      : item.kind !== "credit_bundle",
  );

  return (
    <>
      <section className="rounded-xl bg-white p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#f0f0f0] pb-5">
          <div>
            <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold text-[#1a1a1a]">بسته‌ها و اعتبار پنل</Typography>
            <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm text-[#7b8494]">
              تمام بسته‌های فعال و غیرفعال پنل را ایجاد، ویرایش و مدیریت کنید.
            </Typography>
          </div>
          <motion.button
            className="h-10 rounded-xl bg-[#0048c4] px-4 text-sm font-bold text-white"
            onClick={() => open(null)}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            + افزودن بسته
          </motion.button>
        </div>

        <div className="mt-5 grid h-11 max-w-md grid-cols-2 overflow-hidden rounded-xl border border-[#0048c4]" role="tablist" aria-label="نمایش نوع بسته">
          <Button unstyled
            aria-selected={viewKind === "panel_subscription"}
            className={`text-sm font-bold transition ${
              viewKind === "panel_subscription"
                ? "bg-[#0048c4] text-white"
                : "bg-white text-[#0048c4]"
            }`}
            onClick={() => setViewKind("panel_subscription")}
            role="tab"
            type="button"
          >
            اعتبار پنل
          </Button>
          <Button unstyled
            aria-selected={viewKind === "credit_bundle"}
            className={`border-r border-[#0048c4] text-sm font-bold transition ${
              viewKind === "credit_bundle"
                ? "bg-[#0048c4] text-white"
                : "bg-white text-[#0048c4]"
            }`}
            onClick={() => setViewKind("credit_bundle")}
            role="tab"
            type="button"
          >
            بسته‌ها
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {query.isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-[405px] animate-pulse rounded-2xl border border-[#e4e7ed] bg-[#fafbfc] p-5"
                key={index}
              >
                <div className="h-5 w-24 rounded bg-[#e9edf3]" />
                <div className="mt-5 h-6 w-2/3 rounded bg-[#e9edf3]" />
                <div className="mt-8 h-12 w-1/2 rounded bg-[#eef1f5]" />
                <div className="mt-6 h-40 rounded-xl bg-[#eaf5ef]" />
              </div>
            ))
          ) : visiblePackages.length ? (
            visiblePackages.map((item, index) => {
              const id = packageRecordId(item);
              const isActive = item.is_active !== false;
              const isCreditBundle = item.kind === "credit_bundle";
              const kind = isCreditBundle ? "بسته اعتباری" : "اعتبار پنل";
              const discount = Number(item.discount_percent ?? 0);
              const realPrice = Number(item.real_price ?? 0);
              const hasApiFinalPrice = item.final_price !== undefined && item.final_price !== null;
              const apiFinalPrice = Number(item.final_price ?? 0);
              const finalPrice = hasApiFinalPrice && Number.isFinite(apiFinalPrice)
                ? apiFinalPrice
                : Math.max(0, Math.round(realPrice * (1 - discount / 100)));
              const hasPrice = Number.isFinite(finalPrice) && finalPrice > 0;
              const durationDays = Number(item.duration_days ?? 0);
              const creditItems = [
                { label: "اعتبار آگهی", value: Number(item.ad_credit ?? 0) },
                { label: "اعتبار ویژه", value: Number(item.special_credit ?? 0) },
                { label: "اعتبار بروزرسانی", value: Number(item.renew_credit ?? 0) },
              ].filter((credit) => Number.isFinite(credit.value) && credit.value > 0);
              const isLoadingDetail = detailMutation.isPending && detailMutation.variables === id;
              const isChangingStatus = statusMutation.isPending && statusMutation.variables?.id === id;
              const isDeactivating = deleteMutation.isPending && deleteMutation.variables === id;

              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className={`group flex min-h-[405px] flex-col rounded-2xl border p-5 transition-shadow ${
                    isActive
                      ? "border-[#d9dde7] bg-gradient-to-b from-white to-[#f5f7fb] hover:border-[#0048c4] hover:shadow-[0_14px_36px_rgba(0,72,196,0.10)]"
                      : "border-[#e2e2e2] bg-[#f7f7f7] opacity-80"
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  key={id || `${text(item, ["slug"], "package")}-${index}`}
                  transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.28, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Typography as="span" variant="label" size="small" weight="semibold" className="rounded-lg bg-[#eef4ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">
                        {kind}
                      </Typography>
                      <Typography as="span" variant="label" size="small" weight="semibold"
                        className={`rounded-lg px-2 py-1 text-xs font-bold ${
                          isActive ? "bg-[#e9f8f1] text-[#0b8555]" : "bg-[#eeeeee] text-[#777777]"
                        }`}
                      >
                        {isActive ? "فعال" : "غیرفعال"}
                      </Typography>
                    </div>
                    <div className={isChangingStatus ? "pointer-events-none opacity-50" : ""}>
                      <SwitchButton
                        ariaLabel={`وضعیت ${text(item, ["title"], "بسته")}`}
                        checked={isActive}
                        onChange={async (next) => {
                          if (!id) return;

                          try {
                            await statusMutation.mutateAsync({ id, isActive: next });
                          } catch (error) {
                            notify(getApiErrorMessage(error, "تغییر وضعیت بسته ناموفق بود."), "error");
                          }
                        }}
                      />
                    </div>
                  </div>

                  <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-5 text-lg font-bold text-[#0048c4]">
                    {text(item, ["title"], "بدون عنوان")}
                  </Typography>
                  <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 break-all font-mono text-xs text-[#8a94a3]" dir="ltr">
                    {text(item, ["slug"], id || "-")}
                  </Typography>

                  {hasPrice ? (
                    <div className="mt-5 flex min-h-[58px] items-end justify-between gap-3 [direction:ltr]">
                      {discount > 0 && realPrice > 0 ? (
                        <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-1 text-sm font-semibold text-[#a6a6a6] line-through">
                          {realPrice.toLocaleString("fa-IR")}
                        </Typography>
                      ) : (
                        <Typography as="span" variant="body" size="medium" weight="regular" />
                      )}
                      <div className="text-right [direction:rtl]">
                        <strong className="text-2xl font-bold text-[#1a1a1a]">
                          {finalPrice.toLocaleString("fa-IR")}
                        </strong>
                        <Typography as="span" variant="label" size="small" weight="medium" className="mr-1 text-xs font-medium text-[#4d4d4d]">تومان</Typography>
                      </div>
                    </div>
                  ) : null}

                  {discount > 0 ? (
                    <Typography as="span" variant="label" size="small" weight="medium" className="mt-2 w-fit rounded-lg border border-[#ee3623] bg-white px-2 py-1 text-xs font-medium text-[#ee3623]">
                      {discount.toLocaleString("fa-IR")}٪ تخفیف
                    </Typography>
                  ) : null}

                  {hasPrice || creditItems.length > 0 || durationDays > 0 ? (
                    <div className="my-4 border-t border-dashed border-[#cccccc]" />
                  ) : null}

                  {creditItems.length > 0 ? (
                    <div className="rounded-xl border border-[#11a366] bg-[#11a36614] p-4 text-[#006038]">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#11a366]">
                        <GreenCheckIcon className="h-5 w-5" />
                        <Typography as="span" variant="body" size="medium" weight="regular">اعتبارهای بسته</Typography>
                      </div>
                      <div className="grid gap-2.5">
                        {creditItems.map((credit) => (
                          <div
                            className="flex items-center justify-between gap-3 text-sm font-medium"
                            key={credit.label}
                          >
                            <Typography as="span" variant="body" size="medium" weight="regular">{credit.label}</Typography>
                            <strong className="text-[#006038]">
                              {credit.value.toLocaleString("fa-IR")}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {Number.isFinite(durationDays) && durationDays > 0 ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-[#707a8a]">
                      <Typography as="span" variant="body" size="medium" weight="regular">مدت بسته</Typography>
                      <strong className="text-[#4d4d4d]">
                        {durationDays.toLocaleString("fa-IR")} روز
                      </strong>
                    </div>
                  ) : null}

                  <div className="mt-auto flex gap-2 pt-5">
                    <motion.button
                      className="h-10 flex-1 rounded-lg border border-[#0048c4] bg-white text-sm font-bold text-[#0048c4] transition group-hover:bg-[#0048c4] group-hover:text-white disabled:opacity-60"
                      disabled={isLoadingDetail}
                      onClick={() => open(item)}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                    >
                      {isLoadingDetail ? "در حال دریافت..." : "ویرایش"}
                    </motion.button>
                    {isActive ? (
                      <motion.button
                        className="h-10 rounded-lg border border-[#d93645] bg-white px-4 text-sm font-bold text-[#d93645] disabled:opacity-60"
                        disabled={isDeactivating}
                        onClick={async () => {
                          if (!id || !window.confirm("این بسته غیرفعال شود؟")) return;

                          try {
                            await deleteMutation.mutateAsync(id);
                          } catch (error) {
                            notify(getApiErrorMessage(error, "غیرفعال‌سازی بسته ناموفق بود."), "error");
                          }
                        }}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                      >
                        {isDeactivating ? "در حال انجام..." : "غیرفعال‌سازی"}
                      </motion.button>
                    ) : null}
                  </div>
                </motion.article>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa] px-4 py-12 text-center text-sm text-[#7b8494]">
              بسته‌ای برای نمایش وجود ندارد.
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {editing !== undefined ? (
          <PackageModal
            draft={draft}
            isEditing={Boolean(editing)}
            isPending={saveMutation.isPending}
            onChange={setDraft}
            onClose={() => setEditing(undefined)}
            onSubmit={async () => {
              try {
                await saveMutation.mutateAsync({
                  id: editing ? packageRecordId(editing) : null,
                  payload: packagePayload(draft),
                });
              } catch (error) {
                notify(
                  getApiErrorMessage(
                    error,
                    error instanceof Error ? error.message : "ذخیره بسته ناموفق بود.",
                  ),
                  "error",
                );
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
      <path
        d="m6.2 10 2.4 2.3 5.1-5.2"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PackageModal({
  draft,
  isEditing,
  isPending,
  onChange,
  onClose,
  onSubmit,
}: {
  draft: PackageDraft;
  isEditing: boolean;
  isPending: boolean;
  onChange: (draft: PackageDraft) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}) {
  const field = (key: keyof PackageDraft, value: string | boolean) => {
    onChange({ ...draft, [key]: value });
  };

  const selectKind = (kind: CrmPackageKind) => {
    onChange({
      ...draft,
      kind,
      ...(kind === "panel_subscription"
        ? { adCredit: "", renewCredit: "", specialCredit: "" }
        : { durationDays: "" }),
    });
  };

  const isPanelSubscription = draft.kind === "panel_subscription";

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
      <motion.form
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[calc(100vh-64px)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
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

        <div className="mt-5">
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">نوع بسته</Typography>
          <div className="grid h-11 grid-cols-2 overflow-hidden rounded-xl border border-[#0048c4]" role="tablist" aria-label="نوع بسته">
            <Button unstyled
              aria-selected={isPanelSubscription}
              className={`text-sm font-bold transition ${
                isPanelSubscription ? "bg-[#0048c4] text-white" : "bg-white text-[#0048c4]"
              }`}
              onClick={() => selectKind("panel_subscription")}
              role="tab"
              type="button"
            >
              اعتبار پنل
            </Button>
            <Button unstyled
              aria-selected={!isPanelSubscription}
              className={`border-r border-[#0048c4] text-sm font-bold transition ${
                !isPanelSubscription ? "bg-[#0048c4] text-white" : "bg-white text-[#0048c4]"
              }`}
              onClick={() => selectKind("credit_bundle")}
              role="tab"
              type="button"
            >
              بسته‌ها
            </Button>
          </div>
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 text-xs text-[#7b8494]">
            {isPanelSubscription
              ? "برای اعتبار پنل فقط مدت زمان بسته ثبت می‌شود."
              : "برای بسته‌ها تعداد آگهی، ویژه و بروزرسانی ثبت می‌شود."}
          </Typography>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="شناسه بسته">
            <input
              className={inputClass}
              dir="ltr"
              onChange={(event) => field("id", event.target.value)}
              placeholder="panel-basic"
              value={draft.id}
            />
          </Field>
          <Field label="اسلاگ">
            <input
              className={inputClass}
              dir="ltr"
              onChange={(event) => field("slug", event.target.value)}
              placeholder="panel-basic"
              value={draft.slug}
            />
          </Field>
          <Field label="عنوان">
            <input
              className={inputClass}
              onChange={(event) => field("title", event.target.value)}
              placeholder="پکیج پایه"
              value={draft.title}
            />
          </Field>
          <Field label="قیمت اصلی (تومان)">
            <input
              className={inputClass}
              inputMode="numeric"
              onChange={(event) => field("realPrice", event.target.value)}
              value={draft.realPrice}
            />
          </Field>
          <Field label="درصد تخفیف">
            <input
              className={inputClass}
              inputMode="numeric"
              max="100"
              min="0"
              onChange={(event) => field("discountPercent", event.target.value)}
              value={draft.discountPercent}
            />
          </Field>
          {isPanelSubscription ? (
            <Field label="مدت بسته (روز)">
              <input
                className={inputClass}
                inputMode="numeric"
                min="1"
                onChange={(event) => field("durationDays", event.target.value)}
                value={draft.durationDays}
              />
            </Field>
          ) : null}
          <Field label="ترتیب نمایش">
            <input
              className={inputClass}
              inputMode="numeric"
              min="0"
              onChange={(event) => field("sortOrder", event.target.value)}
              value={draft.sortOrder}
            />
          </Field>
          {!isPanelSubscription ? (
            <>
              <Field label="تعداد آگهی">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => field("adCredit", event.target.value)}
                  value={draft.adCredit}
                />
              </Field>
              <Field label="تعداد ویژه">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => field("specialCredit", event.target.value)}
                  value={draft.specialCredit}
                />
              </Field>
              <Field label="تعداد بروزرسانی">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => field("renewCredit", event.target.value)}
                  value={draft.renewCredit}
                />
              </Field>
            </>
          ) : null}
          <div className="flex items-center justify-between rounded-xl border border-[#e1e5eb] p-4">
            <div>
              <strong className="block text-sm">وضعیت بسته</strong>
              <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-xs text-[#7b8494]">
                بسته فعال برای استفاده در پنل در دسترس است.
              </Typography>
            </div>
            <SwitchButton
              ariaLabel="وضعیت بسته"
              checked={draft.isActive}
              onChange={(value) => field("isActive", value)}
            />
          </div>
        </div>

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

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">{label}</Typography>
      {children}
    </label>
  );
}

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
      <div className="border-b border-[#f0f0f0] pb-5"><Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold">مدیریت هزینه‌ها</Typography><Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 text-sm text-[#7b8494]">محصولات پرداخت ثبت، نردبان، ویژه، تمدید و خدمات ترکیبی آگهی را مدیریت کنید.</Typography></div>
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
                <td className="border-t border-[#edf0f5] px-4 py-4"><Button unstyled className="h-9 rounded-lg border border-[#0048c4] px-4 font-bold text-[#0048c4]" onClick={() => setEditing(product)} type="button">ویرایش</Button></td>
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
      <div className="flex items-center justify-between"><Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold">ویرایش {draft.title}</Typography><Button unstyled className="text-2xl text-[#596477]" onClick={onClose} type="button">×</Button></div>
      <div className="mt-5 grid grid-cols-2 gap-4"><Field label="عنوان"><input className={inputClass} onChange={(e) => set("title", e.target.value)} value={draft.title} /></Field><Field label="قیمت (تومان)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("price", e.target.value)} value={draft.price} /></Field><Field label="هزینه اعتباری"><input className={inputClass} inputMode="numeric" onChange={(e) => set("creditCost", e.target.value)} value={draft.creditCost} /></Field><Field label="ترتیب نمایش"><input className={inputClass} inputMode="numeric" onChange={(e) => set("sortOrder", e.target.value)} value={draft.sortOrder} /></Field><Field label="مدت (روز)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationDays", e.target.value)} value={draft.durationDays} /></Field><Field label="مدت (ماه)"><input className={inputClass} inputMode="numeric" onChange={(e) => set("durationMonths", e.target.value)} value={draft.durationMonths} /></Field><label className="col-span-2"><Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">توضیحات</Typography><textarea className={`${inputClass} min-h-24 py-3`} onChange={(e) => set("description", e.target.value)} value={draft.description} /></label></div>
      <div className="mt-6 flex justify-end gap-3"><Button unstyled className="h-10 rounded-xl border border-[#d7dce5] px-5 text-sm font-bold" onClick={onClose} type="button">انصراف</Button><Button unstyled className="h-10 rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "در حال ذخیره..." : "ذخیره"}</Button></div>
    </form>
  </motion.div>;
}
