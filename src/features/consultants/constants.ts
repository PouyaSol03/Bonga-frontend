import type { SortOption } from "./types";

export const SORT_OPTIONS: SortOption[] = [
  { id: "score", label: "امتیاز" },
  { id: "rank", label: "رتبه" },
  { id: "newest", label: "جدیدترین" },
  { id: "oldest", label: "قدیمی‌ترین" },
];

export const DIRECTORY_PAGE_SIZE = 20;
export const LOAD_MORE_REMAINING_ITEM_COUNT = 10;
export const SEARCH_DEBOUNCE_MS = 350;
