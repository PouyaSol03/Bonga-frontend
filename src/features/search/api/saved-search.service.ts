import { api } from "../../../shared/api/api";

export type SavedSearchFilters = Record<
  string,
  string | number | boolean | Array<string | number>
>;

export type SaveSearchInput = {
  content: string[];
  filters: SavedSearchFilters;
  title: string;
  url: string;
};

type SavedSearchDto = Partial<SaveSearchInput> & {
  _id?: string | number;
  id?: string | number;
};

export type SavedSearchItem = SaveSearchInput & {
  id: string;
};

type SavedSearchResponse =
  | SavedSearchDto[]
  | {
      data?: SavedSearchDto | SavedSearchDto[];
      saved_search?: SavedSearchDto;
      search?: SavedSearchDto;
    }
  | null;

function normalizeItem(item: SavedSearchDto, index: number): SavedSearchItem {
  const filters =
    item.filters && typeof item.filters === "object" && !Array.isArray(item.filters)
      ? item.filters
      : {};

  return {
    content: Array.isArray(item.content)
      ? item.content.filter(
          (value): value is string =>
            typeof value === "string" && Boolean(value.trim()),
        )
      : [],
    filters,
    id: String(item.id ?? item._id ?? `saved-search-${index + 1}`),
    title:
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim()
        : "جستجوی ذخیره‌شده",
    url: typeof item.url === "string" ? item.url : "",
  };
}

function readResponseItems(response: SavedSearchResponse) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (response.data) return [response.data];
  if (response.saved_search) return [response.saved_search];
  if (response.search) return [response.search];

  return [];
}

async function readOptionalJson(response: Response): Promise<SavedSearchResponse> {
  const text = await response.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as SavedSearchResponse;
  } catch {
    return null;
  }
}

export async function getSavedSearches() {
  const response = await api
    .get("me/save-search/list")
    .json<SavedSearchResponse>();

  return readResponseItems(response).map(normalizeItem);
}

export async function saveSearch(input: SaveSearchInput) {
  const response = await api.post("me/save-search/save", {
    context: { allowNonJsonResponse: true },
    json: input,
  });
  const payload = await readOptionalJson(response);
  const savedItem = readResponseItems(payload)[0];

  return normalizeItem(
    savedItem ?? {
      ...input,
      id: `saved-search-${Date.now()}`,
    },
    0,
  );
}

export async function deleteSavedSearch(id: string) {
  await api.delete(`me/save-search/${encodeURIComponent(id)}`, {
    context: { allowNonJsonResponse: true },
  });
}
