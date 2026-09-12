import { useCallback, useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging, isMessagingSupported } from '../../shared/config/firebase';
import { registerFcmToken, unregisterFcmToken } from './api/notification.service';
import { getStoredAuthSession } from '../../shared/auth/auth-storage';

const FCM_TOKEN_STORAGE_KEY = 'bonga_fcm_token';

export type FcmPermissionState = NotificationPermission | 'unsupported';

export function useFcm() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  });
  const [permission, setPermission] = useState<FcmPermissionState>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
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
        const title =
          payload.notification?.title ||
          payload.data?.title ||
          'اعلان جدید بنگاه';
        const body =
          payload.notification?.body ||
          payload.data?.body ||
          '';

        const targetUrl =
          payload.data?.url ||
          payload.data?.target ||
          (payload.fcmOptions && payload.fcmOptions.link) ||
          '/notifications';

        // Dispatch app-level event so header badges and lists can react in real time
        window.dispatchEvent(
          new CustomEvent('bonga:fcm:message', { detail: payload }),
        );

        // Show foreground notification if permission is granted
        if (Notification.permission === 'granted') {
          const options = {
            body,
            icon: payload.notification?.icon || payload.data?.icon || '/icon-192.png',
            badge: '/icon-192.png',
            dir: 'rtl' as NotificationDirection,
            lang: 'fa',
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
    } catch (error) {
        console.warn('خطا در تنظیم گوش‌دهنده پیام‌های پیش‌زمینه FCM:', error);
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
      console.warn('پوش‌نوتیفیکیشن در این مرورگر یا محیط پشتیبانی نمی‌شود.');
      return null;
    }

    const messagingInstance = await getFirebaseMessaging();
    if (!messagingInstance) {
      console.warn('پوش‌نوتیفیکیشن در این مرورگر یا محیط پشتیبانی نمی‌شود.');
      return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn(
        'کلید VAPID تعریف نشده است (VITE_FIREBASE_VAPID_KEY در فایل .env). پوش نوتیفیکیشن وب به کلید VAPID نیاز دارد.',
      );
    }

    try {
      setLoading(true);
      console.log('[FCM] Calling Notification.requestPermission()...');
      const perm = await Notification.requestPermission();
      console.log('[FCM] Permission result:', perm);
      setPermission(perm);

      if (perm !== 'granted') {
        if (perm === 'denied') {
          console.warn(
            '[FCM] دسترسی نوتیفیکیشن در مرورگر مسدود (Block / Denied) است. برای تست مجدد، روی آیکون کنار آدرس سایت در مرورگر کلیک کنید و Notifications را ریست یا مجاز (Allow) کنید.',
          );
        }
        setLoading(false);
        return null;
      }

      // Register service worker from public folder
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      );
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
            await registerFcmToken(currentToken, 'web');
          } catch (apiError) {
            console.warn('خطا در ارسال توکن به بک‌اند:', apiError);
          }
        }
      }

      setLoading(false);
      return currentToken;
    } catch (error) {
      console.error('خطا در گرفتن توکن FCM:', error);
      setLoading(false);
      return null;
    }
  }, []);

  const unregisterToken = useCallback(async () => {
    const savedToken = token || window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (savedToken) {
      try {
        await unregisterFcmToken(savedToken);
      } catch (err) {
        console.warn('خطا در حذف توکن از بک‌اند:', err);
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