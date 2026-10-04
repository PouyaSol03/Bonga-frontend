import { Fragment } from "react";
import LinearRanking from "../../../../../shared/icons/LinearRanking";
import LinearStar from "../../../../../shared/icons/LinearStar";
import LinearTag from "../../../../../shared/icons/LinearTag";
import LinearStairs from "../../../../../shared/icons/LinearStairs";
import LinearStartup from "../../../../../shared/icons/LinearStartup";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import type { RankingLevel } from "../../../utils/rankingLevels";
import type { TeamConsultant } from "../ConsultantManagementPage";

const QUOTA_CONFIG = [
  {
    icon: LinearTag,
    iconBgClass: "bg-[#002099]/16 text-primary",
    label: "مانده اعتبار آگهی",
    key: "adQuota" as const,
    defaultVal: 34,
  },
  {
    icon: LinearStairs,
    iconBgClass: "bg-[#11A366]/16 text-[#11A366]",
    label: "مانده اعتبار بروزرسانی",
    key: "renewQuota" as const,
    defaultVal: 21,
  },
  {
    icon: LinearStartup,
    iconBgClass: "bg-[#FF8D00]/16 text-[#FF8D00]",
    label: "مانده اعتبار ویژه",
    key: "specialQuota" as const,
    defaultVal: 11,
  },
] as const;

function ConsultantRankingsRow({
  rankingScore,
  rankingLevel,
}: {
  rankingScore: number;
  rankingLevel: RankingLevel;
}) {
  return (
    <div className="w-full bg-surface-container-lowest px-4 py-3">
      <div className="grid grid-cols-3 gap-2.5">
        <article className="flex h-[119px] flex-col items-center justify-between rounded-2xl border border-outline-var/40 bg-surface-container-lowest p-3">
          <LinearRanking className="h-6 w-6 text-primary" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="text-[#11A366]"
          >
            {toPersianNumber(67)}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-outline"
          >
            رتبه
          </Typography>
        </article>

        <article className="flex h-[119px] flex-col items-center justify-between p-2.5">
          <img
            src={rankingLevel.image}
            alt={rankingLevel.title}
            className="h-16 w-auto max-w-[54px] object-contain"
          />
          <span className="inline-flex h-6 items-center justify-center rounded-full bg-primary/12 px-2.5 text-xs font-semibold text-primary">
            {rankingLevel.title}
          </span>
        </article>

        <article className="flex h-[119px] flex-col items-center justify-between rounded-2xl border border-outline-var/40 bg-surface-container-lowest p-3">
          <LinearStar className="h-6 w-6 text-warning" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="text-[#11A366]"
          >
            {toPersianNumber(rankingScore)}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-outline"
          >
            امتیاز
          </Typography>
        </article>
      </div>
    </div>
  );
}

function ConsultantActivityCard({
  activeAds,
  activeRequests = 8,
}: {
  activeAds: number;
  activeRequests?: number;
}) {
  return (
    <article className="w-full bg-surface-container-lowest px-4 py-2">
      <div className="flex items-center justify-between py-2">
        <Typography as="span" variant="body" size="medium" weight="medium" className="text-on-surface">
          آگهی‌های فعال
        </Typography>
        <Typography as="span" variant="title" size="medium" weight="semibold" className="text-on-surface">
          {toPersianNumber(activeAds)}
        </Typography>
      </div>
      <div className="my-1 h-px w-full bg-outline-var/40" />
      <div className="flex items-center justify-between py-2">
        <Typography as="span" variant="body" size="medium" weight="medium" className="text-on-surface">
          درخواست فعال
        </Typography>
        <Typography as="span" variant="title" size="medium" weight="semibold" className="text-on-surface">
          {toPersianNumber(activeRequests)}
        </Typography>
      </div>
    </article>
  );
}

function ConsultantQuotasCard({ consultant }: { consultant: TeamConsultant }) {
  return (
    <article className="w-full bg-surface-container-lowest px-4 py-2">
      {QUOTA_CONFIG.map(({ icon: Icon, iconBgClass, label, key, defaultVal }, index) => {
        const val = consultant[key] ?? defaultVal;
        return (
          <Fragment key={key}>
            {index > 0 && <div className="my-1.5 h-px w-full bg-outline-var/40" />}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <Typography as="span" variant="body" size="medium" weight="medium" className="text-on-surface">
                  {label}
                </Typography>
              </div>
              <Typography as="span" variant="title" size="medium" weight="semibold" className="text-on-surface">
                {toPersianNumber(val)}
              </Typography>
            </div>
          </Fragment>
        );
      })}
    </article>
  );
}

export function ConsultantInfoTab({
  consultant,
  rankingLevel,
}: {
  consultant: TeamConsultant;
  rankingLevel: RankingLevel;
}) {
  return (
    <div className="space-y-2.5">
      <ConsultantRankingsRow
        rankingScore={consultant.rankingScore ?? 85}
        rankingLevel={rankingLevel}
      />
      <ConsultantActivityCard activeAds={consultant.scores.ads ?? 51} />
      <ConsultantQuotasCard consultant={consultant} />
    </div>
  );
}
