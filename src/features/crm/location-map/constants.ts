export const MAIN_BOUNDARY_COLOR = "#0048c4";
export const SUB_BOUNDARY_COLOR = "#11a366";
export const SUB_BOUNDARY_COLORS = [
  "#e11d48", // rose
  "#7c3aed", // violet
  "#0891b2", // cyan
  "#d97706", // amber
  "#16a34a", // green
  "#db2777", // pink
  "#4f46e5", // indigo
  "#ea580c", // orange
  "#0f766e", // teal
  "#9333ea", // purple
  "#65a30d", // lime
  "#dc2626", // red
] as const;
export const MUTED_BOUNDARY_COLOR = "#7c3aed";
export const SNAP_DISTANCE_PX = 16;

export function getSubNeighborhoodColor(key: string) {
  if (!key) return SUB_BOUNDARY_COLOR;

  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) - hash + key.charCodeAt(index)) | 0;
  }

  return SUB_BOUNDARY_COLORS[Math.abs(hash) % SUB_BOUNDARY_COLORS.length];
}
