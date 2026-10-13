import { useNavigate } from "react-router";
import { AccessDeniedState } from "../../shared/components/ErrorState";

export function AccessDeniedPage() {
  const navigate = useNavigate();
  return <AccessDeniedState onBack={() => navigate("/account")} />;
}
