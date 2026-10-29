import { AnimatePresence } from "motion/react";
import LinearSearch from "../../../../shared/icons/LinearSearch";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import {
  filterOptions,
  priorityOptions,
  type CrmSupportRequest,
  type StatusFilter,
} from "../types";
import { formatCount } from "../supportHelpers";
import { RequestListCard } from "./SupportRequestListCard";

export function SupportRequestsSidebar({
  activeFilter,
  category,
  filteredRequests,
  hasNextPage,
  isError,
  isLoading,
  onCategoryChange,
  onFilterChange,
  onPageChange,
  onPriorityChange,
  onRetry,
  onSearchChange,
  onSelectRequest,
  page,
  priority,
  searchQuery,
  selectedRequestId,
}: {
  activeFilter: StatusFilter;
  category: string;
  filteredRequests: CrmSupportRequest[];
  hasNextPage: boolean;
  isError: boolean;
  isLoading: boolean;
  onCategoryChange: (value: string) => void;
  onFilterChange: (filter: StatusFilter) => void;
  onPageChange: (updater: (page: number) => number) => void;
  onPriorityChange: (value: string) => void;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onSelectRequest: (id: string) => void;
  page: number;
  priority: string;
  searchQuery: string;
  selectedRequestId: string;
}) {
  return (
    <aside className="flex w-[390px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="shrink-0 space-y-3 border-b border-[#eeeeee] p-3">
        <label className="relative block">
          <LinearSearch className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#808080]" />
          <input
            className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#fafafa] pr-10 pl-3 text-sm outline-none focus:border-[#0048c4] focus:bg-white"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="جستجو در عنوان، شماره یا نام کاربر"
            type="search"
            value={searchQuery}
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="h-10 min-w-0 rounded-xl border border-[#d9d9d9] px-3 text-xs outline-none focus:border-[#0048c4]"
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder="دسته‌بندی"
            value={category}
          />
          <select
            className="h-10 min-w-0 rounded-xl border border-[#d9d9d9] bg-white px-3 text-xs outline-none focus:border-[#0048c4]"
            onChange={(event) => onPriorityChange(event.target.value)}
            value={priority}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex shrink-0 [scrollbar-width:none] gap-2 overflow-x-auto border-b border-[#eeeeee] px-3 py-3 [&::-webkit-scrollbar]:hidden">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <Button
              unstyled
              className={`h-9 shrink-0 rounded-lg border px-3 text-xs font-semibold ${
                isActive
                  ? "border-[#1268d8] bg-[#eaf1ff] text-[#0048c4]"
                  : "border-[#d9d9d9] bg-white text-[#4d4d4d]"
              }`}
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              type="button"
            >
              {filter.label}
            </Button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {isLoading ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="py-16 text-center text-sm text-[#808080]"
          >
            در حال دریافت درخواست‌ها...
          </Typography>
        ) : isError ? (
          <div className="py-16 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-sm text-[#d92d20]"
            >
              دریافت درخواست‌ها با خطا مواجه شد.
            </Typography>
            <Button
              unstyled
              className="mt-3 h-9 rounded-lg bg-[#0048c4] px-4 text-xs font-semibold text-white"
              onClick={onRetry}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <SearchEmptyState className="min-h-[300px] px-4" />
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {filteredRequests.map((request) => (
              <RequestListCard
                isActive={request.id === selectedRequestId}
                key={request.id}
                onClick={() => onSelectRequest(request.id)}
                request={request}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-[#eeeeee] p-3 text-xs text-[#666666]">
        <Button
          unstyled
          className="h-8 rounded-lg border border-[#d9d9d9] px-3 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange((current) => Math.max(1, current - 1))}
          type="button"
        >
          قبلی
        </Button>
        <Typography as="span" variant="body" size="medium" weight="regular">
          صفحه {formatCount(page)}
        </Typography>
        <Button
          unstyled
          className="h-8 rounded-lg border border-[#d9d9d9] px-3 disabled:opacity-40"
          disabled={!hasNextPage}
          onClick={() => onPageChange((current) => current + 1)}
          type="button"
        >
          بعدی
        </Button>
      </div>
    </aside>
  );
}
