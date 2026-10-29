import type { PropertySearchRequest } from "../../api/property-request.service";
import { isReceivedRequestNew } from "../requestHelpers";
import { ReceivedRequestCard } from "./ReceivedRequestCard";
import { ReceivedRequestsGuide } from "./ReceivedRequestsGuide";
import {
  EmptyRequestState,
  ReceivedRequestsSkeleton,
} from "./RequestManagementSkeletons";

export function RequestReceivedTab({
  errorDescription,
  errorTitle,
  isError,
  isLoading,
  isReceivedGuideVisible,
  onDelete,
  onDismissGuide,
  receivedRequests,
  variant,
}: {
  errorDescription: string;
  errorTitle: string;
  isError: boolean;
  isLoading: boolean;
  isReceivedGuideVisible: boolean;
  onDelete: (requestId: string) => void;
  onDismissGuide: () => void;
  receivedRequests: PropertySearchRequest[];
  variant: "account" | "default";
}) {
  return (
    <div className="bg-surface-container">
      {isReceivedGuideVisible ? (
        <ReceivedRequestsGuide onClose={onDismissGuide} />
      ) : null}

      {isLoading ? (
        <ReceivedRequestsSkeleton />
      ) : isError ? (
        <EmptyRequestState
          description={errorDescription}
          title={errorTitle}
          variant={variant}
        />
      ) : receivedRequests.length > 0 ? (
        <div aria-label="درخواست‌های دریافتی">
          {receivedRequests.map((request) => (
            <ReceivedRequestCard
              isNew={isReceivedRequestNew(request)}
              key={`received-${request.id}`}
              onDelete={() => onDelete(request.id)}
              request={request}
            />
          ))}
        </div>
      ) : (
        <EmptyRequestState
          description="درخواست‌های ملکی کاربران که برای آژانس شما ارسال شده‌اند، اینجا نمایش داده می‌شوند."
          title="هنوز درخواست دریافتی وجود ندارد"
          variant={variant}
        />
      )}
    </div>
  );
}
