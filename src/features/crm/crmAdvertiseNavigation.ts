function getCrmAdvertiseDetailPath(advertiseId: string) {
  return `/crm/advertises/${encodeURIComponent(advertiseId)}`;
}

export function getCrmAdvertiseCreatePath(options?: {
  agencyId?: string | number;
  agencyName?: string;
  targetOwnerType?: "user" | "agency";
  targetOwnerId?: string | number;
  targetOwnerName?: string;
  ownerFullName?: string;
  ownerPhone?: string;
  ownerExactAddress?: string;
}) {
  const params = new URLSearchParams({
    editSource: "crm",
  });

  const targetOwnerType = options?.targetOwnerType ?? (options?.agencyId ? "agency" : undefined);
  const targetOwnerId = options?.targetOwnerId ?? options?.agencyId;

  if (targetOwnerType) params.set("targetOwnerType", targetOwnerType);
  if (targetOwnerId !== undefined && targetOwnerId !== null && String(targetOwnerId).trim()) {
    params.set("targetOwnerId", String(targetOwnerId).trim());
  }

  const agencyId = options?.agencyId ?? (targetOwnerType === "agency" ? targetOwnerId : undefined);
  if (agencyId !== undefined && agencyId !== null && String(agencyId).trim()) {
    params.set("agencyId", String(agencyId).trim());
  }

  const agencyName = options?.agencyName ?? options?.targetOwnerName;
  if (agencyName?.trim()) {
    params.set("agencyName", agencyName.trim());
  }
  if (options?.targetOwnerName?.trim()) {
    params.set("targetOwnerName", options.targetOwnerName.trim());
  }
  if (options?.ownerFullName?.trim()) {
    params.set("ownerFullName", options.ownerFullName.trim());
  }
  if (options?.ownerPhone?.trim()) {
    params.set("ownerPhone", options.ownerPhone.trim());
  }
  if (options?.ownerExactAddress?.trim()) {
    params.set("ownerExactAddress", options.ownerExactAddress.trim());
  }

  return `/new-ad?${params.toString()}`;
}

export function getCrmAdvertiseEditPath(advertiseId: string) {
  const params = new URLSearchParams({
    adId: advertiseId,
    edit: "true",
    editSource: "crm",
  });

  return `/new-ad/details?${params.toString()}`;
}

export function getCrmAdvertiseEditState(advertiseId: string) {
  return {
    editReturnTo: getCrmAdvertiseDetailPath(advertiseId),
    isEditMode: true,
  };
}
