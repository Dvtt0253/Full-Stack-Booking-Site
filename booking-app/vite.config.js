import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/route': {
        target: 'http://127.0.0.1:5011',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});