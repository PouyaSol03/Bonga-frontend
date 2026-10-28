import { type AdFormFilterSectionConfig } from "../../advertisements/forms";
import { type TransactionType, type CategoryKey } from "./categories";
import { type FilterBlock, type IconName } from "./filterTypes";
import { createRangeBlock } from "./fieldBlocks";
import { getFieldIcon } from "./fieldIcon";
import {
  getHeatingItemsForListing as getHeatingItems,
  getFacilityItemsForListing as getFacilityItems,
} from "../../advertisements/create/constants/listingOptions";

export function buildFilterBlocksFromSchema(
  sections: AdFormFilterSectionConfig[],
  transaction?: TransactionType,
  category?: CategoryKey,
): FilterBlock[] {
  return sections.map((section): FilterBlock => {
    switch (section.kind) {
      case "neighborhood":
        return { kind: "neighborhood" };
      case "loan":
        return { kind: "loan" };
      case "advertiser":
        return { kind: "advertiser" };
      case "publicationTime":
        return { kind: "publicationTime" };
      case "adFlags":
        return { kind: "adFlags" };
      case "range":
        return createRangeBlock(
          section.id!,
          section.title!,
          section.variant ?? "number",
          section.unit,
          section.showUnitInTitle ?? (section.variant === "area" || section.variant === "number"),
        );
      case "toggle":
        return {
          id: section.id!,
          kind: "toggle",
          title: section.title!,
        };
      case "date":
        return {
          id: section.id!,
          kind: "date",
          title: section.title!,
        };
      case "time":
        return {
          id: section.id!,
          kind: "time",
          title: section.title!,
        };
      case "single": {
        const icon = (section.icon ? section.icon : getFieldIcon(section.id!)) as IconName;
        const isAge = section.id === "age" || section.id === "buildingAge";
        if (isAge) {
          return {
            icon,
            id: section.id!,
            kind: "multi",
            options: (section.options ?? []).map((opt) =>
              typeof opt === "string" ? { id: opt, label: opt } : opt,
            ),
            title: section.title!,
            more: section.more,
            moreLimit: section.moreLimit,
            moreLabel: section.moreLabel,
            moreIcon: section.moreIcon,
          };
        }
        return {
          icon,
          id: section.id!,
          kind: "single",
          options: (section.options ?? []).map((opt) =>
            typeof opt === "string" ? opt : opt.label,
          ),
          title: section.title!,
          more: section.more,
          moreLimit: section.moreLimit,
          moreLabel: section.moreLabel,
          moreIcon: section.moreIcon,
        };
      }
      case "multi": {
        const icon = (section.icon ? section.icon : getFieldIcon(section.id!)) as IconName;
        let options = (section.options ?? []).map((opt) =>
          typeof opt === "string" ? { id: opt, label: opt } : opt,
        );
        if (options.length === 0 && transaction && category) {
          if (section.id === "heatingCooling") {
            options = [...getHeatingItems(transaction, category)];
          } else if (section.id === "facilities") {
            options = [...getFacilityItems(transaction, category)];
          }
        }
        return {
          icon,
          id: section.id!,
          kind: "multi",
          options,
          title: section.title!,
          more: section.more,
          moreLimit: section.moreLimit,
          moreLabel: section.moreLabel,
          moreIcon: section.moreIcon,
        };
      }
      default:
        return { kind: "neighborhood" };
    }
  });
}
