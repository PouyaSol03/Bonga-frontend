import { useNavigate } from "react-router";
import { canGoBackInApp } from "../../../../shared/navigation/navigation";
import { getEditAdRouteState } from "../routeState";
import { getAdStatePath } from "../../../account/adManagement/adManagementData";

interface UseNewAdBackNavigationProps {
  editAdId: string | null;
  editAdState: ReturnType<typeof getEditAdRouteState>;
}

export function useNewAdBackNavigation({ editAdId, editAdState }: UseNewAdBackNavigationProps) {
  const navigate = useNavigate();

  const crmReturnTo = editAdId
    ? (editAdState.editReturnTo ?? `/crm/advertises/${encodeURIComponent(editAdId)}`)
    : "/crm/advertises";

  const leaveCrmEditor = () => {
    if (canGoBackInApp()) navigate(-1);
    else navigate(crmReturnTo);
  };

  const getEditBackTarget = () => {
    if (editAdState.editReturnTo) return editAdState.editReturnTo;
    if (editAdState.returnTo && !editAdState.returnTo.includes("/state-ad") && !editAdState.returnTo.includes("/state-ads")) {
      return editAdState.returnTo;
    }
    if (editAdState.returnTo) return editAdState.returnTo;
    if (editAdId) return getAdStatePath(editAdId);
    return "/account/manage-ads";
  };

  const handleEditBack = () => {
    if (canGoBackInApp()) navigate(-1);
    else navigate(getEditBackTarget());
  };

  return {
    handleEditBack,
    leaveCrmEditor,
  };
}
