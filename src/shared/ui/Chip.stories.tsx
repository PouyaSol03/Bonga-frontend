import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Chip } from "./Chip";
import LinearLocation from "../icons/LinearLocation";
import LinearTick from "../icons/LinearTick";

const meta: Meta<typeof Chip> = {
  title: "Shared UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "چیپ‌ها (Chips) برای فیلتر کردن محتوا، برچسب‌های دسته‌بندی و انتخاب سریع گزینه‌ها به کار می‌روند و دارای انیمیشن فشردگی نرم (`active:scale-[0.96]`) هستند.",
      },
    },
  },
  argTypes: {
    selected: { control: "boolean", description: "وضعیت انتخاب شده" },
    removable: { control: "boolean", description: "امکان حذف چیپ" },
    disabled: { control: "boolean", description: "غیرفعال‌سازی" },
  },
  args: {
    children: "فروش آپارتمان",
    selected: false,
    removable: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const InteractiveFilterGroup: Story = {
  name: "گروه فیلتر تعاملی (Filter Bar)",
  render: function Render() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["همه", "مسکونی"]);
    const filters = ["همه", "مسکونی", "تجاری", "زمین و کلنگی", "ویلا", "مشارکت در ساخت"];

    const toggle = (filter: string) => {
      setSelectedFilters((prev) =>
        prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
      );
    };

    return (
      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-[#e5e5e5]">
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter);
          return (
            <Chip
              key={filter}
              onClick={() => toggle(filter)}
              selected={isSelected}
            >
              {filter}
            </Chip>
          );
        })}
      </div>
    );
  },
};

export const RemovableChips: Story = {
  name: "چیپ‌های قابل حذف (تگ‌های فعال جستجو)",
  render: function Render() {
    const [chips, setChips] = useState(["تهران، نیاوران", "حداقل ۱۰۰ متر", "۳ خواب"]);

    return (
      <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-[#e5e5e5]">
        <span className="text-xs text-[#666666] ml-2">فیلترهای اعمال‌شده:</span>
        {chips.map((item) => (
          <Chip
            key={item}
            onClick={() => setChips((prev) => prev.filter((c) => c !== item))}
            removable
            selected
          >
            {item}
          </Chip>
        ))}
        {chips.length === 0 && <span className="text-xs text-[#808080]">هیچ فیلتری فعال نیست.</span>}
      </div>
    );
  },
};

export const WithIconsAndStates: Story = {
  name: "حالت‌ها و آیکون‌ها",
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-[#e5e5e5]">
      <Chip icon={<LinearLocation className="h-4 w-4" />} selected={false}>
        انتخاب لوکیشن
      </Chip>
      <Chip icon={<LinearTick className="h-4 w-4" />} selected>
        تایید شده
      </Chip>
      <Chip disabled>
        غیرفعال
      </Chip>
    </div>
  ),
};
