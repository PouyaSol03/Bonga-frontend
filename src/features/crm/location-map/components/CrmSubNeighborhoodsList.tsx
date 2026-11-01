import type { CrmRecord } from "../../api/crm.service";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getSubNeighborhoodColor } from "../constants";
import { getSubNeighborhoodPoints } from "../geometry/pointUtils";
import type { SubNeighborhoodRecord } from "../types";

export function CrmSubNeighborhoodsList({
  isPending,
  neighborhood,
  neighborhoodId,
  neighborhoodName,
  newSubName,
  onChangeNewSubName,
  onDeleteSubNeighborhood,
  onOpenNewSubInput,
  onSelectSubNeighborhood,
  onStartNewSubNeighborhood,
  onStartSubNeighborhoodBoundary,
  selectedNeighborhoodId,
  selectedSubId,
  showNewSubInputFor,
  subNeighborhoods,
}: {
  isPending: boolean;
  neighborhood: CrmRecord;
  neighborhoodId: string;
  neighborhoodName: string;
  newSubName: string;
  onChangeNewSubName: (value: string) => void;
  onDeleteSubNeighborhood: (subId: string, name: string) => void;
  onOpenNewSubInput: (neighborhoodId: string) => void;
  onSelectSubNeighborhood: (neighborhoodId: string, subId: string) => void;
  onStartNewSubNeighborhood: (neighborhood: CrmRecord) => void;
  onStartSubNeighborhoodBoundary: (
    neighborhood: CrmRecord,
    subNeighborhood: SubNeighborhoodRecord,
  ) => void;
  selectedNeighborhoodId: string;
  selectedSubId: string;
  showNewSubInputFor: string;
  subNeighborhoods: SubNeighborhoodRecord[];
}) {
  return (
    <div className="border-t border-[#eeeeee] bg-[#fafafa] p-2">
      <div className="space-y-1.5">
        {subNeighborhoods.map((subNeighborhood) => {
          const subNeighborhoodColor = getSubNeighborhoodColor(
            `${neighborhoodId}:${subNeighborhood.id}`,
          );
          const isSubSelected =
            selectedNeighborhoodId === neighborhoodId && selectedSubId === subNeighborhood.id;
          const hasSubBoundary = getSubNeighborhoodPoints(subNeighborhood).length >= 3;

          return (
            <div
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${isSubSelected ? "" : "border-[#eeeeee] bg-white"}`}
              key={subNeighborhood.id}
              style={
                isSubSelected
                  ? {
                      backgroundColor: `${subNeighborhoodColor}12`,
                      borderColor: subNeighborhoodColor,
                    }
                  : undefined
              }
            >
              <Button
                unstyled
                className="min-w-0 flex-1 text-right"
                onClick={() => onSelectSubNeighborhood(neighborhoodId, subNeighborhood.id)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: subNeighborhoodColor }}
                  />
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="medium"
                    className="block min-w-0 truncate text-[#333333]"
                  >
                    {subNeighborhood.name}
                  </Typography>
                </span>
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="block text-[#909090]"
                >
                  {hasSubBoundary ? "مرزبندی شده" : "بدون مرزبندی"}
                </Typography>
              </Button>
              <Button
                onClick={() => onStartSubNeighborhoodBoundary(neighborhood, subNeighborhood)}
                size="small"
                variant="neutral-outline"
              >
                ویرایش
              </Button>
              <Button
                aria-label={`حذف ${subNeighborhood.name}`}
                disabled={isPending}
                onClick={() => onDeleteSubNeighborhood(subNeighborhood.id, subNeighborhood.name)}
                size="small"
                variant="text"
              >
                حذف
              </Button>
            </div>
          );
        })}
      </div>

      {showNewSubInputFor === neighborhoodId ? (
        <div className="mt-2 rounded-lg border border-dashed border-[#cdd7e7] bg-white p-2">
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#f2f6ff] px-2.5 py-2">
            <Typography
              as="span"
              variant="body"
              size="small"
              weight="regular"
              className="text-[#596477]"
            >
              محله انتخاب‌شده:
            </Typography>
            <Typography
              as="strong"
              variant="label"
              size="small"
              weight="semibold"
              className="truncate text-[#0048c4]"
            >
              {neighborhoodName}
            </Typography>
          </div>
          <div className="flex gap-2">
            <input
              autoFocus
              className="h-9 min-w-0 flex-1 rounded-lg border border-[#cccccc] px-2.5 text-sm outline-none focus:border-[#0048c4]"
              onChange={(event) => onChangeNewSubName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onStartNewSubNeighborhood(neighborhood);
              }}
              placeholder={`نام زیرمحله برای ${neighborhoodName}`}
              value={newSubName}
            />
            <Button
              onClick={() => onStartNewSubNeighborhood(neighborhood)}
              size="small"
              variant="primary"
            >
              ترسیم
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="mt-2"
          onClick={() => onOpenNewSubInput(neighborhoodId)}
          size="small"
          variant="ghost"
          fullWidth
        >
          + افزودن زیرمحله به {neighborhoodName}
        </Button>
      )}
    </div>
  );
}
