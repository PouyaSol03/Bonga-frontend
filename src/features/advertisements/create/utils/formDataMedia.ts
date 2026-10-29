import type { NewAdFormValues } from "../types";
import { canonicalizeMediaPath, mediaSource } from "./mediaUtils";

export function appendFormDataMedia(
  formData: FormData,
  values: NewAdFormValues,
  options: { isDraft?: boolean; isEdit?: boolean } = {},
): void {
  const seenCanonicalImages = new Set<string>();
  const seenUploadedFiles = new Set<string>();

  values.photos.forEach((photo) => {
    if (photo.file) {
      const fileKey = `${photo.file.name}_${photo.file.size}`;
      if (!seenUploadedFiles.has(fileKey)) {
        seenUploadedFiles.add(fileKey);
        formData.append("images", photo.file, photo.file.name);
      }
    } else {
      const source = mediaSource(photo.existingValue);
      if (source) {
        const canonical = canonicalizeMediaPath(source);
        if (canonical && !seenCanonicalImages.has(canonical)) {
          seenCanonicalImages.add(canonical);
          formData.append("existing_images", canonical);
        }
      }
    }
  });

  const seenCanonicalVideos = new Set<string>();
  if (values.video?.file) {
    formData.append("video", values.video.file);
  } else if (values.video?.existingValue) {
    const source = mediaSource(values.video.existingValue);
    if (source) {
      const canonical = canonicalizeMediaPath(source);
      if (!seenCanonicalVideos.has(canonical)) {
        seenCanonicalVideos.add(canonical);
        formData.append("existing_video", canonical);
      }
    }
  } else if (options.isEdit) {
    formData.append("videos", "[]");
  }

  if (options.isDraft) {
    for (const key of ["images", "existing_images", "contact_type", "contact_type[]"]) {
      formData.delete(key);
    }
    formData.delete("label");
    formData.delete("description");
  }
}
