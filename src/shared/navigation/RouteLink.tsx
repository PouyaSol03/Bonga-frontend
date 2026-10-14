import { Link, type LinkProps } from "react-router";
import { prefetchRoute } from "./navigation";

export type RouteLinkProps = LinkProps;

export function RouteLink({ to, onMouseEnter, onTouchStart, children, ...props }: RouteLinkProps) {
  return (
    <Link
      to={to}
      onMouseEnter={(event) => {
        if (typeof to === "string") prefetchRoute(to);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        if (typeof to === "string") prefetchRoute(to);
        onTouchStart?.(event);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
