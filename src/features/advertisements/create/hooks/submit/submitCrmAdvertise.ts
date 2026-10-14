import type { NavigateFunction } from "react-router";
import { getApiErrorMessage } from "../../../../../shared/api/api";
import { getCrmRecordId, type CrmRecord  } from "../../../../crm/api/crm.service";

import { getEditAdRouteState } from "../../routeState";
import type { NewAdFormValues } from "../../types";
import { clearNewAdDraftStorage } from "../../utils";

interface SubmitCrmAdvertiseParams {
  crmEditRecord?: CrmRecord;
  crmSaveMutation: any;
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
  isEditMode: boolean;
  navigate: NavigateFunction;
  setFieldErrors: (errors: any) => void;
  setSubmitError: (error: string) => void;
  submitLockRef: React.MutableRefObject<boolean>;
  values: NewAdFormValues;
}

export function submitCrmAdvertise({
  crmEditRecord,
  crmSaveMutation,
  editAdId,
  editAdState,
  isEditMode,
  navigate,
  setFieldErrors,
  setSubmitError,
  submitLockRef,
  values,
}: SubmitCrmAdvertiseParams) {
  if (isEditMode && (!editAdId || !crmEditRecord)) {
    setSubmitError("اطلاعات آگهی برای ذخیره تغییرات در دسترس نیست.");
    return;
  }
  setFieldErrors({});
  setSubmitError("");
  submitLockRef.current = true;

  crmSaveMutation.mutate(
    { id: isEditMode ? editAdId : null, original: crmEditRecord, values },
    {
      onError: (error: unknown) =>
        setSubmitError(
          getApiErrorMessage(
            error,
            isEditMode ? "ویرایش آگهی با خطا مواجه شد." : "ثبت آگهی با خطا مواجه شد.",
          ),
        ),
      onSettled: () => {
        submitLockRef.current = false;
      },
      onSuccess: (savedAdvertise: any) => {
        clearNewAdDraftStorage();
        if (isEditMode && editAdId) {
          const returnTo =
            editAdState.editReturnTo ?? `/crm/advertises/${encodeURIComponent(editAdId)}`;
          const separator = returnTo.includes("?") ? "&" : "?";
          navigate(`${returnTo}${separator}updated=1`, {
            replace: true,
            state: { crmEditSuccess: true, isEditMode: true },
          });
          return;
        }
        const createdId = getCrmRecordId(savedAdvertise);
        navigate(
          createdId
            ? `/crm/advertises/${encodeURIComponent(createdId)}?created=1`
            : "/crm/advertises?created=1",
          { replace: true },
        );
      },
    },
  );
}
