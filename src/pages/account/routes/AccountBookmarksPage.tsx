import { useState, useRef, useMemo, useEffect } from "react";
import { useAdvertiseBadgesQuery, useDeleteAdvertiseBadgeMutation } from "../../../hooks/account.hooks";
import { getApiErrorMessage } from "../../../api/api";
import { BottomSheet } from "../../../components/BottomSheet";
import { AccountAdCardsSkeleton, AccountPageShell, AccountRetryState, BookmarkAdCard, EmptyAccountState, getBadgeAdvertiseId } from "../accountPageViews";

export function AccountBookmarksPage() {
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useAdvertiseBadgesQuery({ perPage: 10 });
  const deleteBadge = useDeleteAdvertiseBadgeMutation();
  const bookmarks = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const prefetchIndex = Math.max(bookmarks.length - 6, 0);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [bookmarks.length, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const deleteBookmark = (advertiseId: string) => {
    deleteBadge.mutate(advertiseId);
  };

  const deleteAllBookmarks = () => {
    deleteBadge.mutate("all", {
      onSuccess: () => {
        setIsConfirmDeleteAllOpen(false);
      },
    });
  };

  return (
    <AccountPageShell
      action={
        <button
          aria-label="حذف همه نشان‌ها"
          className="grid h-12 w-12 place-items-center text-[#1a1a1a] disabled:opacity-40"
          disabled={bookmarks.length === 0 || deleteBadge.isPending}
          onClick={() => setIsConfirmDeleteAllOpen(true)}
          type="button"
        >
          <img alt="" aria-hidden="true" className="h-6 w-6" src="/icons/trash.svg" />
        </button>
      }
      title="نشان‌ها"
    >
      <main className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${!isLoading && !isError && bookmarks.length === 0 ? "bg-white" : "bg-[#f0f0f0]"}`}>
        <div className={`${!isLoading && !isError && bookmarks.length === 0 ? "bg-white" : "space-y-2 bg-[#f0f0f0] pt-2"}`}>
          {isLoading ? <AccountAdCardsSkeleton /> : null}
          {isError ? (
            <AccountRetryState
              error={error}
              message={getApiErrorMessage(error, "دریافت نشان‌ها با خطا مواجه شد.")}
              onRetry={() => void refetch()}
            />
          ) : null}
          {!isLoading && !isError && bookmarks.map((bookmark, index) => (
            <div className="contents" key={getBadgeAdvertiseId(bookmark) || index}>
              <BookmarkAdCard
                badge={bookmark}
                disabled={deleteBadge.isPending}
                onDelete={deleteBookmark}
              />
              {hasNextPage && index === prefetchIndex ? (
                <div aria-hidden="true" className="h-px" ref={loadMoreRef} />
              ) : null}
            </div>
          ))}
          {isFetchingNextPage ? <AccountAdCardsSkeleton count={1} /> : null}
          {!isLoading && !isError && bookmarks.length === 0 ? (
            <EmptyAccountState
              description="آگهی‌های موردعلاقه خود را نشان کنید تا در این بخش نمایش داده شوند."
              iconSrc="/vectors/NoBadges.svg"
              title="هیچ آگهی نشان‌شده‌ای وجود ندارد!"
            />
          ) : null}
        </div>
      </main>

      <BottomSheet
        ariaLabel="حذف همه نشان‌ها"
        contentClassName="px-4 pt-7"
        heightClassName="h-[220px]"
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        showHeader={false}
      >
        <p className="m-0 text-center text-base font-semibold leading-7 text-[#1a1a1a]">
          آیا از حذف همه نشان‌ها مطمئن هستید؟
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 [direction:ltr]">
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4] disabled:opacity-50"
            disabled={deleteBadge.isPending}
            onClick={deleteAllBookmarks}
            type="button"
          >
            بله
          </button>
          <button
            className="h-10 rounded-[10px] border border-[#0048C4] bg-white px-4 text-sm font-medium leading-5 text-[#0048C4]"
            onClick={() => setIsConfirmDeleteAllOpen(false)}
            type="button"
          >
            خیر
          </button>
        </div>
      </BottomSheet>
    </AccountPageShell>
  );
}
