export const MAX_PROFILE_IMAGE_BYTES = 1024 * 1024; // 1MB
export const MAX_PROFILE_IMAGE_DIMENSION = 1000; // 1000x1000 px

export function validateImageDimensions(
  file: File,
  maxWidth = MAX_PROFILE_IMAGE_DIMENSION,
  maxHeight = MAX_PROFILE_IMAGE_DIMENSION,
): Promise<{ valid: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const valid = img.naturalWidth <= maxWidth && img.naturalHeight <= maxHeight;
      resolve({ valid, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, width: 0, height: 0 });
    };

    img.src = objectUrl;
  });
}
