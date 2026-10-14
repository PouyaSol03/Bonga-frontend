import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ChoiceIndicator } from "./Choice";

const meta: Meta<typeof ChoiceIndicator> = {
  title: "Shared UI/ChoiceIndicator",
  component: ChoiceIndicator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "نشانگرهای انتخاب شامل چک‌باکس (Checkbox) و رادیوباتن (Radio) با استایل استاندارد دیزاین سیستم بنگاه.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean", description: "وضعیت انتخاب" },
    disabled: { control: "boolean", description: "غیرفعال‌سازی" },
    type: { control: "select", options: ["checkbox", "radio"], description: "نوع نشانگر" },
  },
  args: {
    checked: true,
    disabled: false,
    type: "checkbox",
  },
};

export default meta;
type Story = StoryObj<typeof ChoiceIndicator>;

export const InteractiveRadioGroup: Story = {
  name: "گروه رادیوباتن تعاملی (انتخاب نحوه پرداخت)",
  render: function Render() {
    const [selected, setSelected] = useState("gateway");
    const options = [
      {
        id: "gateway",
        label: "پرداخت آنلاین اینترنتی (کلیه کارت‌های عضو شتاب)",
        sub: "هدایت به درگاه امن بانکی",
      },
      { id: "wallet", label: "پرداخت از موجودی کیف پول", sub: "موجودی فعلی: ۱۲۵,۰۰۰ تومان" },
    ];

    return (
      <div className="bg-surface-container-lowest border-outline-var max-w-md space-y-3 rounded-xl border p-4">
        <h4 className="text-on-surface text-sm font-bold">نحوه پرداخت را انتخاب کنید:</h4>
        {options.map((opt) => (
          <label
            key={opt.id}
            className="border-outline-var flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all duration-200 ease-out select-none active:scale-[0.99]"
            onClick={() => setSelected(opt.id)}
          >
            <ChoiceIndicator checked={selected === opt.id} type="radio" className="mt-0.5" />
            <div className="flex flex-col">
              <span className="text-on-surface text-sm font-medium">{opt.label}</span>
              <span className="text-outline mt-0.5 text-xs">{opt.sub}</span>
            </div>
          </label>
        ))}
      </div>
    );
  },
};

export const InteractiveCheckboxes: Story = {
  name: "فهرست چک‌باکس تعاملی (امکانات ملک)",
  render: function Render() {
    const [checkedItems, setCheckedItems] = useState<string[]>(["elevator", "parking"]);
    const items = [
      { id: "elevator", label: "آسانسور" },
      { id: "parking", label: "پارکینگ اختصاصی" },
      { id: "storage", label: "انباری" },
      { id: "balcony", label: "بالکن / تراس" },
    ];

    const toggle = (id: string) => {
      setCheckedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    return (
      <div className="bg-surface-container-lowest border-outline-var max-w-md space-y-3 rounded-xl border p-4">
        <h4 className="text-on-surface text-sm font-bold">امکانات ضروری ملک:</h4>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 transition-all duration-200 ease-out select-none active:scale-[0.98]"
              onClick={() => toggle(item.id)}
            >
              <ChoiceIndicator checked={checkedItems.includes(item.id)} type="checkbox" />
              <span className="text-on-surface text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  },
};

export const AllStatesOverview: Story = {
  name: "بررسی تمام حالات در یک نما",
  render: () => (
    <div className="bg-surface-container-lowest border-outline-var flex flex-wrap gap-8 rounded-xl border p-4">
      <div className="space-y-3">
        <h5 className="text-on-surface-var text-xs font-bold">چک‌باکس‌ها:</h5>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked type="checkbox" />
          <span className="text-on-surface text-sm">انتخاب شده (Checked)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked={false} type="checkbox" />
          <span className="text-on-surface text-sm">انتخاب نشده (Unchecked)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked disabled type="checkbox" />
          <span className="text-outline text-sm">غیرفعال انتخاب شده</span>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-on-surface-var text-xs font-bold">رادیوباتن‌ها:</h5>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked type="radio" />
          <span className="text-on-surface text-sm">فعال (Selected)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked={false} type="radio" />
          <span className="text-on-surface text-sm">غیرفعال (Unselected)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked disabled type="radio" />
          <span className="text-outline text-sm">غیرفعال شده</span>
        </div>
      </div>
    </div>
  ),
};
