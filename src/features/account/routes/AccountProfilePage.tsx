import { useNavigate } from "react-router";
import { useMyProfileQuery, useUpdateMyProfileMutation } from "../api/account.hooks";
import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { getApiErrorMessage } from "../../../shared/api/api";
import { useToast } from "../../../shared/hooks/useToast";
import {
  AccountPageShell,
  AccountProfileForm,
  AccountProfileSkeleton,
  AccountRetryState,
} from "../accountPageViews";

export function AccountProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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

  return (
    <AccountPageShell title="مشخصات من">
      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-24">
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
                  navigate("/account/profile");
                  showToast("اطلاعات حساب ذخیره شد");
                },
              });
            }}
          />
        ) : null}
      </main>
    </AccountPageShell>
  );
}
