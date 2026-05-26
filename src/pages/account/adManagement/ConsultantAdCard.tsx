import { AdCard } from "../../../components/AdCard";
import type { AdManagementRouteState, ConsultantAd } from "./adManagementData";

type ConsultantAdCardProps = {
  ad: ConsultantAd;
  state?: AdManagementRouteState;
  to?: string;
};

export function ConsultantAdCard({ ad, state, to }: ConsultantAdCardProps) {
  return <AdCard ad={ad} state={state} to={to} />;
}
