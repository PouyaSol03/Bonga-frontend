import { CrmPackagesView } from "../packages/CrmPackagesView";
import type { CrmRoutePageProps } from "../CrmLayout";

export function CrmPackagesPage(props: CrmRoutePageProps) {
  return <CrmPackagesView {...props} />;
}
