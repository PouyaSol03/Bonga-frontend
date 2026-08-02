import { PageFrame } from "../../app/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";

const consultantLevels = [
  {
    image: "/figma/account/ranking-level-beginner.png",
    points: "۰–۴۹",
    title: "آژانس تازه‌کار",
  },
  {
    image: "/figma/account/ranking-level-active.png",
    points: "۵۰–۶۴",
    title: "آژانس فعال",
  },
  {
    image: "/figma/account/ranking-level-dynamic.png",
    points: "۶۵–۷۹",
    title: "آژانس پویا",
  },
  {
    image: "/figma/account/ranking-level-regional.png",
    points: "۸۰–۸۹",
    title: "آژانس برتر منطقه",
  },
  {
    image: "/figma/account/ranking-level-legendary.png",
    points: "۹۰–۱۰۰",
    title: "آژانس افسانه‌ای",
  },
];

export function IndependentConsultantRankingLevelsPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/ranking"
        className="[&_a]:text-[#1a1a1a]"
        title="سطح پیشرفت مشاور"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        <div className="grid h-12 grid-cols-3 items-center border-b border-[#e5e5e5] text-base font-normal leading-6 text-[#4d4d4d] [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="pr-4 text-right">امتیاز</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-center">نماد</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="pl-4 text-left">عنوان</Typography>
        </div>
        {consultantLevels.map((level) => (
          <LevelTableRow key={level.title} level={level} />
        ))}
      </main>
    </PageFrame>
  );
}

function LevelTableRow({
  level,
}: {
  level: (typeof consultantLevels)[number];
}) {
  return (
    <div className="grid h-[89px] grid-cols-3 items-center border-b border-[#e5e5e5] text-sm leading-5 [direction:rtl] last:border-b-0">
      <strong className="pr-4 text-right text-sm font-semibold text-[#1a1a1a]">{level.points}</strong>
      <img alt="" className="mx-auto h-14 w-14 object-contain" src={level.image} />
      <Typography as="span" variant="label" size="medium" weight="medium" className="pl-4 text-left text-sm font-medium text-[#1a1a1a] [direction:rtl]">{level.title}</Typography>
    </div>
  );
}
