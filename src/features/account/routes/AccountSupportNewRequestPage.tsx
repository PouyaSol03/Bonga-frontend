import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createSupportRequest } from "../../support/api/support-request.service";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import LinearAttachment from "../../../shared/icons/LinearAttachment";
import {
  REQUESTS_PATH,
  RequestOptionBottomSheet,
  RequestSelectField,
  RequiredLabel,
  categoryOptions,
  priorityOptions,
} from "../accountSupportRequestViews";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function AccountSupportNewRequestPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isPrioritySheetOpen, setIsPrioritySheetOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const createRequestMutation = useMutation({ mutationFn: createSupportRequest });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedSubject = subject.trim();
    const normalizedDescription = description.trim();

    if (!normalizedSubject || !category || !priority || !normalizedDescription) {
      setErrorMessage("لطفاً همه فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    createRequestMutation.mutate(
      {
        category,
        description: normalizedDescription,
        priority: priority as "normal" | "important" | "urgent",
        subject: normalizedSubject,
      },
      {
        onError: () => {
          setErrorMessage("ثبت درخواست با خطا مواجه شد. دوباره تلاش کنید.");
        },
        onSuccess: (request) => {
          const threadId =
            request.thread_id === undefined || request.thread_id === null
              ? ""
              : String(request.thread_id);

          navigate(
            threadId
              ? `/account/support/chat/new?thread_id=${encodeURIComponent(threadId)}`
              : REQUESTS_PATH,
            {
              replace: true,
              state: threadId ? { threadId } : undefined,
            },
          );
        },
      },
    );
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden"
      variant="flush"
    >
      <TopBar
        backTo={REQUESTS_PATH}
        className="border-outline-var border-b"
        heightClassName="h-[52px]"

        reserveStartSpace
        title="ایجاد درخواست"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto px-3 pt-4 pb-[76px]">
          <div className="space-y-5">
            <label className="block">
              <RequiredLabel>موضوع درخواست</RequiredLabel>
              <input
                className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/20 mt-2 h-12 w-full rounded-xl border px-3 text-right text-sm leading-5 font-normal transition outline-none focus:ring-3"
                onChange={(event) => {
                  setSubject(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="موضوع درخواست را وارد کنید"
                type="text"
                value={subject}
              />
            </label>

            <RequestSelectField
              label="دسته‌بندی"
              onClick={() => setIsCategorySheetOpen(true)}
              placeholder="موضوع درخواست را وارد کنید"
              value={categoryOptions.find((option) => option.value === category)?.title ?? ""}
            />

            <RequestSelectField
              label="اولویت"
              onClick={() => setIsPrioritySheetOpen(true)}
              placeholder="موضوع درخواست را وارد کنید"
              value={priorityOptions.find((option) => option.value === priority)?.title ?? ""}
            />

            <label className="block">
              <RequiredLabel>شرح مشکل</RequiredLabel>
              <textarea
                className="border-outline-var bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-primary/20 mt-2 min-h-[104px] w-full resize-none rounded-xl border px-3 py-3 text-right text-sm leading-6 font-normal transition outline-none focus:ring-3"
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="شرح مشکل خود را به طور کامل بنویسید"
                value={description}
              />
            </label>

            <div>
              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="medium"
                className="text-on-surface m-0 text-sm leading-5 font-medium"
              >
                افزودن فایل
                <Typography
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-outline mr-1 text-xs font-normal"
                >
                  (اختیاری)
                </Typography>
              </Typography>

              <input
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] ?? null;

                  if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
                    setAttachment(null);
                    setErrorMessage("حجم فایل انتخاب‌شده نباید بیشتر از ۵ مگابایت باشد.");
                  } else {
                    setAttachment(selectedFile);
                    setErrorMessage("");
                  }

                  event.target.value = "";
                }}
                ref={fileInputRef}
                type="file"
              />

              <Button
                unstyled
                className="border-outline bg-surface-container-lowest active:bg-surface-container focus-visible:border-primary focus-visible:ring-primary/20 mt-2 flex min-h-[92px] w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-4 text-center transition outline-none focus-visible:ring-3"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <LinearAttachment className="text-on-surface-var h-5 w-5" />
                {attachment ? (
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="text-on-surface mt-2 max-w-full truncate text-xs leading-5 font-medium"
                  >
                    {attachment.name}
                  </Typography>
                ) : (
                  <>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-on-surface-var mt-2 text-xs leading-5 font-normal"
                    >
                      برای انتخاب فایل لمس کنید
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-outline text-[10px] leading-4 font-normal"
                    >
                      حداکثر حجم فایل ۵ مگابایت
                    </Typography>
                  </>
                )}
              </Button>
            </div>

            {errorMessage ? (
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="regular"
                className="bg-error-container/40 text-error m-0 rounded-lg px-3 py-2 text-right text-xs leading-5 font-normal"
                role="alert"
              >
                {errorMessage}
              </Typography>
            ) : null}
          </div>
        </main>

        <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 px-3 pt-2 pb-2.5">
          <Button
            unstyled
            className="bg-primary text-on-primary focus-visible:ring-primary/20 h-10 w-full rounded-lg px-4 text-sm leading-5 font-semibold outline-none focus-visible:ring-3 active:opacity-80"
            disabled={createRequestMutation.isPending}
            type="submit"
          >
            {createRequestMutation.isPending ? "در حال ثبت..." : "ثبت درخواست"}
          </Button>
        </div>
      </form>

      <RequestOptionBottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        onSelect={(value) => {
          setCategory(value);
          setErrorMessage("");
          setIsCategorySheetOpen(false);
        }}
        options={categoryOptions}
        selectedValue={category}
        title="دسته‌بندی"
      />

      <RequestOptionBottomSheet
        isOpen={isPrioritySheetOpen}
        onClose={() => setIsPrioritySheetOpen(false)}
        onSelect={(value) => {
          setPriority(value);
          setErrorMessage("");
          setIsPrioritySheetOpen(false);
        }}
        options={priorityOptions}
        selectedValue={priority}
        title="اولویت"
      />
    </PageFrame>
  );
}
