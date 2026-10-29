import type { CrmRecord } from "../../api/crm.service";
import { getCrmRecordId } from "../../api/crm.service";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { CrmLocationMapSidebarHeader } from "./CrmLocationMapSidebarHeader";
import { CrmNeighborhoodItem } from "./CrmNeighborhoodItem";
import type { SubNeighborhoodRecord } from "../types";

export function CrmLocationMapSidebar({
  cityName,
  draftName,
  expandedNeighborhoodId,
  isError,
  isLoading,
  isPending,
  neighborhoods,
  newSubName,
  onChangeDraftName,
  onChangeNewSubName,
  onDeleteSubNeighborhood,
  onOpenNewSubInput,
  onRefetch,
  onSelectSubNeighborhood,
  onStartNeighborhoodBoundary,
  onStartNewNeighborhood,
  onStartNewSubNeighborhood,
  onStartSubNeighborhoodBoundary,
  onToggleExpand,
  onToggleNewNeighborhoodInput,
  selectedNeighborhoodId,
  selectedSubId,
  showNewNeighborhoodInput,
  showNewSubInputFor,
}: {
  cityName: string;
  draftName: string;
  expandedNeighborhoodId: string;
  isError: boolean;
  isLoading: boolean;
  isPending: boolean;
  neighborhoods: CrmRecord[];
  newSubName: string;
  onChangeDraftName: (value: string) => void;
  onChangeNewSubName: (value: string) => void;
  onDeleteSubNeighborhood: (subId: string, name: string) => void;
  onOpenNewSubInput: (neighborhoodId: string) => void;
  onRefetch: () => void;
  onSelectSubNeighborhood: (neighborhoodId: string, subId: string) => void;
  onStartNeighborhoodBoundary: (neighborhood: CrmRecord) => void;
  onStartNewNeighborhood: () => void;
  onStartNewSubNeighborhood: (neighborhood: CrmRecord) => void;
  onStartSubNeighborhoodBoundary: (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => void;
  onToggleExpand: (neighborhoodId: string) => void;
  onToggleNewNeighborhoodInput: () => void;
  selectedNeighborhoodId: string;
  selectedSubId: string;
  showNewNeighborhoodInput: boolean;
  showNewSubInputFor: string;
}) {
  return (
    <aside className="z-[500] flex min-h-0 flex-col border-l border-[#e6e8ec] bg-white shadow-[-8px_0_30px_rgba(26,26,26,0.05)]">
      <CrmLocationMapSidebarHeader
        cityName={cityName}
        draftName={draftName}
        isPending={isPending}
        onChangeDraftName={onChangeDraftName}
        onStartNewNeighborhood={onStartNewNeighborhood}
        onToggleNewNeighborhoodInput={onToggleNewNeighborhoodInput}
        showNewNeighborhoodInput={showNewNeighborhoodInput}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, index) => (
              <div className="h-14 animate-pulse rounded-xl bg-[#f3f4f6]" key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl bg-[#fff3f3] p-4 text-sm text-[#c11004]">
            دریافت محله‌ها یا زیرمحله‌ها با خطا مواجه شد.
            <Button className="mt-3" onClick={onRefetch} size="small" variant="secondary">
              تلاش دوباره
            </Button>
          </div>
        ) : neighborhoods.length ? (
          <div className="space-y-2">
            {neighborhoods.map((neighborhood) => (
              <CrmNeighborhoodItem
                expandedNeighborhoodId={expandedNeighborhoodId}
                isPending={isPending}
                key={getCrmRecordId(neighborhood)}
                neighborhood={neighborhood}
                newSubName={newSubName}
                onChangeNewSubName={onChangeNewSubName}
                onDeleteSubNeighborhood={onDeleteSubNeighborhood}
                onOpenNewSubInput={onOpenNewSubInput}
                onSelectSubNeighborhood={onSelectSubNeighborhood}
                onStartNeighborhoodBoundary={onStartNeighborhoodBoundary}
                onStartNewSubNeighborhood={onStartNewSubNeighborhood}
                onStartSubNeighborhoodBoundary={onStartSubNeighborhoodBoundary}
                onToggleExpand={onToggleExpand}
                selectedNeighborhoodId={selectedNeighborhoodId}
                selectedSubId={selectedSubId}
                showNewSubInputFor={showNewSubInputFor}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d9dce2] p-5 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 text-[#808080]"
            >
              هنوز محله‌ای برای این شهر ثبت نشده است.
            </Typography>
          </div>
        )}
      </div>
    </aside>
  );
}
