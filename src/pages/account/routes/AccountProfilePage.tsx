import { useState, useEffect } from "react";
import { useMyProfileQuery, useUpdateMyProfileMutation } from "../../../core/hooks/account.hooks";
import { getStoredAuthSession } from "../../../core/auth/auth-storage";
import { type SnackbarVariant, Snackbar } from "../../../shared/components/Snackbar";
import { getApiErrorMessage } from "../../../core/api/api";
import { AccountPageShell, AccountProfileForm, AccountProfileSkeleton, AccountRetryState } from "../accountPageViews";
import type { AccountToast } from "../accountPageViews";

export function AccountProfilePage() {
  const [toast, setToast] = useState<AccountToast | null>(null);
  const { data: profile, error, isError, isLoading, refetch } = useMyProfileQuery();
  const updateProfile = useUpdateMyProfileMutation();
  const mobile = getStoredAuthSession()?.mobile ?? "-";
  const profileFormKey = [
    profile?.id,
    profile?.mobile,
    profile?.email,
    profile?.family,
    profile?.name,
    profile?.nationalnumber,
  ].join("|");

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (
    message: string,
    title = "موفقیت",
    variant: SnackbarVariant = "success",
  ) => setToast({ message, title, variant });

  return (
    <AccountPageShell title="مشخصات من">
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-24">
        {isLoading ? <AccountProfileSkeleton /> : null}
        {isError ? (
          <AccountRetryState
            error={error}
            message={getApiErrorMessage(error, "دریافت مشخصات با خطا مواجه شد.")}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError ? (
          <AccountProfileForm
            isSubmitting={updateProfile.isPending}
            key={profileFormKey}
            mobile={mobile}
            profile={profile}
            onSubmit={(form) => {
              updateProfile.mutate(form, {
                onError: (submitError) => {
                  showToast(
                    getApiErrorMessage(submitError, "ذخیره اطلاعات با خطا مواجه شد"),
                    "خطا",
                    "error",
                  );
                },
                onSuccess: () => {
                  window.history.pushState({}, "", "/account/profile");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                  showToast("اطلاعات حساب ذخیره شد");
                },
              });
            }}
          />
        ) : null}
      </main>

      {toast ? (
        <Snackbar
          className="bottom-20"
          message={toast.message}
          onDismiss={() => setToast(null)}
          title={toast.title}
          variant={toast.variant}
        />
      ) : null}
    </AccountPageShell>
  );
}
