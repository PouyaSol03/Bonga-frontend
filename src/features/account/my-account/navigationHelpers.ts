export function getLoginRequiredPath(returnTo: string, actionLabel?: string) {
  const params = new URLSearchParams({ returnTo });
  if (actionLabel) {
    params.set("action", actionLabel);
  }
  return `/login-required?${params.toString()}`;
}

export function clearBusinessSuccessQuery() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("businessSuccess")) return;

  url.searchParams.delete("businessSuccess");
  window.history.replaceState(
    window.history.state ?? {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}
