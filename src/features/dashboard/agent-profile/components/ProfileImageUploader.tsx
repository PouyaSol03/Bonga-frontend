import { useRef, type ChangeEvent } from "react";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import LinearUserSolid from "../../../../shared/icons/LinearUserSolid";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function ProfileImageUploader({
  avatarPreviewUrl,
  avatarUrl,
  desktop = false,
  onChange,
}: {
  avatarPreviewUrl: string | null;
  avatarUrl: string | null;
  desktop?: boolean;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrl = avatarPreviewUrl ?? avatarUrl;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <div
      className={desktop ? "w-[122px] shrink-0 text-right" : "mt-4 shrink-0 text-right font-medium"}
    >
      <Typography
        as="p"
        variant="body"
        size="large"
        weight="medium"
        className={
          desktop
            ? "m-0 mb-4 text-base leading-6 font-semibold"
            : "m-0 mb-3 text-sm leading-5 font-semibold"
        }
      >
        تصویر مشاور
      </Typography>
      <Button
        unstyled
        aria-label="بارگذاری تصویر مشاور"
        className={`text-on-surface-var relative grid place-items-center overflow-visible rounded-full ${desktop ? "border-outline-var h-[96px] w-[96px] border" : "mx-auto mr-3 h-22 w-22"}`}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container-high grid h-full w-full place-items-center overflow-hidden rounded-full"
        >
          {imageUrl ? (
            <img alt="تصویر مشاور" className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <LinearUserSolid className="h-8 w-8" />
          )}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="border-surface-container-lowest bg-primary text-on-primary absolute -bottom-0.5 -left-0.5 z-10 grid h-8 w-8 place-items-center rounded-full border-4"
        >
          <LinearEdit2 className="h-4 w-4" />
        </Typography>
      </Button>
      <input
        ref={inputRef}
        accept="image/png,image/jpeg,image/jpg,image/gif"
        className="hidden"
        onChange={handleInputChange}
        type="file"
      />
    </div>
  );
}

export function ProfileImageHelpText() {
  return (
    <div className="text-outline flex gap-1 text-right text-xs font-normal">
      <LinearInfoCircle className="text-on-surface-var h-4.5 w-4.5 shrink-0" />
      <div>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          حجم عکس کمتر از 1MB باشد
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          بهترین ابعاد نمایش 100×100 پیکسل
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          فرمت‌های قابل استفاده jpg, png, gif
        </Typography>
      </div>
    </div>
  );
}
