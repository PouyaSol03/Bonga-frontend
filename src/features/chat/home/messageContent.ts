import { getApiAssetUrl } from "../../../shared/api/api";
import { type ChatMessage } from "../api/chat.service";
import { readNumber, readPathString, readPathText } from "./readChatValues";

export function readChatMessageBody(message: ChatMessage) {
  return (
    readPathString(message, [
      "body",
      "text",
      "content",
      "description",
      "message",
      "message.body",
      "message.text",
      "message.content",
      "data.body",
      "data.text",
      "data.message",
      "payload.body",
      "payload.text",
      "payload.message",
    ]) || ""
  );
}

export function readChatMessageType(message: ChatMessage) {
  return readPathText(message, ["type", "message.type", "data.type", "payload.type"]).toLowerCase();
}

export function readChatMessageAttachment(message: ChatMessage) {
  const attachmentUrl = readPathText(message, [
    "metadata.attachment_url",
    "metadata.attachmentUrl",
    "attachment_url",
    "attachmentUrl",
    "message.metadata.attachment_url",
    "data.metadata.attachment_url",
    "payload.metadata.attachment_url",
  ]);
  const fileName = readPathText(message, [
    "metadata.file_name",
    "metadata.fileName",
    "file_name",
    "fileName",
    "message.metadata.file_name",
    "data.metadata.file_name",
    "payload.metadata.file_name",
  ]);

  return {
    attachmentUrl,
    fileName: fileName || "تصویر ارسالی",
    imageUrl: attachmentUrl
      ? /^https?:\/\//i.test(attachmentUrl)
        ? attachmentUrl
        : getApiAssetUrl(attachmentUrl)
      : "",
  };
}

export function readChatMessageLocation(message: ChatMessage) {
  const latitude = readNumber(
    readPathText(message, [
      "metadata.lat",
      "metadata.latitude",
      "lat",
      "latitude",
      "message.metadata.lat",
      "data.metadata.lat",
      "payload.metadata.lat",
    ]),
  );
  const longitude = readNumber(
    readPathText(message, [
      "metadata.lng",
      "metadata.longitude",
      "lng",
      "longitude",
      "message.metadata.lng",
      "data.metadata.lng",
      "payload.metadata.lng",
    ]),
  );

  return {
    latitude,
    longitude,
    mapsUrl:
      latitude !== undefined && longitude !== undefined
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : "",
  };
}
