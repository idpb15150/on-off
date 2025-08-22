import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/log200': 'http://192.168.23.32:1880',
      '/count': 'http://192.168.23.32:1880',
    }
  },
});
