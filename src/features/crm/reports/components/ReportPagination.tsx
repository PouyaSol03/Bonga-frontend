import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { formatCount } from "../reportHelpers";

export function ReportPagination({
  currentPage,
  isError,
  isLoading,
  onChangePage,
  perPage,
  total,
  totalPages,
}: {
  currentPage: number;
  isError: boolean;
  isLoading: boolean;
  onChangePage: (page: number) => void;
  perPage: number;
  total: number;
  totalPages: number;
}) {
  if (isLoading || isError || total <= perPage) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#edf0f5] px-5 py-4">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="m-0 text-sm font-semibold text-[#7b8493]"
      >
        صفحه {formatCount(currentPage)} از {formatCount(totalPages)}
      </Typography>
      <div className="flex items-center gap-2">
        <Button
          unstyled
          aria-label="صفحه قبلی"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3ef] bg-white text-[#596477] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage <= 1}
          onClick={() => onChangePage(currentPage - 1)}
          type="button"
        >
          <LinearArrowRight1 className="h-4 w-4" />
        </Button>
        <Button
          unstyled
          aria-label="صفحه بعدی"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce3ef] bg-white text-[#596477] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage >= totalPages}
          onClick={() => onChangePage(currentPage + 1)}
          type="button"
        >
          <LinearArrowLeft1 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
