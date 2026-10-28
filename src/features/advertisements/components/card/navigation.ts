export function getAdNavigationState(to: string, state: unknown) {
  if (state !== undefined || !to.startsWith("/ads/")) {
    return state;
  }

  const from = `${window.location.pathname}${window.location.search}`;

  if (from === to) {
    return state;
  }

  return { from };
}
