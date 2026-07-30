import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { createCrmConsultant, listCrmAgents, type CrmConsultantStatus, listCrmAgencies, type CrmRecord, type CrmConsultantPayload, updateCrmConsultant, getCrmRecordId } from "../../../services/crm.service";
import { getApiErrorMessage } from "../../../api/api";
import { SwitchButton } from "../../../components/SwitchButton";
import { motion } from "motion/react";
import LinearEdit2 from "../../../components/(icons)/LinearEdit2";
import { CrmSelect, EditorModal, FilterField, Panel, PanelHeader, PrimaryButton, SmallActionButton, TableCell, SearchTableEmptyRow, TableHead, TableLoadingRows, consultantAgencyId, consultantAgencyName, consultantApiIdentifier, consultantStatusLabel, consultantStatusTone, consultantStatusValue, fullName, ghostButtonClassName, inputClassName, readText, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps, EditorState } from "../CrmLayout";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";

export function CrmConsultantsPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [statusFilter, setStatusFilter] = useState("");
  const [agencyOnly, setAgencyOnly] = useState(false);
  const [agencyIdFilter, setAgencyIdFilter] = useState("");
  const appliedFilters = useMemo(
    () => ({
      agencyId: agencyOnly ? agencyIdFilter : "",
      agencyOnly,
      search: debouncedSearch,
      status: statusFilter,
    }),
    [agencyIdFilter, agencyOnly, debouncedSearch, statusFilter],
  );
  const [editor, setEditor] = useState<EditorState | null>(null);

  const usersQuery = useQuery({
    queryFn: () => listCrmAgents({
      agencyId: appliedFilters.agencyId || undefined,
      page: 1,
      perPage: 100,
      search: appliedFilters.search || undefined,
      status: appliedFilters.status === "" ? undefined : appliedFilters.status as CrmConsultantStatus,
      type: appliedFilters.agencyOnly ? "dependent" : undefined,
    }),
    queryKey: [
      "crm",
      "consultants",
      "agents",
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.agencyOnly,
      appliedFilters.agencyId,
      refreshNonce,
    ],
  });
  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "consultants", "agencies", refreshNonce],
  });

  useQueryErrorToast([usersQuery.error, agenciesQuery.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmConsultantPayload }) =>
      id
        ? updateCrmConsultant(id, payload)
        : createCrmConsultant(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "overview", "users"] }),
      ]);
      notify("اطلاعات مشاور ذخیره شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ consultant, status }: { consultant: CrmRecord; status: Exclude<CrmConsultantStatus, "pending"> }) => {
      const id = getCrmRecordId(consultant);
      return updateCrmConsultant(id, { status });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
      ]);
      notify("وضعیت مشاور تغییر کرد.");
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "تغییر وضعیت مشاور ناموفق بود."), "error");
    },
  });

  const agencies = agenciesQuery.data ?? [];
  const agencyNames = useMemo<Map<string, string>>(
    () => new Map<string, string>(
      agencies.map((agency) => [
        getCrmRecordId(agency),
        readText(agency, ["name", "title"], "آژانس بدون نام"),
      ] as [string, string]),
    ),
    [agencies],
  );

  const consultants = useMemo(() => {
    const normalizedSearch = appliedFilters.search.trim().toLocaleLowerCase("fa-IR");

    return (usersQuery.data ?? []).filter((consultant) => {
      const agencyId = consultantAgencyId(consultant);
      const agencyName = consultantAgencyName(consultant, agencyNames);
      const isAgencyConsultant = readText(consultant, ["type"], "") === "dependent" || Boolean(agencyId);
      const matchesSearch = !normalizedSearch || [
        fullName(consultant),
        readText(consultant, ["mobile", "phone"], ""),
        agencyName,
      ].join(" ").toLocaleLowerCase("fa-IR").includes(normalizedSearch);
      const matchesStatus = appliedFilters.status === "" || consultantStatusValue(consultant) === appliedFilters.status;
      const matchesAgencyMode = !appliedFilters.agencyOnly || isAgencyConsultant;
      const matchesAgency = !appliedFilters.agencyOnly || !appliedFilters.agencyId || agencyId === appliedFilters.agencyId;

      return matchesSearch && matchesStatus && matchesAgencyMode && matchesAgency;
    });
  }, [agencyNames, appliedFilters, usersQuery.data]);

  const openConsultantEditor = (consultant: CrmRecord = {}) => {
    const id = getCrmRecordId(consultant) || null;
    const currentAgencyId = consultantAgencyId(consultant);
    const currentStatus = consultantStatusValue(consultant);

    setEditor({
      fields: [
        { label: "نام", name: "name", value: consultant.name },
        { label: "نام خانوادگی", name: "family", value: consultant.family },
        { label: "شماره موبایل", name: "mobile", value: consultant.mobile },
        {
          label: "آژانس محل فعالیت",
          name: "agency_id",
          options: [
            { label: "مشاور مستقل", value: "" },
            ...agencies.map((agency) => ({
              label: readText(agency, ["name", "title"], "آژانس بدون نام"),
              value: getCrmRecordId(agency),
            })),
          ],
          type: "select",
          value: currentAgencyId,
        },
        ...(id ? [{
          label: "وضعیت مشاور",
          name: "status",
          options: [
            { label: "در انتظار", value: "pending" },
            { label: "تأیید شده", value: "accept" },
            { label: "رد شده", value: "reject" },
          ],
          type: "select" as const,
          value: currentStatus,
        }] : []),
      ],
      onSubmit: async (values) => {
        const selectedAgencyId = values.agency_id?.trim() ?? "";

        if (id) {
          const selectedStatus = values.status;
          if (selectedStatus !== "pending" && selectedStatus !== "accept" && selectedStatus !== "reject") {
            throw new Error("یک وضعیت معتبر برای مشاور انتخاب کنید.");
          }

          await saveMutation.mutateAsync({
            id,
            payload: {
              name: values.name?.trim() ?? "",
              family: values.family?.trim() ?? "",
              mobile: values.mobile?.trim() ?? "",
              status: selectedStatus,
              type: selectedAgencyId ? "dependent" : "independent",
              agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
            },
          });
          return;
        }

        await saveMutation.mutateAsync({
          id: null,
          payload: {
            agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
            family: values.family?.trim() ?? "",
            mobile: values.mobile?.trim() ?? "",
            name: values.name?.trim() ?? "",
            status: "pending",
            type: selectedAgencyId ? "dependent" : "independent",
          },
        });
      },
      title: id ? "ویرایش مشاور" : "افزودن مشاور جدید",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          action={<PrimaryButton icon="plus" label="مشاور جدید" onClick={() => openConsultantEditor()} />}
          subtitle="مشاوران مستقل و وابسته به آژانس را جستجو، فیلتر و مدیریت کنید."
          title="مدیریت مشاورین"
        />

        <form className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4 lg:grid-cols-[minmax(220px,1fr)_190px_250px_minmax(220px,1fr)_auto]" onSubmit={(event) => event.preventDefault()}>
          <FilterField label="جستجو">
            <input
              className={inputClassName}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="نام، موبایل یا آژانس"
              type="search"
              value={search}
            />
          </FilterField>

          <FilterField label="وضعیت">
            <CrmSelect className={inputClassName} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="accept">تأیید شده</option>
              <option value="reject">رد شده</option>
            </CrmSelect>
          </FilterField>

          <div className="flex min-h-[66px] items-end">
            <div className="flex h-10 w-full items-center justify-between rounded-xl border border-[#dce3ef] bg-white px-3">
              <div>
                <Typography as="span" variant="label" size="medium" weight="semibold" className="block text-sm font-semibold text-[#303030]">فقط مشاوران آژانس</Typography>
              </div>
              <SwitchButton
                ariaLabel="فیلتر مشاوران وابسته به آژانس"
                checked={agencyOnly}
                onChange={(checked) => {
                  setAgencyOnly(checked);
                  if (!checked) setAgencyIdFilter("");
                }}
              />
            </div>
          </div>

          <FilterField label="آژانس">
            <CrmSelect
              className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-[#f0f0f0] disabled:text-[#a0a0a0]`}
              disabled={!agencyOnly}
              onChange={(event) => setAgencyIdFilter(event.target.value)}
              value={agencyIdFilter}
            >
              <option value="">همه آژانس‌ها</option>
              {agencies.map((agency) => {
                const id = getCrmRecordId(agency);
                return <option key={id} value={id}>{readText(agency, ["name", "title"], "آژانس بدون نام")}</option>;
              })}
            </CrmSelect>
          </FilterField>
          <div className="flex items-end gap-2">
            {(search || statusFilter || agencyOnly) ? <Button unstyled className={ghostButtonClassName} onClick={() => { setSearch(""); setStatusFilter(""); setAgencyOnly(false); setAgencyIdFilter(""); }} type="button">پاک کردن</Button> : null}
          </div>
        </form>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-right">
              <thead>
                <tr>
                  <TableHead>نام مشاور</TableHead>
                  <TableHead>شماره موبایل</TableHead>
                  <TableHead>آژانس</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {usersQuery.isLoading || agenciesQuery.isLoading ? (
                  <TableLoadingRows columns={5} rows={6} />
                ) : consultants.length ? (
                  consultants.map((consultant, index) => {
                    const id = getCrmRecordId(consultant);
                    const status = consultantStatusValue(consultant);
                    const agencyName = consultantAgencyName(consultant, agencyNames);
                    const isIndependent = agencyName === "مستقل";

                    return (
                      <motion.tr
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 8 }}
                        key={id}
                        transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.2 }}
                      >
                        <TableCell><Typography as="span" variant="label" size="medium" weight="semibold" className="font-bold text-[#1a1a1a]">{fullName(consultant)}</Typography></TableCell>
                        <TableCell><Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">{readText(consultant, ["mobile", "phone"])}</Typography></TableCell>
                        <TableCell>
                          <Typography as="span" variant="label" size="small" weight="semibold" className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${isIndependent ? "border-[#dce3ef] bg-[#f7f8fa] text-[#596477]" : "border-[#cfe4ff] bg-[#eef4ff] text-[#0048c4]"}`}>
                            {agencyName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <SwitchButton
                              ariaLabel={`تغییر وضعیت ${fullName(consultant)}`}
                              checked={status === "accept"}
                              onChange={() => statusMutation.mutate({
                                consultant,
                                status: status === "accept" ? "reject" : "accept",
                              })}
                            />
                            <Typography as="span" variant="label" size="small" weight="semibold" className={`text-xs font-bold ${consultantStatusTone(status)}`}>
                              {consultantStatusLabel(status)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <SmallActionButton
                            disabled={saveMutation.isPending || statusMutation.isPending}
                            icon={<LinearEdit2 className="h-4 w-4" />}
                            label="ویرایش"
                            onClick={() => openConsultantEditor(consultant)}
                            tone="primary"
                          />
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <SearchTableEmptyRow columns={5} />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
    </>
  );
}
