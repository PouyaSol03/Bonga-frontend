export function mediaSource(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const record = value as Record<string, unknown>;

  for (const key of ["path", "url", "src", "file", "image", "video"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  return "";
}

export function canonicalizeMediaPath(source: unknown): string {
  if (typeof source !== "string") return "";
  let clean = source.trim().split("?")[0]?.split("#")[0] ?? "";
  if (!clean || clean.toLowerCase().startsWith("data:")) return "";

  try {
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      clean = new URL(clean).pathname;
    }
  } catch {
    // keep as is
  }

  // Strip leading slashes
  clean = clean.replace(/^\/+/, "");

  // Common backend upload directories
  clean = clean.replace(/^public\//, "");
  clean = clean.replace(/^uploads\/image\/advertiseImg\//, "");
  clean = clean.replace(/^uploads\/video\/advertiseVideo\//, "");
  clean = clean.replace(/^uploads\//, "");

  return clean;
}
