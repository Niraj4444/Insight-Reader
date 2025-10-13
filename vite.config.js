import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ important for Vercel deployments
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.replit.dev'],
  },
});