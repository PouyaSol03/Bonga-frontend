import { ChoiceIndicator } from "./ui/Choice";

type RadioIndicatorProps = {
  checked: boolean;
  className?: string;
};

export function RadioIndicator({
  checked,
  className = "",
}: RadioIndicatorProps) {
  return <ChoiceIndicator checked={checked} className={className} type="radio" />;
}
