import LinearApartment from "../../../shared/icons/LinearApartment";
import { getFeatureIconSrc } from "../../../shared/lib/handleFeaturesIcons";

export function FeatureIcon({
  feature,
  className = "h-6 w-6",
}: {
  feature: string;
  className?: string;
}) {
  const src = getFeatureIconSrc(feature);

  if (src) {
    return <img aria-hidden="true" alt="" className={className} src={src} />;
  }

  return <LinearApartment aria-hidden="true" className={className} />;
}

