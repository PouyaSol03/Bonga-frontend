import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const customViewports = {
  desktopLarge: {
    name: 'Desktop Large (1440px)',
    styles: {
      width: '1440px',
      height: '900px',
    },
    type: 'desktop',
  },
  desktop: {
    name: 'Desktop (1024px)',
    styles: {
      width: '1024px',
      height: '768px',
    },
    type: 'desktop',
  },
  tablet: {
    name: 'Tablet iPad (768px)',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet',
  },
  mobile500: {
    name: 'Bonga Mobile (500px)',
    styles: {
      width: '500px',
      height: '844px',
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
  reference360: {
    name: 'State Ads Reference (360px)',
    styles: {
      width: '360px',
      height: '905px',
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
      const isSharedUI =
        context.title.startsWith('Shared UI') ||
        context.title.startsWith('Design System');
      const selectedViewport = context.globals?.viewport?.value;
      const isDesktopViewport =
        selectedViewport === 'desktop' ||
        selectedViewport === 'desktopLarge' ||
        selectedViewport === 'responsive' ||
        selectedViewport === 'reset';

      // Width constraint:
      // - Shared UI and design tokens expand on desktop (max-w-5xl) and scale naturally on mobile.
      // - If desktop viewport is chosen in toolbar, allow wide container.
      // - Otherwise, default to Bonga 500px mobile shell.
      const containerWidthClass = isSharedUI || isDesktopViewport
        ? 'w-full max-w-5xl'
        : 'w-full max-w-[500px]';

      return (
        <QueryClientProvider client={queryClient}>
          {/* Overwrite global html/body overflow:hidden from index.css for Storybook scrolling */}
          <style>{`
            html, body, #storybook-root, .sb-show-main {
              overflow-y: auto !important;
              height: auto !important;
              min-height: 100% !important;
              max-height: none !important;
            }
          `}</style>
          <div
            dir="rtl"
            className="flex min-h-screen w-full justify-center bg-[#f0f2f5] p-0 sm:py-6 [direction:rtl]"
          >
            <div
              className={`${containerWidthClass} min-h-screen bg-[#f8f9fd] font-['DanaFaNum',sans-serif] antialiased text-[#1a1a1a] shadow-sm sm:rounded-2xl sm:border sm:border-neutral-200 overflow-y-auto ${
                isFullscreen ? 'p-0' : 'p-4'
              }`}
            >
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
