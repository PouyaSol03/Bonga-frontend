import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { formatNumber } from "../../../../shared/lib/numberUtils";

export function PaymentPagination({
  changePage,
  currentPage,
  isFetching,
  totalPages,
}: {
  changePage: (nextPage: number) => void;
  currentPage: number;
  isFetching: boolean;
  totalPages: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#edf0f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-sm text-[#7b8493]"
      >
        صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)}
      </Typography>
      <div className="flex items-center gap-2">
        <Button
          unstyled
          className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage <= 1 || isFetching}
          onClick={() => changePage(currentPage - 1)}
          type="button"
        >
          قبلی
        </Button>
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="semibold"
          className="grid h-9 min-w-9 place-items-center rounded-lg bg-[#0048c4] px-2 text-sm font-bold text-white"
        >
          {formatNumber(currentPage)}
        </Typography>
        <Button
          unstyled
          className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => changePage(currentPage + 1)}
          type="button"
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
