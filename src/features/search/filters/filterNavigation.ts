export function getSafeReturnToPath() {
  const returnTo = new URLSearchParams(window.location.search).get("returnTo") ?? "";

  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) return "";

  return returnTo;
}

export function getBackToSearchPath(backBasePath = "/search") {
  const returnTo = getSafeReturnToPath();

  if (returnTo) return returnTo;

  const params = new URLSearchParams(window.location.search);

  params.delete("focus");
  params.delete("returnTo");

  const queryString = params.toString();

  return queryString ? `${backBasePath}?${queryString}` : backBasePath;
}
