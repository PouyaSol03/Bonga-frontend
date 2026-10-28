import type { ChatCategory } from "../api/chat.service";
import { readPathText } from "./readChatValues";

export function getChatCategory(thread: unknown): ChatCategory {
  const category = readPathText(thread, ["category"]);
  return category === "support"
    ? "support"
    : category === "agency_support"
      ? "agency_support"
      : "advertise";
}

export function getParticipantName(thread: unknown) {
  return (
    readPathText(thread, [
      "participant.showing_name",
      "participant.showingName",
      "participant.full_name",
      "participant.fullName",
      "participant.name",
      "agency.name",
      "agency_name",
      "agencyName",
      "user.full_name",
      "user.fullName",
      "user.name",
    ]) || (readPathText(thread, ["category"]) === "agency_support" ? "پشتیبانی آژانس" : "گفتگو")
  );
}
