import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useRef } from "react";
import {
  listCrmAdvertisesPaginated,
  countCrmAdvertisesByStatus,
  updateCrmAdvertiseStatus,
  getCrmRecordId,
  listCrmAgencies,
  type AdvertiseStatus,
} from "../api/crm.service";
import { CrmAdvertisesPagination } from "../components/CrmAdvertisesPagination";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useNavigate } from "react-router";
import {
  getCrmAdvertiseEditPath,
  getCrmAdvertiseEditState,
} from "../crmAdvertiseNavigation";
import { AdCard } from "../../advertisements/components/AdCard";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import LinearEdit2 from "../../../shared/icons/LinearEdit2";
import LinearCheckmark from "../../../shared/icons/LinearCheckmark";
import LinearCancel from "../../../shared/icons/LinearCancel";
import LinearDelete from "../../../shared/icons/LinearDelete";
import LinearApartment from "../../../shared/icons/LinearApartment";
import LinearGps from "../../../shared/icons/LinearGps";
import LinearVideo from "../../../shared/icons/LinearVideo";
import { getFormName } from "../advertise-detail/helpers";
import {
  ConfirmModal,
  CrmAdvertiseCreateModal,
  CrmIcon,
  CrmSelect,
  FilterField,
  PrimaryButton,
  SmallActionButton,
  advertiseStatusOptions,
  ghostButtonClassName,
  inputClassName,
  mapCrmAdvertiseToCard,
  readText,
  useQueryErrorToast, type ConfirmState, type CrmRoutePageProps 
} from "../CrmLayout";

import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { formatDate } from "../advertise-detail/formatters";

export function CrmAdvertisesPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [trackCode, setTrackCode] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const filters = useMemo(() => ({ status, trackCode: trackCode.trim() }), [status, trackCode]);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  const query = useQuery({
    queryFn: () =>
      listCrmAdvertisesPaginated({
        page,
        perPage,
        status: filters.status === "" ? undefined : (filters.status as AdvertiseStatus),
        trackCode: filters.trackCode,
      }),
    queryKey: ["crm", "advertises", filters, page, perPage, refreshNonce],
    placeholderData: (previousData) => previousData,
  });

  const advertises = query.data?.data ?? [];
  const currentPage = query.data?.page ?? page;
  const totalPages = query.data?.lastPage ?? 1;
  const totalAds = query.data?.total ?? advertises.length;

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage);
    listContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangePerPage = (nextPerPage: number) => {
    setPerPage(nextPerPage);
    setPage(1);
    listContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pendingAdsCountQuery = useQuery({
    queryFn: () => countCrmAdvertisesByStatus("wait_for_admin"),
    queryKey: ["crm", "badges", "advertises", refreshNonce],
    staleTime: 30_000,
  });
  const pendingCount = pendingAdsCountQuery.data ?? 0;

  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "agencies", "lookup"],
    staleTime: 60_000,
  });

  const agencyMap = useMemo(() => {
    const map = new Map<string, string>();
    if (agenciesQuery.data) {
      for (const a of agenciesQuery.data) {
        const id = getCrmRecordId(a) || String(a.id ?? "");
        const name = readText(a, ["name", "title"]);
        if (id && name) {
          map.set(id, name);
        }
      }
    }
    return map;
  }, [agenciesQuery.data]);

  useQueryErrorToast([query.error, pendingAdsCountQuery.error], notify);

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      nextStatus,
      reason,
    }: {
      id: string;
      nextStatus: AdvertiseStatus;
      reason?: string;
    }) => updateCrmAdvertiseStatus(id, nextStatus, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "advertises"] });
      notify("وضعیت آگهی به‌روزرسانی شد.");
    },
  });

  const updateStatus = async (id: string, nextStatus: AdvertiseStatus) => {
    try {
      await statusMutation.mutateAsync({ id, nextStatus });
    } catch (error) {
      notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آگهی ناموفق بود."), "error");
    }
  };

  const openRejectModal = (id: string) => {
    setConfirm({
      body: "لطفاً دلیل رد آگهی را وارد کنید. این دلیل برای کاربر ثبت و نمایش داده می‌شود.",
      confirmLabel: "رد آگهی",
      onConfirm: async (reason) => {
        const normalizedReason = reason?.trim();
        if (!normalizedReason) throw new Error("دلیل رد آگهی الزامی است.");

        await statusMutation.mutateAsync({
          id,
          nextStatus: "needs_edit",
          reason: normalizedReason,
        });
      },
      prompt: {
        label: "دلیل رد آگهی",
        placeholder: "دلیل رد آگهی را بنویسید...",
        required: true,
      },
      title: "رد آگهی",
    });
  };

  return (
    <>
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white px-6 pt-3 pb-6 text-[#1a1a1a] [direction:rtl]">
        <div className="shrink-0">
          <nav aria-label="وضعیت آگهی‌ها" className="flex justify-end overflow-x-auto">
            <div className="inline-flex min-w-max items-center gap-12">
              {[{ label: "همه آگهی‌ها", value: "" }, ...advertiseStatusOptions].map((option) => {
                const isActive = status === option.value;

                return (
                  <Button
                    unstyled
                    aria-current={isActive ? "page" : undefined}
                    className={`relative inline-flex h-10 items-center gap-1.5 bg-transparent px-0 text-sm font-semibold whitespace-nowrap transition ${isActive ? "text-[#0048c4]" : "text-[#666666] hover:text-[#303030]"}`}
                    key={option.value || "all"}
                    onClick={() => {
                      setStatus(option.value);
                      setPage(1);
                    }}
                    type="button"
                  >
                    <span>{option.label}</span>
                    {option.value === "wait_for_admin" && pendingCount > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e53935] px-1.5 text-[11px] font-bold text-white">
                        {new Intl.NumberFormat("fa-IR").format(pendingCount)}
                      </span>
                    ) : null}
                    {isActive ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="medium"
                        weight="regular"
                        className="absolute right-0 -bottom-px h-0.5 w-full rounded-full bg-[#0048c4]"
                      />
                    ) : null}
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                unstyled
                className={`inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold transition ${showFilters ? "border-[#0048c4] text-[#0048c4]" : "border-[#cccccc] text-[#1a1a1a] hover:border-[#0048c4] hover:text-[#0048c4]"}`}
                onClick={() => setShowFilters((value) => !value)}
                type="button"
              >
                <CrmIcon name="filter" size={19} />
                فیلترها
              </Button>

              <label className="relative block h-10 w-[min(360px,42vw)] min-w-[240px]">
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-[#4d4d4d]"
                >
                  <CrmIcon name="search" size={19} />
                </Typography>
                <input
                  className="h-full w-full rounded-xl border border-[#cccccc] bg-white pr-4 pl-12 text-right text-sm font-medium text-[#303030] transition outline-none placeholder:text-[#999999] focus:border-[#0048c4]"
                  onChange={(event) => {
                    setTrackCode(event.target.value);
                    setPage(1);
                  }}
                  placeholder="جستجو با کد پیگیری"
                  type="search"
                  value={trackCode}
                />
              </label>
            </div>

            <PrimaryButton
              icon="plus"
              label="ثبت آگهی جدید"
              onClick={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>

        {showFilters ? (
          <form
            className="mt-5 flex shrink-0 flex-wrap items-end gap-3 rounded-xl bg-[#f5f5f5] p-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <FilterField label="کد پیگیری">
              <input
                className={inputClassName}
                onChange={(event) => {
                  setTrackCode(event.target.value);
                  setPage(1);
                }}
                placeholder="مثلاً ۱۲۳۴۵"
                value={trackCode}
              />
            </FilterField>
            <FilterField label="وضعیت">
              <CrmSelect
                className={inputClassName}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                value={status}
              >
                <option value="">همه وضعیت‌ها</option>
                {advertiseStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CrmSelect>
            </FilterField>
            {status || trackCode ? (
              <Button
                unstyled
                className={ghostButtonClassName}
                onClick={() => {
                  setStatus("");
                  setTrackCode("");
                  setPage(1);
                }}
                type="button"
              >
                پاک کردن فیلتر
              </Button>
            ) : null}
          </form>
        ) : null}

        <div
          ref={listContainerRef}
          className="mt-6 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pl-1"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 2xl:grid-cols-3">
            {query.isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="h-[430px] animate-pulse rounded-xl border border-[#f0f0f0] bg-white p-4"
                  key={index}
                >
                  <div className="h-[224px] rounded-2xl bg-[#e7ebf2]" />
                  <div className="mt-4 h-5 w-2/5 rounded-full bg-[#e7ebf2]" />
                  <div className="mt-3 h-4 w-4/5 rounded-full bg-[#eef0f4]" />
                  <div className="mt-3 h-4 w-3/5 rounded-full bg-[#eef0f4]" />
                </div>
              ))
            ) : advertises.length ? (
              advertises.map((ad, index) => {
                const id = getCrmRecordId(ad);
                const card = mapCrmAdvertiseToCard(ad, index);
                const agencyId =
                  readText(ad, ["agency_id", "publisher_agency_id", "assigned_agency_id"], "") ||
                  (ad.target_owner_type === "agency" ? readText(ad, ["target_owner_id"], "") : "");
                const ownerType = String(
                  ad.publisher_type ?? ad.owner_type ?? ad.target_owner_type ?? "",
                ).toLowerCase();
                const cardAgency =
                  card.agency && card.agency.trim() !== "شخصی" && card.agency.trim() !== "مشاور مستقل"
                    ? card.agency.trim()
                    : "";
                const resolvedAgencyName =
                  cardAgency ||
                  (agencyId ? agencyMap.get(agencyId) : "") ||
                  (agencyId || ownerType === "agency" ? "آژانس املاک" : "");
                const publisherRoleLabel = resolvedAgencyName
                  ? ""
                  : ownerType === "independent_consultant" || ownerType === "independent-consultant"
                    ? "مشاور مستقل"
                    : "شخصی";

                const formCode = card.formCode || readText(ad, ["form_code"], "");
                const hasVideo = Boolean(
                  (Array.isArray(ad.videos) && ad.videos.length > 0) ||
                    ad.video ||
                    ad.has_video === true ||
                    ad.has_video === "true",
                );
                const hasTour3d = Boolean(
                  typeof ad.virtual_tour_link === "string" && ad.virtual_tour_link.trim(),
                );

                return (
                  <article
                    className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white p-3 transition hover:border-[#d9e2f2]"
                    key={id}
                  >
                    <div>
                      <AdCard
                        ad={{
                          ...card,
                          agency: resolvedAgencyName,
                        }}
                        priceTrailingSlot={
                          formCode ? (
                            <span className="shrink-0 rounded-md bg-[#f0f4f8] px-2 py-0.5 text-xs font-semibold text-[#334155]">
                              {getFormName(formCode)}
                            </span>
                          ) : undefined
                        }
                        showAgency={Boolean(resolvedAgencyName)}
                        showStatusBadge
                        state={{ ad, card, status: ad.status }}
                        to={`/crm/advertises/${encodeURIComponent(id)}`}
                        variant="dashboard"
                      />
                    </div>

                    {hasVideo || hasTour3d ? (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1 text-[11px]">
                        {hasVideo ? (
                          <span
                            aria-label="دارای ویدیو"
                            title="دارای ویدیو"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#eef4ff] text-[#0048c4]"
                          >
                            <LinearVideo className="h-4 w-4" />
                          </span>
                        ) : null}
                        {hasTour3d ? (
                          <span
                            aria-label="دارای تور مجازی ۳D"
                            title="دارای تور مجازی ۳D"
                            className="inline-flex h-7 items-center gap-1 rounded-md bg-[#eef4ff] px-1.5 font-semibold text-[#0048c4]"
                          >
                            <LinearGps className="h-3.5 w-3.5" />
                            <span>3D</span>
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#808080]">
                        <div className="flex flex-col gap-1">
                          <Typography as="span" variant="body" size="medium" weight="regular">
                            کد پیگیری:{" "}
                            <strong className="font-semibold text-[#4d4d4d]">
                              {readText(ad, ["track_code"])}
                            </strong>
                          </Typography>
                          <Typography
                            as="span"
                            variant="body"
                            size="small"
                            weight="regular"
                            className="text-[#808080]"
                          >
                            تاریخ انتشار:{" "}
                            <strong className="font-medium text-[#4d4d4d]">
                              {formatDate(ad.confirm_date ?? ad.published_at ?? ad.created_at)}
                            </strong>
                          </Typography>
                        </div>
                        {resolvedAgencyName ? (
                          <span
                            className="inline-flex max-w-[160px] items-center gap-1 rounded-md bg-[#eef4ff] px-2 py-0.5 font-medium text-[#0048c4]"
                            title={resolvedAgencyName}
                          >
                            <LinearApartment className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{resolvedAgencyName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#f5f5f5] px-2 py-0.5 text-[#666666]">
                            {publisherRoleLabel}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                        <SmallActionButton
                          icon={<LinearEdit2 className="h-4 w-4" />}
                          label="ویرایش"
                          onClick={() =>
                            navigate(getCrmAdvertiseEditPath(id), {
                              state: getCrmAdvertiseEditState(id),
                            })
                          }
                          tone="primary"
                        />
                        <SmallActionButton
                          icon={<LinearCheckmark className="h-4 w-4" />}
                          label="تأیید"
                          onClick={() => updateStatus(id, "accepted")}
                          tone="success"
                        />
                        <SmallActionButton
                          icon={<LinearCancel className="h-4 w-4" />}
                          label="رد آگهی"
                          onClick={() => openRejectModal(id)}
                          tone="warning"
                        />
                        <SmallActionButton
                          icon={<LinearDelete className="h-4 w-4" />}
                          label="حذف"
                          onClick={() =>
                            setConfirm({
                              body: "این آگهی از فهرست فعال خارج و در وضعیت حذف‌شده قرار می‌گیرد.",
                              confirmLabel: "حذف آگهی",
                              onConfirm: async () => {
                                await statusMutation.mutateAsync({ id, nextStatus: "deleted" });
                              },
                              title: "حذف آگهی",
                            })
                          }
                          tone="danger"
                        />
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-full rounded-xl bg-white">
                <SearchEmptyState />
              </div>
            )}
          </div>
        </div>

        {!query.isLoading && (totalAds > 0 || totalPages > 1) ? (
          <CrmAdvertisesPagination
            currentPage={currentPage}
            isFetching={query.isFetching}
            onChangePage={handleChangePage}
            onChangePerPage={handleChangePerPage}
            perPage={perPage}
            total={totalAds}
            totalPages={totalPages}
          />
        ) : null}
      </section>

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
      <CrmAdvertiseCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}
