export function normalizeAgencyStatus(status: unknown): "wait" | "accept" | "reject" {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "accept" ||
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "1"
  ) {
    return "accept";
  }

  if (
    normalized === "reject" ||
    normalized === "rejected" ||
    normalized === "denied" ||
    normalized === "2"
  ) {
    return "reject";
  }

  return "wait";
}

export function agencyStatusTextTone(status: unknown) {
  const normalized = normalizeAgencyStatus(status);
  if (normalized === "accept") return "text-[#0b8b55]";
  if (normalized === "reject") return "text-[#cc3342]";
  return "text-[#303030]";
}
