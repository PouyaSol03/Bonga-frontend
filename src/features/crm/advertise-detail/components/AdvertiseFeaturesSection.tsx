import { Typography } from "../../../../shared/ui/Typography";
import type { FeatureRecord } from "../constants";
import { formatDisplayValue } from "../formatters";
import { getFeatureDisplayLabel, getFeatureKey } from "../helpers";
import { getFeatureIcon } from "./DetailIcons";
import { PublicStyleSection } from "./DetailPrimitives";

export function AdvertiseFeaturesSection({
  visibleFeatures,
}: {
  visibleFeatures: FeatureRecord[];
}) {
  return (
    <PublicStyleSection title="اطلاعات ملک">
      {visibleFeatures.length ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 xl:grid-cols-3">
          {visibleFeatures.map((feature, index) => {
            const key = getFeatureKey(feature);
            return (
              <article className="flex min-w-0 items-start gap-3" key={`${key}-${index}`}>
                <Typography
                  as="span"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center text-[#808080]"
                >
                  {getFeatureIcon(key)}
                </Typography>
                <div className="min-w-0">
                  <strong className="block text-base leading-6 font-medium break-words text-[#1a1a1a]">
                    {formatDisplayValue(key, feature.value)}
                  </strong>
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="mt-0.5 block text-xs font-medium text-[#a6a6a6]"
                  >
                    {getFeatureDisplayLabel(feature)}
                  </Typography>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 rounded-xl bg-[#f7f7f7] p-4 text-sm text-[#808080]"
        >
          ویژگی دیگری برای این آگهی ثبت نشده است.
        </Typography>
      )}
    </PublicStyleSection>
  );
}
