import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCrmAdvertise, type CrmRecord  } from "../../../../crm/api/crm.service";

import { buildCrmAdvertisePayload } from "../../edit-mapping/crmEditNormalizer";
import type { NewAdFormValues } from "../../types";

export function useCrmSaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      original,
      values,
    }: {
      id: string | null;
      original?: CrmRecord;
      values: NewAdFormValues;
    }) =>
      buildCrmAdvertisePayload(values, original).then((payload) =>
        saveCrmAdvertise(
          id,
          payload,
          values.photos.flatMap((photo) => (photo.file ? [photo.file] : [])),
        ),
      ),
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
