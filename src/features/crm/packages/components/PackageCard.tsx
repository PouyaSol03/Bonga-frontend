import { motion } from "motion/react";
import { SwitchButton } from "../../../../shared/components/SwitchButton";
import { Typography } from "../../../../shared/ui/Typography";
import { packageRecordId, text } from "../package.helpers";
import type { CrmRecord } from "../types";

interface PackageCardProps {
  item: CrmRecord;
  index: number;
  isLoadingDetail: boolean;
  isChangingStatus: boolean;
  isDeactivating: boolean;
  onEdit: (item: CrmRecord) => void;
  onStatusToggle: (item: CrmRecord, active: boolean) => void;
  onDeactivate: (id: string) => void;
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

export function PackageCard({
  item,
  index,
  isLoadingDetail,
  isChangingStatus,
  isDeactivating,
  onEdit,
  onStatusToggle,
  onDeactivate,
}: PackageCardProps) {
  const id = packageRecordId(item);
  const isActive = item.is_active !== false;
  const isCreditBundle = item.kind === "credit_bundle";
  const kindLabel = isCreditBundle ? "بسته اعتباری" : "اعتبار پنل";
  const discount = Number(item.discount_percent ?? 0);
  const realPrice = Number(item.real_price ?? 0);
  const hasApiFinalPrice = item.final_price !== undefined && item.final_price !== null;
  const apiFinalPrice = Number(item.final_price ?? 0);
  const finalPrice =
    hasApiFinalPrice && Number.isFinite(apiFinalPrice)
      ? apiFinalPrice
      : Math.max(0, Math.round(realPrice * (1 - discount / 100)));
  const hasPrice = Number.isFinite(finalPrice) && finalPrice > 0;
  const durationDays = Number(item.duration_days ?? 0);
  const creditItems = [
    { label: "اعتبار آگهی", value: Number(item.ad_credit ?? 0) },
    { label: "اعتبار ویژه", value: Number(item.special_credit ?? 0) },
    { label: "اعتبار بروزرسانی", value: Number(item.renew_credit ?? 0) },
  ].filter((credit) => Number.isFinite(credit.value) && credit.value > 0);

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={`group flex min-h-[405px] flex-col rounded-2xl border p-5 transition-shadow ${
        isActive
          ? "border-[#d9dde7] bg-gradient-to-b from-white to-[#f5f7fb] hover:border-[#0048c4] hover:shadow-[0_14px_36px_rgba(0,72,196,0.10)]"
          : "border-[#e2e2e2] bg-[#f7f7f7] opacity-80"
      }`}
      initial={{ opacity: 0, y: 16 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.28, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Typography as="span" variant="label" size="small" weight="semibold" className="rounded-lg bg-[#eef4ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">
            {kindLabel}
          </Typography>
          <Typography as="span" variant="label" size="small" weight="semibold"
            className={`rounded-lg px-2 py-1 text-xs font-bold ${isActive ? "bg-[#e9f8f1] text-[#0b8555]" : "bg-[#eeeeee] text-[#777777]"}`}
          >
            {isActive ? "فعال" : "غیرفعال"}
          </Typography>
        </div>
        <div className={isChangingStatus ? "pointer-events-none opacity-50" : ""}>
          <SwitchButton
            ariaLabel={`وضعیت ${text(item, ["title"], "بسته")}`}
            checked={isActive}
            onChange={(next) => onStatusToggle(item, next)}
          />
        </div>
      </div>

      <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-5 text-lg font-bold text-[#0048c4]">
        {text(item, ["title"], "بدون عنوان")}
      </Typography>

      {hasPrice ? (
        <div className="mt-2 flex min-h-[58px] items-end justify-between gap-3 [direction:ltr]">
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
              <div className="flex items-center justify-between gap-3 text-sm font-medium" key={credit.label}>
                <Typography as="span" variant="body" size="medium" weight="regular">{credit.label}</Typography>
                <strong className="text-[#006038]">{credit.value.toLocaleString("fa-IR")}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {Number.isFinite(durationDays) && durationDays > 0 ? (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-[#707a8a]">
          <Typography as="span" variant="body" size="medium" weight="regular">مدت بسته</Typography>
          <strong className="text-[#4d4d4d]">{durationDays.toLocaleString("fa-IR")} روز</strong>
        </div>
      ) : null}

      <div className="mt-auto flex gap-2 pt-5">
        <motion.button
          className="h-10 flex-1 rounded-lg border border-[#0048c4] bg-white text-sm font-bold text-[#0048c4] transition group-hover:bg-[#0048c4] group-hover:text-white disabled:opacity-60"
          disabled={isLoadingDetail}
          onClick={() => onEdit(item)}
          type="button"
          whileTap={{ scale: 0.97 }}
        >
          {isLoadingDetail ? "در حال دریافت..." : "ویرایش"}
        </motion.button>
        {isActive ? (
          <motion.button
            className="h-10 rounded-lg border border-[#d93645] bg-white px-4 text-sm font-bold text-[#d93645] disabled:opacity-60"
            disabled={isDeactivating}
            onClick={() => {
              if (id && window.confirm("این بسته غیرفعال شود؟")) {
                onDeactivate(id);
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
}
