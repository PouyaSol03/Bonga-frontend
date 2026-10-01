import { expect, test } from "@playwright/test";
import {
  formatNotificationTime,
  getNotificationActionLabel,
  getNotificationPath,
} from "../../src/features/notifications/notificationRouting";
import { getNotificationDiamondColor } from "../../src/features/notifications/notificationDiamond";
import type { NotificationItem } from "../../src/features/notifications/api/notification.service";

test.describe("Notification Routing & Actions Unit/Logic Tests", () => {
  test("getNotificationDiamondColor renders diamond only for ads and matches status colors", () => {
    // 1. Ads with diamond
    const publishedAd: NotificationItem = {
      id: "1",
      title: "آگهی شما منتشر شد",
      category: "advertise",
    };
    expect(getNotificationDiamondColor(publishedAd)).toBe("bg-[#11A366]");

    const rejectedAd: NotificationItem = {
      id: "2",
      title: "آگهی شما تأیید نشد",
      category: "advertise",
    };
    expect(getNotificationDiamondColor(rejectedAd)).toBe("bg-[#EE3623]");

    const pendingAd: NotificationItem = {
      id: "3",
      title: "آگهی در انتظار بررسی است",
      category: "advertise",
    };
    expect(getNotificationDiamondColor(pendingAd)).toBe("bg-[#FFD44D]");

    const expiringAd: NotificationItem = {
      id: "4",
      title: "اعتبار آگهی در حال اتمام است",
      category: "advertise",
    };
    expect(getNotificationDiamondColor(expiringAd)).toBe("bg-[#FF6D00]");

    // 2. Non-ad categories MUST NOT have a diamond (Figma requirement)
    const chatNotification: NotificationItem = {
      id: "5",
      title: "پیام جدید دریافت کردید",
      category: "chats",
    };
    expect(getNotificationDiamondColor(chatNotification)).toBeNull();

    const tradeNotification: NotificationItem = {
      id: "6",
      title: "نتیجه معامله ثبت شد",
      category: "trades",
    };
    expect(getNotificationDiamondColor(tradeNotification)).toBeNull();

    const requestNotification: NotificationItem = {
      id: "7",
      title: "درخواست شما ثبت شد",
      category: "requests",
    };
    expect(getNotificationDiamondColor(requestNotification)).toBeNull();

    const systemNotification: NotificationItem = {
      id: "8",
      title: "سامانه بروزرسانی شد",
      category: "systems",
    };
    expect(getNotificationDiamondColor(systemNotification)).toBeNull();
  });

  test("getNotificationPath resolves routes correctly based on target and IDs", () => {
    // 1. Advertise target
    const adNotification: NotificationItem = {
      id: "1",
      title: "آگهی شما تایید شد",
      payload: { target: "advertise", advertise_id: "12345" },
    };
    expect(getNotificationPath(adNotification)).toBe("/ads/12345");

    const adNotificationWithoutId: NotificationItem = {
      id: "2",
      title: "آگهی شما رد شد",
      payload: { target: "advertise" },
    };
    expect(getNotificationPath(adNotificationWithoutId)).toBe("/account/my-ads");

    // 2. Chat target
    const chatNotification: NotificationItem = {
      id: "3",
      title: "پیام جدید",
      payload: { target: "chat", chat_thread_id: "9988" },
    };
    expect(getNotificationPath(chatNotification)).toBe("/chat/9988");

    const chatNotificationWithoutThread: NotificationItem = {
      id: "4",
      title: "پیام جدید",
      payload: { target: "chat" },
    };
    expect(getNotificationPath(chatNotificationWithoutThread)).toBe("/chat");

    // 3. Payment target
    const paymentNotification: NotificationItem = {
      id: "5",
      title: "افزایش اعتبار",
      payload: { target: "payment" },
    };
    expect(getNotificationPath(paymentNotification)).toBe("/account/wallet/history");

    // 4. Support target with chat thread
    const supportNotification: NotificationItem = {
      id: "6",
      title: "پاسخ پشتیبانی",
      payload: { target: "support", chat_thread_id: "supp-10" },
    };
    expect(getNotificationPath(supportNotification)).toBe(
      "/account/support/chat/new?thread_id=supp-10",
    );

    // 5. Agency target
    const agencyNotification: NotificationItem = {
      id: "7",
      title: "درخواست همکاری آژانس",
      payload: { target: "agency" },
    };
    expect(getNotificationPath(agencyNotification)).toBe("/account/dashboard/agency");

    // 6. System target
    const systemNotification: NotificationItem = {
      id: "8",
      title: "ورود جدید به حساب",
      payload: { target: "system" },
    };
    expect(getNotificationPath(systemNotification)).toBe("/notifications/settings");
  });

  test("getNotificationActionLabel matches all Figma SVG action scenarios", () => {
    // Figma 1: تمدید مجدد آگهی
    const renewNotification: NotificationItem = {
      id: "101",
      title: "آگهی شما منقضی شده است",
      category: "advertise",
      payload: { action: "renew" },
    };
    expect(getNotificationActionLabel(renewNotification)).toBe("تمدید آگهی");

    // Figma 2: مشاهده پیام
    const chatNotification: NotificationItem = {
      id: "102",
      title: "پیام جدید از کاربر",
      category: "chats",
      payload: { target: "chat" },
    };
    expect(getNotificationActionLabel(chatNotification)).toBe("مشاهده پیام");

    // Figma 3: درخواست و ثبت کمیسیون
    const commissionNotification: NotificationItem = {
      id: "103",
      title: "معامله شما نهایی شد",
      category: "trades",
      payload: { action: "register_commission" },
    };
    expect(getNotificationActionLabel(commissionNotification)).toBe("ثبت کمیسیون");

    // Figma 4: درخواست ملک و مشاهده جزئیات
    const requestNotification: NotificationItem = {
      id: "104",
      title: "درخواست ملک جدید ثبت شد",
      category: "requests",
      payload: { target: "request" },
    };
    expect(getNotificationActionLabel(requestNotification)).toBe("مشاهده درخواست");

    // Figma 5: استفاده از کد تخفیف
    const discountNotification: NotificationItem = {
      id: "105",
      title: "کد تخفیف ویژه برای شما فعال شد",
      category: "systems",
      payload: { action: "use_discount" },
    };
    expect(getNotificationActionLabel(discountNotification)).toBe("استفاده از تخفیف");
  });

  test("formatNotificationTime formats date keys correctly", () => {
    const today = new Date().toISOString();
    expect(formatNotificationTime(today)).toContain("امروز");

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(formatNotificationTime(yesterday)).toContain("دیروز");
  });
});
