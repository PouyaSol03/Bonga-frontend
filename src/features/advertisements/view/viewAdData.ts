export function parseAdIdFromPath(pathname: string): string | null {
  const match = /^\/ads\/([^/]+)(?:\/[a-z-]+)?\/?$/.exec(pathname);
  if (!match) return null;

  return decodeURIComponent(match[1]);
}
