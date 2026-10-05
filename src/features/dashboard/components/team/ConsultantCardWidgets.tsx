import { useState, type ReactNode } from "react";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { TeamConsultant } from "./teamTypes";

export * from "./QuotaStepper";

export function AddConsultantRoleOption({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-checked={checked}
      className="flex w-full items-center py-2.25 gap-3.5 text-on-surface"
      onClick={onClick}
      role="radio"
      type="button"
    >
      <RadioIndicator checked={checked} />
      <Typography as="span" variant="label" size="large" weight="medium">
        {label}
      </Typography>
    </Button>
  );
}

export function ConsultantAvatar({
  consultant,
  sizeClassName,
}: {
  consultant: TeamConsultant;
  sizeClassName: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const showAvatar = Boolean(consultant.avatarSrc) && !hasImageError;

  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className={`${sizeClassName} grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-container-high text-outline`}
    >
      {showAvatar ? (
        <img
          alt={consultant.name}
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setHasImageError(true)}
          src={consultant.avatarSrc}
        />
      ) : (
        <LinearUserSolid className="h-1/2 w-1/2" />
      )}
    </Typography>
  );
}

export function ConsultantProfileSummary({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-4 flex items-center gap-3 bg-primary/12 px-4 py-2 rounded-2xl">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="grid">
        <Typography as="h1" variant="body" size="large" weight="regular" className="m-0 text-on-surface">
          {consultant.name} (مشاور)
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 text-on-surface/40">
          {consultant.phone}
        </Typography>
      </div>
    </div>
  );
}

export function ConsultantProfilePill({ consultant }: { consultant: TeamConsultant }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-outline-var bg-surface-container-lowest px-4 py-2">
      <ConsultantAvatar consultant={consultant} sizeClassName="h-14 w-14" />
      <div className="flex flex-col justify-center">
        <Typography as="h1" variant="body" size="large" weight="regular" className="m-0 text-on-surface">
          {consultant.name}
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="text-on-surface/40">
          {consultant.phone}
        </Typography>
      </div>
    </div>
  );
}

export function InfoStatRow({
  className = "",
  icon,
  iconClassName,
  labelClassName,
  label,
  value,
}: {
  className?: string;
  icon?: ReactNode;
  iconClassName?: string;
  labelClassName?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        {icon ? (
          <Typography
            as="span"
            variant="body"
            size="large"
            weight="regular"
            className={`grid h-6 w-6 place-items-center rounded-2xl ${iconClassName ?? "text-outline"}`}
          >
            {icon}
          </Typography>
        ) : null}
        <Typography as="span" variant="body" size="large" weight="regular" className={`text-on-surface ${labelClassName}`}>
          {label}
        </Typography>
      </div>
      <Typography as="span" variant="label" size="large" weight="semibold" className="text-on-surface">
        {value}
      </Typography>
    </div>
  );
}

export function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
