import type { PropertySearchRequest } from "../../api/property-request.service";
import { CriteriaRequestCard } from "./CriteriaRequestCard";
import {
  CriteriaRequestsSkeleton,
  EmptyRequestState,
} from "./RequestManagementSkeletons";

export function RequestRequestsTab({
  errorDescription,
  errorTitle,
  isError,
  isLoading,
  onCancel,
  onEdit,
  requests,
  variant,
}: {
  errorDescription: string;
  errorTitle: string;
  isError: boolean;
  isLoading: boolean;
  onCancel: (requestId: string) => void;
  onEdit: (request: PropertySearchRequest) => void;
  requests: PropertySearchRequest[];
  variant: "account" | "default";
}) {
  if (isLoading) {
    return <CriteriaRequestsSkeleton />;
  }

  if (isError) {
    return (
      <EmptyRequestState
        description={errorDescription}
        title={errorTitle}
        variant={variant}
      />
    );
  }

  return (
    <div
      className={
        requests.length > 0
          ? "bg-surface-container space-y-2"
          : "bg-surface-container-lowest"
      }
    >
      {requests.map((request) => (
        <CriteriaRequestCard
          key={request.id}
          onCancel={() => onCancel(request.id)}
          onEdit={() => onEdit(request)}
          request={request}
        />
      ))}
      {requests.length === 0 ? (
        <EmptyRequestState
          description="پس از ثبت درخواست، اینجا نمایش داده می‌شود."
          title="هنوز درخواستی ثبت نشده است"
          variant={variant}
        />
      ) : null}
    </div>
  );
}
