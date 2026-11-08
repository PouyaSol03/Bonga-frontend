import { getLoginRequiredPath } from "../../../shared/navigation/navigation";

export { getLoginRequiredPath };

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
