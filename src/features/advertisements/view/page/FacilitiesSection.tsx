import { useState } from "react";
import { motion } from "motion/react";
import { DetailSection, PropertyGrid } from ".././viewAdComponents";
import type { ViewAdDetails } from ".././viewAdTypes";
import { InlineMoreButton } from "./InlineMoreButton";

export function FacilitiesSection({ details }: { details: ViewAdDetails }) {
  const [areFacilitiesExpanded, setAreFacilitiesExpanded] = useState(false);
  const FACILITIES_COLLAPSED_MAX_ITEMS = 4;

  const hasMoreFacilities = details.features.length > FACILITIES_COLLAPSED_MAX_ITEMS;
  const facilityItems = areFacilitiesExpanded
    ? details.features
    : details.features.slice(0, FACILITIES_COLLAPSED_MAX_ITEMS);

  return (
    <DetailSection icon="apartment" title="تجهیزات و امکانات">
      <motion.div
        layout
        transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden"
      >
        <PropertyGrid items={facilityItems} withLabels={false} />
      </motion.div>
      {hasMoreFacilities ? (
        <InlineMoreButton
          isOpen={areFacilitiesExpanded}
          onClick={() => setAreFacilitiesExpanded((current) => !current)}
        >
          {areFacilitiesExpanded
            ? "نمایش موارد کمتر"
            : `مشاهده ${details.features.length - FACILITIES_COLLAPSED_MAX_ITEMS} امکانات`}
        </InlineMoreButton>
      ) : null}
    </DetailSection>
  );
}
