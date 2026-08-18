import { api } from "../../../shared/api/api";

export type SearchHistoryFilterValue =
  | string
  | number
  | boolean
  | Array<string | number>;

export type SearchHistoryFilters = Record<string, SearchHistoryFilterValue>;

export type SearchHistoryDto = Record<string, unknown> & {
  _id?: string | number;
  category?: { name?: string };
  category_name?: string;
  city?: { name?: string };
  city_name?: string;
  content?: unknown;
  filters?: unknown;
  id?: string | number;
  qsearch?: string;
  query?: string;
  search?: string;
  tags?: unknown;
  text?: string;
  title?: string;
  url?: string;
};

export type SearchHistoryItem = {
  content: string[];
  filters: SearchHistoryFilters;
  id: string;
  subtitle: string;
  tags: string[];
  title: string;
  url: string;
};

type SearchHistoryResponse =
  | {
      data?: SearchHistoryDto | SearchHistoryDto[];
      status?: boolean;
    }
  | SearchHistoryDto[]
  | null;

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return fallback;
}

function readNestedName(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();

  if (value && typeof value === "object" && "name" in value) {
    return toText((value as { name?: unknown }).name);
  }

  return "";
}

function normalizeTextList(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => readNestedName(item) || toText(item))
    .filter(Boolean);
}

function normalizeFilters(value: unknown): SearchHistoryFilters {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap<[string, SearchHistoryFilterValue]>(
      ([key, entry]) => {
        if (
          typeof entry === "string" ||
          typeof entry === "number" ||
          typeof entry === "boolean"
        ) {
          return [[key, entry]];
        }

        if (Array.isArray(entry)) {
          const values = entry.filter(
            (item): item is string | number =>
              typeof item === "string" || typeof item === "number",
          );

          return values.length > 0 ? [[key, values]] : [];
        }

        const nestedName = readNestedName(entry);

        return nestedName ? [[key, nestedName]] : [];
      },
    ),
  );
}

function readSearchTags(item: SearchHistoryDto, filters: SearchHistoryFilters) {
  const content = normalizeTextList(item.content);
  if (content.length > 0) return content;

  const tags = normalizeTextList(item.tags);
  if (tags.length > 0) return tags;

  const legacyFilterTags = normalizeTextList(item.filters);
  if (legacyFilterTags.length > 0) return legacyFilterTags;

  const filterTags = Object.values(filters)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => toText(value))
    .filter(Boolean);

  if (filterTags.length > 0) return filterTags;

  return [
    readNestedName(item.city) || toText(item.city_name),
    readNestedName(item.category) || toText(item.category_name),
  ].filter(Boolean);
}

function appendFilter(params: URLSearchParams, key: string, value: SearchHistoryFilterValue) {
  if (Array.isArray(value)) {
    if (value.length > 0) params.set(key, value.join("_"));
    return;
  }

  params.set(key, String(value));
}

function buildSearchUrl(
  item: SearchHistoryDto,
  filters: SearchHistoryFilters,
  query: string,
) {
  const rawUrl = toText(item.url);

  if (rawUrl) {
    if (rawUrl.startsWith("/")) return rawUrl;
    if (rawUrl.startsWith("?")) return `/search${rawUrl}`;

    try {
      const parsedUrl = new URL(rawUrl, "http://localhost");
      return `${parsedUrl.pathname || "/search"}${parsedUrl.search}`;
    } catch {
      // Fall through and rebuild the URL from the stored filters.
    }
  }

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => appendFilter(params, key, value));

  if (query && !params.has("query") && !params.has("qsearch") && !params.has("q")) {
    params.set("query", query);
  }

  const queryString = params.toString();
  return queryString ? `/search?${queryString}` : "/search";
}

function mapSearchHistoryItem(
  item: SearchHistoryDto,
  index: number,
): SearchHistoryItem {
  const rawQuery = toText(item.qsearch ?? item.query ?? item.search ?? item.text);
  const title = toText(item.title, rawQuery || "جستجوی آگهی");
  const subtitle = readNestedName(item.category) || toText(item.category_name);
  const filters = normalizeFilters(item.filters);
  const tags = readSearchTags(item, filters);

  return {
    content: tags,
    filters,
    id: toText(item.id ?? item._id, String(index + 1)),
    subtitle,
    tags,
    title,
    url: buildSearchUrl(item, filters, rawQuery || title),
  };
}

export async function getSearchHistory(qsearch?: string) {
  const response = await api
    .get("me/search-history/list", { searchParams: { qsearch } })
    .json<SearchHistoryResponse>();
  const data = !response
    ? []
    : Array.isArray(response)
      ? response
      : Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];

  return data.map(mapSearchHistoryItem);
}

export async function deleteSearchHistory(id: string) {
  await api.delete(`me/search-history/${encodeURIComponent(id)}`, {
    context: { allowNonJsonResponse: true },
  });
}
