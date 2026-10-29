import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  createCrmSubNeighborhood,
  deleteCrmSubNeighborhood,
  saveCrmNeighborhood,
  updateCrmSubNeighborhood,
  type CrmRecord,
  type CrmSubNeighborhoodPayload,
} from "../api/crm.service";

export function useCrmLocationMapMutations({
  cityId,
  notify,
}: {
  cityId: string;
  notify: (message: string, tone?: "error" | "success") => void;
}) {
  const queryClient = useQueryClient();

  const invalidateNeighborhoods = async () => {
    await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods", cityId] });
    await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
    await queryClient.invalidateQueries({ queryKey: ["crm", "sub-neighborhoods"] });
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmNeighborhood(id, payload),
    onError: (error) =>
      notify(getApiErrorMessage(error, "ذخیره محدوده جغرافیایی با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("محدوده جغرافیایی با موفقیت ذخیره شد.");
    },
  });

  const subNeighborhoodSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmSubNeighborhoodPayload }) =>
      id ? updateCrmSubNeighborhood(id, payload) : createCrmSubNeighborhood(payload),
    onError: (error) =>
      notify(getApiErrorMessage(error, "ذخیره زیرمحله با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("زیرمحله با موفقیت ذخیره شد.");
    },
  });

  const subNeighborhoodDeleteMutation = useMutation({
    mutationFn: deleteCrmSubNeighborhood,
    onError: (error) => notify(getApiErrorMessage(error, "حذف زیرمحله با خطا مواجه شد."), "error"),
    onSuccess: async () => {
      await invalidateNeighborhoods();
      notify("زیرمحله با موفقیت حذف شد.");
    },
  });

  const isPending =
    saveMutation.isPending ||
    subNeighborhoodSaveMutation.isPending ||
    subNeighborhoodDeleteMutation.isPending;

  const isSavePending = subNeighborhoodSaveMutation.isPending || saveMutation.isPending;

  return {
    isPending,
    isSavePending,
    saveMutation,
    subNeighborhoodDeleteMutation,
    subNeighborhoodSaveMutation,
  };
}
