import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Explicitly set root to current directory
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@emailjs/browser'] // External due to CDN
    }
  },
  server: {
    fs: {
      allow: ['.'] // Allow serving files from root
    }
  }
});
