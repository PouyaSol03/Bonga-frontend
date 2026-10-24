import { useCallback, useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging, isMessagingSupported } from "../../shared/config/firebase";
import { registerFcmToken, unregisterFcmToken } from "./api/notification.service";
import { getStoredAuthSession } from "../../shared/auth/auth-storage";

const FCM_TOKEN_STORAGE_KEY = "bonga_fcm_token";

type FcmPermissionState = NotificationPermission | "unsupported";

export function useFcm() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  });
  const [permission, setPermission] = useState<FcmPermissionState>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  });
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    void isMessagingSupported().then((supported) => {
      if (isMounted) {
        setIsSupported(supported);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Foreground message listener
  useEffect(() => {
    if (!isSupported) return;

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    void getFirebaseMessaging().then((messagingInstance) => {
      if (!isMounted || !messagingInstance) return;

      try {
        unsubscribe = onMessage(messagingInstance, (payload) => {
          const title = payload.notification?.title || payload.data?.title || "اعلان جدید بنگاه";
          const body = payload.notification?.body || payload.data?.body || "";

          const targetUrl =
            payload.data?.url ||
            payload.data?.target ||
            (payload.fcmOptions && payload.fcmOptions.link) ||
            "/notifications";

          // Dispatch app-level event so header badges and lists can react in real time
          window.dispatchEvent(new CustomEvent("bonga:fcm:message", { detail: payload }));

          // Show foreground notification if permission is granted
          if (Notification.permission === "granted") {
            const options = {
              body,
              icon: payload.notification?.icon || payload.data?.icon || "/icon-192.png",
              badge: "/icon-192.png",
              dir: "rtl" as NotificationDirection,
              lang: "fa",
              data: {
                ...payload.data,
                url: targetUrl,
              },
            };

            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
              navigator.serviceWorker.ready
                .then((reg) => reg.showNotification(title, options))
                .catch(() => {
                  try {
                    new Notification(title, options);
                  } catch {
                    // Ignore fallback error
                  }
                });
            } else {
              try {
                new Notification(title, options);
              } catch {
                // Ignore fallback error
              }
            }
          }
        });
      } catch {
        // Ignore foreground listener setup error
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isSupported]);

  const requestToken = useCallback(async () => {
    const supported = await isMessagingSupported();
    if (!supported) {
      return null;
    }

    const messagingInstance = await getFirebaseMessaging();
    if (!messagingInstance) {
      return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    try {
      setLoading(true);
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLoading(false);
        return null;
      }

      // Register service worker from public folder
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;

      const currentToken = await getToken(messagingInstance, {
        vapidKey: vapidKey || undefined,
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        setToken(currentToken);
        window.localStorage.setItem(FCM_TOKEN_STORAGE_KEY, currentToken);

        // Register token with backend if user is authenticated
        const hasSession = Boolean(getStoredAuthSession());
        if (hasSession) {
          try {
            await registerFcmToken(currentToken, "web");
          } catch {
            // Ignore backend registration error
          }
        }
      }

      setLoading(false);
      return currentToken;
    } catch {
      setLoading(false);
      return null;
    }
  }, []);

  const unregisterToken = useCallback(async () => {
    const savedToken = token || window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (savedToken) {
      try {
        await unregisterFcmToken(savedToken);
      } catch {
        // Ignore backend unregistration error
      }
      window.localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
      setToken(null);
    }
  }, [token]);

  return {
    requestToken,
    unregisterToken,
    token,
    loading,
    permission,
    isSupported,
  };
}
