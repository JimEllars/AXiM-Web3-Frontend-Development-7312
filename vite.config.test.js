import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'thirdweb/react': path.resolve(__dirname, './src/__mocks__/thirdweb-react.jsx')
    }
  }
});
