export type AdvertisementMapSearchParamValue = boolean | number | string;

export function buildAdvertisementMapRequestPath(
  params: Record<string, AdvertisementMapSearchParamValue>,
) {
  const query = Object.entries(params)
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(String(value));

      if (key === "geofence") {
        // The API contract uses latitude,longitude pairs separated by literal
        // pipes. URLSearchParams changes those separators to %7C.
        encodedValue = encodedValue
          .replace(/%7C/gi, "|")
          .replace(/%2C/gi, ",");
      }

      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");

  return query ? `public/advertise/map?${query}` : "public/advertise/map";
}
