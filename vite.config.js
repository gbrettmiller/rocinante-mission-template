import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte({
      // Don't compile node_modules packages with runes mode
      compilerOptions: {
        // Per-component runes detection
      },
    }),
  ],
  optimizeDeps: {
    // Include @xyflow/svelte for proper dependency optimization
    include: ['@xyflow/svelte'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(moduleId) {
          if (moduleId.includes('node_modules')) {
            if (moduleId.includes('@xyflow/svelte')) {
              return 'vendor_xyflow'
            }
            if (moduleId.includes('layerchart') || moduleId.includes('d3')) {
              return 'vendor_charts'
            }
            if (moduleId.includes('svelte')) {
              return 'vendor_svelte'
            }
          }
        },
      },
    },
  },
})
