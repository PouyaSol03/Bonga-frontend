import { Typography } from "../../../../shared/ui/Typography";
import type { BusinessType, InfoCard } from "../types";

export function BusinessInfoCard({
  businessType,
  card,
  index,
}: {
  businessType: BusinessType;
  card: InfoCard;
  index: number;
}) {
  const imagePrefix = businessType === "agency" ? "agency" : "consultant";
  const imageSrc = `/figma/business-info/${imagePrefix}-${index + 1}.png`;
  const Icon = card.Icon;

  return (
    <article className="bg-surface-container-lowest px-4 pt-6 pb-5 text-right">
      <div className="flex items-start gap-2.5">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-primary text-on-primary grid h-10 w-10 shrink-0 place-items-center rounded-[8px]"
        >
          <Icon aria-hidden="true" className="h-6 w-6" />
        </Typography>
        <div className="min-w-0">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-primary m-0"
          >
            {card.title}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface-var m-0"
          >
            {card.subtitle}
          </Typography>
        </div>
      </div>

      <div className="bg-surface-container mt-4 overflow-hidden rounded-2xl">
        <img
          alt=""
          className="h-[250px] w-full object-cover object-center"
          draggable={false}
          src={imageSrc}
        />
      </div>

      {card.sections ? (
        <div className="mt-4 space-y-4">
          {card.sections.map((section, sectionIndex) => (
            <div key={`${card.title}-section-${sectionIndex}`}>
              {section.title ? (
                <Typography
                  as="h3"
                  variant="label"
                  size="large"
                  weight="semibold"
                  className="text-on-surface m-0"
                >
                  {section.title}
                </Typography>
              ) : null}

              {section.description ? (
                <Typography
                  as="p"
                  variant="body"
                  size="large"
                  weight="regular"
                  className={`text-on-surface m-0 ${section.title ? "mt-1" : ""}`}
                >
                  {section.description}
                </Typography>
              ) : null}

              {section.bullets?.length ? (
                <ul className="text-on-surface marker:text-tertiary m-0 mt-2 list-disc space-y-1.5 pr-6 text-base leading-7 font-normal">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="pr-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.afterBullets ? (
                <Typography
                  as="p"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="text-on-surface m-0 mt-1"
                >
                  {section.afterBullets}
                </Typography>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <>
          {card.description ? (
            <Typography
              as="p"
              variant="body"
              size="large"
              weight="regular"
              className="text-on-surface m-0 mt-4"
            >
              {card.description}
            </Typography>
          ) : null}

          {card.bullets?.length ? (
            <ul className="text-on-surface marker:text-tertiary m-0 mt-2 list-disc space-y-1.5 pr-6 text-base leading-7 font-normal">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="pr-1">
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </article>
  );
}
