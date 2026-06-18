import { useFormContext } from "react-hook-form";

import type { NewAdFormValues } from "../types";
import { Footer, InputBox, Section, Toggle } from "../components/NewAdControls";
import { CheckRow, RadioCard, SocialInput } from "../components/MediaControls";
import { PhotoUploader, VideoUploader } from "../components/MediaUploaders";

export function MediaStep({ label, onBack, onSubmit }: { label: string; onBack: () => void; onSubmit: () => void }) {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const values = watch();
  const setField = <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => setValue(key as never, value as never, { shouldDirty: true });

  return (
    <>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3" dir="rtl">
        <Section icon="image.svg" title="عکس آگهی" warning>
          <PhotoUploader />
          <div className="mt-5">
            <Toggle
              checked={values.hasVideo}
              label="فیلم"
              onChange={(checked) => {
                setField("hasVideo", checked);

                if (!checked && values.video) {
                  URL.revokeObjectURL(values.video.previewUrl);
                  setField("video", null);
                }
              }}
            />

            {values.hasVideo ? <VideoUploader /> : null}

            <Toggle
              checked={values.hasVirtualTour}
              label="تور مجازی"
              onChange={(checked) => setField("hasVirtualTour", checked)}
            />
          </div>
        </Section>

        <Section icon="info.svg" title="اطلاعات آگهی" warning>
          <div className="space-y-4">
            <div>
              <div className="mb-3 text-right leading-7 text-[#1a1a1a]">ثبت کننده آگهی <span className="text-[#ff3b30]">*</span></div>
              <div className="space-y-3">
                <RadioCard
                  checked={values.registrantType === "personal"}
                  label="شخصی"
                  description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به صورت شخصی ثبت نمایید.
بعد از ثبت اطلاعات به صفحه وضعیت آگهی می‌شوید.`}
                  onClick={() => setField("registrantType", "personal")}
                />

                <RadioCard
                  badge="رایگان"
                  checked={values.registrantType === "agency"}
                  label="آژانس"
                  description={`با فعال بودن این گزینه، می‌توانید آگهی خود را به آژانس املاکی مورد نظر خود بسپارید.
بعد از ثبت اطلاعات به صفحه انتخاب آژانس املاک هدایت می‌شوید.`}
                  onClick={() => setField("registrantType", "agency")}
                />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-2 flex items-center justify-start gap-1 font-semibold leading-7 text-[#1a1a1a]"><span>روش‌های ارتباطی <span className="text-[#ff3b30]">*</span></span><img src="/icons/add_advertisement/warning.svg" alt="" /></div>
              <CheckRow checked={values.chatEnabled} label="چت با کاربران" onChange={(checked) => setField("chatEnabled", checked)} />
              <CheckRow checked={values.phoneEnabled} label="شماره تماس" onChange={(checked) => setField("phoneEnabled", checked)} />
            </div>

            <div>
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">شبکه‌های اجتماعی</div>
              <div className="space-y-3">
                <SocialInput icon="telegram" onChange={(value) => setField("telegram", value)} placeholder="آیدی تلگرام خود را وارد کنید" value={values.telegram} />
                <SocialInput icon="whatsapp" onChange={(value) => setField("whatsapp", value)} placeholder="شماره واتساپ خود را بدون صفر وارد کنید" value={values.whatsapp} />
              </div>
            </div>

            <div className="border-t border-dashed border-[#cccccc] pt-4">
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">عنوان آگهی <span className="text-[#ff3b30]">*</span></div>
              <InputBox onChange={(value) => setField("title", value)} placeholder={`مثال: ${label} ۱۲۰ متری، ۲ خوابه، طبقه اول`} value={values.title} />
            </div>

            <div>
              <div className="mb-3 text-right  font-semibold leading-7 text-[#1a1a1a]">توضیحات آگهی <span className="text-[#ff3b30]">*</span></div>
              <label className="block min-h-32 w-full rounded-[12px] border border-[#cccccc] bg-white px-4 py-3 text-right text-base font-normal leading-6 text-[#1a1a1a] focus-within:border-[#0048c4]">
                <textarea className="min-h-24 w-full resize-none border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => setField("description", event.target.value)} placeholder="اطلاعات بیشتر را وارد کنید..." value={values.description} />
              </label>
            </div>
          </div>
        </Section>
      </main>
      <Footer onBack={onBack} onPrimary={onSubmit} primary="ثبت اطلاعات" />
    </>
  );
}
