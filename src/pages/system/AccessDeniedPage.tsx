import { AccessDeniedState } from "../../shared/components/ErrorState";
import { pushRoute } from "../../app/router/navigation";

export function AccessDeniedPage() {
  return <AccessDeniedState onBack={() => pushRoute("/account")} />;
}
