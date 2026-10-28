import { useRef, useState, type Dispatch, type RefObject, type SetStateAction  } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../../../shared/api/api";
import { getBrowserLocation, getBrowserLocationNotice } from "../../../shared/lib/browserLocation";
import { sendChatImageMessage, sendChatLocationMessage } from "../api/chat-socket";
import { type ChatCategory, uploadChatAttachment } from "../api/chat.service";
import { createChatMessageId } from "./routeState";
import { type SendFileOption } from "./SendFileBottomSheet";
import { type SentChatMessage } from "./types";



export function useChatAttachments({
  activeThreadId,
  chatCategory,
  setSentMessages,
  pendingOutgoingAttachmentsRef,
  pendingOutgoingLocationsRef,
  showNotice,
  setIsSendFileSheetOpen,
}: {
  activeThreadId: string;
  chatCategory: ChatCategory;
  setSentMessages: Dispatch<SetStateAction<SentChatMessage[]>>;
  pendingOutgoingAttachmentsRef: RefObject<Set<string>>;
  pendingOutgoingLocationsRef: RefObject<Set<string>>;
  showNotice: (message: string) => void;
  setIsSendFileSheetOpen: (open: boolean) => void;
}) {
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSendingLocation, setIsSendingLocation] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const sendImageFiles = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    const oversizedFile = selectedFiles.find((file) => file.size > 10 * 1024 * 1024);

    if (oversizedFile) {
      showNotice("حجم هر فایل نباید بیشتر از ۱۰ مگابایت باشد");
      return;
    }

    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      showNotice("لطفا فقط فایل تصویر انتخاب کنید");
      return;
    }

    if (!activeThreadId || isUploadingImages) {
      if (!activeThreadId) showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    setIsUploadingImages(true);
    showNotice("در حال ارسال تصویر...");

    const results = await Promise.allSettled(
      imageFiles.map(async (file) => {
        const attachment = await uploadChatAttachment(activeThreadId, file);

        if (!attachment.status || !attachment.url) {
          throw new Error("آپلود تصویر ناموفق بود");
        }

        const optimisticMessage: SentChatMessage = {
          attachmentUrl: attachment.url,
          fileName: attachment.file_name || file.name || "تصویر ارسالی",
          id: createChatMessageId(),
          imageUrl: getApiAssetUrl(attachment.url),
          type: "image",
        };

        setSentMessages((current) => [...current, optimisticMessage]);
        pendingOutgoingAttachmentsRef.current.add(attachment.url);
        sendChatImageMessage({
          attachmentUrl: attachment.url,
          category: chatCategory,
          fileName: attachment.file_name,
          mimeType: attachment.mime_type,
          size: attachment.size,
          threadId: activeThreadId,
        });
      }),
    );
    const failedResult = results.find((result) => result.status === "rejected");

    if (failedResult?.status === "rejected") {
      showNotice(getApiErrorMessage(failedResult.reason, "ارسال تصویر با خطا مواجه شد"));
    } else {
      showNotice(imageFiles.length > 1 ? "تصاویر ارسال شدند" : "تصویر ارسال شد");
    }

    setIsUploadingImages(false);
  };

  const sendCurrentLocation = () => {
    if (isSendingLocation || !activeThreadId) {
      if (!activeThreadId) showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    setIsSendingLocation(true);
    showNotice("در حال دریافت موقعیت شما...");

    void getBrowserLocation({ maximumAge: 30_000, timeout: 15_000 })
      .then(({ latitude, longitude }) => {
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setSentMessages((current) => [
          ...current,
          {
            id: createChatMessageId(),
            type: "location",
            latitude,
            longitude,
            mapsUrl,
          },
        ]);
        pendingOutgoingLocationsRef.current.add(`${latitude},${longitude}`);
        sendChatLocationMessage({
          category: chatCategory,
          latitude,
          longitude,
          threadId: activeThreadId,
        });
        showNotice("موقعیت ارسال شد");
      })
      .catch((error) => {
        showNotice(getBrowserLocationNotice(error));
      })
      .finally(() => {
        setIsSendingLocation(false);
      });
  };

  const handleSendFileSelect = (id: SendFileOption["id"]) => {
    setIsSendFileSheetOpen(false);

    if (id === "camera") {
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
        cameraInputRef.current.click();
      }
      return;
    }

    if (id === "gallery") {
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
        galleryInputRef.current.click();
      }
      return;
    }

    if (id === "map") {
      sendCurrentLocation();
    }
  };

  return { cameraInputRef, galleryInputRef, sendImageFiles, handleSendFileSelect };
}
