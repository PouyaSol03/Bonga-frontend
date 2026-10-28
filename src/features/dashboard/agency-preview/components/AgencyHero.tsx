import type { ReactNode } from "react";
import LinearBuilding2 from "../../../../shared/icons/LinearBuilding2";
import LinearLocation from "../../../../shared/icons/LinearLocation";
import { Typography } from "../../../../shared/ui/Typography";
import { formatRankingLevelTitle } from "../../utils/rankingLevels";

interface AgencyHeroProps {
  agencyLocation: string;
  agencyLogo?: string;
  agencyName: string;
  agencyStats: Array<{ icon: ReactNode; label: string; value: string }>;
  isAgent?: boolean;
  levelSlug?: string;
}

export function AgencyHero({
  agencyLocation,
  agencyLogo,
  agencyName,
  agencyStats,
  isAgent = false,
  levelSlug,
}: AgencyHeroProps) {
  return (
    <section className="bg-surface-container-lowest px-4 pt-3 pb-4 text-center">
      {agencyLogo ? (
        <img
          alt={agencyName}
          className={`mx-auto h-19 w-19 ${isAgent ? "rounded-full object-cover" : "object-contain"}`}
          src={agencyLogo}
        />
      ) : (
        <div className="bg-surface-container text-outline mx-auto grid h-19 w-19 place-items-center rounded-full">
          <LinearBuilding2 className="h-10 w-10" />
        </div>
      )}
      <Typography
        as="h2"
        variant="title"
        size="large"
        weight="semibold"
        className="text-on-surface-var m-0 mt-2"
      >
        {agencyName}
      </Typography>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {agencyLocation ? (
          <div className="bg-surface-container-high text-on-surface-var inline-flex items-center gap-1 rounded-full px-2 py-0.5">
            <LinearLocation className="text-on-surface-var h-4 w-4" />
            <Typography variant="body" size="small" weight="medium">
              {agencyLocation}
            </Typography>
          </div>
        ) : null}
        {levelSlug ? (
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="bg-primary-container text-primary inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
          >
            {formatRankingLevelTitle({ isAgency: !isAgent, levelSlug })}
          </Typography>
        ) : null}
      </div>

      <div className="text-on-surface-var mt-4 flex items-center">
        {agencyStats.map((item, index) => (
          <div className="contents" key={item.label}>
            <div className="grid flex-1 gap-1 text-center">
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-on-surface mx-auto inline-flex items-center gap-1"
              >
                {item.icon}
                {item.label}
              </Typography>
              <Typography
                variant="title"
                size="small"
                weight="semibold"
                className="text-on-surface"
              >
                {item.value}
              </Typography>
            </div>
            {index < agencyStats.length - 1 ? (
              <div aria-hidden="true" className="bg-outline-var h-7 w-px shrink-0" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
