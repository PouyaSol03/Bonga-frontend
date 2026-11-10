import type { AdvertisementItem } from "../../../advertisements/api/advertisement.service";
import type { NoteItem } from "../../api/account.service";

export function getNoteAdvertiseSource(note: NoteItem): AdvertisementItem {
  return note.ad ?? note.advertise ?? note.advertisement ?? (note as AdvertisementItem);
}

export function getNoteId(note: NoteItem) {
  const id = note.id ?? note._id ?? note.noteId;
  return id === undefined || id === null ? "" : String(id);
}

export function getNoteAdvertiseId(note: NoteItem) {
  const ad = getNoteAdvertiseSource(note);
  const id = note.advertiseId ?? note.advertise_id ?? ad.id ?? ad._id;
  return id === undefined || id === null ? "" : String(id);
}

export function readNoteText(note: NoteItem) {
  if (typeof note.note === "string") return note.note;
  if (typeof note.text === "string") return note.text;
  if (typeof note.description === "string") return note.description;
  return "";
}

export function readNoteDate(note: NoteItem, fallback: string) {
  const createdAt = note.created_at ?? note.updated_at;
  if (typeof createdAt === "string" && createdAt.trim()) return createdAt;
  return fallback || "";
}
