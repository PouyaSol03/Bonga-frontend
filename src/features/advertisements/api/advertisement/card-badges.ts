import { type AdvertisementItem } from "./item-types";

export function resolveAdvertisementBadges(item: AdvertisementItem): string[] {
  const badges: string[] = [];
  const isSpecial =
    item.is_special === true ||
    item.is_special === 1 ||
    item.is_special === "true" ||
    item.is_special === "1" ||
    item.special === true ||
    item.special === 1 ||
    item.special === "true" ||
    item.special === "1";
  const isLadder =
    item.is_ladder === true ||
    item.is_ladder === 1 ||
    item.is_ladder === "true" ||
    item.is_ladder === "1" ||
    item.ladder === true ||
    item.ladder === 1 ||
    item.ladder === "true" ||
    item.ladder === "1";

  if (isSpecial) {
    badges.push("ویژه");
  }
  if (isLadder) {
    badges.push("بروزرسانی");
  }

  if (badges.length > 0) {
    return badges;
  }

  return Array.isArray(item.badges) ? item.badges : [];
}
