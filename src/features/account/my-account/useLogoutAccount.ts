import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../../auth/api/auth.hooks";

export function useLogoutAccount() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const openLogoutConfirm = () => {
    if (!logoutMutation.isPending) {
      setIsLogoutConfirmOpen(true);
    }
  };

  const closeLogoutConfirm = () => {
    if (!logoutMutation.isPending) {
      setIsLogoutConfirmOpen(false);
    }
  };

  const confirmLogout = () => {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setIsLogoutConfirmOpen(false);
        navigate("/home", { replace: true });
      },
    });
  };

  return {
    closeLogoutConfirm,
    confirmLogout,
    isLoggingOut: logoutMutation.isPending,
    isLogoutConfirmOpen,
    openLogoutConfirm,
  };
}
