import { useState } from "react";
import { useNavigate } from "react-router";
import LinearRanking from "../../../../shared/icons/LinearRanking";
import LinearStar from "../../../../shared/icons/LinearStar";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { AgencyConsultantDto } from "../../../agencies/api/agency.service";
import { getAgencyConsultantRoleLabel, toPersianDigits } from "../profileHelpers";
import { consultantAvatarClasses } from "../types";

interface AgencyConsultantsTabProps {
  consultants: AgencyConsultantDto[];
}

export function AgencyConsultantsTab({ consultants }: AgencyConsultantsTabProps) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-y-2">
      {consultants.map((consultant, index) => (
        <Button
          unstyled
          className={`bg-surface-container-lowest active:bg-surface-container-low flex w-full items-center justify-center gap-4 px-4 py-4 text-center transition ${index < consultants.length - 1 ? "border-outline-var border-b" : ""}`}
          key={consultant.agentId ?? consultant.userId}
          onClick={() => {
            if (consultant.agentId === undefined) return;
            navigate(`/agents/${encodeURIComponent(String(consultant.agentId))}`);
          }}
          type="button"
        >
          <div className="flex flex-col items-center">
            <ConsultantAvatar
              className={consultantAvatarClasses[index % consultantAvatarClasses.length]}
              name={consultant.name}
              src={consultant.avatar}
            />
            <Typography
              as="h3"
              variant="title"
              size="medium"
              weight="medium"
              className="text-on-surface-var m-0 mt-2"
            >
              {consultant.name}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="small"
              weight="regular"
              className="bg-surface-container text-outline m-0 mt-1 rounded-lg px-2 py-0.5"
            >
              {getAgencyConsultantRoleLabel(consultant.role)}
            </Typography>
            <div className="text-on-surface-var mt-4 flex items-center justify-center gap-5 text-xs leading-4 font-medium">
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="inline-flex items-center gap-1"
              >
                <LinearStar className="h-4 w-4" />
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="text-on-surface text-xs font-medium"
                >
                  امتیاز
                </Typography>
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="text-tertiary mr-3 text-sm font-semibold"
                >
                  {toPersianDigits(consultant.metrics.rankingScore)}
                </Typography>
              </Typography>
              <div className="bg-outline-var h-4.75 w-px"></div>
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="inline-flex items-center gap-1"
              >
                <LinearRanking className="h-4 w-4" />
                <Typography
                  as="p"
                  variant="body"
                  size="small"
                  weight="medium"
                  className="text-on-surface text-xs font-medium"
                >
                  رتبه
                </Typography>
                <Typography
                  as="span"
                  variant="label"
                  size="medium"
                  weight="semibold"
                  className="text-tertiary mr-3 text-sm font-semibold"
                >
                  —
                </Typography>
              </Typography>
            </div>
          </div>
        </Button>
      ))}
    </section>
  );
}

function ConsultantAvatar({
  className: _className = "",
  name,
  src,
}: {
  className?: string;
  name: string;
  src?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasImageError;

  return (
    <div className="bg-surface-container-low grid h-18 w-18 place-items-center overflow-hidden rounded-full bg-gradient-to-br">
      {shouldShowImage ? (
        <img
          alt={name}
          className="h-full w-full rounded-full object-cover"
          onError={() => setHasImageError(true)}
          src={src}
        />
      ) : (
        <LinearUserSolid className="text-outline h-9 w-9" />
      )}
    </div>
  );
}
