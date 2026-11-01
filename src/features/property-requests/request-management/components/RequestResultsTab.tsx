import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { PropertyRequestResults } from "../../PropertyRequestResults";
import type { PropertyRequestResultsStatus } from "../../PropertyRequestResults";
import type { PropertySearchRequest } from "../../api/property-request.service";
import type { RequestFilterId } from "../types";
import {
  CriteriaRequestsSkeleton,
  EmptyRequestState,
} from "./RequestManagementSkeletons";

export function RequestResultsTab({
  activeFilterId,
  errorDescription,
  errorTitle,
  filteredRequests,
  isError,
  isLoading,
  onStatusChange,
  showResultsEmpty,
  variant,
}: {
  activeFilterId: RequestFilterId;
  errorDescription: string;
  errorTitle: string;
  filteredRequests: PropertySearchRequest[];
  isError: boolean;
  isLoading: boolean;
  onStatusChange: (status: PropertyRequestResultsStatus) => void;
  showResultsEmpty: boolean;
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
        showResultsEmpty ? "bg-surface-container-lowest" : "bg-surface-container space-y-2"
      }
    >
      {filteredRequests.map((request) => (
        <PropertyRequestResults
          bare
          className="bg-surface-container-lowest pb-5"
          compact
          hideWhenEmpty
          key={request.id}
          maxResults={4}
          onStatusChange={onStatusChange}
          request={request}
          showDismissAction
          showHeading={false}
        />
      ))}
      {showResultsEmpty ? (
        activeFilterId !== "all" ? (
          <SearchEmptyState />
        ) : (
          <EmptyRequestState
            description="پس از ثبت درخواست، نتیجه بررسی‌ها و پاسخ‌های مرتبط از اینجا نمایش داده می‌شود."
            title="هنوز نتیجه‌ای ثبت نشده است"
            variant={variant}
          />
        )
      ) : null}
    </div>
  );
}
