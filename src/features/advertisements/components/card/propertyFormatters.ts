export function formatSquareMeters(value?: string): string | undefined {
  if (!value || value.trim() === "" || value.trim() === "-") return undefined;
  const clean = value.replace(/متر(\s*مربع)?/g, "").trim();
  if (!clean) return undefined;
  return `${clean} متر مربع`;
}

export function formatBuildingAgeClean(value?: string): string | undefined {
  if (!value || value.trim() === "" || value.trim() === "-") return undefined;
  const clean = value.replace(/ساخت/g, "").trim();
  if (!clean) return undefined;
  if (clean.includes("سال") || clean.includes("نوساز")) return clean;
  return `${clean} سال`;
}
