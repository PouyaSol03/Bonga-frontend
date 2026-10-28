import { Link } from "react-router";
import LinearImage from "../../../shared/icons/LinearImage";
import { Typography } from "../../../shared/ui/Typography";
import { type ChatThread } from "../api/chat.service";
import { readPathRecord, readPathText } from "./readChatValues";
import { readAdvertiseFormTitle, readImageUrl } from "./threadMetadata";

export function ChatPropertyStrip({ thread }: { thread?: ChatThread }) {
  const advertise = readPathRecord(thread, ["advertise", "ad", "advertisement", "property"]);

  if (!advertise) return null;

  const advertiseId = readPathText(advertise, ["id", "_id"]);
  const advertiseTitle = readPathText(advertise, ["title", "label", "name"]) || "جزئیات ملک";
  const advertiseFormTitle = readAdvertiseFormTitle(advertise);
  const imageUrl = readImageUrl(advertise);
  const content = (
    <section className="bg-surface-container flex h-[52px] shrink-0 items-center gap-2 px-4 text-right [direction:rtl]">
      <div className="bg-primary-container/20 text-outline relative grid h-10 w-[54px] shrink-0 place-items-center overflow-hidden rounded-md">
        <LinearImage className="h-5 w-5" aria-hidden="true" />
        {imageUrl ? (
          <img
            alt={advertiseTitle}
            className="absolute inset-0 h-full w-full object-cover"
            src={imageUrl}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        {advertiseFormTitle ? (
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-on-surface truncate text-xs leading-4 font-normal"
          >
            {advertiseFormTitle}
          </Typography>
        ) : null}
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="medium"
          className={`${advertiseFormTitle ? "mt-1" : ""} text-on-surface truncate text-xs leading-4 font-medium`}
        >
          {advertiseTitle}
        </Typography>
      </div>
    </section>
  );

  if (!advertiseId) return content;

  return (
    <Link
      aria-label={`مشاهده ${advertiseTitle}`}
      className="focus-visible:outline-inset focus-visible:outline-primary/40 block shrink-0 text-inherit no-underline focus-visible:outline-3"
      to={`/ads/${encodeURIComponent(advertiseId)}`}
    >
      {content}
    </Link>
  );
}
