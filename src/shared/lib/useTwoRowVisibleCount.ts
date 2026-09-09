import { useLayoutEffect, useState, type RefObject } from "react";

export function useTwoRowVisibleCount(
  containerRef: RefObject<HTMLDivElement | null>,
  totalCount: number,
  dependencyKey?: string | number,
) {
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    totalCount > 6 ? 6 : totalCount,
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) {
        setVisibleCount(0);
        return;
      }

      const containerWidth = el.getBoundingClientRect().width || el.clientWidth;
      if (containerWidth <= 0) return;

      const firstTop = children[0].offsetTop;
      let secondTop: number | null = null;
      let count = 0;

      for (let i = 0; i < children.length; i++) {
        const top = children[i].offsetTop;
        if (Math.abs(top - firstTop) < 6) {
          count++;
        } else if (secondTop === null) {
          secondTop = top;
          count++;
        } else if (Math.abs(top - secondTop) < 6) {
          count++;
        } else {
          break; // 3rd row reached
        }
      }

      if (count > 0) {
        setVisibleCount(count);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, totalCount, dependencyKey]);

  return visibleCount;
}
