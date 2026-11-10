import { getCrmRecordId, type CrmRecord, type CrmConsultantStatus } from "../api/crm.service";
import { readText, readNestedText } from "./recordFormatters";

export function consultantAgencyId(consultant: CrmRecord) {
  const directId = readText(consultant, ["agency_id", "real_estate_agency_id", "agencyId"], "");

  if (directId) return directId;

  const agency = consultant.agency ?? consultant.real_estate_agency;
  return agency && typeof agency === "object" && !Array.isArray(agency)
    ? getCrmRecordId(agency as CrmRecord)
    : "";
}

export function consultantAgencyName(consultant: CrmRecord, agencyNames: Map<string, string>) {
  const directName =
    readText(consultant, ["agency_name", "real_estate_agency_name", "agency"], "") ||
    readNestedText(consultant, ["agency", "real_estate_agency"], ["name", "title"]);

  if (directName) return directName;

  const agencyId = consultantAgencyId(consultant);
  return agencyId ? (agencyNames.get(agencyId) ?? "آژانس ثبت‌شده") : "مستقل";
}

export function consultantStatusValue(consultant: CrmRecord): CrmConsultantStatus {
  const rawStatus = String(
    consultant.consultant_status ??
      consultant.status ??
      consultant.consultant_status_text ??
      "pending",
  )
    .trim()
    .toLowerCase();
  if (
    rawStatus === "1" ||
    rawStatus === "accept" ||
    rawStatus === "accepted" ||
    rawStatus === "approved"
  ) {
    return "accept";
  }
  if (rawStatus === "2" || rawStatus === "reject" || rawStatus === "rejected") {
    return "reject";
  }
  return "pending";
}

export function consultantStatusLabel(status: CrmConsultantStatus) {
  if (status === "accept") return "تأیید شده";
  if (status === "reject") return "رد شده";
  return "در انتظار";
}

export function consultantStatusTone(status: CrmConsultantStatus) {
  if (status === "accept") return "bg-[#e9f8f0] text-[#0b8b55] border border-[#a3e4c4]";
  if (status === "reject") return "bg-[#ffebed] text-[#ee3623] border border-[#f7b0b6]";
  return "bg-[#fff7df] text-[#ff6d00] border border-[#ffe099]";
}

export function consultantApiIdentifier(value: string) {
  const normalized = value.trim();
  return /^\d+$/.test(normalized) ? Number(normalized) : normalized;
}
