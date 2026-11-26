import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { formatNumber } from "../../../shared/lib/numberUtils";

const PAGE_SIZE_OPTIONS = [12, 24, 48, 60] as const;
const SIBLING_PAGE_COUNT = 3;

export type PaginationToken = number | "ellipsis-start" | "ellipsis-end";

/**
 * Builds page numbers showing up to 3 pages before and 3 pages after currentPage,
 * with first/last page shortcuts and ellipses when truncated.
 */
export function buildPaginationTokens(
  currentPage: number,
  totalPages: number,
): PaginationToken[] {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const start = Math.max(1, safeCurrent - SIBLING_PAGE_COUNT);
  const end = Math.min(safeTotal, safeCurrent + SIBLING_PAGE_COUNT);

  const tokens: PaginationToken[] = [];

  if (start > 1) {
    tokens.push(1);
    if (start > 2) {
      tokens.push("ellipsis-start");
    }
  }

  for (let p = start; p <= end; p += 1) {
    tokens.push(p);
  }

  if (end < safeTotal) {
    if (end < safeTotal - 1) {
      tokens.push("ellipsis-end");
    }
    tokens.push(safeTotal);
  }

  return tokens;
}

export function CrmAdvertisesPagination({
  currentPage,
  isFetching,
  onChangePage,
  onChangePerPage,
  perPage,
  total,
  totalPages,
}: {
  currentPage: number;
  isFetching: boolean;
  onChangePage: (nextPage: number) => void;
  onChangePerPage: (nextPerPage: number) => void;
  perPage: number;
  total: number;
  totalPages: number;
}) {
  const tokens = buildPaginationTokens(currentPage, totalPages);

  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-[#edf0f5] bg-white pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-sm text-[#7b8493]"
        >
          صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)} ({formatNumber(total)} آگهی)
        </Typography>

        <label className="flex items-center gap-2 text-xs text-[#666666]">
          <span>تعداد در صفحه:</span>
          <select
            aria-label="تعداد در صفحه"
            className="h-9 rounded-lg border border-[#dce3ef] bg-white px-2.5 text-sm font-semibold text-[#1a1a1a] outline-none focus:border-[#0048c4]"
            disabled={isFetching}
            onChange={(event) => onChangePerPage(Number(event.target.value))}
            value={perPage}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {formatNumber(size)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          unstyled
          className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onChangePage(currentPage - 1)}
          type="button"
        >
          قبلی
        </Button>

        {tokens.map((token) => {
          if (token === "ellipsis-start" || token === "ellipsis-end") {
            return (
              <span
                aria-hidden="true"
                className="grid h-9 min-w-7 place-items-center text-sm font-bold text-[#7b8493]"
                key={token}
              >
                ...
              </span>
            );
          }

          const isActive = token === currentPage;

          return (
            <Button
              unstyled
              aria-current={isActive ? "page" : undefined}
              aria-label={`صفحه ${formatNumber(token)}`}
              className={`grid h-9 min-w-9 place-items-center rounded-lg px-2.5 text-sm font-bold transition ${
                isActive
                  ? "bg-[#0048c4] text-white"
                  : "border border-[#dce3ef] bg-white text-[#526174] hover:border-[#0048c4] hover:text-[#0048c4] disabled:cursor-not-allowed disabled:opacity-40"
              }`}
              disabled={isActive || isFetching}
              key={token}
              onClick={() => onChangePage(token)}
              type="button"
            >
              {formatNumber(token)}
            </Button>
          );
        })}

        <Button
          unstyled
          className="h-9 rounded-lg border border-[#dce3ef] bg-white px-3 text-sm font-bold text-[#526174] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => onChangePage(currentPage + 1)}
          type="button"
        >
          بعدی
        </Button>
      </div>
    </div>
  );
}
