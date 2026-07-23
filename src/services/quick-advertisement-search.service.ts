import { publicApi } from "../api/api";

export type QuickAdvertisementSearchItem = {
  category: string;
  count: number;
  formCode: string;
  title: string;
};

type QuickAdvertisementSearchItemDto = {
  category?: unknown;
  count?: unknown;
  form_code?: unknown;
  title?: unknown;
};

type QuickAdvertisementSearchResponse = {
  items?: QuickAdvertisementSearchItemDto[];
  query?: unknown;
  status?: boolean;
};

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toCount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return Math.max(0, Math.trunc(parsedValue));
    }
  }

  return 0;
}

function mapQuickSearchItem(
  item: QuickAdvertisementSearchItemDto,
): QuickAdvertisementSearchItem | null {
  const formCode = toText(item.form_code);
  const title = toText(item.title);

  if (!formCode || !title) return null;

  return {
    category: toText(item.category),
    count: toCount(item.count),
    formCode,
    title,
  };
}

export async function quickSearchAdvertisements(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return [];

  const response = await publicApi
    .get("public/advertise/search/quick", {
      searchParams: { query: normalizedQuery },
    })
    .json<QuickAdvertisementSearchResponse>();

  return (response.items ?? []).flatMap((item) => {
    const mappedItem = mapQuickSearchItem(item);

    return mappedItem ? [mappedItem] : [];
  });
}
