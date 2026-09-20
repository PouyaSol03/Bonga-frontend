import LinearApartment from "../../../shared/icons/LinearApartment";
import { getFeatureIconSrc } from "../../../shared/lib/handleFeaturesIcons";
import { ColorableSvgIcon } from "../../../shared/components/ColorableSvgIcon";

export function FeatureIcon({
  feature,
  className = "h-6 w-6",
}: {
  feature: string;
  className?: string;
}) {
  const src = getFeatureIconSrc(feature);
  const resolvedClassName = `text-on-surface-var ${className}`;

  if (src) {
    return <ColorableSvgIcon className={resolvedClassName} src={src} />;
  }

  return <LinearApartment aria-hidden="true" className={resolvedClassName} />;
}

