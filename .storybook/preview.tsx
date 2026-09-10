import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <div dir="rtl" className="font-['DanaFaNum',sans-serif] antialiased text-[#1a1a1a] p-4 bg-[#f8f9fd] min-h-screen [direction:rtl]">
        <Story />
      </div>
    ),
  ],
};

export default preview;