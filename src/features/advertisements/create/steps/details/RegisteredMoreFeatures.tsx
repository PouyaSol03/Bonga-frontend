import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { Tag } from "../../components/NewAdControls";
import type { NewAdFormValues, NewAdFieldErrors } from "../../types";
import { formatPersianCount } from "./formatters";
import { useRegisteredMoreFeatures } from "./useRegisteredMoreFeatures";
import { MoreFeaturesButton } from "./MoreFeaturesButton";

export function RegisteredMoreFeatures({
  values,
  errors,
  onMoreFeatures,
}: {
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  onMoreFeatures?: () => void;
}) {
  const [showRegisteredMoreFeatures, setShowRegisteredMoreFeatures] = useState(false);
  const {
    moreFeatureFields,
    initialMoreFeatureTags,
    extraMoreFeatureTags,
    hiddenMoreFeatureCount,
    registeredMoreFeatures,
    removeMoreFeature,
  } = useRegisteredMoreFeatures(values);
  useEffect(() => {
    if (extraMoreFeatureTags.some((tag) => Boolean(errors[tag.key]))) {
      setShowRegisteredMoreFeatures(true);
    }
  }, [errors, extraMoreFeatureTags]);
  return (
    <>
      {registeredMoreFeatures.length ? (
        <div className="space-y-3 pt-2" dir="rtl">
          <div className="flex flex-wrap justify-start gap-2">
            {initialMoreFeatureTags.map((item) => (
              <Tag key={item.key} label={item.label} onRemove={() => removeMoreFeature(item.key)} />
            ))}
          </div>

          <AnimatePresence initial={false}>
            {showRegisteredMoreFeatures && extraMoreFeatureTags.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="w-full overflow-hidden"
              >
                <div className="flex flex-wrap justify-start gap-2 pt-1">
                  {extraMoreFeatureTags.map((item) => (
                    <Tag
                      key={item.key}
                      label={item.label}
                      onRemove={() => removeMoreFeature(item.key)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {hiddenMoreFeatureCount > 0 ? (
            <Button
              unstyled
              className="text-outline active:text-primary flex h-8 items-center justify-start gap-1.5 text-sm leading-5 font-normal"
              onClick={() => setShowRegisteredMoreFeatures((current) => !current)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">
                {showRegisteredMoreFeatures
                  ? "نمایش کمتر"
                  : `${formatPersianCount(hiddenMoreFeatureCount)} مشخصات دیگر`}
              </Typography>
              <motion.div
                animate={{ rotate: showRegisteredMoreFeatures ? 180 : 0 }}
                transition={{ duration: 0.24, ease: "easeInOut" }}
                className="inline-flex shrink-0 items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 10l5 5 5-5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>
            </Button>
          ) : null}

          <MoreFeaturesButton onMoreFeatures={onMoreFeatures}>ویرایش مشخصات</MoreFeaturesButton>
        </div>
      ) : moreFeatureFields.length ? (
        <MoreFeaturesButton onMoreFeatures={onMoreFeatures}>
          ثبت {formatPersianCount(moreFeatureFields.length)} مشخصات دیگر
        </MoreFeaturesButton>
      ) : null}
    </>
  );
}
