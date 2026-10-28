import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { PaymentOptionIcon } from "../../src/features/account/adManagement/AdManagementIcons";
import { PaymentMethodOption } from "../../src/features/payments/components/PaymentMethodOption";
import { formatShortPayment } from "../../src/features/payments/components/formatShortPayment";

describe("short payment amounts", () => {
  test.each([
    [0, "رایگان"],
    [-0, "رایگان"],
    [1, "۱ تومان"],
    [999, "۹۹۹ تومان"],
    [1000, "۱ هزار تومان"],
    [1250.5, "۱٬۲۵۰٫۵ تومان"],
    [999000, "۹۹۹ هزار تومان"],
    [999999, "۹۹۹٬۹۹۹ تومان"],
    [1000000, "۱ میلیون تومان"],
    [1250000, "۱٫۲۵ میلیون تومان"],
    [1234567, "۱٫۲۳ میلیون تومان"],
    [9999999, "۱۰ میلیون تومان"],
    [-1000, "‎−۱ هزار تومان"],
    [NaN, "ناعدد تومان"],
    [Infinity, "∞ میلیون تومان"],
    [-Infinity, "‎−∞ تومان"],
  ])("preserves %s as %s", (amount, expected) => {
    expect(formatShortPayment(amount)).toBe(expected);
  });
});

describe("payment method option", () => {
  for (const icon of ["consultant", "credit", "online", "wallet"] as const) {
    for (const active of [false, true]) {
      for (const disabled of [false, true]) {
        test(`${icon}: active=${active}, disabled=${disabled}`, () => {
          const props = {
            icon,
            active,
            disabled,
            label: "روش پرداخت",
            subLabel: "مانده",
            onClick: () => {},
          };
          const markup = renderToStaticMarkup(React.createElement(PaymentMethodOption, props));
          const container = document.createElement("div");
          container.innerHTML = markup;
          const button = container.querySelector("button")!;
          expect(button.getAttribute("aria-pressed")).toBe(String(active));
          expect(button.disabled).toBe(disabled);
          expect(button.type).toBe("button");
          expect(button.classList.contains("h-[72px]")).toBe(true);
          expect(button.classList.contains("opacity-50")).toBe(disabled);
          expect(button.textContent).toBe("روش پرداختمانده");
          expect(container.querySelector("strong")?.className).toBe(
            "text-on-surface block text-base leading-6 font-normal",
          );
          expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
        });
      }
    }
  }

  test("preserves defaults and custom subtitle class", () => {
    const props = {
      icon: "wallet" as const,
      active: false,
      label: "کیف پول",
      subLabel: "مانده",
      onClick: () => {},
    };
    expect(renderToStaticMarkup(React.createElement(PaymentMethodOption, props))).toContain(
      "text-outline",
    );
    expect(
      renderToStaticMarkup(
        React.createElement(PaymentMethodOption, {
          ...props,
          subLabelClassName: "text-error font-medium",
        }),
      ),
    ).toContain("text-error font-medium");
    const element = PaymentMethodOption(props);
    expect(element.props.onClick).toBe(props.onClick);
    expect(element.props.disabled).toBe(false);
  });
});

test.each(["consultant", "credit", "wallet", "online"] as const)("preserves %s icon", (icon) => {
  const markup = renderToStaticMarkup(<PaymentOptionIcon icon={icon} />);
  expect(markup).toContain('aria-hidden="true"');
  if (icon === "online") {
    expect(markup).toContain("h-6 w-6 text-[#E02636]");
    expect(
      renderToStaticMarkup(
        <PaymentOptionIcon icon={icon} className="text-on-surface-var h-6 w-6" />,
      ),
    ).toContain("text-[#E02636] h-6 w-6");
    expect(renderToStaticMarkup(<PaymentOptionIcon icon={icon} className="h-6 w-6" />)).toContain(
      'class="h-6 w-6"',
    );
  }
});
