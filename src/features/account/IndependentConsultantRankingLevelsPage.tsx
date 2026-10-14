import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";

const consultantLevels = [
  {
    image: "/vectors/agentLevel/beginner.png",
    points: "۰–۴۹",
    title: "مشاور تازه‌کار",
  },
  {
    image: "/vectors/agentLevel/regional_expert.png",
    points: "۵۰–۶۴",
    title: "کارشناس منطقه",
  },
  {
    image: "/vectors/agentLevel/selected_agent.png",
    points: "۶۵–۷۹",
    title: "مشاور منتخب",
  },
  {
    image: "/vectors/agentLevel/deal_diamond.png",
    points: "۸۰–۸۹",
    title: "الماس معاملات",
  },
  {
    image: "/vectors/agentLevel/unmatched_star.png",
    points: "۹۰–۱۰۰",
    title: "ستاره بی‌رقیب",
  },
];

export function IndependentConsultantRankingLevelsPage() {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/account/ranking"
        className="[&_a]:text-on-surface"
        title="سطح پیشرفت مشاور"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="border-outline-var text-on-surface-var grid h-12 grid-cols-3 items-center border-b text-base leading-6 font-normal [direction:rtl]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="pr-4 text-right"
          >
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
        {consultantLevels.map((level) => (
          <LevelTableRow key={level.title} level={level} />
        ))}
      </main>
    </PageFrame>
  );
}

function LevelTableRow({ level }: { level: (typeof consultantLevels)[number] }) {
  return (
    <div className="border-outline-var grid h-[89px] grid-cols-3 items-center border-b text-sm leading-5 [direction:rtl] last:border-b-0">
      <strong className="text-on-surface pr-4 text-right text-sm font-semibold">
        {level.points}
      </strong>
      <img alt="" className="mx-auto h-14 w-14 object-contain" src={level.image} />
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
