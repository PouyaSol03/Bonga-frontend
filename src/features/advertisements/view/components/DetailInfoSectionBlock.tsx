import { Typography } from "../../../../shared/ui/Typography";
import { AccommodationRatingBanner } from "../viewAdComponents";
import type { DetailInfoSection } from "../viewAdDetails";
import {
  DetailInfoChoiceRows,
  DetailInfoCheckBadges,
  DetailInfoItemCard,
  DetailInfoRowCard,
} from "./DetailInfoCards";

export function DetailInfoSectionBlock({
  section,
  separated = false,
}: {
  section: DetailInfoSection;
  separated?: boolean;
}) {
  const isRowsLayout = section.layout === "rows";

  return (
    <section
      className={`bg-surface-container-lowest px-4 ${separated ? "border-surface-container border-t-8" : ""}`}
    >
      <div className="py-4">
        <Typography variant="label" size="medium" weight="medium" className="text-outline">
          {section.title}
        </Typography>
      </div>
      <div aria-hidden="true" className="bg-outline-var h-px w-full" />

      {section.ratingBanner ? (
        <div className="pt-4">
          <AccommodationRatingBanner
            count={section.ratingBanner.count}
            label={section.ratingBanner.label}
          />
        </div>
      ) : null}

      {isRowsLayout ? (
        <div>
          {section.items.map((item, index) => (
            <DetailInfoRowCard
              item={item}
              key={`${section.title}-${item.label}`}
              showDivider={index < section.items.length - 1}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 justify-items-start gap-x-6 gap-y-6 py-4 [direction:rtl]">
            {section.items.map((item) => (
              <DetailInfoItemCard
                item={item}
                key={`${section.title}-${item.label}`}
                showIcon={section.showIcons === true}
              />
            ))}
          </div>

          <DetailInfoChoiceRows rows={section.choiceRows ?? []} />
          <DetailInfoCheckBadges badges={section.badges ?? []} />
        </>
      )}
    </section>
  );
}
