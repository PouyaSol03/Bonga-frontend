import { getPrimaryAdvertisementImageUrl } from "../../advertisements/utils/advertisement-images";
import { readPathText } from "./readChatValues";

export function readAdvertiseFormTitle(source: unknown) {
  return readPathText(source, [
    "form_title",
    "formTitle",
    "form.title",
    "form.name",
    "category_name",
    "categoryName",
    "category.title",
    "category.name",
  ]);
}

export function readChatThreadId(source: unknown) {
  return readPathText(source, ["thread_id", "threadId", "thread.id", "thread._id", "id", "_id"]);
}

export function readImageUrl(source: unknown) {
  return getPrimaryAdvertisementImageUrl(source);
}
