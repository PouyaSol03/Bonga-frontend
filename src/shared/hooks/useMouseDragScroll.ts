import { useEffect, useRef, type RefObject } from "react";

export function useMouseDragScroll<T extends HTMLElement = HTMLElement>(
  externalRef?: RefObject<T | null>,
) {
  const internalRef = useRef<T | null>(null);
  const targetRef = externalRef || internalRef;

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hasDragged = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      hasDragged = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      el.style.userSelect = "none";
      el.style.cursor = "grab";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        hasDragged = true;
        el.style.cursor = "grabbing";
      }
      const isRtl = getComputedStyle(el).direction === "rtl";
      el.scrollLeft = isRtl ? startScrollLeft + dx : startScrollLeft - dx;
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      el.style.userSelect = "";
      el.style.cursor = "";
    };

    const onClickCapture = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [targetRef]);

  return targetRef;
}
