import { useEffect, useState } from "react";
import { getApiAssetUrl } from "../../../../shared/api/api";
import { useToast } from "../../../../shared/hooks/useToast";
import {
  validateImageDimensions,
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_DIMENSION,
} from "../../../../shared/utils/image-validation";
import { Typography } from "../../../../shared/ui/Typography";
import { EditIcon, UserIcon } from "../common/icons";

export const profileAvatarMimeTypes = new Set(["image/jpeg", "image/png", "image/gif"]);

export function ProfileAvatarPicker({
  avatarFile,
  initialAvatarUrl,
  onAvatarChange,
}: {
  avatarFile: File | null;
  initialAvatarUrl?: string | null;
  onAvatarChange: (file: File | null) => void;
}) {
  const { showToast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (!avatarFile) return;

    let previewUrl = "";
    const timer = setTimeout(() => {
      previewUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(previewUrl);
    }, 0);

    return () => {
      clearTimeout(timer);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setAvatarPreview("");
    };
  }, [avatarFile]);

  const avatarSrc = avatarPreview || (initialAvatarUrl ? getApiAssetUrl(initialAvatarUrl) : "");

  return (
    <section className="flex flex-col items-center px-4 pt-4">
      <div className="text-outline relative grid h-[100px] w-[100px] place-items-center overflow-visible">
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container grid h-full w-full place-items-center overflow-hidden rounded-full"
        >
          {avatarSrc ? (
            <img alt="تصویر پروفایل" className="h-full w-full object-cover" src={avatarSrc} />
          ) : (
            <UserIcon className="text-outline h-10 w-10" />
          )}
        </Typography>

        <label
          aria-label="ویرایش تصویر"
          className="border-surface-container-lowest bg-primary text-on-primary absolute -bottom-1 -left-1 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-4"
          htmlFor="profile-avatar-upload"
        >
          <EditIcon className="h-4 w-4" />
        </label>

        <input
          accept="image/*"
          className="hidden"
          id="profile-avatar-upload"
          type="file"
          onChange={async (event) => {
            const file = event.target.files?.[0] ?? null;
            if (!file) {
              onAvatarChange(null);
              return;
            }
            if (!profileAvatarMimeTypes.has(file.type)) {
              showToast("فرمت تصویر باید jpg، png یا gif باشد.", "خطا", "error");
              event.target.value = "";
              return;
            }
            if (file.size > MAX_PROFILE_IMAGE_BYTES) {
              showToast("حجم تصویر نباید بیشتر از 1MB باشد.", "خطا", "error");
              event.target.value = "";
              return;
            }
            const { valid } = await validateImageDimensions(
              file,
              MAX_PROFILE_IMAGE_DIMENSION,
              MAX_PROFILE_IMAGE_DIMENSION,
            );
            if (!valid) {
              showToast("ابعاد تصویر نباید بیشتر از ۱۰۰۰ در ۱۰۰۰ پیکسل باشد.", "خطا", "error");
              event.target.value = "";
              return;
            }
            onAvatarChange(file);
          }}
        />
      </div>
    </section>
  );
}
