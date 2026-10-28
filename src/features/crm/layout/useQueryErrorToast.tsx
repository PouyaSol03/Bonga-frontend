import { useEffect } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import type { CrmRoutePageProps } from "./types";

export function useQueryErrorToast(errors: Array<unknown>, notify: CrmRoutePageProps["notify"]) {
  const error = errors.find(Boolean);

  useEffect(() => {
    if (!error) return;
    notify(getApiErrorMessage(error, "دریافت اطلاعات از سرور ناموفق بود."), "error");
  }, [error, notify]);
}
