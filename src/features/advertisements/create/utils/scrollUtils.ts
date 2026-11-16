export function scrollDownToRevealed(element?: HTMLElement | null, amount = 220) {
  if (typeof window === "undefined") return;
  setTimeout(() => {
    const scrollable =
      element?.closest<HTMLElement>("main") ||
      document.querySelector<HTMLElement>("main") ||
      document.documentElement;

    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
      if (typeof scrollable.scrollBy === "function") {
        scrollable.scrollBy({ top: amount, behavior: "smooth" });
      } else {
        scrollable.scrollTop += amount;
      }
    } else if (typeof window.scrollBy === "function") {
      window.scrollBy({ top: amount, behavior: "smooth" });
    }
  }, 100);
}
