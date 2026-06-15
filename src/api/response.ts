export type ApiDataResponse<T> = {
  data?: T;
  message?: string;
  status?: boolean;
};

export type ApiListResponse<T> =
  | ApiDataResponse<T[]>
  | {
      items?: T[];
      list?: T[];
      result?: T[];
    }
  | T[];

export function unwrapList<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response)) return response;

  const record = response as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data as T[];
  if (Array.isArray(record.items)) return record.items as T[];
  if (Array.isArray(record.list)) return record.list as T[];
  if (Array.isArray(record.result)) return record.result as T[];

  return [];
}
