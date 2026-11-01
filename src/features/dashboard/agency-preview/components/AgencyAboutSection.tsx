import { useState } from "react";
import LinearArrowDown1 from "../../../../shared/icons/LinearArrowDown1";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

interface AgencyAboutSectionProps {
  aboutText: string;
  agencyName: string;
}

export function AgencyAboutSection({ aboutText, agencyName }: AgencyAboutSectionProps) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <section className="bg-surface-container-lowest p-4 text-center">
      <Typography
        as="h3"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-right text-base leading-6 font-semibold"
      >
        درباره {agencyName}
      </Typography>
      <img alt="" src="/vectors/Bonga.svg" />
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className={`text-on-surface-var m-0 mt-5 text-right leading-8 font-normal ${isAboutExpanded ? "" : "line-clamp-5"}`}
      >
        {aboutText}
      </Typography>
      {aboutText.length > 220 ? (
        <Button
          unstyled
          aria-expanded={isAboutExpanded}
          className="text-primary mx-auto mt-2 inline-flex items-center gap-1 text-xs leading-4 font-semibold"
          onClick={() => setIsAboutExpanded((prev) => !prev)}
          type="button"
        >
          <LinearArrowDown1
            className={`h-4 w-4 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`}
          />
          {isAboutExpanded ? "نمایش کمتر" : "نمایش بیشتر"}
        </Button>
      ) : null}
    </section>
  );
}
