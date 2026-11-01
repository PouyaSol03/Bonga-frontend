import { Typography } from "../../../shared/ui/Typography";

export function LoadingSpinner() {
  return (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
