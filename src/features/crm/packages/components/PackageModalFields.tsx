import type { ReactNode } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { SwitchButton } from "../../../../shared/components/SwitchButton";
import type { CrmPackageKind, PackageDraft } from "../types";

export const inputClass =
  "h-11 w-full rounded-xl border border-[#d7dce5] bg-white px-3 text-sm text-[#303030] outline-none focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label>
      <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">
        {label}
      </Typography>
      {children}
    </label>
  );
}

interface PackageModalFieldsProps {
  draft: PackageDraft;
  onChange: (draft: PackageDraft) => void;
}

export function PackageModalFields({ draft, onChange }: PackageModalFieldsProps) {
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
    <>
      <div className="mt-5">
        <Typography as="span" variant="label" size="medium" weight="semibold" className="mb-2 block text-sm font-bold text-[#4f5a6c]">
          نوع بسته
        </Typography>
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
        <Field label="اسلاگ">
          <input
            className={inputClass}
            dir="ltr"
            onChange={(e) => field("slug", e.target.value)}
            placeholder="panel-basic"
            value={draft.slug}
          />
        </Field>
        <Field label="عنوان">
          <input
            className={inputClass}
            onChange={(e) => field("title", e.target.value)}
            placeholder="پکیج پایه"
            value={draft.title}
          />
        </Field>
        <Field label="قیمت اصلی (تومان)">
          <input
            className={inputClass}
            inputMode="numeric"
            onChange={(e) => field("realPrice", e.target.value)}
            value={draft.realPrice}
          />
        </Field>
        <Field label="درصد تخفیف">
          <input
            className={inputClass}
            inputMode="numeric"
            max="100"
            min="0"
            onChange={(e) => field("discountPercent", e.target.value)}
            value={draft.discountPercent}
          />
        </Field>
        {isPanelSubscription ? (
          <Field label="مدت بسته (روز)">
            <input
              className={inputClass}
              inputMode="numeric"
              min="1"
              onChange={(e) => field("durationDays", e.target.value)}
              value={draft.durationDays}
            />
          </Field>
        ) : null}
        <Field label="ترتیب نمایش">
          <input
            className={inputClass}
            inputMode="numeric"
            min="0"
            onChange={(e) => field("sortOrder", e.target.value)}
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
                onChange={(e) => field("adCredit", e.target.value)}
                value={draft.adCredit}
              />
            </Field>
            <Field label="تعداد ویژه">
              <input
                className={inputClass}
                inputMode="numeric"
                min="0"
                onChange={(e) => field("specialCredit", e.target.value)}
                value={draft.specialCredit}
              />
            </Field>
            <Field label="تعداد بروزرسانی">
              <input
                className={inputClass}
                inputMode="numeric"
                min="0"
                onChange={(e) => field("renewCredit", e.target.value)}
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
    </>
  );
}
