import { usePackagesQuery } from "../packages/api/package.hooks";
import { DashboardPaymentMobilePage } from "./payment/DashboardPaymentMobilePage";
import { DashboardPaymentDesktopPage } from "./payment/DashboardPaymentDesktopPage";

function useIsMobileDashboardPayment() {
  return true;
}

export default function DashboardPaymentPage() {
  const { data: packages = [], error, isError, isLoading, refetch } = usePackagesQuery();
  const isMobile = useIsMobileDashboardPayment();
  const sharedProps = { error, isError, isLoading, packages, refetch };

  if (isMobile) {
    return <DashboardPaymentMobilePage {...sharedProps} />;
  }

  return <DashboardPaymentDesktopPage {...sharedProps} />;
}
