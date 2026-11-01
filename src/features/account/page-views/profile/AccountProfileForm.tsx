import { useState } from "react";
import { TextField } from "../../../../shared/ui/TextField";
import { Button } from "../../../../shared/ui/Button";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <TextField
      className="text-on-surface cursor-default text-sm select-text"
      readOnly
      forceLabel
      highlightWhenFilled={false}
      label={label}
      value={value}
    />
  );
}

export function AccountProfileForm({
  isSubmitting,
  mobile,
  onSubmit,
  profile,
}: {
  isSubmitting: boolean;
  mobile: string;
  onSubmit: (form: {
    avatar: File | null;
    email: string | null;
    family: string | null;
    name: string | null;
  }) => void;
  profile?: {
    avatar?: string | null;
    email?: string | null;
    family?: string | null;
    mobile?: string;
    name?: string | null;
    nationalnumber?: string | null;
    phone?: string;
  };
}) {
  const initialNationalNumber =
    profile?.nationalnumber ??
    ((profile as Record<string, unknown> | undefined)?.national_number as string) ??
    "";

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    email: profile?.email ?? "",
    family: profile?.family ?? "",
    name: profile?.name ?? "",
    nationalnumber: initialNationalNumber,
  });

  return (
    <>
      <ProfileAvatarPicker
        avatarFile={avatarFile}
        initialAvatarUrl={profile?.avatar}
        onAvatarChange={setAvatarFile}
      />

      <section className="mt-4 space-y-6 px-4">
        <ReadonlyField label="شماره همراه" value={profile?.mobile ?? profile?.phone ?? mobile} />
        <ReadonlyField label="کد ملی" value={form.nationalnumber || initialNationalNumber || "-"} />
      </section>

      <div className="bg-surface-container mt-4 h-4" />

      <section className="space-y-6 px-4 pt-4">
        <TextField
          className={`placeholder:text-outline text-sm ${form.name ? "text-on-surface" : "text-outline"}`}
          label="نام خود را وارد کنید"
          placeholder="نام خود را وارد کنید"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
        <TextField
          className={`placeholder:text-outline text-sm ${form.family ? "text-on-surface" : "text-outline"}`}
          label="نام خانوادگی خود را وارد کنید"
          placeholder="نام خانوادگی خود را وارد کنید"
          value={form.family}
          onChange={(event) => setForm((current) => ({ ...current, family: event.target.value }))}
        />
        <TextField
          className={`placeholder:text-outline text-sm ${form.email ? "text-on-surface" : "text-outline"}`}
          label="پست الکترونیکی"
          placeholder="پست الکترونیکی"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(26,26,26,0.08)]">
        <Button
          unstyled
          className="bg-primary text-on-primary h-10 w-full rounded-lg text-sm leading-5 font-medium disabled:opacity-50"
          disabled={isSubmitting}
          type="button"
          onClick={() => {
            const emptyToNull = (value: string) => {
              const trimmedValue = value.trim();
              return trimmedValue.length > 0 ? trimmedValue : null;
            };

            onSubmit({
              avatar: avatarFile,
              email: emptyToNull(form.email),
              family: emptyToNull(form.family),
              name: emptyToNull(form.name),
            });
          }}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت"}
        </Button>
      </div>
    </>
  );
}
