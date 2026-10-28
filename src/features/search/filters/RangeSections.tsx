import { type RangeBlock, type FilterState, type RangeGroupBlock } from "./filterTypes";
import { getFilterSectionAnchor } from "./blockGrouping";
import { RangeItemContent } from "./RangeItemContent";

export function SingleRangeSection({
  block,
  filters,
  setRangeValue,
}: {
  block: RangeBlock;
  filters: FilterState;
  setRangeValue: (id: string, key: "minimum" | "maximum", value: string) => void;
}) {
  const value = filters.ranges[block.id] ?? { minimum: "", maximum: "" };

  return (
    <section
      className="border-surface-container bg-surface-container-lowest scroll-mt-4 border-b-8 p-4"
      data-filter-section={getFilterSectionAnchor(block)}
      dir="rtl"
    >
      <RangeItemContent
        block={block}
        maximum={value.maximum}
        minimum={value.minimum}
        onMaximumChange={(nextValue) => setRangeValue(block.id, "maximum", nextValue)}
        onMinimumChange={(nextValue) => setRangeValue(block.id, "minimum", nextValue)}
      />
    </section>
  );
}

export function RangeGroupSection({
  block,
  filters,
  setRangeValue,
}: {
  block: RangeGroupBlock;
  filters: FilterState;
  setRangeValue: (id: string, key: "minimum" | "maximum", value: string) => void;
}) {
  return (
    <section
      className="border-surface-container bg-surface-container-lowest scroll-mt-4 border-b-8 p-4"
      data-filter-section={getFilterSectionAnchor(block)}
      dir="rtl"
    >
      {block.blocks.map((rangeBlock, index) => {
        const value = filters.ranges[rangeBlock.id] ?? { minimum: "", maximum: "" };

        return (
          <div key={rangeBlock.id}>
            {index > 0 ? <div className="border-outline-var my-4 border-t" /> : null}
            <RangeItemContent
              block={rangeBlock}
              maximum={value.maximum}
              minimum={value.minimum}
              onMaximumChange={(nextValue) => setRangeValue(rangeBlock.id, "maximum", nextValue)}
              onMinimumChange={(nextValue) => setRangeValue(rangeBlock.id, "minimum", nextValue)}
            />
          </div>
        );
      })}
    </section>
  );
}
