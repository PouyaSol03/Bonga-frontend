// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDz8W0t_j0YU-2WZy66n5yyJWeWXkL-J_Q",
  authDomain: "bonga-exirfirm.firebaseapp.com",
  projectId: "bonga-exirfirm",
  storageBucket: "bonga-exirfirm.firebasestorage.app",
  messagingSenderId: "926638791986",
  appId: "1:926638791986:web:5876127ace9834dac14b2b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || payload.data?.title || 'اعلان جدید بنگاه';
  const notificationBody =
    payload.notification?.body || payload.data?.body || '';

  const targetUrl =
    payload.data?.url ||
    payload.data?.target ||
    (payload.fcmOptions && payload.fcmOptions.link) ||
    '/notifications';

  const notificationOptions = {
    body: notificationBody,
    icon: payload.notification?.icon || payload.data?.icon || '/icon-192.png',
    badge: '/icon-192.png',
    dir: 'rtl',
    lang: 'fa',
    vibrate: [200, 100, 200],
    data: {
      ...payload.data,
      url: targetUrl,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if ('navigate' in client && targetUrl) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});