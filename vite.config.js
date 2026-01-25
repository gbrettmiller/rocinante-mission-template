import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('reactflow')) {
              return 'vendor_reactflow';
            }
            if (id.includes('recharts')) {
              return 'vendor_recharts';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor_react';
            }
          }
        },
      },
    },
  },
})
