import type { RefObject } from "react";

type Props = {
  cameraInputRef: RefObject<HTMLInputElement | null>;
  galleryInputRef: RefObject<HTMLInputElement | null>;
  sendImageFiles: (files: FileList | null) => void;
};

export function ChatImageInputs({ cameraInputRef, galleryInputRef, sendImageFiles }: Props) {
  return (
    <>
      <input
        ref={cameraInputRef}
        accept="image/*"
        aria-hidden="true"
        capture="environment"
        className="sr-only"
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />
      <input
        ref={galleryInputRef}
        accept="image/*"
        aria-hidden="true"
        className="sr-only"
        multiple
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />
    </>
  );
}
