import type { Dispatch, SetStateAction } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "../businessCreationHelpers";
import { ActivityAreaSelect } from "./ActivityAreaSelect";
import { RequiredLabel } from "./RequiredLabel";

export function AgencyFields({
  agencyName,
  agencyNameError,
  neighborhoodsError,
  onOpenNeighborhoods,
  selectedNeighborhoods,
  setAgencyName,
  setSelectedNeighborhoods,
}: {
  agencyName: string;
  agencyNameError?: string | null;
  neighborhoodsError?: string | null;
  onOpenNeighborhoods: () => void;
  selectedNeighborhoods: NeighborhoodDto[];
  setAgencyName: (value: string) => void;
  setSelectedNeighborhoods: Dispatch<SetStateAction<NeighborhoodDto[]>>;
}) {
  const removeNeighborhood = (neighborhoodId: string) => {
    setSelectedNeighborhoods((current) =>
      current.filter((item) => getNeighborhoodId(item) !== neighborhoodId),
    );
  };

  return (
    <>
      <div>
        <RequiredLabel>نام آژانس املاک</RequiredLabel>
        <input
          aria-invalid={Boolean(agencyNameError)}
          className={`bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary mt-2 h-14 w-full rounded-xl border px-4 text-right text-base leading-6 font-normal outline-none ${agencyNameError ? "border-error" : "border-outline-var"}`}
          onChange={(event) => setAgencyName(event.target.value)}
          placeholder="مثال: املاک نوروزیان"
          value={agencyName}
        />
        {agencyNameError ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="text-error m-0 mt-2 text-right text-xs leading-5 font-medium"
          >
            {agencyNameError}
          </Typography>
        ) : null}
      </div>

      <div>
        <RequiredLabel>محدوده فعالیت</RequiredLabel>
        <div className="mt-2">
          <ActivityAreaSelect
            error={neighborhoodsError}
            onClick={onOpenNeighborhoods}
            onRemove={removeNeighborhood}
            placeholder="محدوده فعالیت خود را انتخاب کن"
            selectedNeighborhoods={selectedNeighborhoods}
          />
        </div>
        {neighborhoodsError ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="medium"
            className="text-error m-0 mt-2 text-right text-xs leading-5 font-medium"
          >
            {neighborhoodsError}
          </Typography>
        ) : null}
      </div>
    </>
  );
}
