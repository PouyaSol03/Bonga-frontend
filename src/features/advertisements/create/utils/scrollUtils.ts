export function scrollDownToRevealed(element?: HTMLElement | null, fallbackAmount = 220) {
  if (typeof window === "undefined") return;

  setTimeout(() => {
    const scrollable =
      element?.closest<HTMLElement>("main") ||
      document.querySelector<HTMLElement>("main") ||
      document.documentElement;

    if (!scrollable) return;

    const isDoc = scrollable === document.documentElement || scrollable === document.body;
    const canScroll = isDoc
      ? document.documentElement.scrollHeight > window.innerHeight
      : scrollable.scrollHeight > scrollable.clientHeight;

    if (!canScroll) return;

    const containerRect = scrollable.getBoundingClientRect();
    const containerTop = isDoc ? 0 : containerRect.top;
    const containerBottom = isDoc ? window.innerHeight : containerRect.bottom;

    // Locate the revealed content associated with this toggle
    let revealed: HTMLElement | null = null;
    if (element) {
      if (element.nextElementSibling instanceof HTMLElement) {
        revealed = element.nextElementSibling;
      } else if (element.parentElement?.nextElementSibling instanceof HTMLElement) {
        revealed = element.parentElement.nextElementSibling;
      }
    }

    const target = revealed || element;
    let scrollAmount = 0;

    if (target) {
      const targetRect = target.getBoundingClientRect();
      const anchorRect = element ? element.getBoundingClientRect() : targetRect;

      // If bounding rect has rendered geometry
      if (targetRect.height > 0 || targetRect.bottom > 0) {
        const bottomPadding = 24;
        const topPadding = 16;
        const visibleBottom = containerBottom - bottomPadding;
        const overflowBelow = targetRect.bottom - visibleBottom;

        if (overflowBelow > 0) {
          // Scroll only enough to expose the revealed content,
          // but never so much that the toggle/top edge moves above the visible container top.
          const maxScrollDown = Math.max(0, anchorRect.top - (containerTop + topPadding));
          scrollAmount = Math.min(overflowBelow, maxScrollDown);
        } else {
          // Content is already completely visible within the viewport; do not scroll.
          scrollAmount = 0;
        }
      } else {
        scrollAmount = fallbackAmount;
      }
    } else {
      scrollAmount = fallbackAmount;
    }

    if (scrollAmount <= 0) return;

    if (!isDoc && typeof scrollable.scrollBy === "function") {
      scrollable.scrollBy({ top: scrollAmount, behavior: "smooth" });
    } else if (!isDoc) {
      scrollable.scrollTop += scrollAmount;
    } else if (typeof window.scrollBy === "function") {
      window.scrollBy({ top: scrollAmount, behavior: "smooth" });
    } else {
      document.documentElement.scrollTop += scrollAmount;
    }
  }, 100);
}
