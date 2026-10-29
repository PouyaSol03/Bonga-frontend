import { Typography } from "../../../../shared/ui/Typography";
import { formatPersianNumber } from "../discountFormatters";

export function DiscountStatsCards({
  activeCodes,
  hundredPercentCodes,
  totalCodes,
  totalUsed,
}: {
  activeCodes: number;
  hundredPercentCodes: number;
  totalCodes: number;
  totalUsed: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="border-outline-var bg-surface-container-lowest rounded-2xl border p-4">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var"
        >
          کل کدهای تخفیف
        </Typography>
        <div className="text-on-surface mt-2 text-2xl font-bold">
          {formatPersianNumber(totalCodes)}
        </div>
      </div>

      <div className="border-outline-var bg-surface-container-lowest rounded-2xl border p-4">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var"
        >
          کدهای فعال
        </Typography>
        <div className="mt-2 text-2xl font-bold text-[#11a366]">
          {formatPersianNumber(activeCodes)}
        </div>
      </div>

      <div className="border-outline-var bg-surface-container-lowest rounded-2xl border p-4">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var"
        >
          کدهای تخفیف ۱۰۰٪
        </Typography>
        <div className="mt-2 text-2xl font-bold text-[#0048c4]">
          {formatPersianNumber(hundredPercentCodes)}
        </div>
      </div>

      <div className="border-outline-var bg-surface-container-lowest rounded-2xl border p-4">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var"
        >
          مجموع دفعات استفاده
        </Typography>
        <div className="text-on-surface mt-2 text-2xl font-bold">
          {formatPersianNumber(totalUsed)}
        </div>
      </div>
    </div>
  );
}
