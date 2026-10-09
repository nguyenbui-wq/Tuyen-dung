import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5180,
    proxy: {
      // Development only: configure the actual local Wings API hostname here.
      '/api/1/staff-portal': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/1\//, '/1/'),
      },
    },
  },
});
