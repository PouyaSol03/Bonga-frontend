import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listCrmUsers, type CrmRecord, saveCrmUser, toggleCrmUserStatus, toggleCrmUserAuthorization, getCrmRecordId } from "../../../services/crm.service";
import { ConfirmModal, EditorModal, FilterField, Panel, PanelHeader, PrimaryButton, SmallActionButton, TableCell, TableEmptyRow, TableHead, TableLoadingRows, UserStatusBadge, formatMoney, fullName, ghostButtonClassName, inputClassName, normalizeCrmUserRoleSlug, readText, useQueryErrorToast, userRoleOptions, userRoleSlugs } from "../CrmLayout";
import type { ConfirmState, CrmRoutePageProps, EditorState } from "../CrmLayout";
import { SearchEmptyState } from "../../../components/SearchEmptyState";

export function CrmUsersPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const filters = useMemo(
    () => ({ mobile: mobile.trim(), name: name.trim() }),
    [mobile, name],
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

  const authorizationMutation = useMutation({
    mutationFn: toggleCrmUserAuthorization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      notify("وضعیت تایید کد ملی کاربر تغییر کرد.");
    },
  });

  const openUserEditor = (user: CrmRecord = {}) => {
    const id = getCrmRecordId(user) || null;

    setEditor({
      fields: [
        { label: "نام", name: "name", value: user.name },
        { label: "نام خانوادگی", name: "family", value: user.family },
        ...(!id ? [{ label: "کد ملی", name: "nationalnumber", value: user.nationalnumber }] : []),
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
          roles: selectedRoleSlugs,
        };

        if (!id) {
          payload.nationalnumber = values.nationalnumber ?? "";
        }

        await saveMutation.mutateAsync({ id, payload });
      },
      title: id ? "ویرایش کاربر" : "ساخت کاربر جدید",
    });
  };

  const handleToggleStatus = (id: string) => statusMutation.mutateAsync(id);
  const handleToggleAuthorization = (id: string) => authorizationMutation.mutateAsync(id);

  const renderUsersTable = (users: CrmRecord[], emptyMessage: string) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
        <thead>
          <tr className="text-sm font-bold text-[#4d4d4d]">
            <TableHead>نام</TableHead>
            <TableHead>موبایل</TableHead>
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
              const isAuthorized = Number(user.authorized) === 1;
              const roles = userRoleSlugs(user);

              return (
                <tr key={id}>
                  <TableCell><span className="font-bold text-[#1a1a1a]">{fullName(user)}</span></TableCell>
                  <TableCell><span dir="ltr">{readText(user, ["mobile"])}</span></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {roles.length > 0 ? roles.map((role) => (
                          <span
                            className="rounded-lg border border-[#cbd8ed] bg-[#f6f9ff] px-2 py-1 text-xs font-bold text-[#0048c4]"
                            key={role}
                          >
                            {userRoleOptions.find((option) => option.value === role)?.label ?? role}
                          </span>
                        )) : <span className="text-xs text-[#919aa8]">بدون نقش</span>}
                      </div>
                  </TableCell>
                  <TableCell><UserStatusBadge status={user.status} /></TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isAuthorized
                          ? "bg-[#e9f8f0] text-[#0b8b55]"
                          : "bg-[#f4f6f8] text-[#7b8494]"
                      }`}
                    >
                      {isAuthorized ? "تایید شده" : "تایید نشده"}
                    </span>
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
                      <SmallActionButton
                        label={isAuthorized ? "لغو تایید کد ملی" : "تایید کد ملی"}
                        onClick={() => setConfirm({
                          body: isAuthorized
                            ? "تایید کد ملی این کاربر لغو می‌شود و وضعیت احراز هویت او به تایید نشده تغییر می‌کند."
                            : "کد ملی این کاربر به عنوان تایید شده ثبت می‌شود.",
                          confirmLabel: isAuthorized ? "لغو تایید" : "تایید کن",
                          onConfirm: async () => { await handleToggleAuthorization(id); },
                          title: isAuthorized ? "لغو تایید کد ملی" : "تایید کد ملی",
                        })}
                        tone={isAuthorized ? "danger" : "success"}
                      />
                    </div>
                  </TableCell>
                </tr>
              );
            })
          ) : (
            <TableEmptyRow columns={7} message={emptyMessage} />
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
          {(mobile || name) ? (
            <button
              className={ghostButtonClassName}
              onClick={() => {
                setMobile("");
                setName("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </button>
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
                <h3 className="m-0 text-sm font-bold text-[#1a1a1a]">همه کاربران</h3>
                <span className="rounded-lg bg-[#eaf1ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">
                  {new Intl.NumberFormat("fa-IR").format(query.data.length)} کاربر
                </span>
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
