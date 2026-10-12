import type { RefCallback } from "react";
import { getRequestErrorState } from "../../../shared/components/ErrorState";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { DirectoryCard, DirectoryCardSkeleton } from "./DirectoryCard";
import type { DirectoryItem, DirectoryMode } from "../types";

export function DirectoryList({
  error,
  hasNextPage,
  isError,
  isFetchingNextPage,
  isLoading,
  items,
  loadMoreSentinelRef,
  loadMoreTriggerIndex,
  mode,
  onItemClick,
  onRetry,
}: {
  error: unknown;
  hasNextPage: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  items: DirectoryItem[];
  loadMoreSentinelRef: RefCallback<HTMLDivElement>;
  loadMoreTriggerIndex: number;
  mode: DirectoryMode;
  onItemClick: (item: DirectoryItem) => void;
  onRetry: () => void;
}) {
  const DirectoryErrorState = getRequestErrorState(error);

  if (isLoading && items.length === 0) {
    return (
      <div className="space-y-4 pb-20">
        <DirectoryCardSkeleton />
        <DirectoryCardSkeleton />
        <DirectoryCardSkeleton />
      </div>
    );
  }

  if (isError && items.length === 0) {
    return (
      <DirectoryErrorState
        className="min-h-[420px]"
        onRetry={onRetry}
      />
    );
  }

  if (items.length === 0) {
    return <SearchEmptyState />;
  }

  return (
    <div className="space-y-4 pb-20">
      {items.map((item, index) => {
        const shouldAttachRef = hasNextPage && index === loadMoreTriggerIndex;

        return (
          <div
            key={item.id ?? `${item.name}-${index}`}
            ref={shouldAttachRef ? loadMoreSentinelRef : undefined}
          >
            <DirectoryCard
              item={item}
              mode={mode}
              onClick={item.id ? () => onItemClick(item) : undefined}
            />
          </div>
        );
      })}
      {isFetchingNextPage ? (
        <>
          <DirectoryCardSkeleton />
          <DirectoryCardSkeleton />
        </>
      ) : null}
    </div>
  );
}
