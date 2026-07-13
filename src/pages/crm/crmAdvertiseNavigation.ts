export function getCrmAdvertiseDetailPath(advertiseId: string) {
  return `/crm/advertises/${encodeURIComponent(advertiseId)}`;
}

export function getCrmAdvertiseCreatePath() {
  const params = new URLSearchParams({
    editSource: "crm",
  });

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
