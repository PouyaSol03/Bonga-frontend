import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css';

const customViewports = {
  mobile500: {
    name: 'Bonga Mobile (500px)',
    styles: {
      width: '500px',
      height: '100%',
    },
    type: 'mobile',
  },
  iphone14: {
    name: 'iPhone 14 (390px)',
    styles: {
      width: '390px',
      height: '844px',
    },
    type: 'mobile',
  },
  pixel7: {
    name: 'Pixel 7 (412px)',
    styles: {
      width: '412px',
      height: '915px',
    },
    type: 'mobile',
  },
  mobileSmall: {
    name: 'Mobile Small (360px)',
    styles: {
      width: '360px',
      height: '740px',
    },
    type: 'mobile',
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: customViewports,
      defaultViewport: 'mobile500',
    },
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
      test: 'todo',
    },
  },
  decorators: [
    (Story, context) => {
      const isFullscreen = context.parameters?.layout === 'fullscreen';

      return (
        <div
          dir="rtl"
          className="flex min-h-screen w-full justify-center bg-[#f0f2f5] p-0 sm:py-6 [direction:rtl]"
        >
          <div
            className={`w-full max-w-[500px] min-h-screen bg-[#f8f9fd] font-['DanaFaNum',sans-serif] antialiased text-[#1a1a1a] shadow-sm sm:rounded-2xl sm:border sm:border-neutral-200 overflow-x-hidden ${
              isFullscreen ? 'p-0' : 'p-4'
            }`}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;