import { SEO } from "../../../shared/components/SEO";
import { NoConnectionState } from "../../../shared/components/ErrorState";
import type { SearchFilterChip } from "../searchMapData";
import { SearchMapHeader } from "./SearchMapHeader";

interface SearchMapOfflineViewProps {
  chips: SearchFilterChip[];
  isCurrentSearchSaved: boolean;
  isSaveSearchDisabled: boolean;
  isSavingSearch: boolean;
  onBack: () => void;
  onChipClick: (chip: SearchFilterChip) => void;
  onChipRemove: (chip: SearchFilterChip) => void;
  onRetry: () => void;
  onSavedClick: () => void;
  onSearchClick: () => void;
  queryLabel: string;
  savedCount: number;
}

export function SearchMapOfflineView({
  chips,
  isCurrentSearchSaved,
  isSaveSearchDisabled,
  isSavingSearch,
  onBack,
  onChipClick,
  onChipRemove,
  onRetry,
  onSavedClick,
  onSearchClick,
  queryLabel,
  savedCount,
}: SearchMapOfflineViewProps) {
  return (
    <div className="bg-surface-container text-on-surface relative flex h-full min-h-0 flex-col overflow-hidden [direction:rtl]">
      <SEO
        title="جستجوی روی نقشه املاک | خرید و اجاره آپارتمان، خانه و زمین"
        description="جستجوی پیشرفته و موقعیت‌محور املاک روی نقشه نشونو."
      />
      <SearchMapHeader
        savedCount={savedCount}
        isCurrentSearchSaved={isCurrentSearchSaved}
        isSavingSearch={isSavingSearch}
        isSaveSearchDisabled={isSaveSearchDisabled}
        chips={chips}
        onChipClick={onChipClick}
        onChipRemove={onChipRemove}
        queryLabel={queryLabel}
        onSearchClick={onSearchClick}
        onSavedClick={onSavedClick}
        onBack={onBack}
      />
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <NoConnectionState onRetry={onRetry} />
      </div>
    </div>
  );
}
