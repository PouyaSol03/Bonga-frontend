import { AdCard } from "../../../shared/components/AdCard";
import type { ConsultantAd } from "./adManagementData";

type ConsultantAdCardProps = {
  ad: ConsultantAd;
  showStatusBadge?: boolean;
  state?: unknown;
  to?: string;
};

export function ConsultantAdCard({ ad, showStatusBadge = false, state, to }: ConsultantAdCardProps) {
  return <AdCard ad={ad} showStatusBadge={showStatusBadge} state={state} to={to} />;
}
