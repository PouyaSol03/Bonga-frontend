import type { EditorState } from "../CrmLayout";
import {
  consultantAgencyId,
  consultantAgencyName,
  consultantApiIdentifier,
  consultantStatusValue,
  fullName,
  readText,
} from "../CrmLayout";
import type { ConsultantFilters } from "./types";
import {
  type CrmRecord,
  type CrmConsultantPayload,
  getCrmRecordId,
} from "../api/crm.service";

export function filterConsultants(
  records: CrmRecord[],
  filters: ConsultantFilters,
  agencyNames: Map<string, string>,
): CrmRecord[] {
  const normalizedSearch = filters.search.trim().toLocaleLowerCase("fa-IR");

  return records.filter((consultant) => {
    const agencyId = consultantAgencyId(consultant);
    const agencyName = consultantAgencyName(consultant, agencyNames);
    const isAgencyConsultant =
      readText(consultant, ["type"], "") === "dependent" || Boolean(agencyId);
    const matchesSearch =
      !normalizedSearch ||
      [fullName(consultant), readText(consultant, ["mobile", "phone"], ""), agencyName]
        .join(" ")
        .toLocaleLowerCase("fa-IR")
        .includes(normalizedSearch);
    const matchesStatus =
      filters.status === "" || consultantStatusValue(consultant) === filters.status;
    const matchesAgencyMode = !filters.agencyOnly || isAgencyConsultant;
    const matchesAgency =
      !filters.agencyOnly || !filters.agencyId || agencyId === filters.agencyId;

    return matchesSearch && matchesStatus && matchesAgencyMode && matchesAgency;
  });
}

export function buildConsultantEditorState(
  consultant: CrmRecord,
  agencies: CrmRecord[],
  onSave: (id: string | null, payload: CrmConsultantPayload) => Promise<void>,
): EditorState {
  const id = getCrmRecordId(consultant) || null;
  const currentAgencyId = consultantAgencyId(consultant);
  const currentStatus = consultantStatusValue(consultant);

  return {
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
      ...(id
        ? [
            {
              label: "وضعیت مشاور",
              name: "status",
              options: [
                { label: "در انتظار", value: "pending" },
                { label: "تأیید شده", value: "accept" },
                { label: "رد شده", value: "reject" },
              ],
              type: "select" as const,
              value: currentStatus,
            },
          ]
        : []),
    ],
    onSubmit: async (values) => {
      const selectedAgencyId = values.agency_id?.trim() ?? "";

      if (id) {
        const selectedStatus = values.status;
        if (
          selectedStatus !== "pending" &&
          selectedStatus !== "accept" &&
          selectedStatus !== "reject"
        ) {
          throw new Error("یک وضعیت معتبر برای مشاور انتخاب کنید.");
        }

        await onSave(id, {
          agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
          family: values.family?.trim() ?? "",
          mobile: values.mobile?.trim() ?? "",
          name: values.name?.trim() ?? "",
          status: selectedStatus,
          type: selectedAgencyId ? "dependent" : "independent",
        });
        return;
      }

      await onSave(null, {
        agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
        family: values.family?.trim() ?? "",
        mobile: values.mobile?.trim() ?? "",
        name: values.name?.trim() ?? "",
        status: "pending",
        type: selectedAgencyId ? "dependent" : "independent",
      });
    },
    title: id ? "ویرایش مشاور" : "افزودن مشاور جدید",
  };
}
