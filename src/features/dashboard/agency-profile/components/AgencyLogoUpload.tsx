import { useRef, type ChangeEvent } from "react";
import LinearBuilding3 from "../../../../shared/icons/LinearBuilding3";
import LinearEdit2 from "../../../../shared/icons/LinearEdit2";
import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function LogoHelpText() {
  return (
    <div className="text-outline flex gap-1 text-right text-xs font-normal">
      <div className="flex">
        <LinearInfoCircle className="text-on-surface-var h-4.5 w-4.5" />
      </div>
      <div>
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 flex items-center gap-1.5"
        >
          حجم عکس کمتر از 1MB باشد
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          بهترین ابعاد نمایش 100×100 پیکسل
        </Typography>
        <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
          فرمت‌های قابل استفاده jpg, jpeg, png, webp
        </Typography>
      </div>
    </div>
  );
}

export function AgencyLogoUpload({
  logoPreviewUrl,
  logoUrl,
  onLogoChange,
}: {
  logoPreviewUrl: string | null;
  logoUrl: string | null;
  onLogoChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageUrl = logoPreviewUrl ?? logoUrl;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onLogoChange(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  return (
    <div className="mt-4 shrink-0 text-right font-medium">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="m-0 mb-3 text-sm leading-5 font-semibold"
      >
        لوگوی آژانس
      </Typography>
      <Button
        unstyled
        aria-label="بارگذاری لوگوی آژانس"
        className="text-on-surface-var relative mx-auto mr-3 grid h-22 w-22 place-items-center overflow-visible rounded-full"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container grid h-full w-full place-items-center overflow-hidden rounded-full"
        >
          {imageUrl ? (
            <img alt="لوگوی آژانس" className="h-full w-full object-cover" src={imageUrl} />
          ) : (
            <LinearBuilding3 className="h-8 w-8" />
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
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
        type="file"
      />
    </div>
  );
}
