import { type FilterBlockRendererProps } from "./rendererTypes";
import { SelectOnlySection } from "./SelectOnlySection";
import { advertiserOptions, publicationTimeOptions } from "./commonOptions";
import { getFilterSectionAnchor } from "./blockGrouping";
import { CheckboxRow } from "./BooleanSections";

export function MetadataFilterBlock({
  block,
  filters,
  setFilters,
}: Pick<FilterBlockRendererProps, "block" | "filters" | "setFilters">) {
  switch (block.kind) {
    case "advertiser":
      return (
        <SelectOnlySection
          label="آگهی دهنده"
          options={advertiserOptions}
          sectionId={getFilterSectionAnchor(block)}
          topPadding
          value={filters.advertiser}
          onChange={(advertiser) =>
            setFilters((current) => ({
              ...current,
              advertiser,
            }))
          }
        />
      );

    case "publicationTime":
      return (
        <SelectOnlySection
          label="زمان انتشار آگهی"
          options={publicationTimeOptions}
          sectionId={getFilterSectionAnchor(block)}
          value={filters.publicationTime}
          onChange={(publicationTime) =>
            setFilters((current) => ({
              ...current,
              publicationTime,
            }))
          }
        />
      );

    case "adFlags":
      return (
        <section className="bg-surface-container-lowest px-4 pb-2" dir="rtl">
          <CheckboxRow
            bottomFilter
            checked={filters.featured}
            divider
            label="آگهی ویژه"
            onChange={(featured) => setFilters((current) => ({ ...current, featured }))}
          />

          <CheckboxRow
            bottomFilter
            checked={filters.hasPhoto}
            divider
            label="آگهی با عکس"
            onChange={(hasPhoto) => setFilters((current) => ({ ...current, hasPhoto }))}
          />

          <CheckboxRow
            bottomFilter
            checked={filters.hasVideo}
            label="آگهی با ویدیو"
            onChange={(hasVideo) => setFilters((current) => ({ ...current, hasVideo }))}
          />
        </section>
      );

    default:
      return null;
  }
}
