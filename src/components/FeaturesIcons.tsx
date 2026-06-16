import { getFeatureIconSrc } from "../lib/handleFeaturesIcons";

type FeaturesIconsProps = {
  feature: string;
  className?: string;
};

export function FeaturesIcons({
  feature,
  className = "w-6 h-6 object-contain",
}: FeaturesIconsProps) {
  const iconSrc = getFeatureIconSrc(feature);

  if (!iconSrc) return null;

  return (
    <img
      src={iconSrc}
      alt={feature}
      title={feature}
      className={className}
    />
  );
}