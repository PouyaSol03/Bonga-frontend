import type { NewAdFormValues, NewAdFieldErrors } from "../../types";
import type { SetDetailsField, OpenDetailsSheet } from "./types";
import { DetailsChipSection } from "./DetailsChipSection";
import { formatFacilityChipLabel, toggleArray } from "./formatters";
import { getDetailsListingOptions } from "./listingOptions";
import { useDetailsFacilities } from "./useDetailsFacilities";

export function DetailsAmenities({
  transaction,
  category,
  values,
  errors,
  setField,
  setSheet,
  hideHeatingCooling,
  showFacilitiesSection,
}: {
  transaction: string;
  category: string;
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  setSheet: OpenDetailsSheet;
  hideHeatingCooling: boolean;
  showFacilitiesSection: boolean;
}) {
  const { heatingItemsForListing, facilityItemsForCategory } = getDetailsListingOptions(
    transaction,
    category,
  );
  const handleFacilityClick = useDetailsFacilities(values, setField, setSheet);
  return (
    <>
      {!hideHeatingCooling ? (
        <DetailsChipSection
          items={heatingItemsForListing}
          selected={values.heatingCooling}
          onSelect={(id) => setField("heatingCooling", toggleArray(values.heatingCooling, id))}
          error={errors.heatingCooling}
          icon="tempreture.svg"
          title={transaction === "project" ? "سرمایش و گرمایش" : "گرمایش و سرمایش"}
        />
      ) : null}
      {showFacilitiesSection ? (
        <DetailsChipSection
          items={facilityItemsForCategory}
          selected={values.facilities}
          onSelect={handleFacilityClick}
          error={errors.facilities}
          icon="features.svg"
          title="امکانات"
          measureKey={`${values.elevatorCount}-${values.parkingCount}-${values.terraceCount}`}
          getDisplayLabel={(item) =>
            item.id === "elevator" && values.elevatorCount
              ? formatFacilityChipLabel(item.label, values.elevatorCount)
              : item.id === "parking" && values.parkingCount
                ? formatFacilityChipLabel(item.label, values.parkingCount)
                : item.id === "terrace" && values.terraceCount
                  ? formatFacilityChipLabel(item.label, values.terraceCount)
                  : undefined
          }
        />
      ) : null}
    </>
  );
}
