import { useEffect, useRef, useState } from "react";
import { AdLocationMap } from "../../components/AdLocationMap";
import { DetailSection } from ".././viewAdComponents";
import type { ViewAdDetails } from ".././viewAdTypes";
import { Typography } from "../../../../shared/ui/Typography";
import { InlineMoreButton } from "./InlineMoreButton";

const DESCRIPTION_COLLAPSED_HEIGHT = 350;
export function DescriptionSection({details,mapPosition}:{details:ViewAdDetails;mapPosition:{latitude:number;longitude:number}|null}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

const shouldShowDescriptionMore=isDescriptionOverflowing;
  useEffect(() => {
    const updateDescriptionOverflow = () => {
      const element = descriptionRef.current;

      if (!element) {
        setIsDescriptionOverflowing(false);
        return;
      }

      setIsDescriptionOverflowing(element.scrollHeight > DESCRIPTION_COLLAPSED_HEIGHT + 1);
    };

    updateDescriptionOverflow();
    window.addEventListener("resize", updateDescriptionOverflow);

    return () => {
      window.removeEventListener("resize", updateDescriptionOverflow);
    };
  }, [details.description]);
return (
          <DetailSection icon="apartment" title="توضیحات">
            <div
              className="text-on-surface relative mt-6 overflow-hidden text-right text-base leading-8 font-normal transition-all duration-300 ease-in-out"
              style={{
                height:
                  shouldShowDescriptionMore && !isDescriptionExpanded
                    ? DESCRIPTION_COLLAPSED_HEIGHT
                    : "auto",
              }}
            >
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                ref={descriptionRef}
                className="m-0 whitespace-pre-line"
              >
                {details.description}
              </Typography>
              {shouldShowDescriptionMore && !isDescriptionExpanded ? (
                <div className="from-surface-container-lowest/0 to-surface-container-lowest pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b" />
              ) : null}
            </div>
            {shouldShowDescriptionMore ? (
              <InlineMoreButton
                isOpen={isDescriptionExpanded}
                onClick={() => setIsDescriptionExpanded((current) => !current)}
              >
                {isDescriptionExpanded ? "نمایش کمتر توضیحات" : "نمایش ادامه توضیحات"}
              </InlineMoreButton>
            ) : null}
            {mapPosition ? (
              <MapPreview latitude={mapPosition.latitude} longitude={mapPosition.longitude} />
            ) : null}
          </DetailSection>
); }

function MapPreview({ latitude, longitude }: { latitude: number; longitude: number }) {
  return (
    <AdLocationMap
      className="mt-6"
      latitude={latitude}
      longitude={longitude}
      title="موقعیت آگهی روی نقشه"
    />
  );
}
