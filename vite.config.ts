/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

// One source of truth for browser targets: the "browserslist" field in
// package.json. plugin-legacy reads it for JS transpile/polyfills, and we feed
// the same query to Lightning CSS so the CSS gets downleveled to match.
const cssTargets = browserslistToTargets(browserslist())

// Vitest doesn't need the production-only plugins (legacy bundles, Tailwind),
// and skipping them keeps the test run fast and free of build-only side effects.
const isTest = process.env.VITEST === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: isTest
    ? [react()]
    : [
        react(),
        tailwindcss(),
        // Emits a second, ES5 "legacy" bundle + core-js polyfills for old
        // engines, and adds modern polyfills to the main bundle. The
        // <script nomodule> fallback is injected automatically.
        legacy({
          renderLegacyChunks: true,
          modernPolyfills: true,
        }),
      ],
  css: {
    // Lightning CSS downlevels modern CSS (oklch -> rgb, color-mix, nesting,
    // logical properties, …) to fallbacks understood by the targets above.
    // NOTE: it cannot polyfill CSS custom properties or @layer — those still
    // require a reasonably modern (updated) Chrome.
    transformer: 'lightningcss',
    lightningcss: {
      targets: cssTargets,
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
