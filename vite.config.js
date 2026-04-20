import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
