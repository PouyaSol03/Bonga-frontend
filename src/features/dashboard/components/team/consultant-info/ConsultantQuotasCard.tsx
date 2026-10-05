import { Fragment } from "react";
import LinearStairs from "../../../../../shared/icons/LinearStairs";
import LinearStartup from "../../../../../shared/icons/LinearStartup";
import LinearTag from "../../../../../shared/icons/LinearTag";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import type { TeamConsultant } from "../teamTypes";

const QUOTA_CONFIG = [
  {
    icon: LinearTag,
    iconBgClass: "bg-primary/16 text-primary",
    label: "مانده اعتبار آگهی",
    key: "adQuota" as const,
    defaultVal: 0,
  },
  {
    icon: LinearStairs,
    iconBgClass: "bg-tertiary/16 text-tertiary",
    label: "مانده اعتبار بروزرسانی",
    key: "renewQuota" as const,
    defaultVal: 0,
  },
  {
    icon: LinearStartup,
    iconBgClass: "bg-on-warning-container/16 text-on-warning-container",
    label: "مانده اعتبار ویژه",
    key: "specialQuota" as const,
    defaultVal: 0,
  },
] as const;

export function ConsultantQuotasCard({ consultant }: { consultant: TeamConsultant }) {
  return (
    <article className="w-full bg-surface-container-lowest px-4 py-2">
      {QUOTA_CONFIG.map(({ icon: Icon, iconBgClass, label, key, defaultVal }, index) => {
        const val = consultant[key] ?? defaultVal;
        return (
          <Fragment key={key}>
            {index > 0 && <div className="my-1.5 h-px w-full bg-outline-var/40" />}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <Typography as="span" variant="label" size="large" weight="medium" className="text-on-surface-var">
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
