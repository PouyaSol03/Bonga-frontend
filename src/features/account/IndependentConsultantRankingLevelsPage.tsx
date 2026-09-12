import { PageFrame } from "../../shared/layout/PageFrame";
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
      className="flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/ranking"
        className="[&_a]:text-on-surface"
        title="سطح پیشرفت مشاور"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest">
        <div className="grid h-12 grid-cols-3 items-center border-b border-outline-var text-base font-normal leading-6 text-on-surface-var [direction:rtl]">
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
    <div className="grid h-[89px] grid-cols-3 items-center border-b border-outline-var text-sm leading-5 [direction:rtl] last:border-b-0">
      <strong className="pr-4 text-right text-sm font-semibold text-on-surface">{level.points}</strong>
      <img alt="" className="mx-auto h-14 w-14 object-contain" src={level.image} />
      <Typography as="span" variant="label" size="medium" weight="medium" className="pl-4 text-left text-sm font-medium text-on-surface [direction:rtl]">{level.title}</Typography>
    </div>
  );
}
