import { ColorableSvgIcon } from "../../../../shared/components/ColorableSvgIcon";
import { Button } from "../../../../shared/ui/Button";

export function GalleryMediaButton({
  iconSrc,
  label,
  onClick,
}: {
  iconSrc: string;
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      aria-label={label}
      className={`grid h-7 w-7 place-items-center rounded-md`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <ColorableSvgIcon className="h-5 w-5" src={iconSrc} />
    </Button>
  );
}
