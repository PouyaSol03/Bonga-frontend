import type { CrmRecord } from "../../api/crm.service";
import { getCrmRecordId } from "../../api/crm.service";
import { readText } from "../../CrmLayout";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { parseSubNeighborhoods } from "../urlAndRecordHelpers";
import { getNeighborhoodPoints } from "../geometry/pointUtils";
import { CrmSubNeighborhoodsList } from "./CrmSubNeighborhoodsList";
import type { SubNeighborhoodRecord } from "../types";

export function CrmNeighborhoodItem({
  expandedNeighborhoodId,
  isPending,
  neighborhood,
  newSubName,
  onChangeNewSubName,
  onDeleteSubNeighborhood,
  onOpenNewSubInput,
  onSelectSubNeighborhood,
  onStartNeighborhoodBoundary,
  onStartNewSubNeighborhood,
  onStartSubNeighborhoodBoundary,
  onToggleExpand,
  selectedNeighborhoodId,
  selectedSubId,
  showNewSubInputFor,
}: {
  expandedNeighborhoodId: string;
  isPending: boolean;
  neighborhood: CrmRecord;
  newSubName: string;
  onChangeNewSubName: (value: string) => void;
  onDeleteSubNeighborhood: (subId: string, name: string) => void;
  onOpenNewSubInput: (neighborhoodId: string) => void;
  onSelectSubNeighborhood: (neighborhoodId: string, subId: string) => void;
  onStartNeighborhoodBoundary: (neighborhood: CrmRecord) => void;
  onStartNewSubNeighborhood: (neighborhood: CrmRecord) => void;
  onStartSubNeighborhoodBoundary: (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => void;
  onToggleExpand: (neighborhoodId: string) => void;
  selectedNeighborhoodId: string;
  selectedSubId: string;
  showNewSubInputFor: string;
}) {
  const neighborhoodId = getCrmRecordId(neighborhood);
  const neighborhoodName = readText(neighborhood, ["name"], "محله");
  const subNeighborhoods = parseSubNeighborhoods(neighborhood.sub_neighbors);
  const isExpanded = expandedNeighborhoodId === neighborhoodId;
  const isSelected = selectedNeighborhoodId === neighborhoodId && !selectedSubId;
  const hasBoundary = getNeighborhoodPoints(neighborhood).length >= 3;

  return (
    <section
      className={`overflow-hidden rounded-xl border ${isSelected ? "border-[#0048c4]" : "border-[#e6e8ec]"}`}
      key={neighborhoodId}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2.5 ${isSelected ? "bg-[#f2f6ff]" : "bg-white"}`}
      >
        <Button
          unstyled
          className="flex min-w-0 flex-1 items-center gap-2 text-right"
          onClick={() => onToggleExpand(neighborhoodId)}
          type="button"
        >
          <span className="min-w-0 flex-1">
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="block truncate text-[#1a1a1a]"
            >
              {neighborhoodName}
            </Typography>
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="mt-0.5 block text-[#808080]"
            >
              {subNeighborhoods.length
                ? `${subNeighborhoods.length} زیرمحله`
                : "بدون زیرمحله"}{" "}
              · {hasBoundary ? "مرزبندی شده" : "بدون مرزبندی"}
            </Typography>
          </span>
        </Button>
        <Button
          onClick={() => onStartNeighborhoodBoundary(neighborhood)}
          size="small"
          variant="secondary"
        >
          ویرایش
        </Button>
        <LinearArrowLeft1 className={`h-5 w-5 ${isExpanded ? "rotate-90" : ""}`} />
      </div>

      {isExpanded ? (
        <CrmSubNeighborhoodsList
          isPending={isPending}
          neighborhood={neighborhood}
          neighborhoodId={neighborhoodId}
          neighborhoodName={neighborhoodName}
          newSubName={newSubName}
          onChangeNewSubName={onChangeNewSubName}
          onDeleteSubNeighborhood={onDeleteSubNeighborhood}
          onOpenNewSubInput={onOpenNewSubInput}
          onSelectSubNeighborhood={onSelectSubNeighborhood}
          onStartNewSubNeighborhood={onStartNewSubNeighborhood}
          onStartSubNeighborhoodBoundary={onStartSubNeighborhoodBoundary}
          selectedNeighborhoodId={selectedNeighborhoodId}
          selectedSubId={selectedSubId}
          showNewSubInputFor={showNewSubInputFor}
          subNeighborhoods={subNeighborhoods}
        />
      ) : null}
    </section>
  );
}
