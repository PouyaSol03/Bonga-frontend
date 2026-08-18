import { useRef, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { createSupportRequest } from "../../support/api/support-request.service";
import { replaceRoute } from "../../../shared/navigation/navigation";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import LinearAttachment from "../../../shared/icons/LinearAttachment";
import { REQUESTS_PATH, RequestOptionBottomSheet, RequestSelectField, RequiredLabel, categoryOptions, priorityOptions } from "../accountSupportRequestViews";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export function AccountSupportNewRequestPage() {
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

    createRequestMutation.mutate({
      category,
      description: normalizedDescription,
      priority: priority as "normal" | "important" | "urgent",
      subject: normalizedSubject,
    }, {
      onError: () => {
        setErrorMessage("ثبت درخواست با خطا مواجه شد. دوباره تلاش کنید.");
      },
      onSuccess: (request) => {
        const threadId = request.thread_id === undefined || request.thread_id === null
          ? ""
          : String(request.thread_id);

        replaceRoute(
          threadId
            ? `/account/support/chat/new?thread_id=${encodeURIComponent(threadId)}`
            : REQUESTS_PATH,
          threadId ? { threadId } : undefined,
          { rememberCurrent: false },
        );
      },
    });
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        backTo={REQUESTS_PATH}
        className="border-b border-[#e6e6e6]"
        heightClassName="h-[52px]"
       
        reserveStartSpace
        title="ایجاد درخواست"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit}
      >
        <main className="min-h-0 flex-1 overflow-y-auto bg-white px-3 pb-[76px] pt-4">
          <div className="space-y-5">
            <label className="block">
              <RequiredLabel>موضوع درخواست</RequiredLabel>
              <input
                className="mt-2 h-12 w-full rounded-xl border border-[#d0d0d0] bg-white px-3 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-3 focus:ring-[#0048c420]"
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
                className="mt-2 min-h-[104px] w-full resize-none rounded-xl border border-[#d0d0d0] bg-white px-3 py-3 text-right text-sm font-normal leading-6 text-[#1a1a1a] outline-none transition placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-3 focus:ring-[#0048c420]"
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="شرح مشکل خود را به طور کامل بنویسید"
                value={description}
              />
            </label>

            <div>
              <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-5 text-[#1a1a1a]">
                افزودن فایل
                <Typography as="span" variant="body" size="small" weight="regular" className="mr-1 text-xs font-normal text-[#808080]">
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

              <Button unstyled
                className="mt-2 flex min-h-[92px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#b6b6b6] bg-white px-4 py-4 text-center outline-none transition active:bg-[#fafafa] focus-visible:border-[#0048c4] focus-visible:ring-3 focus-visible:ring-[#0048c420]"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <LinearAttachment className="h-5 w-5 text-[#4d4d4d]" />
                {attachment ? (
                  <Typography as="span" variant="label" size="small" weight="medium" className="mt-2 max-w-full truncate text-xs font-medium leading-5 text-[#1a1a1a]">
                    {attachment.name}
                  </Typography>
                ) : (
                  <>
                    <Typography as="span" variant="body" size="small" weight="regular" className="mt-2 text-xs font-normal leading-5 text-[#4d4d4d]">
                      برای انتخاب فایل لمس کنید
                    </Typography>
                    <Typography as="span" variant="body" size="small" weight="regular" className="text-[10px] font-normal leading-4 text-[#a6a6a6]">
                      حداکثر حجم فایل ۵ مگابایت
                    </Typography>
                  </>
                )}
              </Button>
            </div>

            {errorMessage ? (
              <Typography as="p" variant="body" size="small" weight="regular"
                className="m-0 rounded-lg bg-[#fff1f0] px-3 py-2 text-right text-xs font-normal leading-5 text-[#c11004]"
                role="alert"
              >
                {errorMessage}
              </Typography>
            ) : null}
          </div>
        </main>

        <div className="absolute inset-x-0 bottom-0 z-20 bg-white px-3 pb-2.5 pt-2">
          <Button unstyled
            className="h-10 w-full rounded-lg bg-[#0759cf] px-4 text-sm font-semibold leading-5 text-white outline-none active:bg-[#0048b5] focus-visible:ring-3 focus-visible:ring-[#0759cf40]"
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
