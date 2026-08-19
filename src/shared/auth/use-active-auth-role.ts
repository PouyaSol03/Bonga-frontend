import { useEffect, useState } from "react";

import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
  type AuthRoleSlug,
} from "./auth-storage";

function readActiveRole(): AuthRoleSlug {
  return getActiveAuthRole(getStoredAuthSession()) ?? "user";
}

export function useActiveAuthRole() {
  const [activeRole, setActiveRole] = useState<AuthRoleSlug>(readActiveRole);

  useEffect(() => {
    const sync = () => setActiveRole(readActiveRole());

    window.addEventListener(authSessionChangedEventName, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(authSessionChangedEventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return activeRole;
}
