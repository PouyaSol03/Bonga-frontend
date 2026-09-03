import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
      ],

      manifest: {
        name: 'Bonga',
        short_name: 'Bonga',
        description: 'Bonga Web Application',

        start_url: '/',
        scope: '/',

        display: 'standalone',

        background_color: '#ffffff',
        theme_color: '#ffffff',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-monochrome-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],

        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
    }),
  ],

  server: {
    host: true,
    allowedHosts: ['bonga.exirfirm.com'],
  },
})