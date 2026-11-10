export function formatOptionalNumber(value: number | null | undefined): string {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR").format(value);
}

export const slugToConsultantPath: Record<string, string> = {
  file_maker: "/account/ranking/badges/file",
  file: "/account/ranking/badges/file",
  market_magnet: "/account/ranking/badges/magnet",
  magnet: "/account/ranking/badges/magnet",
  always_active: "/account/ranking/badges/time",
  time: "/account/ranking/badges/time",
  response: "/account/ranking/badges/response",
};
