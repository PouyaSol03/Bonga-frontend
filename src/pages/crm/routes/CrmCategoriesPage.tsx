import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { listCrmCategories, type CrmRecord, saveCrmCategory, getCrmRecordId } from "../../../core/services/crm.service";
import { CategoryTree, EditorModal, EmptyState, ListSkeleton, Panel, PanelHeader, cleanEmptyValues, stringifyValue, useQueryErrorToast } from "../CrmLayout";
import type { CrmRoutePageProps, EditorState } from "../CrmLayout";

export function CrmCategoriesPage({ notify, refreshNonce }: CrmRoutePageProps) {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<EditorState | null>(null);

  const query = useQuery({
    queryFn: listCrmCategories,
    queryKey: ["crm", "categories", refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "categories"] });
      notify("دسته‌بندی ذخیره شد.");
    },
  });

  const openCategoryEditor = (category: CrmRecord = {}) => {
    const id = getCrmRecordId(category) || null;
    const parent = category.parent_id;
    const parentId = parent && typeof parent === "object"
      ? getCrmRecordId(parent as CrmRecord)
      : stringifyValue(parent);

    setEditor({
      fields: [
        { label: "نام دسته‌بندی", name: "name", value: category.name },
        { label: "شناسه والد", name: "parent_id", value: parentId },
        { label: "کد", name: "code", value: category.code },
        { label: "نامک", name: "slug", value: category.slug },
      ],
      onSubmit: async (values) => {
        await saveMutation.mutateAsync({ id, payload: cleanEmptyValues(values) });
      },
      title: id ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          subtitle="ساختار درختی دسته‌بندی‌ها را بدون تغییر سایر بخش‌های برنامه مدیریت کنید."
          title="درخت دسته‌بندی‌ها"
        />

        <div className="mt-5 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4">
          {query.isLoading ? (
            <ListSkeleton count={7} />
          ) : query.data?.length ? (
            <CategoryTree categories={query.data} onEdit={openCategoryEditor} />
          ) : (
            <EmptyState description="هنوز دسته‌بندی‌ای ثبت نشده است." />
          )}
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
    </>
  );
}
