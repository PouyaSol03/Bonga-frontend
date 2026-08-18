import { CrmAdvertiseDetailView } from "../CrmAdvertiseDetailView";
import type { CrmRoutePageProps } from "../CrmLayout";

function getAdvertiseId() {
  const match = window.location.pathname.match(/^\/crm\/advertises\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export function CrmAdvertiseDetailPage(props: CrmRoutePageProps) {
  return <CrmAdvertiseDetailView advertiseId={getAdvertiseId()} {...props} />;
}
