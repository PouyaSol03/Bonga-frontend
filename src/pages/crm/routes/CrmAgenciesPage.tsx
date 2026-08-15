import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type CrmConsultantPayload, type CrmRecord, listCrmAgencies, listCrmAgencyAgents, getCrmRecordId, setCrmAgencyTrusted, updateCrmAgencyStatus, updateCrmConsultant } from "../../../core/services/crm.service";
import { getApiErrorMessage } from "../../../core/api/api";
import { AgencyAgentsModal, CrmIcon, CrmSelect, EditorModal, FilterField, Panel, PanelHeader, SmallActionButton, TableCell, SearchTableEmptyRow, TableHead, TableLoadingRows, agencyStatusTextTone, consultantAgencyId, consultantApiIdentifier, ghostButtonClassName, inputClassName, normalizeAgencyStatus, readText, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps, EditorState } from "../CrmLayout";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { SwitchButton } from "../../../shared/components/SwitchButton";

type TrustedAgencyFilter = "" | "true" | "false";

function isTrustedAgency(agency: CrmRecord) {
  return (
    agency.is_trusted === true ||
    agency.is_trusted === 1 ||
    agency.is_trusted === "1" ||
    agency.is_trusted === "true"
  );
}

export function CrmAgenciesPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [trustedFilter, setTrustedFilter] = useState<TrustedAgencyFilter>("");
  const filterName = name.trim();
  const trusted = trustedFilter === "" ? undefined : trustedFilter === "true";
  const [agentsAgency, setAgentsAgency] = useState<CrmRecord | null>(null);
  const [agentEditor, setAgentEditor] = useState<EditorState | null>(null);

  const query = useQuery({
    queryFn: () => listCrmAgencies({ name: filterName, trusted }),
    queryKey: ["crm", "agencies", filterName, trustedFilter, refreshNonce],
  });
  const agencyAgentsQuery = useQuery({
    enabled: Boolean(agentsAgency),
    queryFn: () => listCrmAgencyAgents(getCrmRecordId(agentsAgency ?? {})),
    queryKey: ["crm", "agencies", getCrmRecordId(agentsAgency ?? {}), "agents"],
  });
  const agencyOptionsQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "agencies", "editor-options", refreshNonce],
  });

  useQueryErrorToast([query.error, agencyAgentsQuery.error, agencyOptionsQuery.error], notify);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accept" | "reject" }) =>
      updateCrmAgencyStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "agencies"] });
      notify("وضعیت آژانس به‌روزرسانی شد.");
    },
  });

  const trustedMutation = useMutation({
    mutationFn: ({ id, isTrusted }: { id: string; isTrusted: boolean }) =>
      setCrmAgencyTrusted(id, isTrusted),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] }),
        queryClient.invalidateQueries({ queryKey: ["agencies"] }),
      ]);
      notify("فهرست آژانس‌های مورد اعتماد به‌روزرسانی شد.");
    },
  });

  const agentSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CrmConsultantPayload> }) => updateCrmConsultant(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
      ]);
      notify("اطلاعات مشاور ذخیره شد.");
    },
  });

  const openAgencyAgentEditor = (agent: CrmRecord) => {
    const id = getCrmRecordId(agent);
    if (!id) return;

    const currentAgencyId = consultantAgencyId(agent) || getCrmRecordId(agentsAgency ?? {});
    const agencyOptions = agencyOptionsQuery.data ?? [];

    setAgentsAgency(null);
    setAgentEditor({
      fields: [
        { label: "نام", name: "name", value: agent.name },
        { label: "نام خانوادگی", name: "family", value: agent.family },
        { label: "شماره موبایل", name: "mobile", value: agent.mobile ?? agent.phone },
        { label: "ایمیل", name: "email", type: "email", value: agent.email },
        {
          label: "آژانس محل فعالیت",
          name: "agency_id",
          options: [
            { label: "مشاور مستقل", value: "" },
            ...agencyOptions.map((agency) => ({
              label: readText(agency, ["name", "title"], "آژانس بدون نام"),
              value: getCrmRecordId(agency),
            })),
          ],
          type: "select",
          value: currentAgencyId,
        },
      ],
      onSubmit: async (values) => {
        const selectedAgencyId = values.agency_id?.trim() ?? "";
        await agentSaveMutation.mutateAsync({
          id,
          payload: {
            agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
            family: values.family?.trim() ?? "",
            mobile: values.mobile?.trim() ?? "",
            name: values.name?.trim() ?? "",
            type: selectedAgencyId ? "dependent" : "independent",
          },
        });
      },
      title: "ویرایش مشاور",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          subtitle="در این بخش فقط می‌توانید درخواست آژانس را تایید یا رد کنید."
          title="فهرست آژانس‌ها"
        />

        <form
          className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="نام آژانس">
            <input className={inputClassName} onChange={(event) => setName(event.target.value)} placeholder="جستجوی نام" value={name} />
          </FilterField>
          <FilterField label="مورد اعتماد">
            <CrmSelect
              aria-label="فیلتر آژانس‌های مورد اعتماد"
              className={inputClassName}
              onChange={(event) => setTrustedFilter(event.target.value as TrustedAgencyFilter)}
              value={trustedFilter}
            >
              <option value="">همه</option>
              <option value="true">مورد اعتماد</option>
              <option value="false">غیر مورد اعتماد</option>
            </CrmSelect>
          </FilterField>
          {name || trustedFilter ? (
            <Button unstyled
              className={ghostButtonClassName}
              onClick={() => {
                setName("");
                setTrustedFilter("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </Button>
          ) : null}
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="text-sm font-bold text-[#4d4d4d]">
                <TableHead>نام آژانس</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>مورد اعتماد</TableHead>
                <TableHead>موقعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <TableLoadingRows columns={6} rows={6} />
              ) : query.data?.length ? (
                query.data.map((agency) => {
                  const id = getCrmRecordId(agency);
                  const normalizedStatus = normalizeAgencyStatus(agency.status);
                  const trustedAgency = isTrustedAgency(agency);
                  const isUpdatingThisAgency =
                    statusMutation.isPending && statusMutation.variables?.id === id;
                  const isUpdatingTrustedAgency =
                    trustedMutation.isPending && trustedMutation.variables?.id === id;

                  return (
                    <tr key={id}>
                      <TableCell>
                        <Typography as="span" variant="label" size="medium" weight="semibold" className="font-bold text-[#1a1a1a]">{readText(agency, ["name"])}</Typography>
                        <small className="mt-1 block text-sm text-[#9aa2af]">{id}</small>
                      </TableCell>
                      <TableCell><Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">{readText(agency, ["phone1", "phone2", "phone3"])}</Typography></TableCell>
                      <TableCell>
                        <CrmSelect
                          aria-label={`وضعیت ${readText(agency, ["name"])}`}
                          className={`h-10 min-w-[156px] rounded-lg border border-[#dce3ef] bg-white pr-3 text-sm font-bold outline-none transition focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10 disabled:cursor-not-allowed disabled:opacity-60 ${agencyStatusTextTone(agency.status)}`}
                          disabled={!id || isUpdatingThisAgency}
                          onChange={async (event) => {
                            const status = event.target.value;

                            if (status !== "accept" && status !== "reject") return;

                            try {
                              await statusMutation.mutateAsync({ id, status });
                            } catch (error) {
                              notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آژانس ناموفق بود."), "error");
                            }
                          }}
                          value={normalizedStatus === "wait" ? "" : normalizedStatus}
                        >
                          <option disabled hidden value="">انتخاب وضعیت</option>
                          <option className="bg-white text-[#0b8b55]" style={{ backgroundColor: "#ffffff", color: "#0b8b55" }} value="accept">تایید</option>
                          <option className="bg-white text-[#cc3342]" style={{ backgroundColor: "#ffffff", color: "#cc3342" }} value="reject">رد شده</option>
                        </CrmSelect>
                      </TableCell>
                      <TableCell>
                        <SwitchButton
                          ariaLabel={`مورد اعتماد ${readText(agency, ["name"])}`}
                          checked={trustedAgency}
                          disabled={
                            !id ||
                            isUpdatingTrustedAgency ||
                            (!trustedAgency && normalizedStatus !== "accept")
                          }
                          onChange={async (nextTrusted) => {
                            try {
                              await trustedMutation.mutateAsync({ id, isTrusted: nextTrusted });
                            } catch (error) {
                              notify(getApiErrorMessage(error, "به‌روزرسانی آژانس مورد اعتماد ناموفق بود."), "error");
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell><Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">{readText(agency, ["lat"])}, {readText(agency, ["lng"])}</Typography></TableCell>
                      <TableCell>
                        <SmallActionButton
                          icon={<CrmIcon name="users" size={16} />}
                          label="مشاوران"
                          onClick={() => setAgentsAgency(agency)}
                        />
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <SearchTableEmptyRow columns={6} />
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <AgencyAgentsModal
        agency={agentsAgency}
        agents={agencyAgentsQuery.data ?? []}
        isLoading={agencyAgentsQuery.isLoading}
        onClose={() => setAgentsAgency(null)}
        onEdit={openAgencyAgentEditor}
      />
      <EditorModal
        editor={agentEditor}
        isPending={agentSaveMutation.isPending}
        notify={notify}
        onClose={() => setAgentEditor(null)}
      />
    </>
  );
}
