export type BrowserLocation = {
  accuracy: number | null;
  latitude: number;
  longitude: number;
};

export type BrowserLocationErrorCode =
  | "insecure-context"
  | "permission-denied"
  | "timeout"
  | "unavailable"
  | "unsupported"
  | "unknown";

export type BrowserLocationError = Error & {
  code: BrowserLocationErrorCode;
};

const defaultPositionOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 60_000,
  timeout: 15_000,
};

function createBrowserLocationError(
  code: BrowserLocationErrorCode,
  message: string,
): BrowserLocationError {
  return Object.assign(new Error(message), { code });
}

function getGeolocationErrorCode(error: GeolocationPositionError): BrowserLocationErrorCode {
  if (error.code === error.PERMISSION_DENIED) return "permission-denied";
  if (error.code === error.POSITION_UNAVAILABLE) return "unavailable";
  if (error.code === error.TIMEOUT) return "timeout";

  return "unknown";
}

export function getBrowserLocation(options: PositionOptions = {}) {
  return new Promise<BrowserLocation>((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(
        createBrowserLocationError(
          "unsupported",
          "Geolocation is not supported by this browser.",
        ),
      );
      return;
    }

    if (typeof window !== "undefined" && !window.isSecureContext) {
      reject(
        createBrowserLocationError(
          "insecure-context",
          "Geolocation requires HTTPS or localhost.",
        ),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          accuracy: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(createBrowserLocationError(getGeolocationErrorCode(error), error.message));
      },
      {
        ...defaultPositionOptions,
        ...options,
      },
    );
  });
}

export function getBrowserLocationNotice(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? (error.code as BrowserLocationErrorCode)
      : "unknown";

  if (code === "insecure-context") {
    return "برای دریافت موقعیت، برنامه باید روی HTTPS یا localhost اجرا شود";
  }

  if (code === "permission-denied") {
    return "دسترسی به موقعیت رد شد. لطفا اجازه Location را در مرورگر فعال کنید";
  }

  if (code === "timeout") {
    return "دریافت موقعیت طول کشید. لطفا دوباره تلاش کنید";
  }

  if (code === "unsupported") {
    return "مرورگر شما از دریافت موقعیت پشتیبانی نمی‌کند";
  }

  return "امکان دریافت موقعیت شما وجود ندارد";
}
