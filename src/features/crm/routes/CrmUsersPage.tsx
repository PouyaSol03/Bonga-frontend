import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listCrmUsers, type CrmRecord, saveCrmUser, toggleCrmUserStatus, updateCrmUserAuthorization, getCrmRecordId } from "../api/crm.service";
import { getApiErrorMessage } from "../../../shared/api/api";
import { ConfirmModal, EditorModal, FilterField, Panel, PanelHeader, PrimaryButton, SmallActionButton, TableCell, TableEmptyRow, TableHead, TableLoadingRows, UserStatusBadge, formatMoney, fullName, ghostButtonClassName, inputClassName, normalizeCrmUserRoleSlug, readText, useQueryErrorToast, userRoleOptions, userRoleSlugs } from "../CrmLayout";
import type { ConfirmState, CrmRoutePageProps, EditorState } from "../CrmLayout";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function CrmUsersPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [nationalnumber, setNationalnumber] = useState("");
  const filters = useMemo(
    () => ({
      mobile: mobile.trim(),
      name: name.trim(),
      nationalnumber: nationalnumber.trim(),
    }),
    [mobile, name, nationalnumber],
  );
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const query = useQuery({
    queryFn: () => listCrmUsers(filters),
    queryKey: ["crm", "users", filters, refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "users"] });
      notify("اطلاعات کاربر ذخیره شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: toggleCrmUserStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      notify("وضعیت کاربر تغییر کرد.");
    },
  });

  const setAuthorizationMutation = useMutation({
    mutationFn: ({ id, reason, status }: { id: string | number; reason?: string; status: "accept" | "reject" }) =>
      updateCrmUserAuthorization(String(id), status, reason),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      notify(variables.status === "accept" ? "احراز هویت کاربر تایید شد." : "احراز هویت کاربر رد شد.");
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "خطا در تغییر وضعیت احراز هویت."), "error");
    },
  });

  const openUserEditor = (user: CrmRecord = {}) => {
    const id = getCrmRecordId(user) || null;

    setEditor({
      fields: [
        { label: "نام", name: "name", value: user.name },
        { label: "نام خانوادگی", name: "family", value: user.family },
        { label: "کد ملی", name: "nationalnumber", value: user.nationalnumber },
        { label: "شماره موبایل", name: "mobile", value: user.mobile },
        { label: "ایمیل", name: "email", type: "email", value: user.email },
        {
          label: "نقش‌های کاربر",
          name: "role_slugs",
          options: userRoleOptions,
          type: "checklist",
          value: userRoleSlugs(user),
        },
      ],
      onSubmit: async (values) => {
        const allowedRoleSlugs = new Set(userRoleOptions.map((option) => option.value));
        const selectedRoleSlugs = Array.from(new Set(
          (values.role_slugs ?? "")
            .split(",")
            .map(normalizeCrmUserRoleSlug)
            .filter((role) => allowedRoleSlugs.has(role)),
        ));

        const payload: CrmRecord = {
          email: values.email ?? "",
          family: values.family ?? "",
          mobile: values.mobile ?? "",
          name: values.name ?? "",
          nationalnumber: values.nationalnumber ? values.nationalnumber.trim() : "",
          roles: selectedRoleSlugs,
        };

        await saveMutation.mutateAsync({ id, payload });
      },
      title: id ? "ویرایش کاربر" : "ساخت کاربر جدید",
    });
  };

  const handleToggleStatus = (id: string) => statusMutation.mutateAsync(id);

  const renderUsersTable = (users: CrmRecord[], emptyMessage: string) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-right">
        <thead>
          <tr className="text-sm font-bold text-[#4d4d4d]">
            <TableHead>نام</TableHead>
            <TableHead>موبایل</TableHead>
            <TableHead>کد ملی</TableHead>
            <TableHead>نقش‌ها</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تایید کد ملی</TableHead>
            <TableHead>اعتبار</TableHead>
            <TableHead>عملیات</TableHead>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => {
              const id = getCrmRecordId(user);
              const isActive = Number(user.status) === 1;
              const authVal = Number(user.authorized);
              const isAuthorized = authVal === 1;
              const isRejected = authVal === 2;
              const roles = userRoleSlugs(user);
              const nationalCode = readText(user, ["nationalnumber", "national_code", "national_id"]).trim();
              const hasNationalCode = Boolean(nationalCode);
              const isValidNationalCode = hasNationalCode && /^\d{10}$/.test(nationalCode);

              return (
                <tr key={id}>
                  <TableCell><Typography as="span" variant="label" size="medium" weight="semibold" className="font-bold text-[#1a1a1a]">{fullName(user)}</Typography></TableCell>
                  <TableCell><Typography as="span" variant="body" size="medium" weight="regular" dir="ltr">{readText(user, ["mobile"])}</Typography></TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      <Typography as="span" variant="body" size="medium" weight="medium" dir="ltr" className="font-mono text-sm text-[#1a1a1a]">
                        {hasNationalCode ? nationalCode : "-"}
                      </Typography>
                      <Typography
                        as="span"
                        variant="label"
                        size="small"
                        weight="semibold"
                        className={`inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                          hasNationalCode
                            ? isValidNationalCode
                              ? "bg-[#e9f8f0] text-[#0b8b55]"
                              : "bg-[#fff7ed] text-[#c2410c]"
                            : "bg-[#f4f6f8] text-[#7b8494]"
                        }`}
                      >
                        {hasNationalCode
                          ? isValidNationalCode
                            ? "ثبت شده"
                            : "فرمت نامعتبر"
                          : "ثبت نشده"}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {roles.length > 0 ? roles.map((role) => (
                        <Typography as="span" variant="label" size="small" weight="semibold"
                          className="rounded-lg border border-[#cbd8ed] bg-[#f6f9ff] px-2 py-1 text-xs font-bold text-[#0048c4]"
                          key={role}
                        >
                          {userRoleOptions.find((option) => option.value === role)?.label ?? role}
                        </Typography>
                      )) : <Typography as="span" variant="body" size="small" weight="regular" className="text-xs text-[#919aa8]">بدون نقش</Typography>}
                    </div>
                  </TableCell>
                  <TableCell><UserStatusBadge status={user.status} /></TableCell>
                  <TableCell>
                    <Typography as="span" variant="label" size="small" weight="semibold"
                      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${
                        isAuthorized
                          ? "border-[#a3e4c4] bg-[#e9f8f0] text-[#0b8b55]"
                          : isRejected
                          ? "border-[#f7b0b6] bg-[#ffebed] text-[#ee3623]"
                          : hasNationalCode
                          ? "border-[#ffe099] bg-[#fff7df] text-[#ff6d00]"
                          : "border-[#e2e6eb] bg-[#f4f6f8] text-[#7b8494]"
                      }`}
                    >
                      {isAuthorized
                        ? "تایید شده"
                        : isRejected
                        ? "رد شده"
                        : hasNationalCode
                        ? "در انتظار"
                        : "ثبت نشده"}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatMoney(user.credit)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <SmallActionButton label="ویرایش" onClick={() => openUserEditor(user)} />
                      <SmallActionButton
                        label={isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
                        onClick={() => setConfirm({
                          body: isActive
                            ? "دسترسی این کاربر تا زمان فعال‌سازی دوباره محدود می‌شود."
                            : "حساب این کاربر دوباره فعال می‌شود.",
                          confirmLabel: isActive ? "غیرفعال کن" : "فعال کن",
                          onConfirm: async () => { await handleToggleStatus(id); },
                          title: isActive ? "غیرفعال‌سازی کاربر" : "فعال‌سازی کاربر",
                        })}
                        tone={isActive ? "danger" : "success"}
                      />
                      {!isAuthorized ? (
                        <SmallActionButton
                          disabled={setAuthorizationMutation.isPending}
                          label="تایید کد ملی"
                          onClick={() => setConfirm({
                            body: `کد ملی «${nationalCode || fullName(user)}» به عنوان تایید شده ثبت می‌شود و اعلان تایید برای کاربر ارسال خواهد شد.`,
                            confirmLabel: "تایید کد ملی",
                            onConfirm: async () => {
                              await setAuthorizationMutation.mutateAsync({ id, status: "accept" });
                            },
                            title: "تایید احراز هویت کاربر",
                          })}
                          tone="success"
                        />
                      ) : null}
                      {!isRejected && (hasNationalCode || isAuthorized) ? (
                        <SmallActionButton
                          disabled={setAuthorizationMutation.isPending}
                          label={isAuthorized ? "لغو / رد تایید" : "رد کد ملی"}
                          onClick={() => setConfirm({
                            body: `آیا از رد احراز هویت «${fullName(user)}» اطمینان دارید؟ به کاربر اعلان ارسال خواهد شد و امکان ثبت مجدد اطلاعات را خواهد داشت.`,
                            confirmLabel: "رد احراز هویت",
                            prompt: {
                              label: "دلیل رد احراز هویت (اختیاری جهت درج در اعلان کاربر)",
                              placeholder: "مثال: اطلاعات نامعتبر یا ناخوانا",
                            },
                            onConfirm: async (reason) => {
                              await setAuthorizationMutation.mutateAsync({ id, reason, status: "reject" });
                            },
                            title: "رد احراز هویت کاربر",
                          })}
                          tone="danger"
                        />
                      ) : null}
                    </div>
                  </TableCell>
                </tr>
              );
            })
          ) : (
            <TableEmptyRow columns={8} message={emptyMessage} />
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Panel>
        <PanelHeader
          action={<PrimaryButton icon="plus" label="کاربر جدید" onClick={() => openUserEditor()} />}
          subtitle="جستجو بر اساس نام یا شماره موبایل و مدیریت سطح دسترسی کاربران"
          title="فهرست کاربران"
        />

        <form
          className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="شماره موبایل">
            <input className={inputClassName} onChange={(event) => setMobile(event.target.value)} placeholder="0912..." value={mobile} />
          </FilterField>
          <FilterField label="نام کاربر">
            <input className={inputClassName} onChange={(event) => setName(event.target.value)} placeholder="نام یا نام خانوادگی" value={name} />
          </FilterField>
          <FilterField label="کد ملی">
            <input className={inputClassName} onChange={(event) => setNationalnumber(event.target.value)} placeholder="0012345678" value={nationalnumber} />
          </FilterField>
          {(mobile || name || nationalnumber) ? (
            <Button unstyled
              className={ghostButtonClassName}
              onClick={() => {
                setMobile("");
                setName("");
                setNationalnumber("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </Button>
          ) : null}
        </form>

        <div className="mt-5 space-y-4">
          {query.isLoading ? (
            <section className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
              <div className="border-b border-[#e6e6e6] px-4 py-3">
                <div className="h-5 w-40 animate-pulse rounded bg-[#e9edf3]" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
                  <tbody><TableLoadingRows columns={7} rows={4} /></tbody>
                </table>
              </div>
            </section>
          ) : query.data?.length ? (
            <section className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] bg-[#fafafa] px-4 py-3">
                <Typography as="h3" variant="title" size="small" weight="semibold" className="m-0 text-sm font-bold text-[#1a1a1a]">همه کاربران</Typography>
                <Typography as="span" variant="label" size="small" weight="semibold" className="rounded-lg bg-[#eaf1ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">
                  {new Intl.NumberFormat("fa-IR").format(query.data.length)} کاربر
                </Typography>
              </div>
              {renderUsersTable(query.data, "کاربری مطابق جستجوی شما پیدا نشد.")}
            </section>
          ) : (
            <div className="rounded-xl bg-white">
              <SearchEmptyState />
            </div>
          )}
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}
