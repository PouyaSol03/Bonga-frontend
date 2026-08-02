import { ChoiceIndicator } from "../ui/Choice";

type SelectionCheckIndicatorProps = {
  checked: boolean;
  className?: string;
};

export function SelectionCheckIndicator({
  checked,
  className = "",
}: SelectionCheckIndicatorProps) {
  return <ChoiceIndicator checked={checked} className={className} />;
}
