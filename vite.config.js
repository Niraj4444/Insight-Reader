import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ IMPORTANT: fixes JS load on Vercel
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.replit.dev']
  }
});