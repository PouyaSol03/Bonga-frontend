import type { AdvertisementFeature, AdvertisementItem } from "../../api/advertisement.service";
import type { NewAdFormValues } from "../types";
import { readFirstValue } from "./featureReaders";
import { readText, toBooleanValue } from "./featureFormatters";

export function mapOfficeSpecs(
  ad: AdvertisementItem,
  features: AdvertisementFeature[],
  next: NewAdFormValues,
) {
  const setBool = (key: keyof NewAdFormValues, value: unknown) => {
    const booleanValue = toBooleanValue(value);
    if (booleanValue !== null) {
      (next[key] as boolean) = booleanValue;
    }
  };

  const officePos = readText(
    readFirstValue(
      ad,
      features,
      ["office_position", "officePosition", "موقعیت اداری"],
      ["office_position", "officePosition"],
    ),
  );
  if (officePos) next.officePosition = officePos;

  const officeDocType = readText(
    readFirstValue(
      ad,
      features,
      ["office_document_type", "officeDocumentType", "سند اداری"],
      ["office_document_type", "officeDocumentType"],
    ),
  );
  if (officeDocType) {
    next.officeDocumentType = officeDocType;
    if (!next.hasDocument) next.hasDocument = true;
  }

  setBool(
    "managementRoom",
    readFirstValue(
      ad,
      features,
      ["management_room", "managementRoom", "اتاق مدیریت"],
      ["management_room", "managementRoom"],
    ),
  );
  setBool(
    "conferenceRoom",
    readFirstValue(
      ad,
      features,
      ["conference_room", "conferenceRoom", "اتاق کنفرانس"],
      ["conference_room", "conferenceRoom"],
    ),
  );
  setBool(
    "receptionHall",
    readFirstValue(
      ad,
      features,
      ["reception_hall", "receptionHall", "سالن پذیرش"],
      ["reception_hall", "receptionHall"],
    ),
  );
  setBool(
    "signboard",
    readFirstValue(ad, features, ["signboard", "تابلو خور"], ["signboard"]),
  );
  setBool(
    "kitchen",
    readFirstValue(ad, features, ["kitchen", "آشپزخانه"], ["kitchen"]),
  );
  setBool(
    "separateEntrance",
    readFirstValue(
      ad,
      features,
      ["separate_entrance", "separateEntrance", "ورودی مجزا"],
      ["separate_entrance", "separateEntrance"],
    ),
  );
}
