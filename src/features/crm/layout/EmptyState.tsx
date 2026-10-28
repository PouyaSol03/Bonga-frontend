import { Typography } from "../../../shared/ui/Typography";
import { CrmIcon } from "./CrmIcon";

export function EmptyState({
  compact = false,
  description,
}: {
  compact?: boolean;
  description: string;
}) {
  return (
    <div
      className={`mx-auto flex w-full flex-col items-center justify-center text-center ${compact ? "py-8" : "py-14"}`}
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
      >
        <CrmIcon name="empty" size={24} />
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="m-0 mt-3 text-sm font-medium text-[#8992a1]"
      >
        {description}
      </Typography>
    </div>
  );
}
