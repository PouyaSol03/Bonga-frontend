import { useEffect, useState } from "react";
import { useToast } from "../../../shared/hooks/useToast";
import {
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_DIMENSION,
  validateImageDimensions,
} from "../../../shared/utils/image-validation";
import { profileImageMimeTypes } from "./types";

export function useAgentAvatarUpload() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!avatarPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(avatarPreviewUrl);
  }, [avatarPreviewUrl]);

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;

    if (!profileImageMimeTypes.has(file.type)) {
      showToast("فرمت تصویر باید jpg، png یا gif باشد.", "خطا", "error");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      showToast("حجم تصویر نباید بیشتر از 1MB باشد.", "خطا", "error");
      return;
    }

    const { valid } = await validateImageDimensions(
      file,
      MAX_PROFILE_IMAGE_DIMENSION,
      MAX_PROFILE_IMAGE_DIMENSION,
    );
    if (!valid) {
      showToast("ابعاد تصویر نباید بیشتر از ۱۰۰۰ در ۱۰۰۰ پیکسل باشد.", "خطا", "error");
      return;
    }

    setAvatarFile(file);
    setAvatarPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  return {
    avatarFile,
    avatarPreviewUrl,
    avatarUrl,
    handleAvatarChange,
    setAvatarFile,
    setAvatarPreviewUrl,
    setAvatarUrl,
  };
}
