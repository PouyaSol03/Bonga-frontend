import { useState } from "react";

import { PageFrame } from "../../app/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";

type AgencyLevel = {
  image: string;
  points: string;
  title: string;
};

const agencyLevels: AgencyLevel[] = [
  {
    image: "/vectors/agencyLevel/newbie.svg",
    points: "۰-۴۹",
    title: "آژانس تازه‌کار",
  },
  {
    image: "/vectors/agencyLevel/active.svg",
    points: "۵۰-۶۴",
    title: "آژانس فعال",
  },
  {
    image: "/vectors/agencyLevel/very_active.svg",
    points: "۶۵-۷۹",
    title: "آژانس پویا",
  },
  {
    image: "/vectors/agencyLevel/top_one.svg",
    points: "۸۰-۸۹",
    title: "آژانس برتر منطقه",
  },
  {
    image: "/vectors/agencyLevel/legendery.svg",
    points: "۹۰-۱۰۰",
    title: "آژانس افسانه‌ای",
  },
];

export function DashboardRankingLevelsGuidePage() {
  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/dashboard/ranking"
        className="bg-[#f0f0f0]"
        contentClassName="px-1"
        title="سطح پیشرفت آژانس"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="grid h-12 grid-cols-3 items-center border-b border-[#e5e5e5] text-base font-normal leading-6 text-[#4d4d4d] [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="pr-4">امتیاز</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="">نماد</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="pl-4">عنوان</Typography>
        </div>

        {agencyLevels.map((level) => (
          <AgencyLevelRow key={level.title} level={level} />
        ))}
      </main>
    </PageFrame>
  );
}

function AgencyLevelRow({ level }: { level: AgencyLevel }) {
  return (
    <div className="grid h-[88px] grid-cols-3 items-center border-b border-[#e5e5e5] text-sm leading-5 [direction:rtl] last:border-b-0">
      <strong className="pr-4 text-right text-sm font-semibold text-[#1a1a1a]">
        {level.points}
      </strong>

      <LevelImage src={level.image} />

      <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium text-[#1a1a1a]">
        {level.title}
      </Typography>
    </div>
  );
}

function LevelImage({ src }: { src: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <img src={src} alt="" className="w-14 h-14"/>
    );
  }

  return (
    <img
      alt=""
      className="h-14 w-14 object-contain"
      onError={() => setHasError(true)}
      src={src}
    />
  );
}
