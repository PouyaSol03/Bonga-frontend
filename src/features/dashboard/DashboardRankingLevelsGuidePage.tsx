import { useState } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
} from "../../shared/constants/roles.constants";
import {
  AGENCY_RANKING_LEVELS,
  CONSULTANT_RANKING_LEVELS,
  type RankingLevel,
} from "./utils/rankingLevels";

export function DashboardRankingLevelsGuidePage() {
  const role = getActiveAuthRole(getStoredAuthSession());
  const isConsultant = role === INDEPENDENT_CONSULTANT || role === REAL_ESTATE_CONSULTANT;
  const levels = isConsultant ? CONSULTANT_RANKING_LEVELS : AGENCY_RANKING_LEVELS;
  const pageTitle = isConsultant ? "سطح پیشرفت مشاور" : "سطح پیشرفت آژانس";

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/ranking"
        className="bg-surface-container"
        contentClassName="px-1"
        title={pageTitle}
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="border-outline-var text-on-surface-var grid h-12 grid-cols-3 items-center border-b text-base leading-6 font-normal [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="pr-4">
            امتیاز
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-center"
          >
            نماد
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="pl-4 text-left"
          >
            عنوان
          </Typography>
        </div>

        {levels.map((level) => (
          <AgencyLevelRow key={level.title} level={level} />
        ))}
      </main>
    </PageFrame>
  );
}

function AgencyLevelRow({ level }: { level: RankingLevel }) {
  return (
    <div className="border-outline-var grid h-[88px] grid-cols-3 items-center border-b text-sm leading-5 [direction:rtl] last:border-b-0">
      <strong className="text-on-surface pr-4 text-right text-sm font-semibold">
        {level.points}
      </strong>

      <LevelImage src={level.image} />

      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-on-surface pl-4 text-left text-sm font-medium [direction:rtl]"
      >
        {level.title}
      </Typography>
    </div>
  );
}

function LevelImage({ src }: { src: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <img src={src} alt="" className="h-14 w-14" />;
  }

  return (
    <img alt="" className="h-14 w-14 object-contain" onError={() => setHasError(true)} src={src} />
  );
}
