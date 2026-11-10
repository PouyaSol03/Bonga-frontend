import { useNavigate } from "react-router";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getBusinessInfoPath } from "../businessCreationHelpers";
import type { BusinessType } from "../types";

export function BusinessHero({
  infoType,
  showInfoButton = false,
}: {
  infoType?: BusinessType;
  showInfoButton?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <section className="bg-surface-container-lowest mx-4 rounded-[24px] px-6 pt-7 pb-6 shadow-sm">
      <div className="relative overflow-hidden pb-1 text-right">
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-1 h-8 w-44 [background-image:radial-gradient(var(--outline-var)_1.4px,transparent_1.4px)] [background-size:8px_8px] opacity-80"
        />
        <Typography
          as="p"
          variant="headline"
          size="large"
          className="text-primary relative m-0 flex items-baseline justify-start gap-2 text-[32px] font-black tracking-[-0.04em]"
        >
          <Typography
            as="span"
            variant="headline"
            size="large"
            className="bg-tertiary-container/30 text-tertiary rounded-sm px-1 text-[32px] font-black"
          >
            کسب و کار
          </Typography>
          <Typography
            as="span"
            variant="headline"
            size="large"
            className="text-primary text-[32px] font-black"
          >
            خودتو
          </Typography>
        </Typography>
        <Typography
          as="p"
          variant="headline"
          size="large"
          className="text-primary relative m-0 mt-1 text-[32px] font-black tracking-[-0.04em]"
        >
          راه بنداز!
        </Typography>
      </div>

      {showInfoButton && infoType ? (
        <Button
          unstyled
          className="border-primary bg-surface-container-lowest text-primary mt-4 flex h-10 w-full items-center justify-center gap-3 rounded-lg border px-3"
          onClick={() => navigate(getBusinessInfoPath(infoType))}
          type="button"
        >
          <Typography as="span" variant="label" size="medium" weight="medium">
            اطلاعات بیشتر درباره کسب و کار
          </Typography>
          <LinearArrowLeft1 className="h-5 w-5" />
        </Button>
      ) : null}
    </section>
  );
}
