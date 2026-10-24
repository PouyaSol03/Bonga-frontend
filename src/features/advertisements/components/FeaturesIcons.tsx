import { FeatureIcon } from "./FeatureIcon";

type FeaturesIconsProps = {
  feature: string;
  className?: string;
  selected?: boolean;
};

export function FeaturesIcons({ feature, className = "h-6 w-6", selected }: FeaturesIconsProps) {
  return <FeatureIcon className={className} feature={feature} selected={selected} />;
}
