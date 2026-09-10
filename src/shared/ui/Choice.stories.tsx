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
      { id: "gateway", label: "پرداخت آنلاین اینترنتی (کلیه کارت‌های عضو شتاب)", sub: "هدایت به درگاه امن بانکی" },
      { id: "wallet", label: "پرداخت از موجودی کیف پول", sub: "موجودی فعلی: ۱۲۵,۰۰۰ تومان" },
    ];

    return (
      <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5] space-y-3">
        <h4 className="text-sm font-bold text-[#1a1a1a]">نحوه پرداخت را انتخاب کنید:</h4>
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-[#e5e5e5] cursor-pointer hover:border-[#0048c4] transition-all duration-200 ease-out active:scale-[0.99] select-none"
            onClick={() => setSelected(opt.id)}
          >
            <ChoiceIndicator checked={selected === opt.id} type="radio" className="mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#1a1a1a]">{opt.label}</span>
              <span className="text-xs text-[#808080] mt-0.5">{opt.sub}</span>
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
      setCheckedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    };

    return (
      <div className="max-w-md p-4 bg-white rounded-xl border border-[#e5e5e5] space-y-3">
        <h4 className="text-sm font-bold text-[#1a1a1a]">امکانات ضروری ملک:</h4>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[#f5f5f5] transition-all duration-200 ease-out active:scale-[0.98] select-none"
              onClick={() => toggle(item.id)}
            >
              <ChoiceIndicator checked={checkedItems.includes(item.id)} type="checkbox" />
              <span className="text-sm text-[#1a1a1a]">{item.label}</span>
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
    <div className="flex flex-wrap gap-8 p-4 bg-white rounded-xl border border-[#e5e5e5]">
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-[#666666]">چک‌باکس‌ها:</h5>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked type="checkbox" />
          <span className="text-sm text-[#1a1a1a]">انتخاب شده (Checked)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked={false} type="checkbox" />
          <span className="text-sm text-[#1a1a1a]">انتخاب نشده (Unchecked)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked disabled type="checkbox" />
          <span className="text-sm text-[#808080]">غیرفعال انتخاب شده</span>
        </div>
      </div>

      <div className="space-y-3">
        <h5 className="text-xs font-bold text-[#666666]">رادیوباتن‌ها:</h5>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked type="radio" />
          <span className="text-sm text-[#1a1a1a]">فعال (Selected)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked={false} type="radio" />
          <span className="text-sm text-[#1a1a1a]">غیرفعال (Unselected)</span>
        </div>
        <div className="flex items-center gap-2">
          <ChoiceIndicator checked disabled type="radio" />
          <span className="text-sm text-[#808080]">غیرفعال شده</span>
        </div>
      </div>
    </div>
  ),
};
