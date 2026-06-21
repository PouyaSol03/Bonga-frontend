import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import type { NewAdFormValues, UploadedMediaFile } from "../types";

export const allowedPhotoTypes = ["image/jpeg", "image/png"];
export const allowedPhotoExtensions = ["jpg", "jpeg", "png"];
export const allowedPhotoAccept = ".jpg,.jpeg,.png,image/jpeg,image/png";

export const allowedVideoTypes = ["video/mp4"];
export const allowedVideoExtensions = ["mp4"];
export const allowedVideoAccept = ".mp4,video/mp4";

function createMediaId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isAllowedFile(
  file: File,
  allowedTypes: string[],
  allowedExtensions: string[],
) {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(file.type) || allowedExtensions.includes(extension);
}

export function createUploadedMediaFile(file: File): UploadedMediaFile {
  return {
    id: createMediaId(),
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl: URL.createObjectURL(file),
    file,
  };
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function PhotoUploader() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createdPreviewUrls = useRef<string[]>([]);

  const photos = watch("photos") ?? [];

  useEffect(() => {
    return () => {
      createdPreviewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addPhotos = (fileList: FileList | null) => {
    const selectedFiles = Array.from(fileList ?? []);

    const validFiles = selectedFiles.filter((file) =>
      isAllowedFile(file, allowedPhotoTypes, allowedPhotoExtensions),
    );

    if (!validFiles.length) return;

    const newPhotos = validFiles.map((file) => {
      const mediaFile = createUploadedMediaFile(file);
      createdPreviewUrls.current.push(mediaFile.previewUrl);
      return mediaFile;
    });

    setValue("photos", [...photos, ...newPhotos], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removePhoto = (photoId: string) => {
    const targetPhoto = photos.find((photo) => photo.id === photoId);

    if (targetPhoto) {
      URL.revokeObjectURL(targetPhoto.previewUrl);
    }

    setValue(
      "photos",
      photos.filter((photo) => photo.id !== photoId),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <div className="overflow-hidden" dir="rtl">
      <div className="mb-3 text-right text-base font-medium leading-6 text-[#1a1a1a]">
        انتخاب عکس <span className="text-[#ff3b30]">*</span>
      </div>

      <input
        ref={inputRef}
        accept={allowedPhotoAccept}
        className="hidden"
        multiple
        onChange={(event) => {
          addPhotos(event.target.files);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      <div className="flex gap-3 overflow-x-auto pb-2" dir="rtl">
        <button
          className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-[12px] border border-[#0048c4] bg-white text-[#0048c4]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span className="text-4xl font-light leading-none">+</span>
          <span className="text-sm font-medium leading-5">افزودن عکس</span>
        </button>

        {photos.map((photo, index) => (
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[12px]"
            key={photo.id}
          >
            <img
              alt={`عکس آگهی ${index + 1}`}
              className="h-full w-full object-cover"
              src={photo.previewUrl}
            />

            <button
              aria-label="حذف عکس"
              className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white text-sm leading-none text-[#ff3b30] shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              onClick={() => removePhoto(photo.id)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VideoUploader() {
  const { setValue, watch } = useFormContext<NewAdFormValues>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const video = watch("video");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectVideo = (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file) return;

    const isValidVideo = isAllowedFile(
      file,
      allowedVideoTypes,
      allowedVideoExtensions,
    );

    if (!isValidVideo) return;

    if (video) {
      URL.revokeObjectURL(video.previewUrl);
    }

    const mediaFile = createUploadedMediaFile(file);

    setValue("video", mediaFile, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("hasVideo", true, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setIsUploading(true);
    setProgress(18);

    window.setTimeout(() => setProgress(55), 180);
    window.setTimeout(() => setProgress(88), 360);
    window.setTimeout(() => {
      setProgress(100);
      setIsUploading(false);
    }, 560);
  };

  const removeVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.previewUrl);
    }

    setValue("video", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("hasVideo", false, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="pt-3" dir="rtl">
      <input
        ref={inputRef}
        accept={allowedVideoAccept}
        className="hidden"
        onChange={(event) => {
          selectVideo(event.target.files);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      {!video ? (
        <button
          className="flex h-12 mb-4 w-full items-center justify-between rounded-[10px] border border-[#0048c4] bg-white px-4 text-sm font-medium leading-5 text-[#0048c4]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <div className="flex gap-2">
          <img src="/icons/video.svg" alt="" />
          <span>انتخاب فیلم</span>
          </div>

          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      ) : (
        <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-3 py-2">
          <div className="flex items-center justify-between gap-3 [direction:ltr]">
            <button
              aria-label="حذف فیلم"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#ff3b30]"
              onClick={removeVideo}
              type="button"
            >
              ×
            </button>

            <div className="min-w-0 flex-1 text-right [direction:rtl]">
              <div className="truncate text-xs font-medium leading-5 text-[#1a1a1a]">
                {isUploading ? "در حال آپلود..." : video.name}
              </div>

              <div className="text-[10px] leading-4 text-[#808080]">
                {formatFileSize(video.size)}
              </div>

              {isUploading ? (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e6e6e6]">
                  <div
                    className="h-full rounded-full bg-[#0048c4]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ) : null}
            </div>

            {!isUploading ? (
              <button
                aria-label="نمایش فیلم"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0048c414] text-[#0048c4]"
                onClick={() => window.open(video.previewUrl, "_blank")}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

