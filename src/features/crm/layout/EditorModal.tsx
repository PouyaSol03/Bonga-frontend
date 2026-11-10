import { useEffect, useState, type FormEvent } from "react";
import { getApiErrorMessage } from "../../../shared/api/api";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { ghostButtonClassName, primaryButtonClassName } from "./constants";
import { CrmIcon } from "./CrmIcon";
import { EditorField } from "./EditorField";
import { LoadingSpinner } from "./LoadingSpinner";
import { ModalShell } from "./ModalShell";
import { stringifyValue } from "./recordFormatters";
import type { CrmRoutePageProps, EditorState } from "./types";
export function EditorModal({
  editor,
  isPending,
  notify,
  onClose,
  wide = false,
}: {
  editor: EditorState | null;
  isPending: boolean;
  notify: CrmRoutePageProps["notify"];
  onClose: () => void;
  wide?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor) {
      setValues({});
      return;
    }

    setValues(
      Object.fromEntries(
        editor.fields.map((field) => [
          field.name,
          (field.type === "checklist" || field.type === "neighborhood-multi") &&
          Array.isArray(field.value)
            ? field.value.map((item) => String(item)).join(",")
            : stringifyValue(field.value),
        ]),
      ),
    );
  }, [editor]);

  if (!editor) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await editor.onSubmit(values);
      onClose();
    } catch (error) {
      notify(
        getApiErrorMessage(
          error,
          error instanceof Error ? error.message : "ذخیره اطلاعات ناموفق بود.",
        ),
        "error",
      );
    }
  };

  return (
    <ModalShell onClose={isPending ? undefined : onClose}>
      <form
        className={`max-h-[calc(100vh-64px)] overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgba(14,34,68,0.18)] ${
          wide ? "w-[min(960px,calc(100vw-64px))]" : "w-[min(760px,calc(100vw-64px))]"
        }`}
        onSubmit={submit}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f0f0f0] px-6">
          <div>
            <Typography
              as="h2"
              variant="title"
              size="medium"
              weight="semibold"
              className="m-0 text-base font-bold text-[#1a1a1a]"
            >
              {editor.title}
            </Typography>
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 mt-1 text-sm text-[#919aa8]"
            >
              فیلدهای لازم را تکمیل و سپس ذخیره کنید.
            </Typography>
          </div>
          <Button
            unstyled
            aria-label="بستن"
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477] transition hover:bg-[#e9edf3]"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            <CrmIcon name="close" size={18} />
          </Button>
        </div>

        <div className="max-h-[calc(100vh-208px)] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            {editor.fields.map((field) => (
              <EditorField key={field.name} field={field} values={values} setValues={setValues} />
            ))}
          </div>
        </div>

        <div className="flex h-20 items-center justify-end gap-3 border-t border-[#f0f0f0] px-6">
          <Button
            unstyled
            className={ghostButtonClassName}
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            انصراف
          </Button>
          <Button unstyled className={primaryButtonClassName} disabled={isPending} type="submit">
            {isPending ? <LoadingSpinner /> : <CrmIcon name="save" size={18} />}
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
