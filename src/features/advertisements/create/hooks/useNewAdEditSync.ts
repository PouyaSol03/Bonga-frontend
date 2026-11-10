import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { getApiErrorMessage } from "../../../../shared/api/api";
import { getCrmAdvertise } from "../../../crm/api/crm.service";
import { getV2Edit } from "../../api/v2";
import type { AdvertisementItem } from "../../api/advertisement.service";
import { normalizeCrmAdvertiseForEdit } from "../edit-mapping/crmEditNormalizer";
import { syncEditRouteParams } from "../edit-mapping/editRouteParams";
import { mapAdvertisementToEditValues } from "../edit-mapping/mapAdvertisementToEditValues";
import { getEditAdRouteState } from "../routeState";
import { shouldPreserveNewAdDraft } from "../session";
import type { NewAdFormValues } from "../types";
import { getDefaultValues } from "../utils";

interface UseNewAdEditSyncProps {
  activeRole: string;
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
  initialEditValuesRef?: React.MutableRefObject<NewAdFormValues | null>;
  isCrmEditMode: boolean;
  isCrmSource: boolean;
  isEditMode: boolean;
  methods: UseFormReturn<NewAdFormValues>;
  restoredValues?: Partial<NewAdFormValues>;
  setSubmitError: (error: string) => void;
}

export function useNewAdEditSync({
  activeRole,
  editAdId,
  editAdState,
  initialEditValuesRef: externalInitialEditValuesRef,
  isCrmEditMode,
  isCrmSource,
  isEditMode,
  methods,
  restoredValues,
  setSubmitError,
}: UseNewAdEditSyncProps) {
  const [editRouteVersion, setEditRouteVersion] = useState(0);
  const editDataAppliedRef = useRef<string | null>(null);
  const localInitialEditValuesRef = useRef<NewAdFormValues | null>(
    isEditMode && editAdState.ad
      ? mapAdvertisementToEditValues(
          editAdState.ad,
          getDefaultValues({ ...editAdState, isEditMode: true }),
        )
      : null,
  );
  const initialEditValuesRef = externalInitialEditValuesRef ?? localInitialEditValuesRef;

  const editAdQuery = useQuery<AdvertisementItem, Error>({
    enabled: Boolean(isEditMode && !isCrmEditMode && editAdId),
    queryFn: async () => {
      const id = String(editAdId);
      const res = (await getV2Edit(id)) as
        | { data?: AdvertisementItem; advertise?: AdvertisementItem }
        | AdvertisementItem;
      return (
        "data" in res && res.data
          ? res.data
          : "advertise" in res && res.advertise
            ? res.advertise
            : res
      ) as AdvertisementItem;
    },
    queryKey: ["advertisement", "edit-fields", editAdId, activeRole],
  });

  const crmEditAdQuery = useQuery({
    enabled: Boolean(isCrmEditMode && editAdId),
    queryFn: () => getCrmAdvertise(editAdId ?? ""),
    queryKey: ["crm", "advertise", "edit", editAdId],
  });

  const crmEditRecord = crmEditAdQuery.data;
  const editAdData = isCrmEditMode
    ? crmEditRecord
      ? normalizeCrmAdvertiseForEdit(crmEditRecord)
      : undefined
    : editAdQuery.data;

  const editAdIsError = isCrmEditMode ? crmEditAdQuery.isError : editAdQuery.isError;
  const editAdError = isCrmEditMode ? crmEditAdQuery.error : editAdQuery.error;
  const editAdIsLoading = isCrmEditMode ? crmEditAdQuery.isLoading : editAdQuery.isLoading;

  const isEditingIncomplete =
    isEditMode &&
    !isCrmSource &&
    (String(editAdData?.status) === "-5" ||
      editAdData?.status === "incomplete" ||
      editAdData?.status_code === -5 ||
      String(editAdData?.status_code) === "-5" ||
      String(editAdState.ad?.status) === "-5" ||
      editAdState.ad?.status === "incomplete" ||
      editAdState.status === "incomplete" ||
      String(editAdState.status) === "-5");

  useEffect(() => {
    if (!isEditMode) return undefined;
    if (!editAdData || !editAdId) return undefined;

    const appliedKey = `${isCrmEditMode ? "crm" : "user"}:${editAdId}`;
    if (editDataAppliedRef.current === appliedKey) return undefined;

    const routeChanged = syncEditRouteParams(editAdData);
    const editDefaults = getDefaultValues({
      ...editAdState,
      ad: editAdData,
      isEditMode: true,
    });
    const baselineEditValues = mapAdvertisementToEditValues(editAdData, editDefaults);
    if (externalInitialEditValuesRef) {
      externalInitialEditValuesRef.current = baselineEditValues;
    } else {
      localInitialEditValuesRef.current = baselineEditValues;
    }

    if (shouldPreserveNewAdDraft(window.history.state) && restoredValues) {
      editDataAppliedRef.current = appliedKey;
      if (routeChanged) {
        setTimeout(() => setEditRouteVersion((version) => version + 1), 0);
      }
      return undefined;
    }

    methods.reset(baselineEditValues);
    editDataAppliedRef.current = appliedKey;

    if (routeChanged) {
      setEditRouteVersion((version) => version + 1);
    }

    return undefined;
  }, [editAdData, editAdId, editAdState, isCrmEditMode, isEditMode, methods, restoredValues]);

  useEffect(() => {
    if (!isEditMode || !editAdIsError) return;

    setSubmitError(
      getApiErrorMessage(editAdError, "دریافت اطلاعات آگهی برای ویرایش با خطا مواجه شد."),
    );
  }, [editAdError, editAdIsError, isEditMode, setSubmitError]);

  return {
    crmEditRecord,
    editAdData,
    editAdIsLoading,
    editRouteVersion,
    initialEditValuesRef,
    isEditingIncomplete,
  };
}
