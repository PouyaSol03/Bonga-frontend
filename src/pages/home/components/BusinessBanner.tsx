// src/pages/home/components/BusinessBanner.tsx
import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import ArrowLeft from "../../../shared/assets/icons/ArrowLeft";
import BannerHomePage from "../../../shared/assets/icons/BannerHomePage.svg";
import { RouteLink } from "../../../app/router/RouteLink";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export type BusinessBannerSlide = {
  eyebrow: string;
  title: string;
  buttonText: string;
  to: string;
};

type BusinessBannerProps = {
  slides: BusinessBannerSlide[];
};

const SWIPE_THRESHOLD_RATIO = 0.16;
const SWIPE_VELOCITY_THRESHOLD = 0.45;

export function BusinessBanner({ slides }: BusinessBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressClickUntilRef = useRef(0);
  const dragStateRef = useRef({
    didDrag: false,
    pointerId: -1,
    startTime: 0,
    startX: 0,
  });
  const totalItems = slides.length;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      totalItems <= 1 ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    dragStateRef.current = {
      didDrag: false,
      pointerId: event.pointerId,
      startTime: performance.now(),
      startX: event.clientX,
    };
    setDragOffset(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    if (Math.abs(deltaX) > 4) {
      state.didDrag = true;
      event.preventDefault();
    }

    const isOutsideStart = activeIndex === 0 && deltaX > 0;
    const isOutsideEnd = activeIndex === totalItems - 1 && deltaX < 0;
    setDragOffset(isOutsideStart || isOutsideEnd ? deltaX * 0.22 : deltaX);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, isCancelled = false) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    const elapsedMs = Math.max(performance.now() - state.startTime, 1);
    const velocity = deltaX / elapsedMs;
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const distanceThreshold = Math.max(viewportWidth * SWIPE_THRESHOLD_RATIO, 32);
    const shouldChangeSlide =
      !isCancelled &&
      (Math.abs(deltaX) >= distanceThreshold ||
        Math.abs(velocity) >= SWIPE_VELOCITY_THRESHOLD);

    if (shouldChangeSlide) {
      setActiveIndex((index) =>
        deltaX < 0
          ? Math.min(index + 1, totalItems - 1)
          : Math.max(index - 1, 0),
      );
    }

    if (state.didDrag) {
      suppressClickUntilRef.current = performance.now() + 500;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.pointerId = -1;
    setDragOffset(0);
    setIsDragging(false);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <section
      className="select-none bg-white px-4 pb-5 pt-4 min-[390px]:pb-6"
      aria-label="سامانه کسب و کار"
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        className={`touch-pan-y overflow-hidden rounded-xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onClickCapture={(event) => {
          if (performance.now() > suppressClickUntilRef.current) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerCancel={(event) => finishDrag(event, true)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
      >
        <div
          className="flex [direction:ltr]"
          style={{
            transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              className="relative flex min-h-[108px] w-full shrink-0 flex-row-reverse items-center justify-between gap-2 bg-[#edf2ff] px-3 py-3 text-[#0048c4] [direction:rtl] min-[390px]:min-h-[124px] min-[390px]:gap-2.5 min-[390px]:px-4"
              key={slide.title}
              aria-hidden={index !== activeIndex}
              aria-label={`${index + 1} از ${totalItems}`}
              aria-roledescription="slide"
              role="group"
            >
              <img
                src={BannerHomePage}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="h-auto w-[39%] max-w-[112px] shrink-0 min-[390px]:w-[42%] min-[390px]:max-w-[128px]"
              />

              <div className="flex min-w-0 flex-col items-start gap-0.5 text-right">
                <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 whitespace-nowrap text-xs font-extrabold leading-4 text-[#11a366] min-[390px]:text-sm min-[390px]:leading-5">
                  {slide.eyebrow}
                </Typography>

                <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 whitespace-nowrap text-base font-black leading-6 text-[#0048c4] min-[390px]:text-lg">
                  {slide.title}
                </Typography>

                <RouteLink
                  className="mt-1.5 flex items-center justify-start gap-2 rounded-lg bg-[#0048C4] px-3 py-1.5 text-xs font-medium leading-4 text-white min-[390px]:gap-3 min-[390px]:px-4"
                  tabIndex={index === activeIndex ? 0 : -1}
                  to={slide.to}
                >
                  {slide.buttonText}
                  <ArrowLeft />
                </RouteLink>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-3 min-[390px]:mt-4 min-[390px]:gap-4"
        aria-label="اسلایدهای بنر"
      >
        {Array.from({ length: totalItems }, (_, index) => (
          <Button unstyled
            key={index}
            className={`h-3 cursor-pointer rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:h-4 ${
              index === activeIndex
                ? "w-10 bg-[#0048c4] min-[390px]:w-[50px]"
                : "w-3 bg-[#dce5f2] min-[390px]:w-4"
            }`}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={`نمایش اسلاید ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
