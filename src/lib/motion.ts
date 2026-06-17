export const softSpring = {
  damping: 28,
  mass: 0.9,
  stiffness: 320,
} as const;

export const quickEase = [0.22, 1, 0.36, 1] as const;

export const pageMotion = {
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: quickEase },
  },
  exit: {
    opacity: 0,
    x: -18,
    transition: { duration: 0.18, ease: quickEase },
  },
  initial: {
    opacity: 0,
    x: 18,
  },
} as const;

export const contentMotion = {
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: quickEase },
  },
  initial: {
    opacity: 0,
    y: 14,
  },
} as const;

export const listContainerMotion = {
  animate: {
    transition: {
      staggerChildren: 0.045,
    },
  },
  initial: {},
} as const;

export const listItemMotion = {
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: quickEase },
  },
  initial: {
    opacity: 0,
    y: 10,
  },
} as const;
