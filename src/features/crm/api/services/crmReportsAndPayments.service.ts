import { ApiError, api } from "../../../../shared/api/api";
import {
  compactSearchParams,
  findPaginationRecord,
  normalizeRows,
  type CrmRecord,
} from "./crmBase";

export type CrmReportKind = "advertise" | "user";

export type CrmReportFilters = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type CrmReportListResult = {
  data: CrmRecord[];
  total: number;
  page: number;
  perPage: number;
};

export type CrmPaymentFilters = {
  page?: number;
  perPage?: number;
  status?: number;
  paymentFor?: number;
  paymentType?: number;
  agencyId?: string;
  userId?: string;
  advertiseId?: string;
  packageId?: string;
  fromDate?: string;
  toDate?: string;
};

export type CrmPaymentListResult = {
  data: CrmRecord[];
  total: number;
  page: number;
  perPage: number;
};

async function requestCrmReportList(
  endpoint: string,
  filters: Required<Pick<CrmReportFilters, "page" | "perPage">> & Pick<CrmReportFilters, "search">,
) {
  const query = compactSearchParams({
    page: filters.page,
    per_page: filters.perPage,
    search: filters.search?.trim(),
  });

  try {
    return await api.get(endpoint, { searchParams: query }).json<unknown>();
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 405) throw error;

    return api
      .post(endpoint, {
        json: {
          page: filters.page,
          per_page: filters.perPage,
          ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
        },
      })
      .json<unknown>();
  }
}

export async function listCrmReports(
  kind: CrmReportKind,
  filters: CrmReportFilters = {},
): Promise<CrmReportListResult> {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 20;
  const endpoint = kind === "advertise" ? "panel/advertise/report/list" : "panel/chat/report/list";
  const payload = await requestCrmReportList(endpoint, {
    page,
    perPage,
    search: filters.search,
  });
  const data = normalizeRows(payload);
  const pagination = findPaginationRecord(payload);
  const totalValue = Number(pagination.total ?? pagination.count ?? data.length);
  const pageValue = Number(pagination.page ?? pagination.current_page ?? page);
  const perPageValue = Number(pagination.per_page ?? pagination.perPage ?? perPage);

  return {
    data,
    total: Number.isFinite(totalValue) ? totalValue : data.length,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : page,
    perPage: Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : perPage,
  };
}

export async function listCrmPayments(
  filters: CrmPaymentFilters = {},
): Promise<CrmPaymentListResult> {
  const payload = await api
    .get("panel/payments", {
      searchParams: compactSearchParams({
        page: filters.page ?? 1,
        per_page: filters.perPage ?? 20,
        status: filters.status,
        payment_for: filters.paymentFor,
        payment_type: filters.paymentType,
        agency_id: filters.agencyId?.trim(),
        user_id: filters.userId?.trim(),
        advertise_id: filters.advertiseId?.trim(),
        package_id: filters.packageId?.trim(),
        from_date: filters.fromDate,
        to_date: filters.toDate,
      }),
    })
    .json<unknown>();

  const record =
    payload && typeof payload === "object" && !Array.isArray(payload) ? (payload as CrmRecord) : {};
  const data = normalizeRows(payload);
  const requestedPage = filters.page ?? 1;
  const requestedPerPage = filters.perPage ?? 20;
  const totalValue = Number(record.total ?? record.count ?? data.length);
  const pageValue = Number(record.page ?? requestedPage);
  const perPageValue = Number(record.per_page ?? record.perPage ?? requestedPerPage);

  return {
    data,
    total: Number.isFinite(totalValue) ? totalValue : data.length,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : requestedPage,
    perPage: Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : requestedPerPage,
  };
}
