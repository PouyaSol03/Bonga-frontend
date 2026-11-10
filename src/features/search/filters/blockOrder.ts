import { type FilterBlock } from "./filterTypes";
import { type CategoryKey } from "./categories";

export function getBlockOrderKey(block: FilterBlock) {
  if (block.kind === "neighborhood") return "neighborhood";
  if (block.kind === "loan") return "hasLoan";
  if (block.kind === "advertiser") return "advertiser";
  if (block.kind === "publicationTime") return "publicationTime";
  if (block.kind === "adFlags") return "adFlags";

  return block.id;
}

export function sortSaleApartmentBlocks(blocks: FilterBlock[]) {
  const order = [
    "neighborhood",
    "meterage",
    "price",
    "age",
    "rooms",
    "floor",
    "renovated",
    "furnished",
    "hasLoan",
    "documentType",
    "unitType",
    "unitPosition",
    "heatingCooling",
    "facilities",
    "exchangeWith",
    "advertiser",
    "publicationTime",
    "adFlags",
  ];
  const orderMap = new Map(order.map((key, index) => [key, index]));

  return [...blocks]
    .filter((block) => getBlockOrderKey(block) !== "totalFloors")
    .sort((first, second) => {
      const firstOrder = orderMap.get(getBlockOrderKey(first)) ?? Number.MAX_SAFE_INTEGER;
      const secondOrder = orderMap.get(getBlockOrderKey(second)) ?? Number.MAX_SAFE_INTEGER;

      return firstOrder - secondOrder;
    });
}

export function sortSaleResidentialBlocks(blocks: FilterBlock[], _category: CategoryKey) {
  const commonOrder = [
    "neighborhood",
    "meterage",
    "price",
    "age",
    "rooms",
    "floor",
    "documentType",
    "buildingType",
    "villaType",
    "landPosition",
    "hasLoan",
    "heatingCooling",
    "facilities",
    "exchangeWith",
    "advertiser",
    "publicationTime",
    "adFlags",
  ];

  const orderMap = new Map(commonOrder.map((key, index) => [key, index]));
  return [...blocks].sort(
    (a, b) =>
      (orderMap.get(getBlockOrderKey(a)) ?? Number.MAX_SAFE_INTEGER) -
      (orderMap.get(getBlockOrderKey(b)) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function dedupeBlocks(blocks: FilterBlock[]) {
  const seen = new Set<string>();

  return blocks.filter((block) => {
    const key = "id" in block ? `${block.kind}:${block.id}` : block.kind;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
