import LinearBuilding3 from "../../../../../shared/icons/LinearBuilding3";
import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { ConsultantAvatar } from "../ConsultantCardWidgets";
import type { TeamConsultant } from "../teamTypes";

export type ReplacementTarget =
  | { id: "agency"; kind: "agency"; name: string; subtitle: string }
  | { id: string; kind: "consultant"; consultant: TeamConsultant };

export function getReplacementLabel(target: ReplacementTarget) {
  return target.kind === "agency" ? target.name : target.consultant.name;
}

export function getReplacementSearchText(target: ReplacementTarget) {
  return target.kind === "agency"
    ? `${target.name} ${target.subtitle}`
    : `${target.consultant.name} ${target.consultant.phone}`;
}

export function ReplacementOption({
  isSelected,
  onSelect,
  target,
}: {
  isSelected: boolean;
  onSelect: () => void;
  target: ReplacementTarget;
}) {
  return (
    <Button
      unstyled
      aria-pressed={isSelected}
      className={`flex h-[76px] w-full items-center gap-3 rounded-xl border px-3 text-right transition ${
        isSelected
          ? "border-primary bg-primary-container"
          : "border-outline-var bg-surface-container-lowest"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex min-w-0 flex-1 gap-x-2">
        {target.kind === "agency" ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-container text-primary"
          >
            <LinearBuilding3 className="h-6 w-6" />
          </Typography>
        ) : (
          <ConsultantAvatar consultant={target.consultant} sizeClassName="h-11 w-11" />
        )}
        <div className="flex min-w-0 flex-col justify-center">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="semibold"
            className="block truncate text-sm font-semibold text-on-surface"
          >
            {getReplacementLabel(target)}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="block truncate text-xs font-medium text-outline"
          >
            {target.kind === "agency" ? target.subtitle : target.consultant.phone}
          </Typography>
        </div>
      </div>
      <SelectionCheckIndicator
        checked={isSelected}
        className="!h-4.5 !w-4.5 rounded-sm"
      />
    </Button>
  );
}
