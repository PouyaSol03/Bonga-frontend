import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveCrmAdvertise,
  createCrmAgencyAdvertise,
  createCrmUserAdvertise,
  type CrmRecord,
} from "../../../../crm/api/crm.service";

import { buildCrmAdvertisePayload } from "../../edit-mapping/crmEditNormalizer";
import type { NewAdFormValues } from "../../types";

export function useCrmSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      original,
      values,
      dynamicFieldKeys,
    }: {
      id: string | null;
      original?: CrmRecord;
      values: NewAdFormValues;
      dynamicFieldKeys?: Iterable<string>;
    }) =>
      buildCrmAdvertisePayload(values, original, { dynamicFieldKeys }).then((payload) => {
        const targetType = payload.target_owner_type || values.targetOwnerType;
        const targetId = payload.target_owner_id || values.targetOwnerId;

        const forbiddenFeatureKeys = new Set([
          "agency_id",
          "consultant_id",
          "publisher",
          "has_virtual_tour",
          "has_image",
          "has_video",
          "location",
          "form_code",
          "owner_type",
          "target_owner_type",
          "target_owner_id",
          "request_id",
          "reason",
        ]);

        if (!id && targetType === "agency" && targetId) {
          const { owner_type, target_owner_type, target_owner_id, ...cleanPayload } = payload;
          const cleanFeatures = (cleanPayload.features || []).filter(
            (feature) => !forbiddenFeatureKeys.has(feature.key),
          );

          return createCrmAgencyAdvertise(targetId, {
            advertisement: {
              ...cleanPayload,
              features: cleanFeatures,
            },
          });
        }

        if (!id && targetType === "user" && targetId) {
          const { owner_type, target_owner_type, target_owner_id, ...cleanPayload } = payload;
          const cleanFeatures = (cleanPayload.features || []).filter(
            (feature) => !forbiddenFeatureKeys.has(feature.key),
          );

          return createCrmUserAdvertise(targetId, {
            advertisement: {
              ...cleanPayload,
              features: cleanFeatures,
            },
          });
        }

        return saveCrmAdvertise(
          id,
          payload,
          values.photos.flatMap((photo) => (photo.file ? [photo.file] : [])),
        );
      }),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertise"] });
      if (variables.id) {
        await queryClient.invalidateQueries({
          queryKey: ["crm", "advertise", "edit", variables.id],
        });
      }
    },
  });
}
