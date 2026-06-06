import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('react-icons')) return 'vendor-react-icons';
            if (id.includes('thirdweb')) return 'vendor-thirdweb';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-react-router';
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    env: {
      VITE_ENABLE_WEB3: 'true'
    }
  },
  define: {
    'import.meta.env.VITE_ENABLE_WEB3': JSON.stringify('true')
  }
});
