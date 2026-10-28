import { type FilterBlock, type RangeBlock } from "./filterTypes";

export function getFilterSectionAnchor(block: FilterBlock) {
  if (block.kind === "neighborhood") return "neighborhood";
  if (block.kind === "range-group") {
    return getFilterSectionAnchor(block.blocks[0]);
  }
  if (block.kind === "range") {
    if (["meterage", "landArea", "buildingArea", "projectMeterage"].includes(block.id))
      return "area";
    if (["price", "projectPrice", "dailyPrice", "rentPrice", "mortgagePrice"].includes(block.id))
      return "price";

    return block.id;
  }
  if ("id" in block) return block.id;

  return block.kind;
}

export function isSameRangeTopic(a?: FilterBlock, b?: FilterBlock): boolean {
  if (!a || !b || a.kind !== "range" || b.kind !== "range") return false;

  const isDimensionA = a.variant === "area" || a.variant === "number";
  const isDimensionB = b.variant === "area" || b.variant === "number";
  if (isDimensionA && isDimensionB) return true;

  const isRentPriceA = a.id === "rentPrice" || a.id === "mortgagePrice";
  const isRentPriceB = b.id === "rentPrice" || b.id === "mortgagePrice";
  if (isRentPriceA && isRentPriceB) return true;

  return false;
}

export function groupFilterBlocks(blocks: FilterBlock[]): FilterBlock[] {
  const result: FilterBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const current = blocks[i];
    if (current.kind === "range") {
      const group: RangeBlock[] = [current];
      while (
        i + 1 < blocks.length &&
        blocks[i + 1].kind === "range" &&
        isSameRangeTopic(group[group.length - 1], blocks[i + 1] as RangeBlock)
      ) {
        group.push(blocks[i + 1] as RangeBlock);
        i++;
      }

      if (group.length > 1) {
        result.push({
          blocks: group,
          id: group.map((b) => b.id).join("-"),
          kind: "range-group",
        });
      } else {
        result.push(current);
      }
    } else {
      result.push(current);
    }
    i++;
  }

  return result;
}
