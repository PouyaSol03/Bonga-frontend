import LinearBuilding2 from "../../../shared/icons/LinearBuilding2";
import LinearUserSolid from "../../../shared/icons/LinearUserSolid";
import "../../advertisements/components/AdCard.css";
import type { ManagerPublisher } from "./types";

export function PublisherAvatar({
  publisher,
  size,
}: {
  publisher: ManagerPublisher;
  size: "large" | "small";
}) {
  const sizeClass = size === "large" ? "h-14 w-14" : "h-12 w-12";
  const radiusClass = publisher.type === "agency" ? "rounded-lg" : "rounded-full";

  if (publisher.image) {
    return (
      <img
        alt=""
        className={`${sizeClass} shrink-0 object-cover ${radiusClass}`}
        draggable={false}
        src={publisher.image}
      />
    );
  }

  return (
    <div
      className={`grid ${sizeClass} bg-surface-container text-outline shrink-0 place-items-center ${radiusClass}`}
    >
      {publisher.type === "agency" ? (
        <LinearBuilding2 className="h-6 w-6" />
      ) : (
        <LinearUserSolid className="h-6 w-6" />
      )}
    </div>
  );
}
