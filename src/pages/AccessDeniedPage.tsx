import { AccessDeniedState } from "../components/ErrorState";
import { pushRoute } from "../routes/navigation";

export function AccessDeniedPage() {
  return <AccessDeniedState onBack={() => pushRoute("/account")} />;
}
