import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import type { NewAdFormValues } from "./types";

/**
 * Ensures any collapsed or conditional sub-sections containing invalid fields
 * are expanded so the user can see the error message.
 */
export function expandErrorSections(
  errors: Record<string, string>,
  setValue: UseFormSetValue<NewAdFormValues>,
  getValues: UseFormGetValues<NewAdFormValues>,
) {
  if (!errors || Object.keys(errors).length === 0) return;

  // Loan section
  if (errors.loanAmount || errors.loanInstallment) {
    if (!getValues("loanEnabled")) {
      setValue("loanEnabled", true, { shouldDirty: true });
    }
  }

  // Exchange section
  if (errors.exchangeTargets) {
    if (!getValues("exchangeEnabled")) {
      setValue("exchangeEnabled", true, { shouldDirty: true });
    }
  }

  // Sale terms section
  if (errors.saleTermsPercent || errors.saleTermsInstallmentMonths) {
    if (!getValues("saleTermsEnabled")) {
      setValue("saleTermsEnabled", true, { shouldDirty: true });
    }
  }

  // Rent conversion section
  if (errors.rentConversionMortgagePrice) {
    if (!getValues("rentConversionEnabled")) {
      setValue("rentConversionEnabled", true, { shouldDirty: true });
    }
  }

  // Media video section
  if (errors.video) {
    if (!getValues("hasVideo")) {
      setValue("hasVideo", true, { shouldDirty: true });
    }
  }

  // Media virtual tour section
  if (errors.virtualTourLink) {
    if (!getValues("hasVirtualTour")) {
      setValue("hasVirtualTour", true, { shouldDirty: true });
    }
  }
}

/**
 * Smoothly scrolls to the first invalid field or error container in the DOM.
 */
export function scrollToFirstError(errors: Record<string, string>, delayMs = 120) {
  if (typeof window === "undefined" || !errors || Object.keys(errors).length === 0) return;

  window.setTimeout(() => {
    let targetElement: HTMLElement | null = null;

    // 1. Try finding by matching data-field-key, name, id, or data-testid for error keys
    for (const key of Object.keys(errors)) {
      if (!errors[key]) continue;
      const el = document.querySelector<HTMLElement>(
        `[data-field-key="${key}"], [name="${key}"], #${key}, [data-testid="${key}"]`,
      );
      if (el) {
        targetElement = el;
        break;
      }
    }

    // 2. If not found by key, search for visual error markers in DOM
    if (!targetElement) {
      const errorElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".border-error, [data-field-error='true'], [aria-invalid='true'], .text-error",
        ),
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      });

      if (errorElements.length > 0) {
        targetElement = errorElements.reduce((topmost, current) => {
          const topRect = topmost.getBoundingClientRect();
          const currRect = current.getBoundingClientRect();
          return currRect.top < topRect.top ? current : topmost;
        });
      }
    }

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      // Try focusing input/button/textarea for accessibility and visibility
      const focusable = targetElement.matches("input, textarea, select, button")
        ? targetElement
        : targetElement.querySelector<HTMLElement>("input, textarea, select, button");

      if (focusable && typeof focusable.focus === "function") {
        focusable.focus({ preventScroll: true });
      }
    }
  }, delayMs);
}

/**
 * High-level error handler: expands collapsed error sections and scrolls to the first error.
 */
export function handleValidationFailure(
  errors: Record<string, string>,
  setValue: UseFormSetValue<NewAdFormValues>,
  getValues: UseFormGetValues<NewAdFormValues>,
) {
  expandErrorSections(errors, setValue, getValues);
  scrollToFirstError(errors);
}
