import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'vendor-icons': ['lucide-react'],
          'ui-vendor': ['framer-motion', 'react-icons'],
          'vendor-web3': ['thirdweb']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/telemetry': {
        target: 'http://localhost:8787',
        changeOrigin: true
      },
      '/api/wp': {
        target: 'http://localhost:8788',
        changeOrigin: true
      },
      '/api/rpc': {
        target: 'http://localhost:8789',
        changeOrigin: true
      }
    }
  }
});
