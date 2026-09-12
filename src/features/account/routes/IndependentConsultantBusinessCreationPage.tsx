import { useState, useEffect } from "react";
import { useCreateMyAgentMutation, useMyProfileQuery } from "../api/account.hooks";
import { getApiErrorMessage } from "../../../shared/api/api";
import { BusinessFormPage, RequiredLabel, normalizePhoneDigits } from "../businessCreationShared";
import type { BusinessToast } from "../businessCreationShared";

export function IndependentConsultantBusinessCreationPage() {
  const { data: profile } = useMyProfileQuery();
  const isAgencyPending = Boolean(
    profile?.agency_id &&
      (profile?.agency_status === 0 ||
        profile?.agency_status === "0" ||
        profile?.agency_status === "wait" ||
        String(profile?.agency_status).toLowerCase() === "wait"),
  );
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [toast, setToast] = useState<BusinessToast | null>(null);
  const createAgentMutation = useCreateMyAgentMutation();

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSubmitAgent = async () => {
    createAgentMutation.reset();

    const trimmedFullName = fullName.trim();
    const normalizedMobile = normalizePhoneDigits(mobile);

    if (!trimmedFullName) {
      setToast({
        message: "نام و نام خانوادگی مشاور الزامی است.",
        title: "خطا",
        variant: "error",
      });
      return false;
    }

    if (!normalizedMobile) {
      setToast({
        message: "شماره همراه الزامی است.",
        title: "خطا",
        variant: "error",
      });
      return false;
    }

    try {
      await createAgentMutation.mutateAsync({
        agency_id: null,
        name: trimmedFullName,
        phonenumber: normalizedMobile,
      });

      return true;
    } catch (error) {
      setToast({
        message: getApiErrorMessage(error, "ایجاد کسب و کار با خطا مواجه شد."),
        title: "خطا",
        variant: "error",
      });
      return false;
    }
  };

  return (
    <BusinessFormPage
      businessType="independent-consultant"
      disabledSubmit={isAgencyPending}
      fields={
        <>
          <div>
            <RequiredLabel>نام و نام خانوادگی مشاور</RequiredLabel>
            <input
              className="mt-2 h-14 w-full rounded-xl border border-outline-var bg-surface-container-lowest px-4 text-right text-base font-normal leading-6 text-on-surface outline-none placeholder:text-outline focus:border-primary"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="مثال: املاک نوروزیان"
              value={fullName}
            />
          </div>

          <div>
            <RequiredLabel>شماره همراه</RequiredLabel>
            <input
              className="mt-2 h-14 w-full rounded-xl border border-outline-var bg-surface-container-lowest px-4 text-right text-base font-normal leading-6 text-on-surface outline-none placeholder:text-outline focus:border-primary"
              inputMode="tel"
              onChange={(event) => setMobile(event.target.value)}
              placeholder="مثال: ۰۹۱۵۵۲۱۴۰۶۲"
              value={mobile}
            />
          </div>
        </>
      }
      isSubmitting={createAgentMutation.isPending}
      lockedMessage={isAgencyPending ? "در انتظار ادمین برای تایید کسب و کار شما" : undefined}
      onDismissToast={() => setToast(null)}
      onSubmit={handleSubmitAgent}
      toast={toast}
    />
  );
}
