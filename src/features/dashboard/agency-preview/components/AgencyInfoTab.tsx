import { useNavigate } from "react-router";
import LinearAdd from "../../../../shared/icons/LinearAdd";
import LinearAddToList from "../../../../shared/icons/LinearAddToList";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { PublicAgentAgencySummary } from "../../../agencies/api/agency.service";
import type { BadgeDetailItem } from "../../components/BadgeDetailBottomSheet";
import { AgencyAboutSection } from "./AgencyAboutSection";
import { AgencyActionRow } from "./AgencyActionRow";
import { AgencyBadgesSection } from "./AgencyBadgesSection";

interface AgencyInfoTabProps {
  aboutUs: string;
  activityAreas: string[];
  agencyId?: string;
  agencyName: string;
  agentAgency?: PublicAgentAgencySummary;
  badges?: Array<{
    current_value?: number;
    earned?: boolean;
    level?: number;
    next_target?: number;
    progress?: number;
    slug?: string;
    thresholds?: number[];
    title?: string;
  }>;
  entityLabel?: string;
  isAgent?: boolean;
  onBadgeClick?: (badge: BadgeDetailItem) => void;
  onFeedbackClick?: () => void;
  workingHours?: string;
}

export function AgencyInfoTab({
  aboutUs,
  activityAreas,
  agencyId: _agencyId = "",
  agencyName,
  agentAgency,
  badges,
  entityLabel = "آژانس",
  isAgent = false,
  onBadgeClick,
  onFeedbackClick,
  workingHours = "",
}: AgencyInfoTabProps) {
  const navigate = useNavigate();
  const activityAreaText = activityAreas.length
    ? activityAreas.join("، ")
    : "محدوده فعالیت ثبت نشده است.";
  const aboutText = aboutUs || `توضیحی برای این ${entityLabel} ثبت نشده است.`;

  return (
    <div className="bg-surface-container-low space-y-2">
      <AgencyBadgesSection badges={badges} onBadgeClick={onBadgeClick} />

      <section className="bg-surface-container-lowest p-4">
        <Typography
          as="h3"
          variant="title"
          size="medium"
          weight="semibold"
          className="m-0 text-base leading-6 font-semibold"
        >
          محدوده فعالیت
        </Typography>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="text-on-surface-var m-0 mt-4 text-sm leading-7 font-normal"
        >
          {activityAreaText}
        </Typography>
      </section>

      {agentAgency?.name ? (
        <Button
          unstyled
          className="bg-surface-container-lowest flex w-full items-center gap-3 p-4 text-right"
          onClick={() => {
            if (agentAgency.id) {
              navigate(`/agencies/${encodeURIComponent(agentAgency.id)}`);
            }
          }}
          type="button"
        >
          {agentAgency.logo ? (
            <img
              alt={agentAgency.name}
              className="h-12 w-12 shrink-0 rounded-xl object-contain"
              src={agentAgency.logo}
            />
          ) : (
            <div className="bg-surface-container text-outline grid h-12 w-12 shrink-0 place-items-center rounded-xl">
              <LinearUserSolid className="h-6 w-6" />
            </div>
          )}
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="min-w-0 flex-1"
          >
            <strong className="text-on-surface block truncate text-sm">{agentAgency.name}</strong>
            {agentAgency.address ? (
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className="text-outline mt-1 block truncate text-xs"
              >
                {agentAgency.address}
              </Typography>
            ) : null}
          </Typography>
          {agentAgency.id ? <LinearArrowLeft1 className="text-on-surface-var h-5 w-5" /> : null}
        </Button>
      ) : null}

      {workingHours ? (
        <section className="bg-surface-container-lowest p-4">
          <Typography
            as="h3"
            variant="title"
            size="medium"
            weight="semibold"
            className="m-0 text-base leading-6 font-semibold"
          >
            ساعات کاری
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var m-0 mt-3 text-sm leading-6"
          >
            {workingHours}
          </Typography>
        </section>
      ) : null}

      {!isAgent ? (
        <AgencyActionRow
          icon={<LinearAdd className="text-on-surface-var h-6 w-6" />}
          onClick={() => {
            const params = new URLSearchParams({
              registrantType: "personal",
              context: "personal",
            });
            navigate(`/new-ad/category?${params.toString()}`);
          }}
          title="ثبت آگهی رایگان"
        />
      ) : null}
      <AgencyActionRow
        icon={<LinearAddToList className="text-on-surface-var h-6 w-6" />}
        onClick={onFeedbackClick}
        title="ثبت بازخورد"
      />

      <AgencyAboutSection aboutText={aboutText} agencyName={agencyName} />
    </div>
  );
}
