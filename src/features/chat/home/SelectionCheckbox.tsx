import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { CheckIcon } from "./listIcons";

export function SelectionCheckbox({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      unstyled
      aria-pressed={isSelected}
      aria-label={isSelected ? "برداشتن انتخاب گفتگو" : "انتخاب گفتگو"}
      className="focus-visible:outline-primary/40 grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px]"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      type="button"
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${
          isSelected
            ? "border-primary bg-primary text-white"
            : "border-outline bg-surface-container-lowest text-transparent"
        }`}
      >
        <CheckIcon className="h-[14px] w-[14px]" />
      </Typography>
    </Button>
  );
}
