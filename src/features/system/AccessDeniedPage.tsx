import { AccessDeniedState } from "../../shared/components/ErrorState";
import { pushRoute } from "../../shared/navigation/navigation";

export function AccessDeniedPage() {
  return <AccessDeniedState onBack={() => pushRoute("/account")} />;
}
