import { useNavigate } from "react-router";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  getStoredAuthSession,
  storeLoginRedirectPath,
} from "../../../shared/auth/auth-storage";
import { useToast } from "../../../shared/hooks/useToast";
import { useCreateAgencyChatMutation } from "../../chat/api/chat.hooks";
import type { AgencyPreviewTab } from "./types";
import { shareOrCopyAgencyUrl } from "./urlHelpers";

interface UseAgencyPreviewActionsParams {
  entityId: string;
  entityLabel: string;
  isAgentPreview: boolean;
  previewPath: string;
  publicAgencyQuery: { refetch: () => Promise<unknown> };
  publicAgentQuery: { refetch: () => Promise<unknown> };
  setActiveTab: (tab: AgencyPreviewTab) => void;
  shareText: string;
  shareTitle: string;
  shareUrl: string;
}

export function useAgencyPreviewActions({
  entityId,
  entityLabel,
  isAgentPreview,
  previewPath,
  publicAgencyQuery,
  publicAgentQuery,
  setActiveTab,
  shareText,
  shareTitle,
  shareUrl,
}: UseAgencyPreviewActionsParams) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createAgencyChatMutation = useCreateAgencyChatMutation();

  async function handleShareClick() {
    try {
      const result = await shareOrCopyAgencyUrl(shareUrl, shareTitle, shareText);
      if (result === "copied") {
        showToast(`لینک صفحه ${entityLabel} کپی شد.`);
      }
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }
      showToast("اشتراک‌گذاری با خطا مواجه شد.", "خطا", "error");
    }
  }

  const handleChatClick = () => {
    const authSession = getStoredAuthSession();
    if (!authSession) {
      storeLoginRedirectPath(window.location.pathname + window.location.search);
      navigate("/login");
      return;
    }

    if (!entityId) {
      showToast("شناسه برای شروع چت یافت نشد.", "خطا", "error");
      return;
    }

    createAgencyChatMutation.mutate(entityId, {
      onSuccess: (thread) => {
        const threadId = thread?.id ?? thread?.thread_id ?? thread?._id;
        if (threadId) {
          navigate(`/chat/${encodeURIComponent(String(threadId))}`);
        } else {
          navigate("/chat");
        }
      },
      onError: (err) => {
        showToast(
          getApiErrorMessage(err, "امکان چت آنلاین با این آژانس در حال حاضر فعال نیست."),
          "خطا",
          "error",
        );
      },
    });
  };

  function changeTab(tab: AgencyPreviewTab) {
    if (isAgentPreview && tab === "consultants") return;

    setActiveTab(tab);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.replaceState(
      window.history.state ?? {},
      "",
      `${previewPath}?${params.toString()}`,
    );
  }

  const retryPublicPreview = () => {
    if (isAgentPreview) {
      void publicAgentQuery.refetch();
    } else {
      void publicAgencyQuery.refetch();
    }
  };

  return {
    changeTab,
    createAgencyChatMutation,
    handleChatClick,
    handleShareClick,
    retryPublicPreview,
  };
}
