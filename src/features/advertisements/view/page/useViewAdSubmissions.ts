import { useEffect, useState } from "react";
import { useSaveAdvertiseNoteMutation } from "../../../account/api/account.hooks";
import {
  useAdvertiseReportReasonsQuery,
  useSubmitAdvertiseFeedbackMutation,
  useSubmitAdvertiseReportMutation,
} from "../../api/advertisement.hooks";
import type { AdvertiseFeedbackPayload } from "../../api/advertisement.service";
import { getApiErrorMessage, isUnauthorizedApiError } from "../../../../shared/api/api";
import type { ViolationReportSubmitPayload } from "../pages/ViewAdViolationReportPage";
import type { useViewAdNavigation } from "./useViewAdNavigation";
import type { ShowViewAdToast } from "./useViewAdToast";

type Props = Pick<
  ReturnType<typeof useViewAdNavigation>,
  "adId" | "requireAuthorization" | "navigateToLoginRequiredPage"
> & { showToast: ShowViewAdToast };

export function useViewAdSubmissions({
  adId,
  requireAuthorization,
  navigateToLoginRequiredPage,
  showToast,
}: Props) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isViolationReportOpen, setIsViolationReportOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const saveNote = useSaveAdvertiseNoteMutation();
  const submitFeedback = useSubmitAdvertiseFeedbackMutation();
  const submitReport = useSubmitAdvertiseReportMutation();
  const reportReasonsQuery = useAdvertiseReportReasonsQuery(isViolationReportOpen);
  useEffect(() => {
    if (!isViolationReportOpen || !reportReasonsQuery.isError) return;
    if (!isUnauthorizedApiError(reportReasonsQuery.error)) return;

    setIsViolationReportOpen(false);
    navigateToLoginRequiredPage("ارسال گزارش تخلف");
  }, [isViolationReportOpen, reportReasonsQuery.error, reportReasonsQuery.isError]);

  const handleSaveNote = () => {
    const cleanNote = noteText.trim();

    if (!adId || !cleanNote || saveNote.isPending) {
      return;
    }

    if (!requireAuthorization("ثبت یادداشت")) return;

    saveNote.mutate(
      { advertiseId: adId, note: cleanNote },
      {
        onError: (noteError) => {
          if (isUnauthorizedApiError(noteError)) {
            requireAuthorization("ثبت یادداشت");
            return;
          }

          showToast(getApiErrorMessage(noteError, "ثبت یادداشت با خطا مواجه شد."), "خطا", "error");
        },
        onSuccess: () => {
          setIsNoteOpen(false);
          showToast("یادداشت شما ثبت شد");
        },
      },
    );
  };

  const handleSubmitFeedback = (feedback: AdvertiseFeedbackPayload) => {
    if (!adId || submitFeedback.isPending) {
      return;
    }

    if (!requireAuthorization("ثبت بازخورد")) return;

    submitFeedback.mutate(
      { advertiseId: adId, feedback },
      {
        onError: (feedbackError) => {
          if (isUnauthorizedApiError(feedbackError)) {
            requireAuthorization("ثبت بازخورد");
            return;
          }

          showToast(
            getApiErrorMessage(feedbackError, "ثبت بازخورد با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsFeedbackOpen(false);
          showToast("بازخورد شما ثبت شد");
        },
      },
    );
  };

  const handleSubmitReport = ({ description, reportReasonId }: ViolationReportSubmitPayload) => {
    if (!adId || submitReport.isPending) {
      return;
    }

    if (!requireAuthorization("ارسال گزارش تخلف")) return;

    submitReport.mutate(
      {
        advertiseId: adId,
        description,
        reportReasonId,
      },
      {
        onError: (reportError) => {
          setIsViolationReportOpen(false);
          if (isUnauthorizedApiError(reportError)) {
            requireAuthorization("ارسال گزارش تخلف");
            return;
          }

          showToast(
            getApiErrorMessage(reportError, "ارسال گزارش تخلف با خطا مواجه شد."),
            "خطا",
            "error",
          );
        },
        onSuccess: () => {
          setIsViolationReportOpen(false);
          showToast("گزارش تخلف با موفقیت ثبت شد", "موفق", "success");
        },
      },
    );
  };

  return {
    note: {
      isOpen: isNoteOpen,
      setIsOpen: setIsNoteOpen,
      noteText,
      setNoteText,
      isSaving: saveNote.isPending,
      save: handleSaveNote,
    },
    feedback: {
      isOpen: isFeedbackOpen,
      setIsOpen: setIsFeedbackOpen,
      isSubmitting: submitFeedback.isPending,
      submit: handleSubmitFeedback,
    },
    report: {
      isOpen: isViolationReportOpen,
      setIsOpen: setIsViolationReportOpen,
      isSubmitting: submitReport.isPending,
      submit: handleSubmitReport,
      reasonsQuery: reportReasonsQuery,
    },
  };
}
