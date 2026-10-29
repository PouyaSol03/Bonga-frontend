import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../shared/auth/auth-storage";
import { useProfileStore } from "./stores/useProfileStore";
import { isBusinessAccount } from "./my-account/accountHeaderHelpers";
import { clearBusinessSuccessQuery } from "./my-account/navigationHelpers";
import { AccountBusinessSuccessSheet } from "./my-account/components/AccountBusinessSuccessSheet";
import { StandardAccountPage } from "./my-account/components/StandardAccountPage";
import { IndependentConsultantAccountPage } from "./my-account/components/IndependentConsultantAccountPage";

export function MyAccountPage() {
  const [authSession, setAuthSession] = useState(() => getStoredAuthSession());
  const activeRole = getActiveAuthRole(authSession);
  const [isBusinessSuccessOpen, setIsBusinessSuccessOpen] = useState(
    () => new URLSearchParams(window.location.search).get("businessSuccess") === "1",
  );

  useEffect(() => {
    function syncAuthSession() {
      setAuthSession(getStoredAuthSession());
    }

    window.addEventListener(authSessionChangedEventName, syncAuthSession);
    window.addEventListener("storage", syncAuthSession);

    return () => {
      window.removeEventListener(authSessionChangedEventName, syncAuthSession);
      window.removeEventListener("storage", syncAuthSession);
    };
  }, []);

  const sessionUserId = authSession?.userId;
  const sessionActiveRole = authSession?.activeRole;

  useEffect(() => {
    if (authSession) {
      void useProfileStore.getState().fetchProfile(true);
    }
  }, [sessionUserId, sessionActiveRole]);

  const businessSuccessSheet = (
    <AccountBusinessSuccessSheet
      isOpen={isBusinessSuccessOpen}
      onClose={() => {
        setIsBusinessSuccessOpen(false);
        clearBusinessSuccessQuery();
      }}
    />
  );

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="h-full w-full"
        exit={{ opacity: 0, y: 20 }}
        initial={{ opacity: 0, y: 20 }}
        key={authSession && isBusinessAccount(activeRole) ? activeRole : "standard"}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
      >
        {authSession && isBusinessAccount(activeRole) ? (
          <IndependentConsultantAccountPage
            authSession={authSession}
            businessSuccessSheet={businessSuccessSheet}
          />
        ) : (
          <StandardAccountPage
            authSession={authSession}
            businessSuccessSheet={businessSuccessSheet}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
