import { AdCard } from "../../../components/AdCard";
import type { AdManagementRouteState, ConsultantAd } from "./adManagementData";

type ConsultantAdCardProps = {
  ad: ConsultantAd;
  showStatusBadge?: boolean;
  state?: AdManagementRouteState;
  to?: string;
};

export function ConsultantAdCard({ ad, showStatusBadge = false, state, to }: ConsultantAdCardProps) {
  return <AdCard ad={ad} showStatusBadge={showStatusBadge} state={state} to={to} />;
}
