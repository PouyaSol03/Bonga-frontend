import { AdCard } from "../../advertisements/components/AdCard";
import type { ConsultantAd } from "./adManagementData";

type ConsultantAdCardProps = {
  ad: ConsultantAd;
  showStatusBadge?: boolean;
  state?: unknown;
  to?: string;
  onDeleteIncomplete?: (event: React.MouseEvent) => void;
};

export function ConsultantAdCard({ ad, showStatusBadge = false, state, to, onDeleteIncomplete }: ConsultantAdCardProps) {
  return <AdCard ad={ad} onDeleteIncomplete={onDeleteIncomplete} showStatusBadge={showStatusBadge} state={state} to={to} />;
}
