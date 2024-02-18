import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import autoImport from 'unplugin-auto-import/vite'
import iconsResolver from 'unplugin-icons/resolver'
import icons from 'unplugin-icons/vite'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'production',
  includeAssets: ['favicon.ico'],
  srcDir: 'src',
  filename: 'sw.ts',
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  injectManifest: {
    globPatterns: ['**/*.{js,css,html,ico,png,json,svg}'],
  },
  manifest: {
    name: 'Sudoku',
    short_name: 'Sudoku',
    description: 'A sudoku player',
    theme_color: '#e7e5e4',
    background_color: '#e7e5e4',
    display: 'standalone',
    icons: [
      { src: 'favicon.svg', sizes: '1024x1024', type: 'image/svg+xml', purpose: 'any' },
      { src: 'favicon-solid.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
      { src: 'favicon.png', sizes: '1024x1024', type: 'image/png', purpose: 'maskable' },
    ],
  },
}

export default defineConfig({
  plugins: [
    react(),
    vitePWA(pwaOptions),
    autoImport({
      dts: false,
      resolvers: [
        iconsResolver({
          prefix: false,
          extension: 'jsx',
          enabledCollections: ['tabler'],
          alias: {
            icon: 'tabler',
          },
        }),
      ],
    }),
    icons({ compiler: 'jsx', jsx: 'react' }),
  ],
  worker: {
    format: 'es',
  },
})
