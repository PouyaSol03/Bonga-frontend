import { CrmFeedbackViews } from "../CrmFeedbackViews";
import type { CrmRoutePageProps } from "../CrmLayout";

export function CrmFeedbackPage(props: CrmRoutePageProps) {
  return <CrmFeedbackViews {...props} />;
}

export default CrmFeedbackPage;
