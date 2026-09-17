import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Shared UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "کلید تغییر وضعیت (Switch) برای فعال/غیرفعال کردن سریع قابلیت‌ها و تنظیمات اپلیکیشن.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean", description: "وضعیت روشن/خاموش کلید" },
    disabled: { control: "boolean", description: "غیرفعال‌سازی تغییر وضعیت" },
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const InteractiveSettingsList: Story = {
  name: "فهرست تنظیمات نوتیفیکیشن‌ها (Settings List)",
  render: function Render() {
    const [settings, setSettings] = useState({
      push: true,
      sms: false,
      newChat: true,
      priceDrop: true,
    });

    const update = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="max-w-md p-4 bg-surface-container-lowest rounded-xl border border-outline-var divide-y divide-outline-var">
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium text-on-surface">اعلان‌های درون‌برنامه‌ای (Push)</div>
            <div className="text-xs text-outline">دریافت پیام‌ها و وضعیت بررسی آگهی‌ها</div>
          </div>
          <Switch checked={settings.push} onChange={() => update("push")} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium text-on-surface">ارسال پیامک (SMS)</div>
            <div className="text-xs text-outline">اطلاع‌رسانی پیام‌های ضروری چت از طریق پیامک</div>
          </div>
          <Switch checked={settings.sms} onChange={() => update("sms")} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <div className="text-sm font-medium text-on-surface">هشدار کاهش قیمت آگهی‌های نشان‌شده</div>
            <div className="text-xs text-outline">هنگام تخفیف یا کاهش قیمت توسط مالک</div>
          </div>
          <Switch checked={settings.priceDrop} onChange={() => update("priceDrop")} />
        </div>
      </div>
    );
  },
};

export const States: Story = {
  name: "حالت‌های روشن، خاموش و غیرفعال",
  render: () => (
    <div className="flex items-center gap-8 p-4 bg-surface-container-lowest rounded-xl border border-outline-var">
      <div className="flex items-center gap-2">
        <Switch checked onChange={() => {}} />
        <span className="text-sm text-on-surface">روشن (Active)</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={false} onChange={() => {}} />
        <span className="text-sm text-on-surface">خاموش (Inactive)</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked disabled onChange={() => {}} />
        <span className="text-sm text-outline">غیرفعال (Disabled)</span>
      </div>
    </div>
  ),
};
