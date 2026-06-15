import { api } from "../api/api";

export type SearchHistoryDto = Record<string, unknown> & {
  _id?: string;
  category?: { name?: string };
  category_name?: string;
  city?: { name?: string };
  city_name?: string;
  filters?: unknown;
  id?: string | number;
  qsearch?: string;
  query?: string;
  search?: string;
  tags?: unknown;
  text?: string;
  title?: string;
};

export type SearchHistoryItem = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
};

type SearchHistoryResponse =
  | {
      data?: SearchHistoryDto[];
      status?: boolean;
    }
  | SearchHistoryDto[];

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function readNestedName(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;

  if (value && typeof value === "object" && "name" in value) {
    return toText((value as { name?: unknown }).name);
  }

  return "";
}

function readSearchTags(item: SearchHistoryDto) {
  if (Array.isArray(item.tags)) return item.tags.map((tag) => toText(tag)).filter(Boolean);
  if (Array.isArray(item.filters)) return item.filters.map((tag) => toText(tag)).filter(Boolean);

  const filters = item.filters;

  if (filters && typeof filters === "object") {
    return Object.values(filters)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((tag) => readNestedName(tag) || toText(tag))
      .filter(Boolean);
  }

  return [
    readNestedName(item.city) || toText(item.city_name),
    readNestedName(item.category) || toText(item.category_name),
  ].filter(Boolean);
}

function mapSearchHistoryItem(
  item: SearchHistoryDto,
  index: number,
): SearchHistoryItem {
  const title = toText(
    item.title ?? item.qsearch ?? item.query ?? item.search ?? item.text,
    "جستجوی آگهی",
  );
  const subtitle = readNestedName(item.category) || toText(item.category_name);

  return {
    id: toText(item.id ?? item._id, String(index + 1)),
    subtitle,
    tags: readSearchTags(item),
    title,
  };
}

export async function getSearchHistory(qsearch?: string) {
  const response = await api
    .get("me/search-history/list", { searchParams: { qsearch } })
    .json<SearchHistoryResponse>();
  const data = Array.isArray(response) ? response : response.data ?? [];

  return data.map(mapSearchHistoryItem);
}

export function deleteSearchHistory(id: string) {
  return api.delete(`me/search-history/${id}`).json();
}
