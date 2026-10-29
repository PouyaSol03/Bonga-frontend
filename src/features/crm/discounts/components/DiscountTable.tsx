import { SwitchButton } from "../../../../shared/components/SwitchButton";
import { Button } from "../../../../shared/ui/Button";
import type { CrmDiscountCode, CrmDiscountServiceType } from "../../api/crm-discount.service";
import { formatDatePersian, formatPersianNumber } from "../discountFormatters";
import { serviceBadgeColors, serviceLabels } from "../types";

export function DiscountTable({
  discountCodes,
  isError,
  isLoading,
  isPendingToggle,
  onDeleteClick,
  onEditClick,
  onToggleStatus,
}: {
  discountCodes: CrmDiscountCode[];
  isError: boolean;
  isLoading: boolean;
  isPendingToggle: boolean;
  onDeleteClick: (id: number) => void;
  onEditClick: (item: CrmDiscountCode) => void;
  onToggleStatus: (id: number) => void;
}) {
  return (
    <div className="border-outline-var bg-surface-container-lowest overflow-hidden rounded-2xl border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="border-outline-var bg-surface-container text-on-surface-var border-b text-xs font-semibold">
            <tr>
              <th className="px-4 py-3.5">کد تخفیف</th>
              <th className="px-4 py-3.5">درصد تخفیف</th>
              <th className="px-4 py-3.5">سرویس‌های مجاز</th>
              <th className="px-4 py-3.5">سقف تخفیف</th>
              <th className="px-4 py-3.5">تعداد استفاده</th>
              <th className="px-4 py-3.5">انقضا</th>
              <th className="px-4 py-3.5">وضعیت</th>
              <th className="px-4 py-3.5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-outline-var divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-on-surface-var py-12 text-center">
                  در حال بارگذاری کدهای تخفیف...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="text-error py-12 text-center">
                  خطا در دریافت کدهای تخفیف. لطفاً دوباره تلاش کنید.
                </td>
              </tr>
            ) : discountCodes.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-on-surface-var py-12 text-center">
                  هیچ کد تخفیفی تاکنون تعریف نشده است.
                </td>
              </tr>
            ) : (
              discountCodes.map((item) => {
                const is100 = item.discount_percent >= 100;
                const isExpired = item.expire_at && new Date(item.expire_at) < new Date();

                return (
                  <tr className="hover:bg-surface-container-low transition-colors" key={item.id}>
                    <td className="text-on-surface px-4 py-4 font-mono font-bold" dir="ltr">
                      <span className="bg-surface-container-high text-primary rounded-lg px-2.5 py-1 text-sm font-semibold tracking-wider">
                        {item.code}
                      </span>
                      {item.description ? (
                        <div
                          className="text-on-surface-var mt-1 font-sans text-xs font-normal"
                          dir="rtl"
                        >
                          {item.description}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-4 py-4">
                      {is100 ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          ۱۰۰٪ (رایگان)
                        </span>
                      ) : (
                        <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold">
                          {formatPersianNumber(item.discount_percent)}٪
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(item.services || []).map((srv: CrmDiscountServiceType) => (
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                              serviceBadgeColors[srv as CrmDiscountServiceType] || "bg-gray-100 text-gray-700"
                            }`}
                            key={srv}
                          >
                            {serviceLabels[srv as CrmDiscountServiceType] || srv}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="text-on-surface px-4 py-4">
                      {item.max_discount_amount
                        ? `${formatPersianNumber(item.max_discount_amount)} تومان`
                        : "بدون سقف"}
                    </td>

                    <td className="text-on-surface px-4 py-4">
                      <span className="font-semibold">
                        {formatPersianNumber(item.used_count || 0)}
                      </span>
                      {item.usage_limit ? (
                        <span className="text-on-surface-var">
                          {" "}
                          / {formatPersianNumber(item.usage_limit)}
                        </span>
                      ) : (
                        <span className="text-on-surface-var text-xs"> (نامحدود)</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className={isExpired ? "text-error font-medium" : "text-on-surface"}>
                        {formatDatePersian(item.expire_at)}
                      </span>
                      {isExpired ? (
                        <div className="text-error text-xs font-medium">منقضی شده</div>
                      ) : null}
                    </td>

                    <td className="px-4 py-4">
                      <SwitchButton
                        checked={item.is_active}
                        disabled={isPendingToggle}
                        onChange={() => onToggleStatus(item.id)}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          unstyled
                          className="bg-surface-container text-on-surface hover:bg-surface-container-high h-8 rounded-lg px-3 text-xs font-medium transition"
                          onClick={() => onEditClick(item)}
                          type="button"
                        >
                          ویرایش
                        </Button>
                        <Button
                          unstyled
                          className="bg-error-container/30 text-error hover:bg-error-container/50 h-8 rounded-lg px-3 text-xs font-medium transition"
                          onClick={() => onDeleteClick(item.id)}
                          type="button"
                        >
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
