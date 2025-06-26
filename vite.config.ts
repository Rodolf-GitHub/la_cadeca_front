import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'maskable-icon-512x512.png',
          'screenshot-desktop.png',
          'screenshot-mobile.png'
        ],
        manifest: {
          name: 'La Cadeca',
          short_name: 'La Cadeca',
          description: 'Calculadora de conversiones de moneda, compra venta de divisas en Cuba',
          theme_color: '#FFC107',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          id: '/',
          prefer_related_applications: false,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any'
            }
          ],
          screenshots: [
            {
              src: 'screenshot-desktop.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Pantalla principal en escritorio'
            },
            {
              src: 'screenshot-mobile.png',
              sizes: '750x1334',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Pantalla principal en móvil'
            }
          ],
          shortcuts: [
            {
              name: 'Mi Perfil',
              url: '/profile',
              icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
            }
          ],
          categories: ['travel', 'transportation'],
          lang: 'es',
          dir: 'ltr'
        },
        workbox: {
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,woff,woff2}'
          ],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.cuba-taxi\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html'
        },
        strategies: 'generateSW'
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    preview: {
      port: 4173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
})