import { getApiErrorMessage, isUnauthorizedApiError } from "../../../../shared/api/api";
import { ViewAdFeedbackPage } from "../pages/ViewAdFeedbackPage";
import { ViewAdNotePage } from "../pages/ViewAdNotePage";
import { ViewAdViolationReportPage } from "../pages/ViewAdViolationReportPage";
import type { useViewAdSubmissions } from "./useViewAdSubmissions";

export function ViewAdSubmissionOverlays({
  note,
  feedback,
  report,
}: ReturnType<typeof useViewAdSubmissions>) {
  return (
    <>
      {feedback.isOpen ? (
        <ViewAdFeedbackPage
          isSubmitting={feedback.isSubmitting}
          onClose={() => feedback.setIsOpen(false)}
          onSubmit={feedback.submit}
        />
      ) : null}

      {note.isOpen ? (
        <ViewAdNotePage
          isSaving={note.isSaving}
          noteText={note.noteText}
          onChangeNote={note.setNoteText}
          onClose={() => note.setIsOpen(false)}
          onSave={note.save}
        />
      ) : null}

      {report.isOpen ? (
        <ViewAdViolationReportPage
          errorMessage={
            report.reasonsQuery.isError
              ? isUnauthorizedApiError(report.reasonsQuery.error)
                ? "برای ارسال گزارش تخلف، ابتدا وارد حساب کاربری شوید."
                : getApiErrorMessage(
                    report.reasonsQuery.error,
                    "دریافت دلایل گزارش با خطا مواجه شد.",
                  )
              : undefined
          }
          isLoading={report.reasonsQuery.isLoading}
          isSubmitting={report.isSubmitting}
          onClose={() => report.setIsOpen(false)}
          onRetry={() => void report.reasonsQuery.refetch()}
          onSubmit={report.submit}
          reasons={report.reasonsQuery.data ?? []}
        />
      ) : null}
    </>
  );
}
