import { FeatureIcon } from "./FeatureIcon";

type FeaturesIconsProps = {
  feature: string;
  className?: string;
};

export function FeaturesIcons({
  feature,
  className = "h-6 w-6",
}: FeaturesIconsProps) {
  return <FeatureIcon className={className} feature={feature} />;
}
