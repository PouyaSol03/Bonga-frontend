import { type FilterBlockRendererProps } from "./rendererTypes";
import { NeighborhoodFilterSection } from "./NeighborhoodFilterSection";
import { getFilterSectionAnchor } from "./blockGrouping";
import { RangeGroupSection, SingleRangeSection } from "./RangeSections";
import { TimeFilterSection, DateFilterSection } from "./DateTimeFilterSections";
import { SingleChoiceSection } from "./SingleChoiceSection";
import { getIcon } from "./filterIcons";
import { ExchangeFilterSection } from "./ExchangeFilterSection";
import { ChipSection } from "./ChipSection";
import { SwitchOnlySection, LoanFilterSection } from "./BooleanSections";
import { MetadataFilterBlock } from "./MetadataFilterBlock";

export function FilterBlockRenderer({
  applyButtonLabel,
  block,
  filters,
  focusTarget,
  nextBlock,
  onApply,
  previousBlock,
  setFilters,
  setRangeValue,
  setSingleValue,
  setToggleValue,
  toggleMultiValue,
}: FilterBlockRendererProps) {
  switch (block.kind) {
    case "neighborhood":
      return (
        <NeighborhoodFilterSection
          applyButtonLabel={applyButtonLabel}
          sectionId={getFilterSectionAnchor(block)}
          focusTarget={focusTarget}
          onApply={onApply}
          selectedNeighborhoods={filters.neighborhoods}
          onChange={(neighborhoods) => setFilters((current) => ({ ...current, neighborhoods }))}
        />
      );

    case "range-group":
      return <RangeGroupSection block={block} filters={filters} setRangeValue={setRangeValue} />;

    case "range":
      return <SingleRangeSection block={block} filters={filters} setRangeValue={setRangeValue} />;

    case "time":
      return (
        <TimeFilterSection
          sectionId={getFilterSectionAnchor(block)}
          title={block.title}
          value={filters.singles[block.id] ?? ""}
          onChange={(value) => setSingleValue(block.id, value)}
        />
      );

    case "date":
      return (
        <DateFilterSection
          sectionId={getFilterSectionAnchor(block)}
          title={block.title}
          value={filters.singles[block.id] ?? ""}
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              singles: { ...current.singles, [block.id]: value || undefined },
            }))
          }
        />
      );

    case "single":
      return (
        <SingleChoiceSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          onSelect={(value) => setSingleValue(block.id, value)}
          options={block.options}
          selected={filters.singles[block.id]}
          title={block.title}
        />
      );

    case "multi":
      if (block.id === "exchangeWith") {
        return (
          <ExchangeFilterSection
            icon={getIcon(block.icon)}
            sectionId={getFilterSectionAnchor(block)}
            onToggle={(value) => toggleMultiValue(block.id, value)}
            options={block.options}
            selected={filters.multis[block.id] ?? []}
            title={block.title}
          />
        );
      }

      return (
        <ChipSection
          icon={getIcon(block.icon)}
          sectionId={getFilterSectionAnchor(block)}
          showFeatureIcons={block.id === "heatingCooling" || block.id === "facilities"}
          onToggle={(value) => toggleMultiValue(block.id, value)}
          options={block.options}
          selected={filters.multis[block.id] ?? []}
          title={block.title}
        />
      );

    case "toggle": {
      const startsBooleanGroup = previousBlock?.kind !== "toggle";
      const endsBooleanGroup = nextBlock?.kind !== "toggle" && nextBlock?.kind !== "loan";

      return (
        <SwitchOnlySection
          checked={Boolean(filters.toggles[block.id])}
          groupEnd={endsBooleanGroup}
          groupStart={startsBooleanGroup}
          label={block.title}
          onChange={(checked) => setToggleValue(block.id, checked)}
        />
      );
    }

    case "loan":
      return (
        <LoanFilterSection
          checked={Boolean(filters.toggles.hasLoan)}
          groupStart={previousBlock?.kind !== "toggle"}
          onChange={(checked) => setToggleValue("hasLoan", checked)}
        />
      );

    case "advertiser":
    case "publicationTime":
    case "adFlags":
      return <MetadataFilterBlock block={block} filters={filters} setFilters={setFilters} />;

    default:
      return null;
  }
}
