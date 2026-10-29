import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { inputClassName, type PaymentFilterDraft } from "../types";
import { FilterIcon } from "./PaymentIcons";
import { DateFilterButton, FilterField } from "./PaymentTableElements";

export function PaymentFilterSection({
  applyFilters,
  clearFilters,
  draft,
  setOpenPicker,
  updateDraft,
}: {
  applyFilters: () => void;
  clearFilters: () => void;
  draft: PaymentFilterDraft;
  setOpenPicker: (picker: "from" | "to") => void;
  updateDraft: (key: keyof PaymentFilterDraft, value: string) => void;
}) {
  return (
    <section className="rounded-2xl bg-white p-5">
      <div className="flex flex-col gap-1">
        <Typography
          as="h2"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base font-black text-[#263042]"
        >
          فیلتر پرداخت‌ها
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 text-sm leading-6 text-[#8a94a3]"
        >
          فیلترها مستقیماً به API پرداخت‌های پنل ارسال می‌شوند.
        </Typography>
      </div>

      <form
        className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
      >
        <FilterField label="وضعیت پرداخت">
          <select
            className={inputClassName}
            onChange={(event) => updateDraft("status", event.target.value)}
            value={draft.status}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="0">ثبت شده</option>
            <option value="1">پرداخت شده</option>
            <option value="-1">ناموفق</option>
          </select>
        </FilterField>

        <FilterField label="بابت پرداخت">
          <select
            className={inputClassName}
            onChange={(event) => updateDraft("paymentFor", event.target.value)}
            value={draft.paymentFor}
          >
            <option value="">همه موارد</option>
            <option value="0">آگهی</option>
            <option value="1">شارژ کیف پول</option>
            <option value="2">بسته</option>
            <option value="3">تسویه آگهی</option>
          </select>
        </FilterField>

        <FilterField label="روش پرداخت">
          <select
            className={inputClassName}
            onChange={(event) => updateDraft("paymentType", event.target.value)}
            value={draft.paymentType}
          >
            <option value="">همه روش‌ها</option>
            <option value="0">درگاه بانکی</option>
            <option value="1">کیف پول</option>
          </select>
        </FilterField>

        <DateFilterButton
          label="از تاریخ"
          onClick={() => setOpenPicker("from")}
          value={draft.fromDate}
        />
        <DateFilterButton
          label="تا تاریخ"
          onClick={() => setOpenPicker("to")}
          value={draft.toDate}
        />

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-5">
          <Button
            unstyled
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            type="submit"
          >
            <FilterIcon /> اعمال فیلترها
          </Button>
          <Button
            unstyled
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dce3ef] bg-white px-3 text-sm font-semibold text-[#657184] transition hover:bg-[#f5f7fa]"
            onClick={clearFilters}
            type="button"
          >
            حذف فیلترها
          </Button>
        </div>
      </form>
    </section>
  );
}
