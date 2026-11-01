import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DetailSection, PropertyGrid } from ".././viewAdComponents";
import type { ViewAdDetails } from ".././viewAdTypes";
import { InlineMoreButton } from "./InlineMoreButton";

export function FacilitiesSection({details}:{details:ViewAdDetails}) {
const [areFacilitiesExpanded,setAreFacilitiesExpanded]=useState(false);
  const FACILITIES_COLLAPSED_MAX_ITEMS = 4;

  const visibleFacilityCount = areFacilitiesExpanded
    ? details.features.length
    : FACILITIES_COLLAPSED_MAX_ITEMS;
  const facilityItems = details.features.slice(0, visibleFacilityCount);
  const hasMoreFacilities = details.features.length > FACILITIES_COLLAPSED_MAX_ITEMS;
return (
          <DetailSection icon="apartment" title="تجهیزات و امکانات">
            <div className="overflow-hidden">
              <PropertyGrid
                items={facilityItems.slice(0, FACILITIES_COLLAPSED_MAX_ITEMS)}
                withLabels={false}
              />
              <AnimatePresence initial={false}>
                {areFacilitiesExpanded && facilityItems.length > FACILITIES_COLLAPSED_MAX_ITEMS && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      <PropertyGrid
                        items={facilityItems.slice(FACILITIES_COLLAPSED_MAX_ITEMS)}
                        withLabels={false}
                      />
                    </div>
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


); }
