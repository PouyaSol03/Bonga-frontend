import { useState, useEffect } from "react";
import { agencyImageMimeTypes } from "./agencyProfileHelpers";
import {
  validateImageDimensions,
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_DIMENSION,
} from "../../../shared/utils/image-validation";
import type { AgencyProfileToast } from "./types";

export function useAgencyLogoUpload(
  showToast: (message: string, title?: string, variant?: AgencyProfileToast["variant"]) => void,
) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!logoPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(logoPreviewUrl);
  }, [logoPreviewUrl]);

  const handleLogoChange = async (file: File | null) => {
    if (!file) {
      setLogoFile(null);
      setLogoPreviewUrl(null);
      return;
    }

    if (!agencyImageMimeTypes.has(file.type)) {
      showToast("فرمت لوگو باید JPG، JPEG، PNG یا WEBP باشد.", "خطا", "error");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      showToast("حجم لوگو نباید بیشتر از ۱ مگابایت باشد.", "خطا", "error");
      return;
    }

    const { valid } = await validateImageDimensions(
      file,
      MAX_PROFILE_IMAGE_DIMENSION,
      MAX_PROFILE_IMAGE_DIMENSION,
    );
    if (!valid) {
      showToast("ابعاد لوگو نباید بیشتر از ۱۰۰۰ در ۱۰۰۰ پیکسل باشد.", "خطا", "error");
      return;
    }

    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  return {
    handleLogoChange,
    logoFile,
    logoPreviewUrl,
    logoUrl,
    setLogoFile,
    setLogoPreviewUrl,
    setLogoUrl,
  };
}
