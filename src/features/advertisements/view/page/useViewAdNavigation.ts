import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import { parseViewAdIdFromPath } from "../details/viewAdNavigation";

export function useViewAdNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const adId = parseViewAdIdFromPath(window.location.pathname);
  const isPreview = window.location.pathname.startsWith("/preview-ad/");

  const handleBack = useCallback(() => {
    if (isPreview) {
      const target = adId
        ? `/account/manage-ads/${encodeURIComponent(String(adId))}/state-ad`
        : "/account/manage-ads";
      navigate(target, { replace: true });
      return;
    }
    const from = (location.state as { from?: string } | null)?.from;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/home", { replace: true });
  }, [isPreview, adId, location.state, navigate]);

  const navigateToLoginRequiredPage = (actionLabel: string) => {
    const redirectPath = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({
      action: actionLabel,
      returnTo: redirectPath,
    });
    navigate(`/login-required?${params.toString()}`);
  };

  const requireAuthorization = (actionLabel: string) => {
    if (getStoredAuthSession()) return true;

    navigateToLoginRequiredPage(actionLabel);

    return false;
  };

  return {
    navigate,
    adId,
    isPreview,
    handleBack,
    navigateToLoginRequiredPage,
    requireAuthorization,
  };
}
