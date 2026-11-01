import { useCallback } from "react";
import { useNavigate } from "react-router";
import { getStoredBackTarget } from "../../../shared/navigation/navigation";
import { SEARCH_FILTER_ENTRY_KEY } from "./constants";

export function useSearchMapBackNavigation() {
  const navigate = useNavigate();

  const navigateToLoginRequired = useCallback(
    (action: string) => {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      const params = new URLSearchParams({ action, returnTo });
      navigate(`/login-required?${params.toString()}`);
    },
    [navigate],
  );

  const handleBack = useCallback(() => {
    const storedBackTarget = getStoredBackTarget();

    if (storedBackTarget && !storedBackTarget.backTo.startsWith("/search")) {
      const isFilterEntry = Boolean(
        (window.history.state as Record<string, unknown> | null)?.[SEARCH_FILTER_ENTRY_KEY],
      );

      if (!isFilterEntry && window.history.length > 1) {
        navigate(-1);
        return;
      }

      navigate(storedBackTarget.backTo, { replace: true, state: storedBackTarget.backState });
      return;
    }

    if (storedBackTarget && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/home", { replace: true });
  }, [navigate]);

  return {
    handleBack,
    navigateToLoginRequired,
  };
}
