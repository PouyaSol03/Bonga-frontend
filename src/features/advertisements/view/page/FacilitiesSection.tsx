import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DetailSection, PropertyGrid } from ".././viewAdComponents";
import type { ViewAdDetails } from ".././viewAdTypes";
import { InlineMoreButton } from "./InlineMoreButton";

export function FacilitiesSection({ details }: { details: ViewAdDetails }) {
  const [areFacilitiesExpanded, setAreFacilitiesExpanded] = useState(false);
  const FACILITIES_COLLAPSED_MAX_ITEMS = 4;

  const hasMoreFacilities = details.features.length > FACILITIES_COLLAPSED_MAX_ITEMS;
  const initialItems = details.features.slice(0, FACILITIES_COLLAPSED_MAX_ITEMS);
  const extraItems = details.features.slice(FACILITIES_COLLAPSED_MAX_ITEMS);

  return (
    <DetailSection icon="apartment" title="تجهیزات و امکانات">
      <div className="overflow-hidden">
        <PropertyGrid items={initialItems} withLabels={false} className="mt-6" />
        <AnimatePresence initial={false}>
          {areFacilitiesExpanded && hasMoreFacilities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <PropertyGrid
                items={extraItems}
                withLabels={false}
                className="mt-6"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
