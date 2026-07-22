import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { type CrmRecord, listCrmAgencies, listCrmAgencyAgents, getCrmRecordId, updateCrmAgencyStatus, saveCrmUser } from "../../../services/crm.service";
import { getApiErrorMessage } from "../../../api/api";
import { AgencyAgentsModal, CrmIcon, CrmSelect, EditorModal, FilterField, Panel, PanelHeader, SmallActionButton, TableCell, TableEmptyRow, TableHead, TableLoadingRows, agencyStatusTextTone, consultantAgencyId, ghostButtonClassName, inputClassName, normalizeAgencyStatus, readText, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps, EditorState } from "../CrmLayout";

export function CrmAgenciesPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const filterName = name.trim();
  const [agentsAgency, setAgentsAgency] = useState<CrmRecord | null>(null);
  const [agentEditor, setAgentEditor] = useState<EditorState | null>(null);

  const query = useQuery({
    queryFn: () => listCrmAgencies({ name: filterName }),
    queryKey: ["crm", "agencies", filterName, refreshNonce],
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

  const agentSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CrmRecord }) => saveCrmUser(id, payload),
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
        const consultantRole = selectedAgencyId ? "real_estate_consultant" : "independent_consultant";

        await agentSaveMutation.mutateAsync({
          id,
          payload: {
            agency_id: selectedAgencyId || null,
            email: values.email ?? "",
            family: values.family ?? "",
            mobile: values.mobile ?? "",
            name: values.name ?? "",
            roles: ["user", consultantRole],
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
          {name ? (
            <button
              className={ghostButtonClassName}
              onClick={() => {
                setName("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </button>
          ) : null}
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="text-sm font-bold text-[#4d4d4d]">
                <TableHead>نام آژانس</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>موقعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <TableLoadingRows columns={5} rows={6} />
              ) : query.data?.length ? (
                query.data.map((agency) => {
                  const id = getCrmRecordId(agency);
                  const normalizedStatus = normalizeAgencyStatus(agency.status);
                  const isUpdatingThisAgency =
                    statusMutation.isPending && statusMutation.variables?.id === id;

                  return (
                    <tr key={id}>
                      <TableCell>
                        <span className="font-bold text-[#1a1a1a]">{readText(agency, ["name"])}</span>
                        <small className="mt-1 block text-sm text-[#9aa2af]">{id}</small>
                      </TableCell>
                      <TableCell><span dir="ltr">{readText(agency, ["phone1", "phone2", "phone3"])}</span></TableCell>
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
                      <TableCell><span dir="ltr">{readText(agency, ["lat"])}, {readText(agency, ["lng"])}</span></TableCell>
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
                <TableEmptyRow columns={5} message="آژانسی مطابق جستجوی شما پیدا نشد." />
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
