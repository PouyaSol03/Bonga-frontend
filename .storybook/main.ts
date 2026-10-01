import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  "framework": "@storybook/react-vite",
  "staticDirs": ["../public"],
  async viteFinal(config) {
    return {
      ...config,
      server: {
        ...config.server,
        host: "0.0.0.0",
      },
    };
  },
};
export default config;
