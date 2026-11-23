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
    <PublicStyleSection title="مشخصات و امکانات ملک">
      {visibleFeatures.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleFeatures.map((feature, index) => {
            const key = getFeatureKey(feature);
            return (
              <article
                className="flex min-w-0 items-center gap-3.5 rounded-xl border border-[#f0f0f0] bg-[#fafafa]/70 p-3.5 transition hover:border-[#0048c4]/30 hover:bg-white hover:shadow-xs"
                key={`${key}-${index}`}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                  {getFeatureIcon(key)}
                </div>
                <div className="min-w-0 flex-1">
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="block text-xs font-medium text-[#808080]"
                  >
                    {getFeatureDisplayLabel(feature)}
                  </Typography>
                  <strong className="mt-0.5 block truncate text-sm font-bold text-[#1a1a1a]">
                    {formatDisplayValue(key, feature.value)}
                  </strong>
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
          className="m-0 rounded-xl bg-[#f7f7f7] p-4 text-center text-sm text-[#808080]"
        >
          ویژگی خاصی برای این آگهی ثبت نشده است.
        </Typography>
      )}
    </PublicStyleSection>
  );
}
