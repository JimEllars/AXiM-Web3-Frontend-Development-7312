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
    host: true
  }
});
