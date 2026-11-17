import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scrollDownToRevealed } from "../../../src/features/advertisements/create/utils/scrollUtils";

describe("scrollDownToRevealed", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("does not scroll when revealed content is already fully visible (e.g. toggle near top)", () => {
    const main = document.createElement("main");
    Object.defineProperty(main, "scrollHeight", { value: 1200, configurable: true });
    Object.defineProperty(main, "clientHeight", { value: 700, configurable: true });
    main.getBoundingClientRect = () => ({
      top: 60,
      bottom: 760,
      left: 0,
      right: 400,
      width: 400,
      height: 700,
      x: 0,
      y: 60,
      toJSON: () => {},
    });
    main.scrollBy = vi.fn();

    // Toggle near top: top=80, bottom=130
    const toggle = document.createElement("div");
    toggle.getBoundingClientRect = () => ({
      top: 80,
      bottom: 130,
      left: 0,
      right: 400,
      width: 400,
      height: 50,
      x: 0,
      y: 80,
      toJSON: () => {},
    });

    // Revealed content: top=140, bottom=340 (well within visibleBottom = 760 - 24 = 736)
    const revealed = document.createElement("div");
    revealed.getBoundingClientRect = () => ({
      top: 140,
      bottom: 340,
      left: 0,
      right: 400,
      width: 400,
      height: 200,
      x: 0,
      y: 140,
      toJSON: () => {},
    });

    main.appendChild(toggle);
    main.appendChild(revealed);
    document.body.appendChild(main);

    scrollDownToRevealed(toggle, 220);
    vi.advanceTimersByTime(120);

    expect(main.scrollBy).not.toHaveBeenCalled();
  });

  it("scrolls only enough to expose partially hidden revealed content below viewport", () => {
    const main = document.createElement("main");
    Object.defineProperty(main, "scrollHeight", { value: 1500, configurable: true });
    Object.defineProperty(main, "clientHeight", { value: 700, configurable: true });
    main.getBoundingClientRect = () => ({
      top: 60,
      bottom: 760,
      left: 0,
      right: 400,
      width: 400,
      height: 700,
      x: 0,
      y: 60,
      toJSON: () => {},
    });
    main.scrollBy = vi.fn();

    // Toggle at top=580, bottom=630
    const toggle = document.createElement("div");
    toggle.getBoundingClientRect = () => ({
      top: 580,
      bottom: 630,
      left: 0,
      right: 400,
      width: 400,
      height: 50,
      x: 0,
      y: 580,
      toJSON: () => {},
    });

    // Revealed content: top=640, bottom=836
    // visibleBottom = 760 - 24 = 736
    // overflowBelow = 836 - 736 = 100px
    const revealed = document.createElement("div");
    revealed.getBoundingClientRect = () => ({
      top: 640,
      bottom: 836,
      left: 0,
      right: 400,
      width: 400,
      height: 196,
      x: 0,
      y: 640,
      toJSON: () => {},
    });

    main.appendChild(toggle);
    main.appendChild(revealed);
    document.body.appendChild(main);

    scrollDownToRevealed(toggle, 220);
    vi.advanceTimersByTime(120);

    expect(main.scrollBy).toHaveBeenCalledWith({
      top: 100,
      behavior: "smooth",
    });
  });

  it("caps scrolling to prevent pushing the toggle above visible container top", () => {
    const main = document.createElement("main");
    Object.defineProperty(main, "scrollHeight", { value: 3000, configurable: true });
    Object.defineProperty(main, "clientHeight", { value: 700, configurable: true });
    main.getBoundingClientRect = () => ({
      top: 60,
      bottom: 760,
      left: 0,
      right: 400,
      width: 400,
      height: 700,
      x: 0,
      y: 60,
      toJSON: () => {},
    });
    main.scrollBy = vi.fn();

    // Toggle at top=100 (close to container top 60)
    const toggle = document.createElement("div");
    toggle.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 0,
      right: 400,
      width: 400,
      height: 50,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    // Huge revealed content: bottom=1200
    // overflowBelow = 1200 - 736 = 464
    // maxScrollDown = 100 - (60 + 16) = 24
    const revealed = document.createElement("div");
    revealed.getBoundingClientRect = () => ({
      top: 160,
      bottom: 1200,
      left: 0,
      right: 400,
      width: 400,
      height: 1040,
      x: 0,
      y: 160,
      toJSON: () => {},
    });

    main.appendChild(toggle);
    main.appendChild(revealed);
    document.body.appendChild(main);

    scrollDownToRevealed(toggle, 220);
    vi.advanceTimersByTime(120);

    expect(main.scrollBy).toHaveBeenCalledWith({
      top: 24,
      behavior: "smooth",
    });
  });

  it("supports wrapped toggles where revealed content is parent's next sibling", () => {
    const main = document.createElement("main");
    Object.defineProperty(main, "scrollHeight", { value: 1500, configurable: true });
    Object.defineProperty(main, "clientHeight", { value: 700, configurable: true });
    main.getBoundingClientRect = () => ({
      top: 60,
      bottom: 760,
      left: 0,
      right: 400,
      width: 400,
      height: 700,
      x: 0,
      y: 60,
      toJSON: () => {},
    });
    main.scrollBy = vi.fn();

    const wrapper = document.createElement("div");
    const toggle = document.createElement("div");
    toggle.getBoundingClientRect = () => ({
      top: 600,
      bottom: 650,
      left: 0,
      right: 400,
      width: 400,
      height: 50,
      x: 0,
      y: 600,
      toJSON: () => {},
    });
    wrapper.appendChild(toggle);

    // Revealed sibling to the wrapper: bottom=816 (overflow = 816 - 736 = 80)
    const revealed = document.createElement("div");
    revealed.getBoundingClientRect = () => ({
      top: 660,
      bottom: 816,
      left: 0,
      right: 400,
      width: 400,
      height: 156,
      x: 0,
      y: 660,
      toJSON: () => {},
    });

    main.appendChild(wrapper);
    main.appendChild(revealed);
    document.body.appendChild(main);

    scrollDownToRevealed(toggle, 220);
    vi.advanceTimersByTime(120);

    expect(main.scrollBy).toHaveBeenCalledWith({
      top: 80,
      behavior: "smooth",
    });
  });
});
