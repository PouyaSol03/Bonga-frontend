import { useNavigate } from "react-router";
import { useCreateAdvertiseChatMutation } from "../../../chat/api/chat.hooks";
import { getApiErrorMessage, isUnauthorizedApiError } from "../../../../shared/api/api";
import { getChatThreadId } from "./chatThreadId";
import type { useViewAdNavigation } from "./useViewAdNavigation";
import type { ShowViewAdToast } from "./useViewAdToast";

type Props = Pick<
  ReturnType<typeof useViewAdNavigation>,
  "adId" | "requireAuthorization" | "navigateToLoginRequiredPage"
> & { showToast: ShowViewAdToast };

export function useViewAdChat({
  adId,
  requireAuthorization,
  navigateToLoginRequiredPage,
  showToast,
}: Props) {
  const navigate = useNavigate();
  const createAdvertiseChat = useCreateAdvertiseChatMutation();
  const open = (actionLabel: string) => {
    if (!requireAuthorization(actionLabel)) return;
    if (createAdvertiseChat.isPending) return;

    createAdvertiseChat.mutate(String(adId), {
      onError: (error) => {
        if (isUnauthorizedApiError(error)) {
          navigateToLoginRequiredPage(actionLabel);
          return;
        }

        showToast(
          getApiErrorMessage(error, "شروع گفتگو با خطا مواجه شد. دوباره تلاش کنید."),
          "خطا",
          "error",
        );
      },
      onSuccess: (thread) => {
        const threadId = getChatThreadId(thread);

        if (!threadId) {
          showToast("شناسه گفتگو از سرور دریافت نشد.", "خطا", "error");
          return;
        }

        navigate(`/chat/${encodeURIComponent(threadId)}`, {
          state: {
            thread,
            threadId,
          },
        });
      },
    });
  };

  return { open, isPending: createAdvertiseChat.isPending };
}
