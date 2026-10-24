import LinearApartment from "../../../shared/icons/LinearApartment";
import { getFeatureIconSrc } from "../../../shared/lib/handleFeaturesIcons";
import { ColorableSvgIcon } from "../../../shared/components/ColorableSvgIcon";
import { cn } from "../../../design-system/classes";

export function FeatureIcon({
  feature,
  className = "h-6 w-6",
  selected,
}: {
  feature: string;
  className?: string;
  selected?: boolean;
}) {
  const src = getFeatureIconSrc(feature);
  const colorClass =
    selected === true
      ? "text-primary"
      : selected === false
        ? "text-on-surface-var"
        : className.includes("text-")
          ? ""
          : "text-on-surface-var";
  const resolvedClassName = cn(colorClass, className);

  if (src) {
    return <ColorableSvgIcon className={resolvedClassName} src={src} />;
  }

  return <LinearApartment aria-hidden="true" className={resolvedClassName} />;
}
