import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  listCrmPayments,
  type CrmPaymentFilters,
  type CrmRecord,
} from "../api/crm.service";
import {
  jalaliDateToIso,
  jalaliDateToTimestamp,
  optionalNumber,
} from "./paymentDateUtils";
import {
  emptyDraft,
  type CrmPaymentsViewProps,
  type PaymentFilterDraft,
} from "./types";

export function useCrmPayments({ notify, refreshNonce }: CrmPaymentsViewProps) {
  const [draft, setDraft] = useState<PaymentFilterDraft>(emptyDraft);
  const [filters, setFilters] = useState<CrmPaymentFilters>({ page: 1, perPage: 20 });
  const [openPicker, setOpenPicker] = useState<"from" | "to" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<CrmRecord | null>(null);

  const query = useQuery({
    queryFn: () => listCrmPayments(filters),
    queryKey: ["crm", "payments", filters, refreshNonce],
  });

  useEffect(() => {
    if (!query.error) return;
    notify(getApiErrorMessage(query.error, "دریافت تاریخچه پرداخت‌ها ناموفق بود."), "error");
  }, [notify, query.error]);

  const payments = useMemo(() => query.data?.data ?? [], [query.data]);
  const total = query.data?.total ?? 0;
  const currentPage = query.data?.page ?? filters.page ?? 1;
  const perPage = query.data?.perPage ?? filters.perPage ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const updateDraft = (key: keyof PaymentFilterDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    if (
      draft.fromDate &&
      draft.toDate &&
      jalaliDateToTimestamp(draft.fromDate) > jalaliDateToTimestamp(draft.toDate)
    ) {
      notify("تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد.", "error");
      return;
    }

    setFilters((current) => ({
      page: 1,
      perPage: current.perPage ?? 20,
      status: optionalNumber(draft.status),
      paymentFor: optionalNumber(draft.paymentFor),
      paymentType: optionalNumber(draft.paymentType),
      fromDate: draft.fromDate ? jalaliDateToIso(draft.fromDate, false) : undefined,
      toDate: draft.toDate ? jalaliDateToIso(draft.toDate, true) : undefined,
    }));
  };

  const clearFilters = () => {
    setDraft(emptyDraft);
    setFilters((current) => ({ page: 1, perPage: current.perPage ?? 20 }));
  };

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;
    setFilters((current) => ({ ...current, page: nextPage }));
  };

  const setPerPage = (newPerPage: number) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      perPage: newPerPage,
    }));
  };

  return {
    applyFilters,
    changePage,
    clearFilters,
    currentPage,
    draft,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    openPicker,
    payments,
    perPage,
    refetch: () => void query.refetch(),
    selectedPayment,
    setOpenPicker,
    setPerPage,
    setSelectedPayment,
    total,
    totalPages,
    updateDraft,
  };
}
