import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { formatNumber } from "../../../../shared/lib/numberUtils";
import type { CrmRecord } from "../../api/crm.service";
import { CloseIcon, ReceiptIcon } from "./PaymentIcons";
import { PaymentPagination } from "./PaymentPagination";
import { PaymentTableRows } from "./PaymentTableRows";
import { PaymentTableSkeleton, TableHead } from "./PaymentTableElements";

export function PaymentTableSection({
  changePage,
  clearFilters,
  currentPage,
  isError,
  isFetching,
  isLoading,
  onSelectPayment,
  payments,
  perPage,
  refetch,
  setPerPage,
  total,
  totalPages,
}: {
  changePage: (nextPage: number) => void;
  clearFilters: () => void;
  currentPage: number;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
  onSelectPayment: (payment: CrmRecord) => void;
  payments: CrmRecord[];
  perPage: number;
  refetch: () => void;
  setPerPage: (perPage: number) => void;
  total: number;
  totalPages: number;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white">
      <div className="flex flex-col gap-3 border-b border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 text-base font-black text-[#263042]"
          >
            همه پرداخت‌ها
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="m-0 mt-1 text-sm text-[#8a94a3]"
          >
            {isLoading ? "در حال دریافت..." : `${formatNumber(total)} تراکنش پیدا شد`}
          </Typography>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-[#667085]">
          تعداد در صفحه
          <select
            className="h-9 rounded-lg border border-[#dce3ef] bg-white px-2 text-sm font-semibold text-[#303030] outline-none focus:border-[#0048c4]"
            onChange={(event) => setPerPage(Number(event.target.value))}
            value={perPage}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-separate border-spacing-0 text-right">
          <thead>
            <tr className="bg-[#fafbfc] text-sm font-bold text-[#697587]">
              <TableHead>شناسه پرداخت</TableHead>
              <TableHead>بابت پرداخت</TableHead>
              <TableHead>مبلغ</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>روش پرداخت</TableHead>
              <TableHead>زمان ثبت</TableHead>
              <TableHead>عملیات</TableHead>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <PaymentTableSkeleton columns={7} />
            ) : isError ? (
              <tr>
                <td colSpan={7}>
                  <div className="mx-auto flex w-full flex-col items-center justify-center py-14 text-center">
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0] text-[#cc3342]"
                    >
                      <CloseIcon />
                    </Typography>
                    <Typography
                      as="p"
                      variant="body"
                      size="medium"
                      weight="medium"
                      className="m-0 mt-3 text-sm font-semibold text-[#6f7a8b]"
                    >
                      دریافت تاریخچه پرداخت‌ها ناموفق بود.
                    </Typography>
                    <Button
                      unstyled
                      className="mt-3 text-sm font-bold text-[#0048c4]"
                      onClick={refetch}
                      type="button"
                    >
                      تلاش مجدد
                    </Button>
                  </div>
                </td>
              </tr>
            ) : payments.length ? (
              <PaymentTableRows onSelectPayment={onSelectPayment} payments={payments} />
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="mx-auto flex w-full flex-col items-center justify-center py-14 text-center">
                    <Typography
                      as="span"
                      variant="body"
                      size="medium"
                      weight="regular"
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
                    >
                      <ReceiptIcon />
                    </Typography>
                    <Typography
                      as="p"
                      variant="body"
                      size="medium"
                      weight="medium"
                      className="m-0 mt-3 text-sm font-semibold text-[#6f7a8b]"
                    >
                      پرداختی مطابق فیلترها پیدا نشد.
                    </Typography>
                    <Button
                      unstyled
                      className="mt-3 text-sm font-bold text-[#0048c4]"
                      onClick={clearFilters}
                      type="button"
                    >
                      حذف فیلترها
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && total > 0 ? (
        <PaymentPagination
          changePage={changePage}
          currentPage={currentPage}
          isFetching={isFetching}
          totalPages={totalPages}
        />
      ) : null}
    </section>
  );
}
