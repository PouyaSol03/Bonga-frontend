import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawApiUrl = env.VITE_API_BASE_URL || env.VITE_API_BASE_URL_V2 || ''
  let proxyTarget = 'http://192.168.1.106:3000'
  if (rawApiUrl) {
    try {
      proxyTarget = new URL(rawApiUrl).origin
    } catch {
      // keep fallback
    }
  }

  return {
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

        background_color: '#024ac3',
        theme_color: '#024ac3',

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

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-helmet-async')) {
              return 'vendor-react'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query'
            }
            if (id.includes('motion')) {
              return 'vendor-motion'
            }
          }
        },
      },
    },
  },

  server: {
    host: true,
    allowedHosts: ['bonga.exirfirm.com'],
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
  }
})