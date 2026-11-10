import LinearMapsLocation from "../../../shared/icons/LinearMapsLocation";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export function DirectoryMapButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      unstyled
      className="bg-primary text-on-primary focus-visible:outline-primary/40 absolute bottom-[16px] left-1/2 z-10 inline-flex -translate-x-1/2 items-center justify-center gap-2 rounded-2xl px-4 py-2 leading-6 shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 active:opacity-80"
      onClick={onClick}
      type="button"
    >
      <LinearMapsLocation className="text-on-primary h-6 w-6" />
      <Typography as="span" variant="label" size="medium" weight="medium" className="font-medium">
        نقشه
      </Typography>
    </Button>
  );
}
